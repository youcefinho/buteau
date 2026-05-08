# CLAUDE.md — Équipe Buteau (Andrew Buteau, Planiprêt)

> Lu automatiquement à chaque ouverture du projet. Respecter à la lettre.
> Dernière mise à jour : 2026-05-08 (Phase 0 — bootstrap)

---

## 1. Description du projet

Site web haute conversion pour **Équipe Buteau** — courtage hypothécaire résidentiel + investissement immobilier. Cabinet d'attache : **Planiprêt Cabinet en Courtage Hypothécaire**. Le site actuel `equipebuteau.com` est sur Wix (à remplacer — footer broken « Newel Rénovation 2035 »).

**Tagline officielle :** « L'hypothèque autrement »

**Direction esthétique : LUXURY MINIMAL CORPORATE / éditorial raffiné** — navy + taupe + bronze caramel, lettrages uppercase, espacement large, signature lines taupe, gradient overlays. Modèle visuel issu des 4 HTML mockups dans `C:\Users\rochdi\.gemini\antigravity\scratch\buteau\`.

**Cible :** B2C — primo-acheteurs, propriétaires (renouvellement / refinancement), investisseurs immobiliers.

**Territoire desservi :** Tout le Québec (siège Laval).

**Régulateur :** AMF (courtier hypothécaire). Numéros de certificat individuels en placeholder Phase 8 (à fournir par client).

---

## 2. Stack technique (V6 Intralys)

| Outil | Version | Rôle |
|---|---|---|
| **React** | 19 | UI |
| **TypeScript** | 5.8+ | Strict mode |
| **Vite** | 7 | Build + dev server |
| **TanStack Router** | 1.168+ | Routing file-based |
| **Tailwind CSS** | v4 | `@theme inline` + `oklch` |
| **Cloudflare Workers** | — | API + assets unifiés |
| **Cloudflare D1** | — | `equipe-buteau-leads` |
| **Bun** | Latest | Runtime + package manager |

Backend pattern : worker unique `src/worker.ts` qui sert assets dist/ + API /api/*.

---

## 3. Commandes

```bash
bun install
bun run dev              # localhost:5173+
bun run build            # DOIT passer 0 erreur avant push
bunx wrangler dev        # API local port 8787 (en parallèle de bun run dev)
bunx wrangler deploy     # deploy MANUEL Cloudflare (jamais auto)
```

Workflow standard : `bun run build` → `git push` (backup) → `bunx wrangler deploy` après validation user.

---

## 4. Structure cible

```
src/
├── components/landing/    # sections par page (Hero, Valeurs, Services, Equipe, Institutions, Outils, etc.)
│   ├── Glossary.tsx, ExitIntentPopup.tsx, CookieBanner.tsx, TrackingPixels.tsx
│   ├── KineticHeadline, FootnoteScope/List, AmfDisclaimer, SkipToContent
│   ├── LanguageToggle, StickyCtaMobile
│   └── calculators/
│       └── HypothequeCalculator.tsx  (formule canadienne semi-annual)
├── hooks/                 # useCountUp, useMagnetic, useTilt, useCookieConsent, useFocusTrap
├── lib/                   # config, translations, LanguageContext, GlossaryContext, parseLocaleFloat
├── routes/                # __root, index (Accueil), equipe, institutions, outils, lexique, mentions-legales, confidentialite
└── worker.ts              # API Cloudflare (D1 + GHL pipeline V6)
```

---

## 5. État du projet (snapshot 2026-05-08 — Phase 0)

### Phases planifiées (10 phases, ~15h focus total)

| # | Phase | Status |
|---|---|---|
| 0 | Setup contexte (CLAUDE.md + memory + folder) | EN COURS |
| 1 | Bootstrap V6 (configs + scaffold + bun install) | TODO |
| 2 | Design system (tokens oklch + fonts + utilities) | TODO |
| 3 | Page Accueil (Hero + Valeurs + Services + Équipe teaser + Guides + Outils + CTA) | TODO |
| 4 | Page Équipe (Hero + 3 cartes + Notre Méthode + CTA) | TODO |
| 5 | Page Institutions (Hero + 9 prêteurs + assurance + CTA) | TODO |
| 6 | Page Outils (Hero + Calculateur + Guides + TikTok + Blog + Docs + CTA) | TODO |
| 7 | Backend leads (worker /api/lead 4 couches + D1 + GHL) + Tracking pixels | TODO |
| 8 | Compliance AMF + Loi 25 + Glossaire 14 termes hypothécaires | TODO |
| 9 | Audits + bun build + wrangler deploy MANUEL | TODO |

### Placeholders Phase 8-9 (à fournir par client)

- `amf.certificateNumberAndrew` — n° certificat AMF Andrew Buteau
- `amf.certificateNumberAbygaele` — n° certificat AMF Abygaèle (si déjà certifiée)
- `amf.certificateNumberAlexis` — Alexis « en formation » → mention adaptée
- `legal.neq` — NEQ Équipe Buteau (ou Planiprêt si opère sous le cabinet)
- `legal.streetAddress` — 2300 boul. Saint-Martin Est, suite 200, Laval, QC H7E 5P3 (CONFIRMÉ)
- `legal.cabinet` — « Planiprêt Cabinet en Courtage Hypothécaire » (CONFIRMÉ)
- `legal.dpoEmail` — DPO email Loi 25
- `calendlyUrl` — Phase 9 (tu fournis)
- `ghl.locationId`, `ghl.trackingId` — Phase 9 (tu fournis)
- `tracking.{ga4, metaPixel, clarity, googleAds}` — Phase 9 (tu fournis)

---

## 6. Données client centralisées

Toutes les data Buteau dans `src/lib/config.ts`. JAMAIS hardcoder dans les composants.

Champs confirmés (pré-remplis) :
- `name` : « Équipe Buteau »
- `tagline` : « L'hypothèque autrement »
- `cabinet` : « Planiprêt Cabinet en Courtage Hypothécaire »
- `phone.raw` : `+14384944567`
- `phone.display` : `438-494-4567`
- `email` : `gestion@equipebuteau.com`
- `address` : 2300 boul. Saint-Martin Est, suite 200, Laval, QC H7E 5P3
- Équipe : Andrew Buteau (lead courtier), Abygaèle, Alexis (en formation)

---

## 7. Conventions design (LUXURY MINIMAL CORPORATE)

**Palette confirmée HTML mockups :**
- Navy `#10223d` → `oklch(0.252 0.067 256)` — fond foncé dominant
- Taupe `#b8af9f` → `oklch(0.722 0.018 84)` — accent, dividers, signatures lines
- Off-white `#f9f9f9` → `oklch(0.978 0 0)` — sections claires
- Bronze caramel `#C69C6D` → `oklch(0.704 0.077 56)` — accent boutons, hover

**Fonts (Google Fonts) :**
- `Montserrat` 600/700/800 — titres uppercase, letter-spacing 0.12em
- `Open Sans` 300/400/600 — corps de texte
- `Cormorant Garamond` italic — accents éditoriaux luxury (optionnel pour différenciation)

**Patterns visuels distinctifs :**
- Signature lines taupe (3-4rem horizontal, 1px) avant/après sections
- Gradient overlays sur images de fond (navy → transparent)
- Hover translateY(-2px) + box-shadow étendue
- Border-left colorés sur cartes (3px taupe ou bronze)
- Lettrages uppercase letter-spacing 0.12em sur eyebrows
- Numbers as design (montants paiement mensuel calculator en serif large)

---

## 8. Règles absolues

### R1 — Pas de copier-coller depuis autres clients (composants)
TOOLKIT (hooks, helpers, pipeline V6, configs, features Lexique/CookieBanner/etc.) → COPIÉ verbatim depuis `eg-services-financiers` ou autres projets V6.
SITE (composants pages : Hero/Concept/Strategies/Equipe/etc., translations.ts, theme tokens) → CODÉ FRESH 100%.

### R2 — i18n complet (FR/EN)
Tout texte visible passe par `translations.ts`. Toggle FR/EN doit changer 100% du contenu. FR par défaut au load (Charte loi 96 Quebec).

### R3 — TypeScript strict
Pas d'`any`. Build = 0 erreurs / 0 warnings AVANT push.

### R4 — Bun, pas npm/yarn

### R5 — Wrangler deploy MANUEL
`git push` ≠ deploy. Deploy = `bunx wrangler deploy` après validation user.

### R6 — Compliance AMF obligatoire avant Meta Ads
Buteau = courtage hypothécaire = supervisé AMF. Mentions légales avec numéros de certificat OBLIGATOIRES avant lancement campagne.
Pas de promesses de rendement chiffrées (« +X% », « gagnerez Y$ », « garantie ») — interdit AMF.

### R7 — Defense en profondeur leads (4 couches)
1. Honeypot field caché (`display:none` + `tabindex="-1"` + `aria-hidden="true"` + autocomplete random)
2. Timing detection `elapsed_ms < 3000ms` (client + worker)
3. Rate limit D1 30s par IP
4. Server-side validation (email regex + maxLen + consent + sanitization)

---

## 9. Git workflow

- Branch principale : `main`
- Commits français avec scope conventionnel : `feat(landing):`, `fix(calc):`, `chore:` etc.
- Co-authored-by Claude Opus 4.7 (1M context) sur chaque commit
- Push fréquent (backup, pas deploy auto)

---

## 10. Skills à invoquer

**Process / orchestration :**
- `superpowers:brainstorming` — avant chaque décision design majeure
- `superpowers:writing-plans` — plans phase
- `superpowers:test-driven-development` — calculator + parseLocaleFloat
- `superpowers:verification-before-completion` — avant tout claim « done »
- `superpowers:subagent-driven-development` — Phase 3-6 pages parallèles
- `gsd-code-review`, `gsd-ui-review`, `gsd-verify-work` — Phase 9 audits

**Design :**
- `frontend-design` — composition distinctive
- `intralys-edito-magazine` — grammaire luxury éditoriale (réf, pas copie)
- `intralys-sections-edito-templates` — inspiration concepts sections (PAS verbatim)

**Compliance non-négociable :**
- `intralys-amf-disclaimer` — disclaimer + guards code-level
- `intralys-consent-loi25` — checkbox consentement + audit trail
- `intralys-compliance` — audit Quebec final
- `intralys-footnote-scope` — footnotes éditoriales légales

**Toolkit V6 :**
- `intralys-core`, `intralys-blueprint` — méthodologie + référence stack
- `intralys-i18n-bilingual` — BilingualLax + ta<T>()
- `intralys-skip-content-a11y` — WCAG triple
- `intralys-locale-parsefloat` — helper FR (NNBSP + virgule + $)
- `intralys-form-honeypot` — honeypot + timing
- `intralys-v6-pipeline` — D1 + worker GHL
- `intralys-tracking` — Meta Pixel + CAPI + Consent v2

**Métier hypothécaire QC :**
- `intralys-outils-immobiliers-qc` — calculator semi-annual canadien + glossaire ready
- `intralys-glossary` — modal + AutoGlossary + Schema.org DefinedTermSet

---

## 11. Référence visuelle

**4 HTML mockups source :** `C:\Users\rochdi\.gemini\antigravity\scratch\buteau\`
- `Accueil.html` — Hero + Valeurs (3 piliers) + Services + Équipe + Guides + Outils + CTA
- `equipe.html` — Hero + 3 cartes équipe + Notre Méthode + CTA
- `institutions.html` — Hero + Info assurances + 9 institutions financières + CTA
- `outils.html` — Hero + Calculateur + 3 Guides + TikTok + Blog + 2 Docs + CTA

**Méthode anti-oubli :** avant de coder chaque section, RELIRE le HTML correspondant en entier (chunk par chunk si gros) pour capter chaque détail (copy, hiérarchie, microcopy, hover, transitions).

**9 institutions financières (page institutions.html) :**
Banque Nationale, MCAP, First National, CIBC, CMLS, TD, Scotia, Manuvie, Desjardins.
