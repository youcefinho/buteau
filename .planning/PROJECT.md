# Équipe Buteau — Site courtier hypothécaire Planiprêt

Bootstrap `.planning/` minimal cree 2026-05-13.

## Client
- **Nom** : Andrew Buteau
- **Profession** : Courtier hypothecaire
- **Cabinet** : Planipret Cabinet en Courtage Hypothecaire
- **Territoire** : Laval / Quebec
- **Inscription AMF** : (a confirmer)
- **Telephone** : (438) 494-4567
- **Email** : gestion@equipebuteau.com

## Stack technique
- **Framework** : React 19 + TypeScript strict + Vite 7
- **Router** : TanStack Router file-based + view transitions
- **Styling** : Tailwind v4 + palette navy + taupe + bronze (luxury minimal)
- **Hosting** : Cloudflare Workers + D1 + R2 (rate limits + lead audit)
- **Forms** : V6 pipeline GHL External Tracking (JSON body, full_name unique, form_started_at timestamp ms)
- **Patterns** : letter-by-letter reveal BUTEAU wordmark + atmospheric embers + signature lines bronze

## URLs
- **Live** : https://equipe-buteau.intralysqc.workers.dev
- **Repo** : github.com/youcefinho/buteau
- **GHL location ID** : `aTgKP6OstI7SH8PRcKxB`
- **GHL tracking ID** : `tk_a1730dcac9744515864c001895c485ea`

## Routes
- `/` — Home (Hero + BrokerLetter + CapsulesPreview + Concept + Partners + LendersGrid + Faq + CtaBlock)
- `/equipe` — Page equipe RE/MAX Vision + Mathis
- `/institutions` — 9+ institutions financieres partenaires
- `/outils` — Calculateurs hypothecaires
- `/capsules` — Capsules educatives video
- `/lexique` + `/colophon` + `/carnet` — pages secondaires

## Theme design
- **Identite** : luxury minimal corporate (Ralph Lauren / Cereal magazine)
- **Palette** : navy oklch + taupe + bronze (oklch tokens)
- **Typo** : Montserrat ExtraBold display + Open Sans + Cormorant Garamond italic + Fraunces variable signature
- **Font fallbacks** : size-adjust metrics matched (CLS prevention 2026-05-13)
- **Patterns** : RisingBronzeEmbers + signature lines + AnimatedSignature + magazine cover hero treatment

## Etat actuel (2026-05-13 post-session)
- **Lighthouse mobile** : P 59-73 / A 94 / BP 92 / SEO 100
- **Core Web Vitals** : LCP 4.4s / **CLS 0.002 ✓✓** (0.261→0.002 cette session) / TBT 260-360ms
- **A11y** : 94/100
- **Compliance** : Loi 25 banner ✓
- **SEO** : Schema FinancialService LocalBusiness + sitemap + view transitions API
- **Perf** : Font fallback size-adjust (CLS fix) + Hero preload AVIF + Partner logos width/height (no shift)

## Skills Intralys applicables
- `intralys-amf-disclaimer` — disclaimer hypothecaire AMF
- `intralys-v6-pipeline` — securite forms
- `intralys-glossary` — terms hypothecaires

## Issues connus pending user
1. 🟡 LCP 4.4s mobile (architectural — Bundle React + bronze embers)
2. 🟡 Inspector-issues + errors-in-console (Calendly cookies 3rd party)

## Sessions majeures (chronologie inverse)
- **2026-05-13** : Font fallback metrics CLS fix (0.261→0.002) + Hero preload + Partner logos dimensions + overflow-x safety net + touch targets WCAG AAA + "Survolez" hint mobile hidden
- **2026-05-12** : V6 pipeline reparation D1 provisionnee + endpoint correct
- **2026-05-11** : Atmospheric embers + signature lines
- **2026-05-10** : Self-host hero AVIF + Buteau navy embers
