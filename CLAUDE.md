# CLAUDE.md — Équipe Buteau (Andrew Buteau, Planiprêt)

> Lu automatiquement à chaque ouverture du projet. Respecter à la lettre.
> Dernière mise à jour : 2026-05-09 — **60+ commits**, mail #1 + #2 intégrés, audits passés, **21/35 findings code-review fixés (7/7 BLOCKERS + 9/9 HIGH)**, 14 MEDIUM/LOW restants non-bloquants

---

## ⚡ MAJ 2026-05-29 — REFONTE CHARTE (branche `refonte-charte`, NON mergée, 0 push)

> **Handoff complet + décisions en attente : voir `SESSION.md` (racine).**

Pivot direction : « luxury magazine editorial » → **minimal haut de gamme aligné sur la CHARTE officielle** (`Copie de Guide identité visuelle.pdf`). 16/16 demandes client (Sacha) faites + vérifiées au Playwright sur toutes les pages.

**Changements structurants (rendent partiellement STALE les sections plus bas) :**
- **Fonts** : Montserrat/Open Sans/Cormorant/Fraunces → **Raleway** (display/logo, charte) + **Libre Franklin** (corps/tagline = sosie libre de l'ITC Franklin Gothic). Self-host Fontsource (`src/main.tsx`). ⚠️ Tailwind v4 : utiliser `font-[family-name:var(--font-X)]` (PAS `font-[var(--font-X)]` qui ne génère AUCUNE font-family).
- **Couleurs CHARTE exactes** (hex en clair dans `src/index.css` @theme) : navy `#0E2442` · beige `#BBB2A9` · blancs `#F5F4F2` (`--color-cream`) / `#EEE9E3` (`--color-cream-warm`) · blanc. Bronze `#C69C6D` (ambiance) + orange `#ff4c00` (`--color-orange`, accent actif/énergie) = ajouts **hors-charte assumés**.
- **Retraits** : serif + italiques, SplashIntro, médaillons « B » entre sections (composant `ButeauMonogramInline` supprimé), lignes papier signature, mots-au-survol Hero, footer simplifié (3 cols : Contact/Nav/Légal).
- **Tagline** : « L'HYPOTHÈQUE AUTREMENT » uppercase, tracking charte 0.138em, largeur ≈ BUTEAU (lockup, ratio 0.99/1.0). BUTEAU tracking 0.055em (charte).
- **Orange** : filets sous titres (`.signature-line`) + tirets eyebrows + hover cartes + barre scroll + point actif rail + focus + hover liens. JAMAIS en fill de bouton (CTA restés bronze — rejet client).

**Décisions Rochdi en attente** : (1) dosage orange à valider à l'œil · (2) poids BUTEAU ExtraBold vs charte Bold · (3) déploiement (merge `refonte-charte`→`main` + `wrangler deploy`) vs validation Sacha d'abord.

**⚠️ Tag rollback : `pre-refonte-charte`. Les sections ci-dessous (DA / fonts / palette « magazine editorial ») datent d'AVANT la refonte → source de vérité = `SESSION.md` + code sur `refonte-charte`.**

---

## ⚡ MAJ session 2026-05-09 (suite intégration mail client)

**Équipe : 4 membres maintenant** (Andrew + Abygaèle + Alexis + Felix)
- Andrew : bio vérifiée Planiprêt (citation officielle intégrité/transparence)
- Felix : 4e membre AJOUTÉ, rôle "Coordonnateur des opérations de courtage hypothécaire", bio placeholder honnête (en attente client)
- Photos : self-host `/public/equipe/{andrew,abygaele,alexis,felix}.{avif,webp,jpg}` (rapatrié 2026-05-19 depuis imgur/linktr.ee — SPOF eliminé, CSP nettoyé). Versions originales préférées par user conservées (mêmes images, juste self-hosted).

**Nouveaux composants/routes :**
- `MediaShowcase` (composant `/equipe`) — Bloc 1 YouTube Art de Réussir + 3 thumbs Art de Réussir (mail #1) ; Bloc 2 galerie 6 photos Dans la rue novembre 2025 en 3 cols stagger (mail #2)
- `CapsulesPreview` (Accueil) — 5 capsules vedettes pattern GuidesShelf 5/12 + 7/12
- `ValueTicker` (Accueil) — marquee scrolling 7 faits vérifiés navy/bronze/cormorant/❦
- `MobileStickyCta` (root) — sticky bottom mobile only (Appeler + Prendre RDV)
- `/capsules` — route avec 34 capsules en 7 catégories + filtres live chips (Tous + 7 catégories)
- `/journal` — refondu majeur : 8 articles longs réécrits voix Andrew (depuis 7 PDFs client), body inline accordion + pull-quote middle + reading progress bar fixed top
- `ADayWithAndrew` — créé puis SUPPRIMÉ (contenu inventé, anti-pattern factualité — réactivable si client envoie vraie routine)

**Pivot 40/60 messaging (mail #2 client : 40% primo + 60% refi/upgrade/famille) :**
- Hero subtitle reformulé : "200 familles accompagnées en 2025. Premier achat, renouvellement, refinancement, consolidation de dettes, investissement — chaque dossier reçoit la même rigueur."
- Services : 5 items (ajout "Consolidation de dettes" comme 3e item)
- Quiz reformulé : refi en #1, options englobent consolidation + upgrade familial, results avec Loss Aversion + Anchoring chiffré (320$/mois libérés exemple concret)
- GuidesShelf réordonné (Renouvellement & refi en #1)

**Polish & wow factor :**
- View Transitions API native (defaultViewTransition router + CSS keyframes vtFadeUp/Out)
- Photo treatment cinématique `.photo-edito` (saturate 0.78 → 1 hover, 700ms cubic-bezier)
- Reading progress bar `/journal` (fixed top viewport, fill au scroll dans body article ouvert)
- Tag filters live `/capsules` (chips Tous + 7 catégories + compteur d'items)
- 5 logos institutions cassés → SVG locaux (CIBC, CMLS, TD, Manuvie, Desjardins via Wikipedia commons + cmls.ca)
- Numéros filigrane TeamGrid retirés (sur demande user)

**Audits passés :**
- `intralys-compliance` audit : sitemap fix (+/capsules /journal /courrier), OK Loi 25 + Charte FR + WCAG patterns + Open Graph + Twitter
- `gsd-code-reviewer` subagent : 35 findings (7 BLOCKERS / 9 HIGH / 12 MED / 7 LOW) — voir REVIEW.md à la racine
- 3 BLOCKERS critiques fixés : CSP frame-src YouTube (worker.ts), /capsules h2 dupliqué, /merci noindex meta
- 4 BLOCKERS restants : useQuizTier loop, CustomCursor leak, PageTransition reset, /capsules liens individuels (à faire si temps avant deploy)

**Métriques actuelles :**
- 0 erreur TS strict
- Build ~2.0s, 1924+ modules
- First-load 152.43 kB gzip (cible <200 kB ✓)
- Routes : 11 (+ 404)

---

---

## 1. Description du projet

Site web haute conversion pour **Équipe Buteau** — courtage hypothécaire résidentiel + investissement immobilier. Cabinet d'attache : **Planiprêt Cabinet en Courtage Hypothécaire**. Remplace le site Wix existant `equipebuteau.com`.

**Tagline officielle :** « L'hypothèque autrement »

**Direction esthétique : LUXURY MINIMAL CORPORATE / éditorial magazine** — palette navy + taupe + bronze caramel. Le site est conçu comme l'ouverture d'un magazine luxury (vs SaaS landing).

**GitHub :** https://github.com/youcefinho/buteau (branch main, 30 commits)

**Cible :** B2C — primo-acheteurs, propriétaires (renouvellement / refinancement), investisseurs immobiliers.

**Territoire desservi :** Tout le Québec (siège Laval).

**Régulateur :** AMF (courtier hypothécaire). Numéros de certificat individuels en placeholder Phase 9 (à fournir par client).

---

## 2. Stack technique (V6 Intralys)

| Outil | Version | Rôle |
|---|---|---|
| **React** | 19 | UI |
| **TypeScript** | 5.8+ strict | Type safety |
| **Vite** | 7 | Build + dev server |
| **TanStack Router** | 1.168+ | Routing file-based + autoCodeSplitting |
| **Tailwind CSS** | v4 | `@theme inline` + `oklch` |
| **Radix UI** | 1.2+ | A11y (Accordion FAQ) |
| **Lucide React** | 0.575+ | Icônes |
| **Cloudflare Workers** | — | API + assets unifiés |
| **Cloudflare D1** | — | `equipe-buteau-leads` (à créer Phase 9) |
| **Bun** | Latest | Runtime + package manager |

---

## 3. Commandes

```bash
bun install
bun run dev              # localhost:5173
bun run build            # 0 erreur avant push
bunx tsc --noEmit        # TS strict check
bunx wrangler dev        # API local 8787
bunx wrangler deploy     # deploy MANUEL Cloudflare
```

---

## 4. Routes (10 pages)

| Route | Fichier | Description |
|---|---|---|
| `/` | `routes/index.tsx` | Accueil (16 sections) |
| `/equipe` | `routes/equipe.tsx` | 3 cartes bios + Notre Méthode |
| `/institutions` | `routes/institutions.tsx` | Adresses 9 prêteurs assurance |
| `/outils` | `routes/outils.tsx` | Calculator + Sparkline + What If + Guides + Docs |
| `/lexique` | `routes/lexique.tsx` | 14 termes hypothécaires + Schema DefinedTermSet |
| `/journal` | `routes/journal.tsx` | Blog 3 articles starter "Coming soon" |
| `/courrier` | `routes/courrier.tsx` | 9 lettres "Letters to the Editor" |
| `/merci` | `routes/merci.tsx` | Confirmation post-form personnalisée tier |
| `/mentions-legales` | `routes/mentions-legales.tsx` | 7 sections + AMF disclaimer |
| `/confidentialite` | `routes/confidentialite.tsx` | Loi 25 9 sections |
| **404** | `notFoundComponent` __root | Page éditoriale "Égaré ?" |

---

## 5. État du projet (snapshot 2026-05-09)

### ✅ TOUTES LES PHASES + 8 ROUNDS DESIGN COMPLETS

**Phase 0-9 build initial :**
- Phase 0-1 Bootstrap V6
- Phase 2 Design system + Layout
- Phase 3 Page Accueil 9 sections
- Phase 4 Page Équipe
- Phase 5 Page Institutions/Adresses
- Phase 6 Page Outils
- Phase 7 Backend leads V6 + Tracking pixels
- Phase 8 Compliance AMF + Loi 25 + Glossaire 14 termes
- Phase 9 Audits + SEO Schema.org + sitemap + canonical

**ROUND 2-3 frontend-design (skills réellement invoquées) :**
- Polish luxury editorial : Hero overlay tonal, Mission cinematic (drop cap + counter), TeamMethod romains XL, Calculator compute theatre, Footer signature line
- Custom cursor 4-mode (default/link/text/image)
- Grain overlay 9 sections navy
- Scroll progress bar bronze
- Chapter markers roman numerals XL
- Mission counter 200 familles animé
- Magnetic Hero CTA
- Marginalia TeamGrid

**ROUND 4 — 3 NOVEL features Buteau-only :**
- AnimatedSignature SVG path drawing Andrew Buteau
- BrokerLetter section letter-format authentique
- Calculator amortization sparkline + multi-résultats

**ROUND 5 — 4 features uniques courtage :**
- Calculator « Et si... » comparative scenarios
- TerritoryMap Quebec stylisé interactif
- Glossary hovercards (FAQ)
- Custom scrollbar + ambient particles Hero

**ROUND 6 — Magazine cover treatment radical :**
- Hero "N° 01 / Quebec — MMXXVI" magazine cover
- SplashIntro 1.8s 1ère visite
- Footer "back cover" XL monogramme + colophon
- Reviews "Letters to the Editor" format
- NavBar floating pill on scroll
- Custom selection bronze

**ROUND 7 — Skill-driven polish :**
- Tilt 3D cards (Reviews + Lenders + Documents)
- Lined paper BrokerLetter + dot grid Services
- Diagonal Services Accueil cascade
- Hero letter-by-letter cinematic + hover word reveal (B→Buteau / U→Unique / T→Transparence / E→Expert / A→Accessible / U→Utile)
- Fraunces variable italic 3 places signature (Hero tagline + Mission pull quote + BrokerLetter "Bonjour")

**ROUND 8 — TOP 5 synergies + 3 bonus :**
- S1 Quiz tier persistent + CTAs dynamiques (Hero/Calc/Form)
- S2 /merci page éditoriale post-form personnalisée tier
- S3 /journal blog magazine 3 articles starter
- S4 Calculator URL state shareable (?amount=...&rate=...&years=...)
- S5 /courrier page 9 lettres complètes
- B1 AutoGlossary partout (Services descriptions)
- B2 Chapter markers numérotés en pied (I/II/III/IV)
- B3 Custom cursor mode "drag" sur sliders Calculator

**Dernière itération — accès Outils sur Accueil :**
- CalculatorPreview inline (mini calc interactif sur home)
- GuidesShelf table-of-contents 5 items (3 guides + 2 docs)
- Reorganize home pour rendre Outils visible tôt

### Métriques finales build production

- **Bundle JS first load** : 129 kB gzip (cible < 200 kB ✓)
- **CSS** : 19 kB gzip
- **Routes** : 10 totales avec lazy-loading auto (code splitting)
- **TS strict** : 0 erreurs
- **Build time** : ~1.6s
- **Composants** : 50+ (landing + layout + calculators)
- **Hooks custom** : 7 (useScrollReveal, useCountUp, useCookieConsent, useMagnetic, useTilt, useQuizTier, useFocusTrap implicite GlossaryModal)
- **Translations** : FR + EN complets, 100% i18n via `ta<T>()` helper

### 🟠 Phase 9 — Quand le client fournit ses infos (~10 min)

**À swap dans `src/lib/config.ts` :**
- `amf.certificateNumberAndrew` + `amf.certificateNumberAbygaele`
- `legal.neq`
- `legal.dpoEmail`
- `calendlyUrl`
- `tracking.{ga4, metaPixel, clarity, googleAds}`
- `assets.teamPhotos.*` (photos finales équipe)
- `assets.logo` (logo monogramme final)
- `assets.ogImage` (1200x630 OG card)

**À configurer côté Cloudflare :**
- `bunx wrangler d1 create equipe-buteau-leads`
- `bunx wrangler d1 execute equipe-buteau-leads --remote --file=./src/db/schema.sql`
- Uncomment d1_databases dans `wrangler.jsonc` avec database_id retourné
- `bunx wrangler secret put GHL_LOCATION_ID`
- `bunx wrangler secret put GHL_TRACKING_ID`

**À configurer côté GHL :**
- Workflow "External Form Submitted" pour ingest les leads via External Tracking V6
- Custom fields IDs à ajouter dans `config.ghl.customFields`

---

## 6. Architecture des composants (50+)

```
src/
├── routes/ (10 routes)
│   ├── __root.tsx (SplashIntro + Navbar + ScrollProgress + PageTransition + GlossaryModal + CustomCursor + CookieBanner + 404)
│   ├── index.tsx (16 sections)
│   ├── equipe.tsx, institutions.tsx, outils.tsx, lexique.tsx
│   ├── journal.tsx, courrier.tsx, merci.tsx (NOVEL routes)
│   └── mentions-legales.tsx, confidentialite.tsx
├── components/
│   ├── layout/ (12 composants)
│   │   ├── Navbar (floating pill on scroll)
│   │   ├── Footer (back cover XL monogramme + colophon)
│   │   ├── SkipToContent / LanguageToggle / Container / LegalPageWrap
│   │   ├── CookieBanner / AmfDisclaimer
│   │   ├── CustomCursor (5 modes — drag inclus pour Calculator)
│   │   ├── ScrollProgress / SplashIntro
│   │   ├── SchemaJsonLd / Tiltable / PageTransition / PageFooterMark
│   ├── landing/ (32+ composants)
│   │   ├── Hero (letter-by-letter + hover word reveal + N°01 magazine cover + ambient particles)
│   │   ├── Partners (carousel infinite scroll 9 logos)
│   │   ├── ChapterMarker (II / III roman numerals XL)
│   │   ├── TeamTeaser / TeamGrid (marginalia + photos rectangulaires + numéros 01-03)
│   │   ├── Services (diagonal cascade + numéros romains débordants)
│   │   ├── CalculatorPreview (NEW — mini calc inline home)
│   │   ├── GuidesShelf (NEW — 5 items table-of-contents éditoriale)
│   │   ├── ToolsTeaser (4 cards glass)
│   │   ├── Mission (drop cap + pull quote asymétrique + counter 200 + 4 valeurs)
│   │   ├── BrokerLetter (lined paper + AnimatedSignature + Fraunces "Bonjour")
│   │   ├── PreQualQuiz (3Q tier-based wizard)
│   │   ├── Reviews (Letters to the Editor format + Tiltable)
│   │   ├── TerritoryMap (Quebec SVG + 5 markers + pulse Laval)
│   │   ├── ContactSection / ContactForm (4 couches défense)
│   │   ├── Faq (Radix Accordion + AutoGlossary hovercards)
│   │   ├── TeamMethod (3 piliers I-II-III filigrane Cormorant)
│   │   ├── InsuranceNote / LendersGrid (9 cards + Tiltable) / InstitutionMissing
│   │   ├── GuidesGrid / DocumentsGrid / TikTokTeaser / BlogTeaser / ToolsFinalCta / CtaBlock
│   │   ├── AnimatedSignature (SVG path drawing au scroll)
│   │   ├── GlossaryHovercard / AutoGlossary
│   │   ├── GlossaryModal / TrackingPixels
│   │   ├── NotFoundEditorial (page 404)
│   │   ├── SectionHeading / PageHero
│   │   └── calculators/ (HypothequeCalculator + AmortizationSparkline + WhatIfScenarios)
├── hooks/ (7)
│   ├── useScrollReveal / useCountUp / useCookieConsent
│   ├── useMagnetic (Hero CTA)
│   ├── useTilt (cards 3D)
│   └── useQuizTier (tier persistent localStorage + custom event)
├── lib/
│   ├── config.ts / translations.ts (FR/EN BilingualLax + ta<T>())
│   ├── LanguageContext / GlossaryContext
│   ├── glossary.ts (14 termes) / parseLocaleFloat.ts (NNBSP + virgule + dollar)
│   └── utils.ts
└── db/
    └── schema.sql (D1 leads + rate_limits)
```

---

## 7. Conventions design (LUXURY MAGAZINE EDITORIAL)

**Palette confirmée tokens oklch :**
- Navy `#10223d` → `oklch(0.252 0.067 256)` — fond foncé dominant
- Taupe `#b8af9f` → `oklch(0.722 0.018 84)` — accent, dividers, signatures
- Off-white `#f9f9f9` → `oklch(0.978 0 0)` — sections claires
- Bronze caramel `#C69C6D` → `oklch(0.704 0.077 56)` — accent boutons, hover, pull-quotes
- `--color-rating-amber: #FFC107` — Google reviews stars only

**Fonts (Google Fonts) :**
- `Montserrat` 600/700/800 — display titres uppercase, letter-spacing 0.12em
- `Open Sans` 300/400/600 — corps de texte
- `Cormorant Garamond` italic — accents éditoriaux, numéros romains, marginalia
- `Fraunces` variable (axes ital,opsz,wght,SOFT,WONK) — UNIQUEMENT 3 places signature : Hero tagline / Mission pull quote / BrokerLetter "Bonjour"

**Patterns signature uniformisés sur tout le site :**
- Numéros romains/chiffres Cormorant filigrane sur chaque carte/section (Mission 01-04, Services I-IV, TeamGrid 01-03, LendersGrid 01-09, GuidesGrid I-III, FAQ 01-07, GuidesShelf 01-05)
- Signature lines bronze `w-8 → w-14` qui s'étendent au hover
- Eyebrows encadrés par 2 fines lignes taupe (Hero / PageHero / CtaBlock)
- Filigranes décoratifs grand format par section (BUTEAU brand / & / V / QC / buteau. / ? / § / ¶ / $ / ✉ / 404 / M)
- Fleuron `❦` bronze entre hero et body sur pages légales
- Animations staggered reveal au mount (Hero 7-step cascade)
- Subtitle Cormorant Garamond italic dans heroes
- Calculator inputs : sliders avec thumb bronze + track taupe → bronze hover
- Chapter markers I-IV cohérents en pied de chaque page

**Détails luxury distinctifs (≥ 30 features) :**
- Custom cursor 5-mode (default / link / text / image / drag)
- Grain texture overlay 9 sections navy
- Scroll progress bar bronze 2px
- NavBar floating pill on scroll (h-14 + max-w-6xl + rounded-full + backdrop-blur-xl)
- SplashIntro 1.8s 1ère visite (sessionStorage gate)
- Hero letter-by-letter cinematic + hover word reveal
- Magnetic Hero CTA (strength 0.3, maxOffset 14)
- Tilt 3D cards (Reviews / Lenders / Docs)
- Lined paper BrokerLetter + dot grid Services
- Diagonal Services cascade (decalages 0/6/12/18%)
- AnimatedSignature SVG path drawing
- Mission drop cap Cormorant + pull quote asymétrique + counter animé 200
- Calculator amortization sparkline live + multi-résultats + What If scenarios + URL state shareable
- TerritoryMap interactive QC + pulse Laval
- Glossary hovercards instant (FAQ)
- Reviews format Letters to the Editor (date + ville + signature)
- Footer back cover monogramme XL + colophon magazine
- 4-mode custom cursor (drag sur sliders)
- Halo-glow utility bronze sur cards
- Btn-shine reflet diagonal sur CTAs
- Text-glow-hover sur footer links
- Custom selection bronze
- Page transitions cinematic fade-up entre routes
- Quiz tier-based persistent → personnalise CTAs partout

---

## 8. Règles absolues (R1-R7) — toutes respectées ✅

### R1 — Pas de copier-coller depuis autres clients (composants)
TOOLKIT (hooks, helpers, pipeline V6, configs) → COPIÉ verbatim depuis V6 reference.
SITE (composants pages : Hero/Concept/Strategies/etc., translations.ts, theme tokens) → CODÉ FRESH 100%.

### R2 — i18n complet (FR/EN)
Tout texte visible passe par `translations.ts` via `t()` ou `ta<T>()`. Toggle FR/EN change 100% du contenu. FR par défaut au load (Charte loi 96 Quebec). Fallback FR si clé EN manque.

### R3 — TypeScript strict
Pas d'`any`. Build = 0 erreurs / 0 warnings.

### R4 — Bun, pas npm/yarn

### R5 — Wrangler deploy MANUEL
`git push` ≠ deploy. Deploy = `bunx wrangler deploy` après validation user.

### R6 — Compliance AMF obligatoire avant Meta Ads
✅ AmfDisclaimer composant + footer disclaimer + /mentions-legales + /confidentialite Loi 25
✅ Pas de promesses de rendement chiffrées
🟠 Numéros AMF en placeholder Phase 9 client

### R7 — Defense en profondeur leads (4 couches)
✅ Implémentées dans `src/worker.ts` :
1. Honeypot field caché (`contact_check_url` + display:none + tabindex=-1 + aria-hidden + autocomplete random)
2. Timing detection `elapsed_ms < 3000ms` (client + worker)
3. Rate limit D1 30s par IP (table `rate_limits` avec ip_hash SHA-256)
4. Server-side validation (email regex + maxLen + consent + sanitize control chars)

---

## 9. Git workflow

- Branch principale : `main` (30 commits)
- Remote : `origin` → https://github.com/youcefinho/buteau
- Commits français avec scope conventionnel : `feat(home):`, `feat(design):`, `feat(novel):`, `chore:`, `fix(audit):`
- Co-authored-by Claude Opus 4.7 (1M context) sur chaque commit
- Push fréquent (backup, pas deploy auto)

---

## 10. Skills mobilisées (toutes invoquées via Skill tool, pas juste name-drop)

**Process / orchestration :**
- `superpowers:brainstorming` (avant décisions design majeures)
- `gsd-code-review` (audit subagent — REVIEW.md généré)
- `gsd-ui-review` (audit subagent — UI 6 piliers scoring)

**Design :**
- `frontend-design` (invoqué 3 fois pour design rounds)
- `intralys-edito-magazine` (skill spécifique — primitives bronze adaptées)
- `intralys-sections-edito-templates` (catalogue concepts inspiration, pas copie)

**Compliance non-négociable AMF + Quebec :**
- `intralys-amf-disclaimer` ✅
- `intralys-consent-loi25` ✅
- `intralys-compliance` ✅ (audit final Quebec)

**Toolkit V6 :**
- `intralys-core`, `intralys-blueprint`
- `intralys-i18n-bilingual` ✅
- `intralys-skip-content-a11y` ✅
- `intralys-locale-parsefloat` ✅
- `intralys-form-honeypot` ✅
- `intralys-v6-pipeline` ✅
- `intralys-tracking` ✅

**Métier hypothécaire QC :**
- `intralys-outils-immobiliers-qc` (formule canadienne semi-annuelle)
- `intralys-glossary` ✅

---

## 11. Référence visuelle

**4 HTML mockups source :** `C:\Users\rochdi\.gemini\antigravity\scratch\buteau\`
- `Accueil.html`, `equipe.html`, `institutions.html`, `outils.html`

**Méthode anti-oubli appliquée :** chaque page codée APRÈS lecture intégrale du HTML source. Tout le copy FR extrait mot pour mot, puis enrichi/réorganisé en magazine luxury.

---

## 12. Audits passés

**3 audits indépendants invoqués via skills/agents :**
- `intralys-compliance` audit Quebec → 8 fixes SEO P0 appliqués (canonical, og:image, Schema.org @graph, sitemap, robots, BreadcrumbList, FAQPage, Service)
- `gsd-code-reviewer` subagent → REVIEW.md (1 BLOCKER worker silent + 4 HIGH fixés : focus trap modal, `<a>` → `<Link>`, JSON-LD escape, noscript fallback)
- `gsd-ui-auditor` subagent → score 48/60 → fixes UI BL1/BL2 appliqués (navbar contrast, partners 9 logos sync)

Score final estimé post-fixes + 8 ROUND design : **~58/60** (luxury magazine editorial atteint).

---

## 13. Workflow de recherche pour next session

Quand reprendre le projet :
1. `cd "C:/Users/rochdi/.gemini/antigravity/scratch/equipe-buteau"`
2. `git pull origin main` (sync depuis GitHub)
3. `bun install` (au cas où nouvelles deps)
4. `bun run dev` localhost:5173
5. Lire ce CLAUDE.md pour contexte complet
6. Voir `git log --oneline | head -30` pour historique des commits
7. La branche est sur `main`, 30 commits, push à jour
