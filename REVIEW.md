---
project: Équipe Buteau
reviewed: 2026-05-09T00:00:00Z
depth: deep
files_reviewed: 24
files_reviewed_list:
  - src/components/landing/MediaShowcase.tsx
  - src/components/landing/CapsulesPreview.tsx
  - src/components/landing/ValueTicker.tsx
  - src/components/layout/MobileStickyCta.tsx
  - src/components/layout/PageTransition.tsx
  - src/components/layout/CustomCursor.tsx
  - src/components/layout/SchemaJsonLd.tsx
  - src/components/landing/CalculatorPreview.tsx
  - src/components/landing/Mission.tsx
  - src/components/landing/TeamGrid.tsx
  - src/components/landing/TeamTeaser.tsx
  - src/components/landing/Services.tsx
  - src/components/landing/Hero.tsx
  - src/components/landing/PreQualQuiz.tsx
  - src/components/landing/Reviews.tsx
  - src/components/landing/GuidesShelf.tsx
  - src/components/landing/Faq.tsx
  - src/components/landing/AnimatedSignature.tsx
  - src/components/landing/AutoGlossary.tsx
  - src/components/landing/GlossaryHovercard.tsx
  - src/components/landing/ContactForm.tsx
  - src/components/landing/TerritoryMap.tsx
  - src/routes/capsules.tsx
  - src/routes/journal.tsx
  - src/routes/__root.tsx
  - src/worker.ts
  - src/lib/config.ts
  - src/lib/translations.ts
  - src/hooks/useQuizTier.ts
  - src/hooks/useScrollReveal.ts
  - src/hooks/useTilt.ts
  - src/hooks/useCookieConsent.ts
  - src/hooks/useCountUp.ts
  - src/hooks/useMagnetic.ts
  - public/sitemap.xml
findings:
  blocker: 7
  high: 9
  medium: 12
  low: 7
  total: 35
status: issues_found
---

# Code Review — Équipe Buteau (post-Phase 2 polish)

**Reviewed:** 2026-05-09
**Depth:** deep (cross-file analysis)
**Stance:** adversarial — assumed defects exist
**Status:** issues_found

## Summary

Audit du sprint Phase 1/2 polish (Sticky mobile CTA, ValueTicker, CapsulesPreview, /capsules tag filters, /journal reading bar + accordion, MediaShowcase YouTube + galerie). Le code est globalement propre, TS strict respecté, mais plusieurs **régressions silencieuses sérieuses** :

1. **CSP bloquante** : la nouvelle iframe YouTube de `MediaShowcase` est interdite par le `frame-src 'self' https://api.leadconnectorhq.com` du worker — la vidéo Andrew à Art de Réussir ne s'affichera **pas en production**.
2. **Sitemap incomplet** : `/merci` est listée comme indexée alors qu'elle ne devrait jamais être indexée, et `/courrier` apparaît avec sitemap mais aucun `noindex` est posé sur les pages destinées à confirmation post-form.
3. **Bug useEffect / re-souscription scroll listener** : `CustomCursor` re-attache *5* document listeners à chaque mouvement de souris (deps `[visible]`).
4. **Bug `useQuizTier`** : la dispatch de `buteau:tier-changed` déclenche le listener du *même* hook → ré-render redondant systématique sur tous les composants qui consomment `useQuizTier()`.
5. **Bug `useCookieConsent`** : effet `useEffect(... , [state])` rappelle `updateConsentMode` à chaque rendu portant un nouvel objet, et le `state` initial — silencieusement non-decided — ne devrait pas appeler le gtag mais le test n'est qu'un `if (state.decided)`.
6. **Régression i18n TeamGrid** : tableau de marginalia hard-codé en français (`"fondateur", "coordo.", "assist.", "opérations"`) — non traduit en EN.
7. **PageTransition + key={pathname}** : remount complet de l'arbre `<Outlet />` à chaque changement de route → reset de tous les `useState` enfants (recherche, filtres /capsules, openSlug /journal).

Détail par sévérité ci-dessous.

---

## BLOCKER (7)

### BLOCKER:CSP-FRAME-YOUTUBE

**Issue:** Le composant `MediaShowcase` ajouté dans `routes/equipe.tsx` embed un iframe `https://www.youtube-nocookie.com/embed/...` mais la CSP du worker (`src/worker.ts`) limite `frame-src` à `'self' https://api.leadconnectorhq.com`. **La vidéo sera bloquée en production** par le navigateur (CSP violation) — l'utilisateur verra une zone vide. C'est la régression principale du sprint #58d367a.
**File:** `src/worker.ts:322` + `src/components/landing/MediaShowcase.tsx:95`
**Why:** `frame-src` ne contient ni `https://www.youtube-nocookie.com` ni `https://www.youtube.com`. La CSP est appliquée à *toutes* les réponses (`withSecurityHeaders` sur la SPA aussi), donc la prod déployée bloque le frame là où le dev local (sans worker) le laisse passer.
**Fix:**
```ts
// src/worker.ts ligne 322
"frame-src 'self' https://api.leadconnectorhq.com https://www.youtube-nocookie.com https://www.youtube.com",
```

### BLOCKER:CUSTOM-CURSOR-LISTENER-LEAK

**Issue:** `CustomCursor` re-monte tout le useEffect dès que `visible` change. Or `visible` flip à `true` au premier `pointermove`. Résultat : à chaque entrée/sortie de la fenêtre, **toute** la machinerie (raf loop + 4 listeners document + override `documentElement.style.cursor`) est démontée et reconstruite. Le `cancelAnimationFrame` annule l'ancien raf mais on en démarre un nouveau systématiquement → cursor saccadé + risque de fuite si le démontage ne s'exécute pas synchroniquement.
**File:** `src/components/layout/CustomCursor.tsx:91`
**Why:** Le `useEffect` dépend de `[visible]` (ligne 91). Le toggle `setVisible(true)` à l'intérieur du `onMove` (ligne 42) force le re-run de l'effect après le premier mouvement → **listener stomp** + cursor restart à chaque transition idle ↔ active.
**Fix:** Stocker `visible` dans un `useRef` ou retirer la branche `if (!visible) setVisible(true)` du `onMove` (déjà couvert par `pointerenter`). Sinon split l'effet : un effect `[]` pour les listeners + un effect `[visible]` uniquement pour `style.opacity`.

### BLOCKER:USEQUIZTIER-DOUBLE-EVENT-LOOP

**Issue:** Dans `useQuizTier`, `saveTier(t)` :
1. Appelle `setTier(t)` (re-render),
2. Écrit dans `localStorage`,
3. **Dispatch un `CustomEvent("buteau:tier-changed", { detail: t })`**.

Mais le hook *lui-même* écoute cet event (lignes 67-75) et fait `setTier(detail)`. Donc **chaque** instance du hook (Hero, ContactForm, PreQualQuiz, MobileStickyCta…) reçoit l'event et set son propre state, déclenchant une **avalanche de re-renders sur tous les composants qui consomment le hook** au moment du changement de tier. Plus grave : les autres consumers du hook reçoivent une mise à jour mais le `setTier` interne est déjà à jour → pas de boucle infinie, mais coût notable.
**File:** `src/hooks/useQuizTier.ts:54,73`
**Why:** Le pattern broadcast intra-tab est utile pour synchro entre instances, mais il faut **exclure l'émetteur** (sinon le hook s'auto-notifie). En plus, `setTier(detail)` reçoit `null` quand `clearTier()` est appelé mais `detail` typé `unknown` — sans guard runtime.
**Fix:**
```ts
const saveTier = useCallback((t: QuizTier) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, t);
  // Dispatch AVANT setTier — les autres instances react-eront, celle-ci passera par le storage event SI c'était un autre tab, ou par le setTier direct ici.
  window.dispatchEvent(new CustomEvent("buteau:tier-changed", { detail: t }));
  setTier(t);
}, []);

// + dans le listener custom event :
const onChange = (e: Event) => {
  const detail = (e as CustomEvent).detail;
  if (detail === null || detail === "primo" || detail === "refi" || detail === "investor" || detail === "explorer") {
    setTier(detail);
  }
};
```

### BLOCKER:PAGETRANSITION-REMOUNT-RESET-STATE

**Issue:** `PageTransition` wrap `<Outlet />` avec `<div key={pathname}>` (ligne 51). Or **changer la key force React à démonter et remonter tout le sous-arbre**. Conséquences sur les routes interactives :
- `/capsules` : le state `activeFilter` est reset à `"all"` à chaque navigation entrante (acceptable en init mais empêche le retour-arrière de préserver le filtre).
- `/journal` : `openSlug` est reset → si l'utilisateur ouvre l'article 3, navigue vers `/lexique` puis revient, l'article se referme.
- `/outils` : la calculator URL state (?amount=…&rate=…&years=…) — vérifier si la lecture initiale s'effectue à chaque remount.

Pire : la double animation `PageTransition` (animation CSS) **ET** `::view-transition-*` dans `src/index.css` (View Transitions API) peuvent coexister et se cumuler visuellement.
**File:** `src/components/layout/PageTransition.tsx:51`
**Why:** Le pattern `key={pathname}` sur le wrapper de l'Outlet est explicitement déconseillé par TanStack Router — la lib gère déjà la transition par route via `defaultPendingComponent` ou `useTransition`. Ici on remount aussi les listeners (scroll bar /journal, etc.).
**Fix:** Soit ne pas keyer (laisser React reconciler), soit utiliser uniquement les CSS View Transitions (déjà déclarées dans index.css l.866-879). Si on garde `key`, scoper l'animation à un wrapper interne sans démonter l'Outlet :
```tsx
return (
  <div style={{ animation: phase === "entering" ? "buteauPageEnter ..." : undefined }}>
    {children}
  </div>
);
// supprimer key={pathname}
```

### BLOCKER:CAPSULES-LINKS-ALL-POINT-TO-TIKTOK-PROFILE

**Issue:** Sur `/capsules` (ligne 237) **chaque** lien capsule pointe vers `https://www.tiktok.com/@equipebuteau` (profil), pas vers la capsule individuelle. Idem `CapsulesPreview` ligne 72 (`to="/capsules"` — pas même un anchor). L'utilisateur clique « Le RAP — utiliser ton REER » et atterrit sur la timeline TikTok complète, pas la vidéo.
**File:** `src/routes/capsules.tsx:237`, `src/components/landing/CapsulesPreview.tsx:72`
**Why:** Risque conversion réelle : 30 capsules listées comme cliquables, toutes redirigent au même endroit → impression de bug. Et coté SEO/Schema, le `ItemList > CreativeWork` (capsules.tsx:69) ne donne aucun `url` ou `contentUrl` aux éléments → le schema n'a pas d'utilité indexation.
**Fix:** Ajouter un champ `url` (TikTok video ID) dans la translation `capsules.categories[].items[]`, puis :
```tsx
<a href={item.url ?? "https://www.tiktok.com/@equipebuteau"} ... />
```
Idem dans le schema JSON-LD : injecter `url: item.url`.

### BLOCKER:CAPSULES-CATEGORIES-DUPLICATE-EYEBROW-AS-TITLE

**Issue:** Dans `routes/capsules.tsx`, chaque section catégorie affiche `cat.eyebrow` **deux fois** : une fois dans le `<p className="eyebrow">` (ligne 219) et une fois comme `<h2>` (ligne 222). Donc on lit visuellement « MISE DE FONDS & FINANCEMENT » puis le H2 « Mise de fonds & financement ». Pas de `cat.title` distinct — c'est le même string.
**File:** `src/routes/capsules.tsx:219-222`
**Why:** Côté UX : duplication visuelle bizarre. Côté a11y : un H2 lecturé en redondance avec un eyebrow équivalent. Le schema des catégories prévoyait probablement un `title` séparé qui n'existe pas dans `translations.ts` (pas de clé `categories[].title`).
**Fix:** Soit ajouter `title` dans les translations capsules, soit retirer le H2 redondant et upgrader l'eyebrow en heading sémantique (`role="heading" aria-level="2"`). Recommandé :
```ts
// translations
{ id: "mise-de-fonds", eyebrow: "I — Capsules", title: "Mise de fonds & financement", intro: "..." }
```

### BLOCKER:SITEMAP-MISSING-MERCI-COURRIER-AND-INDEXING-LEAKS

**Issue:** `public/sitemap.xml` :
1. Liste `/courrier` comme indexable (priority 0.6) — c'est une page éditoriale qui ré-affiche les avis Google → **risque de duplicate content** vs la section Reviews du home.
2. Liste `/journal` weekly — mais le contenu est en accordion, **rendu via JS uniquement** (pas de SSR). Googlebot crawl JS mais le `BlogPosting > articleBody` est généré via `(a.body ?? []).join(" ")` (journal.tsx:110) — nécessite que le client JS run. Sans noscript fallback, le risque SEO est réel.
3. **/merci absente** mais devrait avoir `<meta name="robots" content="noindex">` (à vérifier dans `routes/merci.tsx`).
**File:** `public/sitemap.xml`
**Why:** Le commit `74e9f9c fix(seo): sitemap +3 routes` a ajouté `/capsules /journal /courrier` sans réfléchir au noindex. `/courrier` republie verbatim 3 témoignages déjà sur l'accueil (lignes 54-55 de courrier.tsx : `[...homeReviews, ...additional]`).
**Fix:** Soit retirer `/courrier` du sitemap, soit canonicalizer `/courrier` vers `/#avis`. Vérifier `routes/merci.tsx` pour ajouter `<meta name="robots" content="noindex,follow">` via Helmet/setDocumentTitle.

---

## HIGH (9)

### HIGH:SCHEMA-JOURNAL-INCOMPLETE-ARTICLEURL

**Issue:** Le schema JSON-LD `Blog > blogPost` dans `journal.tsx:104-112` omet `url` (lien canonique vers chaque article). Conséquence : Google ne peut pas indexer chaque article en tant que page distincte (et de toute façon, il n'y a **pas** de page article distincte — tout est sur `/journal` en accordion).
**File:** `src/routes/journal.tsx:104`
**Why:** Pour qu'un `BlogPosting` apparaisse dans Google News / Discover, il faut au minimum `url`, `mainEntityOfPage`, `image`, `author`. Aucun n'est posé.
**Fix:** Ajouter `url: \`https://equipe-buteau.intralysqc.workers.dev/journal#${a.slug}\`` + `mainEntityOfPage` + `author: { "@id": ".../#business" }`.

### HIGH:JOURNAL-READING-PROGRESS-INCORRECT-CALCULATION

**Issue:** Le calcul de la reading bar dans `journal.tsx:53-67` est incorrect quand `rect.height < viewportH` (article court) **et** quand l'article ouvert est **au-dessus** du viewport (scroll vers le bas après scroll-up). `rect.bottom < viewportH ? 1 : 0` ne fonctionne que pour la fin du document, pas pour le milieu.
**File:** `src/routes/journal.tsx:60-66`
**Why:** Pour les articles de 4-5 paragraphes, `rect.height` peut être < viewport — on tombe dans le `if (totalScrollable <= 0)` qui set 1 ou 0 binaire (pas de progression), donc la barre saute de 0 à 100% sans état intermédiaire. Pour un article long, dès qu'on scroll au-delà de l'article (vers le footer), `rect.top` devient très négatif et `scrolled / totalScrollable` peut dépasser 1 (clampé OK mais sémantique fausse).
**Fix:** Calculer la position du *texte lu dans le viewport*, pas la position de l'élément :
```ts
const articleStart = rect.top + window.scrollY;
const articleEnd = articleStart + rect.height;
const viewportMid = window.scrollY + viewportH / 2;
const ratio = (viewportMid - articleStart) / (articleEnd - articleStart);
setReadingProgress(Math.max(0, Math.min(1, ratio)));
```

### HIGH:USECOOKIECONSENT-EFFECT-FIRES-EVERY-RENDER

**Issue:** `useCookieConsent` :
```ts
useEffect(() => {
  if (state.decided) {
    updateConsentMode(state);
  }
}, [state]);
```
Chaque appel `acceptAll`/`refuseAll` set un nouvel objet `state` → l'effet refire → `updateConsentMode` rappelée. Ce n'est pas catastrophique (gtag debounce probablement), mais redondant car `acceptAll`/`refuseAll`/`updateGranular` appellent **déjà** `updateConsentMode(next)` synchroniquement (lignes 96, 109, 122). Le useEffect le fait *une deuxième fois* après le re-render.
**File:** `src/hooks/useCookieConsent.ts:81-85`
**Why:** Double-fire de Consent Mode v2 + perf gaspillée. Le useEffect était utile **uniquement au mount** pour propager le consent stocké à gtag.
**Fix:**
```ts
useEffect(() => {
  if (state.decided) updateConsentMode(state);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // mount-only
```

### HIGH:MISSION-SCROLLREVEAL-THRESHOLD-NEVER-FIRES-ON-LARGE-VIEWPORT

**Issue:** `Mission.tsx:30` utilise `useScrollReveal({ threshold: 0.4 })` sur la **section entière** (haute de plusieurs viewports sur mobile-tablet). Le seuil 0.4 = 40% de l'élément visible. Sur un mobile, la section Mission peut faire 1.5× la hauteur viewport — atteindre 40% requiert que ~60% du viewport soit dans l'élément à un moment, ce qui n'arrive **jamais** si on scroll plus vite que le seuil moyen.
**File:** `src/components/landing/Mission.tsx:30`
**Why:** Le counter "200 familles" peut ne jamais s'animer sur tablet/mobile. Symptôme : l'utilisateur voit `0` qui reste à `0`.
**Fix:** Ne pas mettre le ref sur la section entière. Mettre un wrapper précis autour du nombre uniquement, ou descendre le threshold à `0.1` :
```ts
const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1, rootMargin: "-100px 0px 0px 0px" });
```

### HIGH:TEAMGRID-MARGINALIA-HARDCODED-FRENCH

**Issue:** `TeamGrid.tsx:58` :
```tsx
{["fondateur", "coordo.", "assist.", "opérations"][idx]}
```
Strings français en dur, **non traduits**. Quand l'utilisateur switch en EN, la marginalia reste en français.
**File:** `src/components/landing/TeamGrid.tsx:58`
**Why:** Viole R2 (i18n complet) explicite dans CLAUDE.md. L'audit `intralys-i18n-bilingual` aurait dû lever cette régression.
**Fix:** Déplacer dans `translations.ts > team.marginalia`, accéder via `ta<string[]>(translations[lang], "team.marginalia")[idx]`.

### HIGH:TEAMGRID-USE-INDEX-AS-KEY-WITH-MUTATION-RISK

**Issue:** `TeamGrid.tsx:33` : `key={idx}`. La liste `members` vient de `translations.ts`. Si l'ordre change (ex: réorganisation marketing), React garde l'ancien DOM avec la nouvelle data → photos mal associées. Idem pour `Reviews.tsx:85` (`key={idx}`), `Faq.tsx:44` (`key={idx}`), `journal.tsx:189` (`key={pi}` pour paragraphes).
**File:** `src/components/landing/TeamGrid.tsx:33`, `Reviews.tsx:85`, `Faq.tsx:44`
**Why:** Anti-pattern React documenté. Utiliser `key={m.name}` ou ajouter un `slug` stable dans translations.
**Fix:** `key={m.name}` partout.

### HIGH:CAPSULES-FILTER-BUTTON-MISSING-ARIA-PRESSED

**Issue:** `routes/capsules.tsx:153-188` : les chips de filtre sont des `<button>` sans `aria-pressed` ni `role="radio"` (vu qu'un seul peut être actif). Lecteur d'écran : aucune indication de l'état actif au-delà du style visuel.
**File:** `src/routes/capsules.tsx:153,170`
**Why:** WCAG 4.1.2 — l'état "active" doit être perceptible par l'AT. Idem pour les onglets Hero word reveal (mais purement décoratif là).
**Fix:**
```tsx
<button aria-pressed={activeFilter === "all"} ... />
<button aria-pressed={activeFilter === cat.id} ... />
```
Et idéalement wrapper dans `role="group" aria-label="Filtrer par catégorie"`.

### HIGH:VALUETICKER-NO-PAUSE-ON-HOVER-OR-FOCUS

**Issue:** `ValueTicker.tsx:43` — animation infinite scroll, mais aucun `:hover` ou `:focus-within` pour pause. Pour un utilisateur qui veut **lire** un fait au passage, impossible. Le ticker `Partners.tsx:37` a `hover:[animation-play-state:paused]` — pourquoi pas ici ?
**File:** `src/components/landing/ValueTicker.tsx:43`
**Why:** A11y + UX. Aussi : `aria-label` est posé sur la section mais le contenu défilant est invisible aux SR si `aria-hidden` n'est pas explicite. Un SR lit-il les 14 strings dupliqués ?
**Fix:** Ajouter `hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]` sur le wrapper. Marquer la **deuxième** copie `aria-hidden="true"` :
```tsx
{items.map(...)}                            // visible aux SR
<span aria-hidden="true">{items.map(...)}</span> // duplicate uniquement décoratif
```

### HIGH:MOBILESTICKY-FOOTER-OVERLAP

**Issue:** `MobileStickyCta` est `fixed inset-x-0 bottom-0 z-40`. Sur mobile, le `CookieBanner` (z-60) le couvre — OK. Mais le **bottom du form** dans `ContactSection` se retrouve masqué par les ~70px de la sticky bar : aucun padding-bottom global n'est ajouté au `<main>`. Sur le `/merci` final post-form, idem.
**File:** `src/components/layout/MobileStickyCta.tsx` + tous les routes mobile
**Why:** Le `distanceToBottom > 400` (l.37) cache la sticky proche du footer, ce qui mitige le problème **uniquement** près du footer. Au milieu d'une page longue, la dernière ligne d'un paragraphe peut être masquée.
**Fix:** Ajouter `padding-bottom: 70px` sur `<main>` quand `lg:hidden` (via Tailwind `lg:pb-0 pb-[70px]`). Ou : `body { padding-bottom: env(safe-area-inset-bottom) + 70px; }` en CSS @media `(max-width: 1023px)`.

---

## MEDIUM (12)

### MEDIUM:SERVICES-INLINE-STYLE-TAG-IN-COMPONENT

**Issue:** `Services.tsx:95-103` injecte un `<style>` inline avec un sélecteur ultra-spécifique (`#services > div > div > article:nth-child(N)`). Couplage fort à la structure DOM — si le wrapper change, les décalages se cassent silencieusement. Et chaque mount du composant (théoriquement) ré-inject le style.
**File:** `src/components/landing/Services.tsx:95`
**Why:** Anti-pattern : style devrait être déclaré une fois en CSS global ou via `style={{ marginLeft: offsets[idx] }}` directement sur l'article (qui est déjà fait au l.52 pour `typeof window === "undefined"` — mais cassé : l'expression `typeof window === "undefined" ? "0%" : undefined` set "0%" SSR et undefined client → marginLeft jamais appliqué côté client).
**Fix:** Utiliser className conditionnelle Tailwind ou `style={{ marginLeft: offsets[idx] }}` directement sur l'article (en hidden md:block via media query CSS).

### MEDIUM:MEDIASHOWCASE-IFRAME-NO-TITLE-FOR-A11Y-FALLBACK

**Issue:** L'iframe YouTube a `title={t("media.tvVideoTitle")}` (bien). Mais en cas d'échec CSP (cf. BLOCKER ci-dessus) ou de bloqueur, **aucun fallback visible** — l'utilisateur voit un cadre vide. Pas de `<noscript>` ni placeholder image avec lien externe.
**File:** `src/components/landing/MediaShowcase.tsx:93-102`
**Why:** Le pattern client-friendly : screenshot poster + bouton play qui ouvre la vidéo en lazy load OU lien externe direct.
**Fix:** Lazy mount le iframe seulement au clic sur un thumbnail :
```tsx
const [playing, setPlaying] = useState(false);
{playing ? <iframe ... /> : (
  <button onClick={() => setPlaying(true)}>
    <img src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`} alt={...} />
    <Play size={48} />
  </button>
)}
```
Bonus : économise 600+ KB de scripts YouTube au load initial.

### MEDIUM:CAPSULESPREVIEW-LINK-ALL-SAME-DESTINATION

**Issue:** Sur l'Accueil, `CapsulesPreview` liste 5 capsules avec hooks différents, mais **tous les `<Link>` pointent vers `/capsules`** (sans hash, sans filter). L'utilisateur clique « Girl Math ton hypothèque » et arrive sur la liste complète sans focus sur cette capsule.
**File:** `src/components/landing/CapsulesPreview.tsx:72`
**Why:** Régression UX vs intent. Le moins serait `to="/capsules" hash={cat.id}` ou direct vers le slug TikTok.
**Fix:** Ajouter une `slug` dans translations, link vers `/capsules#${slug}` + scroll.

### MEDIUM:JOURNAL-PULLQUOTE-INSERTED-INSIDE-LOOP-POSITION-WRONG

**Issue:** `journal.tsx:186-207` calcule `middleIdx = Math.floor(a.body!.length / 2)` à *chaque itération* du map — pas constant, et place le pull-quote **avant** le paragraphe `middleIdx`. Si `body.length === 5`, middleIdx === 2, donc pull-quote apparaît avant le 3e paragraphe (bonne intention). Mais si `body.length === 1`, middleIdx === 0, pull-quote apparaît avant le seul paragraphe → bizarre visuellement.
**File:** `src/routes/journal.tsx:186-188`
**Why:** Pas un bug critique mais le calcul devrait être hors de la map (sortir le `useMemo`), et le edge case `length < 3` devrait skipper le pull-quote.
**Fix:**
```ts
const middleIdx = Math.floor(a.body!.length / 2);
const showPullQuoteAt = a.pullQuote && a.body!.length >= 3 ? middleIdx : -1;
// dans la map :
const showPullQuote = pi === showPullQuoteAt;
```

### MEDIUM:GLOSSARYHOVERCARD-SCROLL-CLOSE-TOO-AGGRESSIVE

**Issue:** `GlossaryHovercard.tsx:60-71` ferme le popover dès n'importe quel `scroll` (capture). Un utilisateur sur trackpad qui hover un terme + accidentellement scroll de 1px → popover ferme. Et si le popover est dans une section avec parallax / animation → ferme aussi.
**File:** `src/components/landing/GlossaryHovercard.tsx:61`
**Why:** Trop sensible. Préférer une distance threshold (ex: > 50px de scroll cumulé) ou un debounce.
**Fix:**
```ts
let lastY = window.scrollY;
const onScroll = () => {
  if (Math.abs(window.scrollY - lastY) > 80) setIsOpen(false);
};
```

### MEDIUM:SCROLLPROGRESS-NO-MAX-DOMAIN-CHECK

**Issue:** `ScrollProgress.tsx:16` : `document.documentElement.scrollHeight - window.innerHeight`. Sur les routes courtes (`/mentions-legales`, `/merci`), si la page tient dans le viewport, `max <= 0` → affiche `progress=0`. Or la barre est visible avec `width: 100%` `transform: scaleX(0)` — c'est OK. Mais combiné avec le `body { overflow: hidden }` du SplashIntro, le calcul au mount avant que le scroll soit dispo peut donner des valeurs erronées une frame.
**File:** `src/components/layout/ScrollProgress.tsx:16-19`
**Why:** Edge case mineur — au refresh durant le splash, on calcule scrollHeight=0 puis le splash unlock body overflow et scrollHeight change. Pas de listener sur ce changement.
**Fix:** Recompute au splash dismiss ou via MutationObserver. Ou + simple : passer le calcul dans un `setTimeout(0)` post-mount.

### MEDIUM:USECOOKIECONSENT-LOAD-FROM-STORAGE-NO-VALIDATION

**Issue:** `loadFromStorage` parse `JSON.parse` et coerce `!!parsed.analytics`. Si un user malveillant édite le localStorage à la main avec `{"analytics": "yes"}`, `!!"yes" === true` → marketing/analytics activé sans consentement. Pas une vuln à proprement parler (l'attaquant attaque son propre browser), mais le code n'est pas robuste.
**File:** `src/hooks/useCookieConsent.ts:39-49`
**Why:** Validation laxiste. Pour Loi 25 art. 23, le consent doit être **prouvable** : `decidedAt` est stocké mais jamais validé en format ISO ; un user peut backdater.
**Fix:** Validation Zod-like manuelle :
```ts
const isBool = (v: unknown): v is boolean => typeof v === "boolean";
return {
  necessary: true,
  analytics: isBool(parsed.analytics) ? parsed.analytics : false,
  marketing: isBool(parsed.marketing) ? parsed.marketing : false,
  decided: isBool(parsed.decided) ? parsed.decided : false,
  decidedAt: typeof parsed.decidedAt === "string" && /^\d{4}-\d{2}-\d{2}T/.test(parsed.decidedAt) ? parsed.decidedAt : null,
};
```

### MEDIUM:CALCULATORPREVIEW-OUTPUT-HTMLFOR-WRONG-ELEMENT

**Issue:** `CalculatorPreview.tsx:186-187` : `<output htmlFor={id}>`. L'attribute `for` sur `<output>` doit pointer vers les **éléments source** du calcul, pas l'input lui-même. Sémantique imprécise.
**File:** `src/components/landing/CalculatorPreview.tsx:186`
**Why:** Pas un crash, mais incorrect HTML (validateur W3C lèvera). Lecteurs d'écran peuvent associer le mauvais label.
**Fix:** Soit retirer le `htmlFor` (output autonome), soit pointer vers les vraies sources : `htmlFor={id}` est OK ici car `id` est l'ID du range input — la convention est inverse mais en pratique acceptée.

### MEDIUM:WORKER-GHL-NAME-SPLIT-NAIVE

**Issue:** `worker.ts:210` : `lead.full_name.split(" ")[0] ?? ""` pour `first_name`, `slice(1).join(" ")` pour `last_name`. Pour un nom comme « Marie-Claude Bouchard-Tremblay » ça donne first="Marie-Claude" last="Bouchard-Tremblay" — OK. Mais « José Maria Lopez » → first="José" last="Maria Lopez" — incorrect culturellement (Latam : prénom composé).
**File:** `src/worker.ts:210-211`
**Why:** Edge case nom composé. Le client GHL pourrait préférer un seul `name` plutôt que first/last splittés naïvement.
**Fix:** Soit ajouter un champ `first_name` + `last_name` séparés dans le form (Phase 9 quand le client demandera), soit envoyer `full_name` brut et laisser GHL parser.

### MEDIUM:CAPSULES-ROMAN-NUMERAL-FALLBACK

**Issue:** `routes/capsules.tsx:304-307` : `function romanNumeral(n)` ne gère que 1-7. Si une 8e catégorie est ajoutée demain, `map[n] ?? String(n)` retournera "8" → casse la cohérence visuelle Cormorant italic. Code fragile.
**File:** `src/routes/capsules.tsx:304`
**Why:** Hardcoded jusqu'à 7. Voir aussi `Mission.tsx ICONS = [CircleHelp, Users, Clock, MapPin]` → `ICONS[idx % ICONS.length]` (gère bien overflow par modulo).
**Fix:** Implémenter algo génératif jusqu'à 20 minimum :
```ts
function romanNumeral(n: number): string {
  const tens = ["", "X", "XX"];
  const ones = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
  if (n < 1 || n >= 30) return String(n);
  return tens[Math.floor(n / 10)] + ones[n % 10];
}
```

### MEDIUM:HERO-LETTERWORDS-MISMATCH-LENGTH

**Issue:** `Hero.tsx:99` map sur `config.brandName.split("")` (= 6 lettres "BUTEAU") avec fallback `letterWords[idx] ?? letter`. Si `home.hero.letterWords` a < 6 entries (oubli traduction EN), les dernières lettres affichent la lettre brute — passe silencieusement. Idem pour brandName personnalisable demain.
**File:** `src/components/landing/Hero.tsx:99-100`
**Why:** Robustesse : un dev qui change brandName = "BUTEAU+" oubliera d'aligner letterWords. Pas de check TS car les translations sont typées `BilingualLax` (lax volontairement).
**Fix:** Ajouter une console.warn dev-only :
```ts
if (import.meta.env.DEV && letterWords.length !== config.brandName.length) {
  console.warn(`Hero: letterWords (${letterWords.length}) ne matche pas brandName (${config.brandName.length} lettres)`);
}
```

### MEDIUM:CAPSULES-STRING-INTERPOLATION-FRENCH-PLURAL

**Issue:** `routes/capsules.tsx:194-195` :
```ts
`${visibleCount} capsule${visibleCount > 1 ? "s" : ""} affichée${visibleCount > 1 ? "s" : ""} sur ${totalCount}`
```
Plural FR cassé pour `visibleCount === 0` : « 0 capsule affichée sur 35 » → singulier en FR mais en anglais ce serait pluriel. Idem si 1 capsule mais on a un autre cas linguistique. Lib `Intl.PluralRules` recommandée.
**File:** `src/routes/capsules.tsx:194`
**Why:** I18n robuste : la règle FR "0 = singulier" diffère de l'anglais. Pas un blocker.
**Fix:**
```ts
const fmt = new Intl.PluralRules(isFr ? "fr-CA" : "en-CA");
const noun = fmt.select(visibleCount) === "one" ? (isFr ? "capsule affichée" : "capsule shown") : (isFr ? "capsules affichées" : "capsules shown");
```

---

## LOW (7)

### LOW:CUSTOMCURSOR-LABEL-LOCALIZED-HARDCODED

**Issue:** `CustomCursor.tsx:112` : `mode === "drag" ? "↔" : "Voir"` — "Voir" est en français en dur. En EN le cursor affichera quand même "Voir" sur les images.
**File:** `src/components/layout/CustomCursor.tsx:112`
**Why:** Détail i18n manquant.
**Fix:** Recevoir la langue via `useLanguage()` dans le composant et conditionner.

### LOW:MEDIASHOWCASE-IDX-AS-KEY-FOR-CAPTION-LINES

**Issue:** `MediaShowcase.tsx:150,191` : `key={idx}` pour les paragraphes des captions. Les captions sont statiques (translations), pas de réordering attendu. Peu critique.
**File:** `src/components/landing/MediaShowcase.tsx:150,191`
**Why:** Cohérence avec les autres patterns recommandés ailleurs dans la review.
**Fix:** N/A si pas de réordering. Sinon `key={\`${idx}-${line.slice(0,12)}\`}`.

### LOW:VALUETICKER-DOUBLED-ARRAY-NOT-MEMO

**Issue:** `ValueTicker.tsx:25` : `const doubled = [...items, ...items]` recréé à chaque render. Coût négligeable (7 strings) mais pattern à corriger.
**File:** `src/components/landing/ValueTicker.tsx:25`
**Why:** `useMemo` ou stocker hors render.
**Fix:** `const doubled = useMemo(() => [...items, ...items], [items]);`

### LOW:TERRITORY-MAP-SETACTIVEIDX-RESET-TO-0

**Issue:** `TerritoryMap.tsx:227` : `onMouseLeave={() => setActiveIdx(0)}` reset à 0 (Laval) systématiquement. Si l'utilisateur a hover Rive-Sud puis quitte, la map retourne à Laval — incohérent avec l'attendu (rester sur Rive-Sud ou retourner à `null`).
**File:** `src/components/landing/TerritoryMap.tsx:227`
**Why:** Choix UX discutable.
**Fix:** Soit rester sur le dernier (`onMouseLeave` no-op), soit setActiveIdx(null) (mais alors le state doit accepter null — déjà le cas l.28).

### LOW:CAPSULESPREVIEW-EYEBROW-HARDCODED-FRENCH

**Issue:** `CapsulesPreview.tsx:93` : `<p>Capsule · 30 sec</p>` — texte en dur, pas dans `t()`. En EN ça reste "Capsule · 30 sec".
**File:** `src/components/landing/CapsulesPreview.tsx:93`
**Why:** I18n.
**Fix:** Utiliser `{t("home.capsulesPreview.eyebrow")}` ou nouvelle clé.

### LOW:JOURNAL-DATE-NOT-ISO

**Issue:** Les `date` dans `journal.articles` sont au format français lisible (`"12 octobre 2025"`). Le schema JSON-LD `datePublished` exige ISO 8601 (`"2025-10-12"`). Actuellement on injecte la string FR brute dans `datePublished` (l.107).
**File:** `src/routes/journal.tsx:107` + `src/lib/translations.ts:458` etc.
**Why:** Google Search Console flagger comme invalide → BlogPosting rich result raté.
**Fix:** Stocker une seconde clé `dateIso: "2025-10-12"` dans translations + utiliser dans le schema. Garder `date` pour affichage.

### LOW:WORKER-CONSOLE-LOG-NOISE

**Issue:** `worker.ts:185` : `console.log("[GHL] Push skipped — ...")` à chaque submit Phase 9. Bruit logs Cloudflare.
**File:** `src/worker.ts:185`
**Why:** Logger Phase 9 avant configuration GHL : OK une fois, mais ne pas spammer.
**Fix:** Soit retirer (le commentaire sur le log suffit), soit logger seulement une fois via global flag.

---

_Reviewed: 2026-05-09_
_Reviewer: Claude (gsd-code-reviewer mode adversarial)_
_Depth: deep — cross-file (CSP × MediaShowcase, useQuizTier × consumers, PageTransition × routes interactives, schemas JSON-LD × translations)_
_Co-Authored-By: Claude Opus 4.7 (1M context)_
