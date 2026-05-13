<!-- refreshed: 2026-05-13 -->
# Équipe Buteau — Codebase Overview

**Analysis Date:** 2026-05-13
**Client:** Andrew Buteau, courtier hypothécaire — Cabinet d'attache Planiprêt
**Live:** https://equipe-buteau.intralysqc.workers.dev
**Repo:** github.com/youcefinho/buteau

---

## 1. Stack & Dependencies

### Core runtime
- **React 19.2** + **TypeScript 5.8 strict** — UI + 0-error type gate
- **Vite 7.3** — build + dev server + `vite-tsconfig-paths` + image optimizer
- **Bun** — package manager + dev runtime (lockfile `bun.lock`)
- **TanStack Router 1.168** file-based, `autoCodeSplitting: true`, native View Transitions API
- **Cloudflare Workers** + **D1** (`equipe-buteau-leads` provisioned 2026-05-11, ID `65088730-b488-463f-b1c6-5ea8eadab3b0`) + **R2** (not yet wired)

### Styling & UX
- **Tailwind v4.2** via `@tailwindcss/vite` plugin — `@theme inline` + `oklch()` tokens
- **`tw-animate-css`** — extra keyframes
- **Radix UI Accordion 1.2** — FAQ a11y primitive
- **Motion 12.38** (Framer Motion fork) — page/component transitions
- **Lucide React 0.575** — iconography
- **Sonner 2.0** — toasts (not heavily used)

### Fonts (self-hosted via Fontsource — Perf B.2)
- `@fontsource-variable/montserrat` 5.2 — display ExtraBold
- `@fontsource-variable/open-sans` 5.2 — body
- `@fontsource/cormorant-garamond` 5.2 — editorial italic
- `@fontsource-variable/fraunces` 5.2 — variable signature (axes `opsz`/`wght`/`SOFT`/`WONK`), used ONLY on 3 signature spots
- **CLS fix 2026-05-13** : `@font-face` declarations `"X fallback"` with `size-adjust` + `ascent-override` + `descent-override` matching each web font's metrics (in `src/index.css:62-96`). Brought CLS from 0.261 → 0.002.

### Build / image pipeline
- `vite-plugin-image-optimizer` (sharp under the hood) — JPG/PNG/WebP q80 at build
- `scripts/prep-hero.cjs` + `@resvg/resvg-js` + `svgo` — pre-build asset prep (hero `.avif`/`.webp`/`.jpg` triplet in `public/`)
- `esbuild.pure: ["console.log","console.debug","console.info","console.trace"]` — silent prod console

### Validation
- **Zod 4.4** — schema validation (worker-side)
- **`class-variance-authority`** + `tailwind-merge` + `clsx` — variant utilities

### Vite config (`vite.config.ts`)
- `manualChunks` : `router`, `motion`, `icons`, `radix` — splits vendor bundles
- Proxy `/api/*` → `localhost:8787` (wrangler dev parallel)

---

## 2. Architecture

### Cloudflare Worker (`src/worker.ts`)
Single-file ~770 lines. Pipeline V6 Intralys with **5 défense layers** (vs 4 baseline) :
- **Layer 0** — CSRF Origin pinning (`originAllowed()` — reject if `Origin` header host ≠ request host, 403)
- **Layer 1** — Honeypot (`contact_check_url` field must be empty, else silent 200)
- **Layer 2** — Timing detection (`form_started_at` payload < 1500ms = bot → silent 200)
- **Layer 3** — D1 rate limit `30s per IP` (SHA-256 hash of IP + salt, table `rate_limits`)
- **Layer 4** — Server-side validation (email regex, maxLen `full_name:200 / email:320 / phone:50 / message:2000`, sanitize control chars)

**D1 schema** (`src/db/schema.sql`) :
- `leads` : `id`, `created_at`, `email`, `full_name`, `phone`, `message`, `source`, `consent_at`, `ip_hash` (SHA-256, Loi 25 minimisation), `user_agent`, `ghl_pushed_at`, `ghl_status`
- `rate_limits` : `ip_hash PRIMARY KEY`, `last_attempt_at`
- Indexes on `email`, `created_at`, `last_attempt_at`

**Worker also handles SSR meta via HTMLRewriter** (`injectRouteMeta()`) — `ROUTE_META_SSR` per-path map with FR/EN titles/descriptions, `schemaBuilder()` for `DefinedTermSet` (lexique, 20 terms full SSR), `ItemList` (carnet 6 items), `BreadcrumbList` injected per non-home/non-noindex route, hreflang trio (`fr-CA`/`en-CA`/`x-default`), `noscript` fallback body for non-JS bots.
**`Vary: Accept-Language`** appended bilingual.

### Routes (file-based TanStack Router — `src/routes/`)
| Route | File | Description |
|---|---|---|
| `/` | `routes/index.tsx` | Hero + Partners + ValueTicker + TeamTeaser + Services + CalculatorPreview + GuidesShelf + CapsulesPreview + ToolsTeaser + Mission + AdPage + BrokerLetter + PreQualQuiz + TerritoryMap + Reviews + FAQ + ContactSection (16 sections) |
| `/equipe` | `routes/equipe.tsx` | 4 membres team grid + MediaShowcase YouTube + Notre Méthode |
| `/institutions` | `routes/institutions.tsx` | LendersGrid 9 prêteurs + InstitutionMissing |
| `/outils` | `routes/outils.tsx` | HypothequeCalculator + AmortizationSparkline + WhatIfScenarios + GuidesGrid + DocumentsGrid |
| `/capsules` | `routes/capsules.tsx` | 34 capsules / 7 catégories + filtres live chips |
| `/journal` | `routes/journal.tsx` | 8 longform articles + reading progress bar + accordion body |
| `/courrier` | `routes/courrier.tsx` | 9 « Letters to the Editor » format magazine |
| `/lexique` | `routes/lexique.tsx` | 20 termes hypothécaires + DefinedTermSet schema SSR |
| `/carnet` | `routes/carnet.tsx` | Programmes/notaires/inspecteurs (page + modal dual pattern) |
| `/colophon` | `routes/colophon.tsx` | Typo/palette/principes (page + modal dual pattern) |
| `/merci` | `routes/merci.tsx` | Post-form éditoriale tier-aware (`noindex`) |
| `/mentions-legales` + `/confidentialite` | — | AMF + Loi 25 |
| 404 | `__root.tsx notFoundComponent` | `NotFoundEditorial` |

### Component tree (50+ landing + 19 layout + atmosphere + ui + typography)
```
src/
├── routes/                              # 14 routes file-based
├── components/
│   ├── atmosphere/
│   │   ├── RisingBronzeEmbers.tsx       # 3-tone streak system (dark/light/bronze)
│   │   └── ScrollSideBronzeLine.tsx     # scroll-aware vertical bronze line (motion/react port Serujan pattern)
│   ├── landing/                         # 40+ section components
│   │   ├── Hero.tsx                     # letter-by-letter BUTEAU + magazine cover (N°01)
│   │   ├── BrokerLetter.tsx             # lined-paper + AnimatedSignature + Fraunces "Bonjour"
│   │   ├── AnimatedSignature.tsx        # SVG path-drawing, IntersectionObserver-gated
│   │   ├── CapsulesPreview.tsx          # 5/12 sticky + 7/12 list, mirror of GuidesShelf
│   │   ├── LendersGrid.tsx              # 9 institutions cards + Tiltable + halo-glow
│   │   ├── ExitIntent.tsx               # 15s desktop top-exit / 60s mobile inactivity / 90s auto, sessionStorage gate
│   │   ├── ContactForm.tsx              # 4 visible layers (honeypot + timing + consent + validation)
│   │   ├── TerritoryMap.tsx             # QC SVG + 5 markers + pulse Laval
│   │   ├── PreQualQuiz.tsx              # 3Q tier-based wizard + persistent localStorage
│   │   ├── CalculatorPreview.tsx        # mini calc with .border-beam panel
│   │   ├── GlossaryHovercard.tsx + AutoGlossary.tsx + GlossaryModal.tsx
│   │   ├── CarnetContent/CarnetModal + ColophonContent/ColophonModal  # dual modal+page pattern
│   │   └── calculators/                 # HypothequeCalculator + AmortizationSparkline + WhatIfScenarios
│   ├── layout/                          # 19 layout primitives
│   │   ├── Navbar.tsx                   # floating pill on scroll
│   │   ├── Footer.tsx                   # back-cover XL monogramme + colophon
│   │   ├── SplashIntro.tsx              # 1.8s 1ère visite, sessionStorage gate
│   │   ├── CustomCursor.tsx             # 5-mode (default/link/text/image/drag)
│   │   ├── PageTransition.tsx           # cinematic fade-up
│   │   ├── MobileStickyCta.tsx          # < lg, padding-bottom main 70px + safe-area-inset
│   │   ├── ScrollProgress.tsx           # 2px bronze line top
│   │   ├── ModalShell.tsx               # reusable modal (Carnet/Colophon/Glossary)
│   │   ├── Tiltable.tsx                 # 3D tilt cards
│   │   └── CookieBanner.tsx             # Loi 25 consent
│   ├── typography/                      # Footnote / FootnoteScope / FootnoteList
│   └── ui/                              # CVA primitives (Button, etc.)
├── hooks/
│   ├── useAtmospherePresence.ts         # IntersectionObserver + velocity-based opacity + pause off-screen
│   ├── useQuizTier.ts                   # localStorage + custom event 'buteau:tier-changed'
│   ├── useMagnetic.ts                   # Hero CTA magnetic effect
│   ├── useTilt.ts + useScrollReveal.ts + useCountUp.ts + useCookieConsent.ts
├── lib/
│   ├── config.ts                        # SINGLE source of truth client data
│   ├── translations.ts                  # FR + EN bilingual ta<T>() helper
│   ├── glossary.ts                      # 20 termes hypothécaires
│   ├── parseLocaleFloat.ts              # NNBSP + virgule + $ tolerant parser
│   ├── LanguageContext.tsx + GlossaryContext.tsx + ColophonContext.tsx + CarnetContext.tsx
│   └── utils.ts                         # cn() helper
├── db/schema.sql                        # D1 leads + rate_limits
├── worker.ts                            # Single-file Cloudflare Worker ~770 lines
├── main.tsx                             # Entry
├── routeTree.gen.ts                     # TanStack auto-gen
└── index.css                            # Tailwind + tokens + ~50 custom keyframes/utilities
```

### State management
- **No global store** (no Redux, no Zustand). React contexts for cross-cutting concerns :
  - `LanguageContext` — FR/EN toggle (default FR, Charte Loi 96 Quebec)
  - `GlossaryContext` — open/close glossary modal globally
  - `ColophonContext` + `CarnetContext` — open dual modal pages
- **Custom events** for cross-component coordination : `buteau:tier-changed` (PreQualQuiz → Hero/Calc/CTAs)
- **sessionStorage gates** : `buteau:exitintent-shown`, splash intro shown

---

## 3. Conventions

### Palette (oklch tokens in `src/index.css:9-54`)
- `--color-navy` `oklch(0.252 0.067 256)` `#10223d` — dominant dark surface
- `--color-navy-deep` `oklch(0.205 0.060 256)` — contrast
- `--color-navy-soft` `oklch(0.305 0.065 256)` — cards
- `--color-taupe` `oklch(0.722 0.018 84)` `#b8af9f` — signature accent, dividers
- `--color-taupe-light/-dark` — secondary text + light dividers
- `--color-bronze` `oklch(0.704 0.077 56)` `#C69C6D` — accent CTA, hover, pull-quotes
- `--color-bronze-deep / -soft` — hover state + soft tint
- `--color-cream` `oklch(0.978 0 0)` `#f9f9f9` — light section background
- `--color-rating-amber` `#FFC107` — Google reviews stars ONLY

### Typography rules
- `--font-display` : Montserrat ExtraBold — uppercase titles, `letter-spacing: 0.12em`
- `--font-sans` : Open Sans — body
- `--font-editorial` : Cormorant Garamond italic — pull-quotes, marginalia, numerals
- `--font-signature` : Fraunces variable — **EXCLUSIVELY 3 spots** : Hero tagline / Mission pull quote / BrokerLetter "Bonjour" — axes `opsz:144, wght:400, SOFT:50, WONK:1` (`.font-signature` utility class)
- `--tracking-eyebrow` `0.12em` / `--tracking-headline` `-0.02em`

### Signature visual grammar (all sections respect)
- **Roman numerals / 01-99 filigrane** in Cormorant italic on each card/section (Mission 01-04, Services I-IV, TeamGrid 01-03, LendersGrid 01-09, FAQ 01-07)
- **Signature lines bronze** `w-8 → w-14` extending on hover (between sections)
- **Eyebrow** framed by 2 thin taupe lines (Hero / PageHero / CtaBlock)
- **XL background filigrane glyph** per section (`m` for BrokerLetter, `▶` for Capsules, `V` for Lenders, `?` for FAQ, etc.) — `text-[24-28rem]` opacity 8-10%
- **Fleuron `❦` bronze** between hero and body on legal pages
- **Stagger reveal** : `data-stagger="reveal"` on container, 7 children fade 0.05s → 0.80s

### Atmospheric layers (Z-order strict)
1. `surface-navy` / `surface-cream` background
2. `grain-overlay::after` (svg fractalNoise, `mix-blend-mode: overlay`, opacity 0.045)
3. `gradient-navy-overlay` / radial vignette
4. `RisingBronzeEmbers` wrapper `z-[1]` (above bg-image z-auto, sub content)
5. `ambient-particles` (Hero only)
6. **Content `relative z-10`** (MUST set on content sections — bug fix 2026-05-10 PM)

**Embers** : 3-tone (`dark` cream streak / `light` navy streak with bronze halo / `bronze` for cream sections), CSS-only `width: 1px` + linear-gradient + box-shadow halo, animated `emberRiseStreak linear infinite` 12-20s, paused off-screen via `embers-paused` class (GPU saving), respects `prefers-reduced-motion` + `prefers-reduced-data`.

### Buttons signature (Buteau-specific)
- `.btn-bronze` : living gradient shimmer 10s + inset 3D (bronze-soft highlight + navy-deep shadow) + `::before` slide-in fill bronze-deep + letter-spacing tightening hover + `::after` ember rising particle (cohérence avec atmospheric system) — `isolation: isolate` REQUIRED to prevent z-index bug burying text
- `.btn-ghost-navy` : transparent → navy fill on hover

### Naming
- **Files** : PascalCase components, camelCase hooks (`useXxx`), kebab-case routes
- **i18n** : ALL visible text via `t()` or `ta<T>()` helper from `src/lib/translations.ts` — FR + EN parity gate
- **i18n locales** : `fr-CA` / `en-CA`
- **Translations structure** : nested object `home.hero.letterWords` accessed via `ta<string[]>(translations[lang], "home.hero.letterWords")`

### View Transitions API (`src/index.css:1104-1142`)
- `defaultViewTransition` on TanStack Router + CSS `::view-transition-old/new(root)` keyframes `vtFadeUp` / `vtFadeOut` (240/400ms, cubic-bezier easing)
- `prefers-reduced-motion` → 1ms duration (effectively off)

### Print stylesheet (`src/index.css:1160-1230`)
Carnet/Colophon/Glossary modals print as full-page magazine documents with external URLs appended after links.

---

## 4. Integrations

### GHL V6 Pipeline (External Tracking) — `pushToGhl()` in `src/worker.ts:569-639`
- Endpoint : `https://backend.leadconnectorhq.com/external-tracking/events`
- Body type : `external_form_submission`
- **Buteau-specific schema** : `formData` + `formLabels` (not `data`) — split `full_name` → `first_name` + `last_name` (`nameParts = trim().split(/\s+/)`)
- **`sessionId: crypto.randomUUID()`** REQUIRED — bug 2026-05-12 : missing sessionId returned 400 from GHL
- `trackingId` hardcoded `tk_a1730dcac9744515864c001895c485ea` (worker has no clientConfig bundle access)
- `locationId` hardcoded `aTgKP6OstI7SH8PRcKxB`
- `Timezone: "America/Toronto"` injected
- Non-blocking via `ctx.waitUntil()` — UI never waits on GHL
- 5s timeout via `AbortSignal.timeout(5000)` — prevents isolate hang
- **`form_started_at` is `number` timestamp ms** (Date.now() captured at form mount via `useRef`)

### CSP (Content Security Policy — `withSecurityHeaders()` in `src/worker.ts:715-770`)
- `script-src 'self' 'unsafe-inline' googletagmanager + google-analytics + facebook.net + clarity.ms`
- `frame-src 'self' api.leadconnectorhq.com youtube-nocookie.com youtube.com` — fix BLOCKER 2026-05-09 (YouTube MediaShowcase was blocked)
- `frame-ancestors 'none'` + `X-Frame-Options: DENY` (legacy fallback)
- `connect-src` : self + leadconnectorhq + GA + clarity + facebook
- `img-src` : self + data + 9 specific CDN hosts (imgur, wixstatic, wikipedia, b2b2c.ca, logos-world, linktr.ee, googleapis, filesafe, ytimg)
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (eligible hstspreload.org)
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- `Cross-Origin-Opener-Policy: same-origin`
- Cache : `/assets/*` → `public, max-age=31536000, immutable` (Vite hash), HTML excluded (SSR meta freshness)

### Calendly (Phase 9 pending — `config.calendlyUrl: ""`)
- Lazy loaded via `requestIdleCallback` + IntersectionObserver (Perf B.4)
- **Known concern** : Calendly 3rd-party cookies set ceiling at Lighthouse Best-Practices 92

### Planiprêt cabinet d'attache
- Hardcoded in `config.cabinet` + `config.legal.cabinet`
- Adresse confirmée : `2300 boul. Saint-Martin Est, suite 200, Laval, QC H7E 5P3`
- AMF disclaimer in `config.amf.disclaimer.{fr,en}` — 2-paragraph version covering operating under Planiprêt licence

### Loi 25 (Quebec privacy)
- `CookieBanner` component (`src/components/layout/CookieBanner.tsx`) — explicit opt-in
- `useCookieConsent` hook + `consent_at` timestamp captured in D1 INSERT
- `ip_hash` (SHA-256 + salt) stored instead of clear IP — minimisation principle
- Dedicated `/confidentialite` route (9 sections)
- Loi 25 Art. 23 : checkbox EXPLICITE consent before form submit

---

## 5. Concerns / Tech Debt

### Performance (Lighthouse mobile snapshot 2026-05-13)
- **P 59-73** / A 94 / BP 92 / SEO 100
- **LCP 4.4s** — Architectural ceiling : React 19 bundle + hero image AVIF + bronze embers initial paint
- **CLS 0.002 ✅** — Fixed this session (was 0.261) via font fallback metrics
- **TBT 260-360ms** — JS execution heavy on first paint
- **BP 92 ceiling** — Calendly 3rd-party cookies (`inspector-issues` + `errors-in-console`)

### Improvement paths
- **LCP** : Could try preload of hero image priority high, defer ember mount to post-LCP, evaluate splitting motion bundle further
- **TBT** : Consider Suspense-defer PreQualQuiz / TerritoryMap / Tiltable cards initial JS
- **Calendly** : Skipping Calendly entirely or moving to dedicated route `/rendez-vous` would lift BP to 100

### Phase 9 placeholders (in `src/lib/config.ts`)
- `amf.certificateNumberAndrew` + `amf.certificateNumberAbygaele` empty
- `legal.neq` empty (à fournir client)
- `legal.dpoEmail` empty
- `calendlyUrl: ""`
- `ghl.locationId` + `ghl.trackingId` empty (but hardcoded in worker — config kept for UI references)
- `tracking.{ga4, metaPixel, clarity, googleAds}` all empty — pixels are no-op when empty
- `assets.logo` + `assets.ogImage` empty

### Known REVIEW.md findings (35 total ; 7 BLOCKER + 9 HIGH fixed 2026-05-09)
- `CustomCursor` re-attaches 5 doc listeners on every mouse move (useEffect deps `[visible]` bug — fixed)
- `useQuizTier` double-event-loop : `dispatch CustomEvent` triggered own listener → redundant re-render (fixed)
- `useCookieConsent` `useEffect([state])` triggers `updateConsentMode` per render (fixed)
- 12 MEDIUM + 7 LOW remain non-blocking (see `REVIEW.md`)

### Architectural constraints
- **`run_worker_first: ["/*"]`** in `wrangler.jsonc` — ALL requests go through worker before assets (else SSR meta breaks)
- **`assets.binding: "ASSETS"`** REQUIRED with `run_worker_first` — else `env.ASSETS` is undefined and worker crashes with 1101
- Worker has NO access to React `config.ts` bundle — `trackingId` / `locationId` must be hardcoded in `pushToGhl()` (or use wrangler secrets — not yet adopted)
- TanStack Router file-based — DO NOT manually edit `src/routeTree.gen.ts` (auto-regenerated)
- D1 binding `DB` (not `equipe_buteau_leads`) — must match `env.DB` in worker.ts
- Worker REFUSES with 503 if D1 absent (audit BL-01 : silent UI success without persistence = total loss in prod)

### Recent additions (2026-05-10 → 13)
- **2026-05-13** : Font fallback size-adjust metrics (CLS 0.261 → 0.002), hero preload `<link rel="preload" as="image">` AVIF, Partner logos width/height attrs, `overflow-x: hidden` safety net on html+body, mobile touch targets bumped WCAG AAA 48px, "Survolez" hint mobile hidden
- **2026-05-12** : V6 pipeline repair — D1 provisioned, worker endpoint `/external-tracking/events` corrected, body shape `formData/formLabels` (not `data`), sessionId added (was 400)
- **2026-05-11** : Atmospheric `RisingBronzeEmbers` 3-tone system + `ScrollSideBronzeLine` motion/react port
- **2026-05-10** : Self-host hero `AVIF+WebP+JPG` triplet (744KB PNG imgur → 48KB AVIF), navy embers visibility bumped (alpha + double box-shadow halo bronze), self-hosted fonts via Fontsource, Calendly lazy + analytics defer requestIdleCallback, drop console esbuild, `content-visibility: auto` cv-defer on below-fold sections, ExitIntent component added, page transitions View Transitions API native

---

## 6. What's UNIQUE to Buteau (vs other Intralys sites)

1. **Letter-by-letter BUTEAU wordmark reveal** (Hero) — `home.hero.letterWords` translations array, hover word reveal per letter (B→Buteau / U→Unique / T→Transparence / E→Expert / A→Accessible / U→Utile), `buteauLetterIn` keyframe with `filter: blur(10px) → 0`
2. **Magazine cover treatment** — N°01 / MMXXVI / Laval—Québec in Cormorant italic top corners + curtain reveal `buteauCurtain` keyframe (navy-deep velum lifts 1.1s cubic-bezier)
3. **Fraunces variable signature** restricted to EXACTLY 3 spots with `opsz:144, WONK:1, SOFT:50` — luxury distinctive vs Cormorant traditional
4. **AnimatedSignature SVG path-drawing** — Andrew Buteau handwritten-style calligraphy stroke-dasharray reveal on IntersectionObserver enter
5. **BrokerLetter lined-paper** — repeating-linear-gradient horizontal lines 32px pitch with mask gradient top/bottom fade, Fraunces "Bonjour" + 3 paragraphs Cormorant italic 1.7-1.8 leading + AnimatedSignature col 4/12
6. **3-tone embers** (`cream` for navy sections / `navy` for cream sections / `bronze`) — bicolor adaptive vs Mathis crimson-only / Serujan gold-only
7. **5-mode CustomCursor** with `drag` mode dedicated to Calculator sliders (no other Intralys site has drag mode)
8. **`.btn-bronze` ember-rising particle** `::after` — micro-coherence with macro embers system (visual ADN)
9. **Quiz tier-based persistent + CustomEvent broadcast** — `useQuizTier` writes localStorage + dispatches `buteau:tier-changed` → Hero CTA + Calculator CTA + ContactForm source all personalize based on tier
10. **JSON body schema with `full_name` (unique vs other sites that use `firstName`+`lastName` separately)** + `form_started_at` as `number` ms timestamp
11. **Dual modal+page pattern** for Carnet/Colophon (modal UX via Footer button + SEO-indexable route via dedicated path)
12. **View Transitions API** native + `defaultViewTransition` router config + `vtFadeUp`/`vtFadeOut` keyframes
13. **5-layer worker defense** (vs 4 baseline) — Layer 0 CSRF Origin pinning ADDED

---

*Codebase analysis: 2026-05-13*
