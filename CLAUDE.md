# CLAUDE.md — Équipe Buteau (Andrew Buteau, Planiprêt)

> Lu automatiquement à chaque ouverture du projet. Respecter à la lettre.
> Dernière mise à jour : 2026-05-08 (Phases 0-9 complètes — site prêt à shipper)

---

## 1. Description du projet

Site web haute conversion pour **Équipe Buteau** — courtage hypothécaire résidentiel + investissement immobilier. Cabinet d'attache : **Planiprêt Cabinet en Courtage Hypothécaire**. Remplace le site Wix existant `equipebuteau.com`.

**Tagline officielle :** « L'hypothèque autrement »

**Direction esthétique : LUXURY MINIMAL CORPORATE / éditorial raffiné** — palette navy + taupe + bronze caramel, lettrages uppercase, espacement large, signature lines taupe, gradient overlays. Référence visuelle : 4 HTML mockups dans `C:\Users\rochdi\.gemini\antigravity\scratch\buteau\`.

**Cible :** B2C — primo-acheteurs, propriétaires (renouvellement / refinancement), investisseurs immobiliers.

**Territoire desservi :** Tout le Québec (siège Laval).

**Régulateur :** AMF (courtier hypothécaire). Numéros de certificat individuels en placeholder Phase 9 client (à fournir).

---

## 2. Stack technique (V6 Intralys)

| Outil | Version | Rôle |
|---|---|---|
| **React** | 19 | UI |
| **TypeScript** | 5.8+ strict | Type safety |
| **Vite** | 7 | Build + dev server |
| **TanStack Router** | 1.168+ | Routing file-based avec autoCodeSplitting |
| **Tailwind CSS** | v4 | `@theme inline` + tokens `oklch` |
| **Radix UI** | 1.2+ | Accessibilité (Accordion FAQ) |
| **Lucide React** | 0.575+ | Icônes |
| **Cloudflare Workers** | — | API + assets unifiés (1 worker, pas Pages Functions) |
| **Cloudflare D1** | — | `equipe-buteau-leads` (à créer Phase 9) |
| **Bun** | Latest | Runtime + package manager |

---

## 3. Commandes

```bash
bun install
bun run dev              # localhost:5173
bun run build            # DOIT passer 0 erreur avant push
bunx tsc --noEmit        # TS strict check
bunx wrangler dev        # API local port 8787 (en parallèle de bun run dev)
bunx wrangler deploy     # deploy MANUEL Cloudflare (jamais auto)
```

Workflow standard : `bun run build` → `git push` (backup) → `bunx wrangler deploy` après validation user.

---

## 4. Structure finale

```
equipe-buteau/
├── CLAUDE.md (ce fichier)
├── package.json + bunfig.toml + bun.lock
├── tsconfig.json (strict + paths @/*)
├── vite.config.ts (TanStack Router + Tailwind v4 + tsconfig-paths + proxy /api)
├── wrangler.jsonc (assets SPA + run_worker_first /api/*)
├── index.html (FR par défaut + OG + Twitter + Google Fonts Montserrat/Open Sans/Cormorant)
└── src/
    ├── main.tsx (LanguageProvider + GlossaryProvider + RouterProvider)
    ├── index.css (theme oklch navy/taupe/bronze + utilities .eyebrow .display .signature-line .card-luxury .btn-bronze .surface-navy/cream)
    ├── worker.ts (POST /api/lead 4 couches + ctx.waitUntil GHL + CSP headers)
    ├── routeTree.gen.ts (auto-généré par TanStack)
    ├── routes/
    │   ├── __root.tsx (Navbar + Footer + SkipToContent + CookieBanner + GlossaryModal + TrackingPixels)
    │   ├── index.tsx (Page Accueil 9 sections)
    │   ├── equipe.tsx (Page Équipe — 3 cartes + Notre Méthode + CtaBlock)
    │   ├── institutions.tsx (Page Institutions — Insurance + 9 lenders + Missing + CtaBlock)
    │   ├── outils.tsx (Page Outils — Calculator + Guides + TikTok + Blog + Documents + ToolsFinalCta)
    │   ├── lexique.tsx (14 termes hypothécaires + Schema.org DefinedTermSet)
    │   ├── mentions-legales.tsx (7 sections)
    │   └── confidentialite.tsx (Loi 25 — 9 sections)
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx (sticky scroll-aware + LanguageToggle + CTA tel + mobile drawer)
    │   │   ├── Footer.tsx (brand + contact + sitemap + legal + AMF disclaimer)
    │   │   ├── Container.tsx (responsive sm/md/lg/xl/full)
    │   │   ├── SkipToContent.tsx (WCAG 2.4.1)
    │   │   ├── LanguageToggle.tsx (FR/EN)
    │   │   ├── CookieBanner.tsx (Loi 25 art. 23 — boutons d'égale visibilité)
    │   │   ├── AmfDisclaimer.tsx (3 variantes : inline / card / badge)
    │   │   └── LegalPageWrap.tsx (wrapper pages légales)
    │   └── landing/
    │       ├── SectionHeading.tsx (eyebrow + title + signature line)
    │       ├── PageHero.tsx (hero secondaire pour pages internes)
    │       ├── Hero.tsx (Hero Accueil plein écran)
    │       ├── Partners.tsx (carousel infinite scroll + mask fade)
    │       ├── TeamTeaser.tsx (3 cartes Accueil)
    │       ├── TeamGrid.tsx (3 cartes Équipe avec bios)
    │       ├── TeamMethod.tsx (3 piliers I-II-III filigrane)
    │       ├── Services.tsx (4 cartes border-left taupe -> bronze hover)
    │       ├── Mission.tsx (2 paragraphes éditoriaux + 4 valeurs)
    │       ├── ToolsTeaser.tsx (4 cartes glass)
    │       ├── Reviews.tsx (3 témoignages Google)
    │       ├── ContactSection.tsx (form + info)
    │       ├── ContactForm.tsx (4 couches défense leads)
    │       ├── Faq.tsx (Radix Accordion 7 questions)
    │       ├── InsuranceNote.tsx (encadré Attention sur preuve assurance)
    │       ├── LendersGrid.tsx (9 institutions avec adresses)
    │       ├── InstitutionMissing.tsx (encadré CTA contact)
    │       ├── CtaBlock.tsx (CTA réutilisable Équipe/Institutions)
    │       ├── GuidesGrid.tsx (3 guides "Bientôt")
    │       ├── TikTokTeaser.tsx (capsules vidéo soon)
    │       ├── BlogTeaser.tsx (blog soon)
    │       ├── DocumentsGrid.tsx (2 docs téléchargeables)
    │       ├── ToolsFinalCta.tsx (CTA fin Outils)
    │       ├── TrackingPixels.tsx (Consent Mode v2 default DENIED + GA4/Meta/Clarity/GAds)
    │       ├── GlossaryModal.tsx (modal 14 termes a11y)
    │       └── calculators/
    │           └── HypothequeCalculator.tsx (formule canadienne semi-annuelle)
    ├── hooks/
    │   ├── useScrollReveal.ts (IntersectionObserver fade-in)
    │   ├── useCountUp.ts (RAF ease-out cubic)
    │   └── useCookieConsent.ts (localStorage + Consent Mode v2 update)
    ├── lib/
    │   ├── config.ts (data Buteau centralisée + placeholders Phase 9)
    │   ├── translations.ts (FR/EN BilingualLax + ta<T>())
    │   ├── LanguageContext.tsx (FR par défaut, persist localStorage)
    │   ├── GlossaryContext.tsx (open/close + selectedSlug)
    │   ├── glossary.ts (14 termes hypothécaires QC)
    │   ├── parseLocaleFloat.ts (NNBSP + virgule + dollar)
    │   └── utils.ts (cn helper)
    └── db/
        └── schema.sql (D1 schema : leads + rate_limits)
```

---

## 5. État du projet (snapshot 2026-05-08 — site prêt à shipper)

### ✅ DONE — Phases 0-9 complètes

| # | Phase | Status |
|---|---|---|
| 0 | Setup contexte (CLAUDE.md + folder) | ✅ |
| 1 | Bootstrap V6 (configs + scaffold + bun install) | ✅ |
| 2 | Design system (tokens oklch + utilities + Navbar/Footer/SkipToContent/LanguageToggle) | ✅ |
| 3 | Page Accueil (9 sections : Hero/Partners/TeamTeaser/Services/Mission/ToolsTeaser/Reviews/Contact/Faq) | ✅ |
| 4 | Page Équipe (PageHero + TeamGrid 3 bios + TeamMethod 3 piliers + CtaBlock) | ✅ |
| 5 | Page Institutions/Adresses pour assurances (Insurance note + LendersGrid 9 + Missing + Cta) | ✅ |
| 6 | Page Outils (Calculator FR canadien semi-annuel + Guides 3 + TikTok + Blog + Docs 2 + FinalCta) | ✅ |
| 7 | Backend leads V6 (D1 schema + worker /api/lead 4 couches + ContactForm + TrackingPixels Consent v2) | ✅ |
| 8a | CookieBanner Loi 25 + AmfDisclaimer + useCookieConsent | ✅ |
| 8b | /mentions-legales (7 sections) + /confidentialite (Loi 25 9 sections) | ✅ |
| 8c | Glossaire 14 termes + GlossaryModal + /lexique + Schema.org DefinedTermSet | ✅ |
| 9 | Audits final (build OK + tsc OK + hardcoded strings audit OK) | ✅ |

### Métriques finales (build production)

- **Bundle JS first load** : 118 kB gzip (< 200 kB target ✓)
- **CSS** : 8 kB gzip
- **Routes** : 8 totales avec lazy-loading auto (code splitting)
- **TS strict** : 0 erreurs
- **Build time** : ~1.5s

### 🟠 Phase 9 — Quand le client fournit ses infos (~10 min)

À swap dans `src/lib/config.ts` :
- `amf.certificateNumberAndrew` → trust signal "Inscrit AMF" s'active
- `amf.certificateNumberAbygaele` (si certifiée)
- `legal.neq` → mentions légales
- `legal.dpoEmail` → page confidentialité section 9
- `calendlyUrl` → CTAs deviennent booking direct (intégration finale fin)
- `tracking.{ga4, metaPixel, clarity, googleAds}` → pixels actifs
- Photos équipe finales dans `assets.teamPhotos.*`

À configurer côté Cloudflare :
- Créer D1 : `bunx wrangler d1 create equipe-buteau-leads`
- Apply schema : `bunx wrangler d1 execute equipe-buteau-leads --remote --file=./src/db/schema.sql`
- Uncomment d1_databases dans `wrangler.jsonc` avec database_id retourné
- Secrets : `bunx wrangler secret put GHL_LOCATION_ID` + `GHL_TRACKING_ID`

À configurer côté GHL :
- Workflow "External Form Submitted" pour ingest les leads via External Tracking V6
- Custom fields IDs à ajouter dans `config.ghl.customFields` au fur et à mesure

---

## 6. Données client centralisées

**Toutes dans `src/lib/config.ts`** — JAMAIS hardcoder ailleurs.

Champs confirmés (pré-remplis) :
- `name` : « Équipe Buteau »
- `tagline` : « L'hypothèque autrement »
- `cabinet` : « Planiprêt Cabinet en Courtage Hypothécaire »
- `phone.raw` : `+14384944567` — `phone.display` : `438-494-4567`
- `email` : `gestion@equipebuteau.com`
- `address` : 2300 boul. Saint-Martin Est, suite 200, Laval, QC H7E 5P3
- Équipe : Andrew Buteau (lead courtier), Abygaèle Gagné (coordo), Alexis Buteau (en formation)
- 9 institutions financières (BN/MCAP/FN/CIBC/CMLS/TD/Scotia/Manuvie/Desjardins)

---

## 7. Conventions design (LUXURY MINIMAL CORPORATE)

**Palette confirmée HTML mockups → tokens oklch :**
- Navy `#10223d` → `oklch(0.252 0.067 256)` — fond foncé dominant
- Taupe `#b8af9f` → `oklch(0.722 0.018 84)` — accent, dividers, signatures lines
- Off-white `#f9f9f9` → `oklch(0.978 0 0)` — sections claires
- Bronze caramel `#C69C6D` → `oklch(0.704 0.077 56)` — accent boutons, hover

**Fonts (Google Fonts) :**
- `Montserrat` 600/700/800 — titres uppercase, letter-spacing 0.12em
- `Open Sans` 300/400/600 — corps de texte
- `Cormorant Garamond` italic — accents éditoriaux luxury (numéros romains TeamMethod)

**Patterns visuels distinctifs :**
- Signature lines taupe (1px ou 2px horizontal)
- Gradient overlays sur images de fond (navy 86-92% + image fixed)
- Hover translateY(-2px) + box-shadow étendue
- Border-left colorés sur cartes (3px → 5px taupe ou bronze)
- Lettrages uppercase letter-spacing 0.12em sur eyebrows
- Numéros romains I-II-III filigrane Cormorant italic (TeamMethod)
- Compute theatre Calculator : surface navy contraste avec result chiffre énorme
- Cards luxury hover translateY + border-color → bronze

---

## 8. Règles absolues (R1-R7)

### R1 — Pas de copier-coller depuis autres clients (composants)
TOOLKIT (hooks, helpers, pipeline V6, configs, features Lexique/CookieBanner/etc.) → COPIÉ verbatim depuis V6 reference (eg-services-financiers).
SITE (composants pages : Hero/Concept/Strategies/Equipe/etc., translations.ts, theme tokens) → CODÉ FRESH 100%.
✅ Audit grep : aucun composant copy-paste détecté.

### R2 — i18n complet (FR/EN)
Tout texte visible passe par `translations.ts`. Toggle FR/EN doit changer 100% du contenu. FR par défaut au load (Charte loi 96 Quebec).
✅ Audit grep : seuls les JSDoc et contenu légal hardcoded FR/EN dédié (BodyFr/BodyEn) sont en dur — c'est OK.

### R3 — TypeScript strict
Pas d'`any`. Build = 0 erreurs / 0 warnings AVANT push.
✅ `bunx tsc --noEmit` : 0 erreur.

### R4 — Bun, pas npm/yarn
✅

### R5 — Wrangler deploy MANUEL
`git push` ≠ deploy. Deploy = `bunx wrangler deploy` après validation user.
🟠 Pas encore deployé — attente du go user après Phase 9 client setup (D1 + secrets GHL + AMF cert numbers).

### R6 — Compliance AMF obligatoire avant Meta Ads
Buteau = courtage hypothécaire = supervisé AMF.
✅ AmfDisclaimer composant + footer disclaimer + /mentions-legales + /confidentialite.
✅ Pas de promesses de rendement chiffrées (« +X% », « gagnerez Y$ », « garantie »).
🟠 Numéros AMF en placeholder Phase 9 client.

### R7 — Defense en profondeur leads (4 couches)
✅ Implémentées dans `src/worker.ts` :
1. Honeypot field caché (`contact_check_url` + display:none + tabindex=-1 + aria-hidden + autocomplete random)
2. Timing detection `elapsed_ms < 3000ms` (client envoie `form_started_at`, worker check)
3. Rate limit D1 30s par IP (table `rate_limits` avec ip_hash SHA-256)
4. Server-side validation (email regex + maxLen + consent + sanitize control chars)

---

## 9. Git workflow

- Branch principale : `main` (8 commits Phase 0-8 + 1 commit Phase 9)
- Commits français avec scope conventionnel : `feat(home):`, `feat(team):`, `chore:` etc.
- Co-authored-by Claude Opus 4.7 (1M context) sur chaque commit
- Push fréquent (backup, pas deploy auto)
- Pas de remote configuré encore (à créer si user veut un GitHub repo)

---

## 10. Skills mobilisées

**Process / orchestration :**
- `superpowers:brainstorming`, `superpowers:verification-before-completion`
- `gsd-code-review` (Phase 9 audit)

**Design :**
- `frontend-design` — composition distinctive
- `intralys-edito-magazine` — grammaire luxury éditoriale (référence)
- `intralys-sections-edito-templates` — inspiration concepts (PAS verbatim)

**Compliance non-négociable AMF + Quebec :**
- `intralys-amf-disclaimer` ✅
- `intralys-consent-loi25` ✅
- `intralys-compliance` ✅
- `intralys-footnote-scope` (pas utilisé Phase 8 — peut être ajouté Phase 9 si client veut)

**Toolkit V6 :**
- `intralys-core`, `intralys-blueprint` — méthodologie + référence stack
- `intralys-i18n-bilingual` ✅ (BilingualLax + ta<T>())
- `intralys-skip-content-a11y` ✅
- `intralys-locale-parsefloat` ✅ (Calculator FR canadien)
- `intralys-form-honeypot` ✅ (4 couches)
- `intralys-v6-pipeline` ✅ (D1 + worker + GHL ctx.waitUntil)
- `intralys-tracking` ✅ (Meta + GA4 + Clarity + Google Ads + Consent v2)

**Métier hypothécaire QC :**
- `intralys-outils-immobiliers-qc` (formule canadienne dans Calculator)
- `intralys-glossary` ✅ (modal + Schema.org DefinedTermSet)

---

## 11. Référence visuelle

**4 HTML mockups source :** `C:\Users\rochdi\.gemini\antigravity\scratch\buteau\`
- `Accueil.html` — utilisé pour Hero + Valeurs/Mission + Services + ÉquipeTeaser + ToolsTeaser + Reviews + Contact + FAQ
- `equipe.html` — utilisé pour Page Équipe (3 cartes bios + Notre Méthode 3 piliers)
- `institutions.html` — utilisé pour Page Institutions (Insurance note + 9 lenders + Missing)
- `outils.html` — utilisé pour Page Outils (Calculator + Guides + TikTok + Blog + Documents)

**Méthode anti-oubli appliquée :** chaque page a été codée APRÈS lecture intégrale du HTML source (chunk par chunk pour Accueil.html qui faisait 2103 lignes ; via Explore agent pour les autres). Tout le copy FR a été extrait mot pour mot.
