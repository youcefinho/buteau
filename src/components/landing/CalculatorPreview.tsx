import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Layers } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { parseLocaleFloat, formatLocaleCurrency } from "@/lib/parseLocaleFloat";
import { useCountUp } from "@/hooks/useCountUp";
import { useGlossary } from "@/lib/GlossaryContext";

/**
 * CalculatorPreview — version compacte du calculateur sur l'Accueil.
 *
 * Pourquoi : permet à l'utilisateur de jouer avec les chiffres directement
 * sur le home (vs cliquer pour aller sur /outils). CTA clair pour passer à
 * la version complète (sparkline + What If + Partage) sur /outils.
 *
 * Utilise les mêmes sliders et la même formule canadienne semi-annuelle.
 */

const DEFAULTS = { amount: 400000, rate: 5.5, years: 25 };
const RANGES = {
  amount: { min: 100000, max: 1500000, step: 5000 },
  rate: { min: 1, max: 9, step: 0.05 },
  years: { min: 5, max: 30, step: 1 },
};

export function CalculatorPreview() {
  const { t, lang } = useLanguage();
  const { open: openGlossary } = useGlossary();
  const [amount, setAmount] = useState<string>(String(DEFAULTS.amount));
  const [rate, setRate] = useState<string>(String(DEFAULTS.rate));
  const [years, setYears] = useState<string>(String(DEFAULTS.years));

  const monthlyPayment = useMemo<number | null>(() => {
    const principal = parseLocaleFloat(amount) ?? DEFAULTS.amount;
    const annualRate = parseLocaleFloat(rate) ?? DEFAULTS.rate;
    const n = (parseLocaleFloat(years) ?? DEFAULTS.years) * 12;
    if (principal <= 0 || n <= 0) return null;
    if (annualRate === 0) return principal / n;
    const semiAnnual = annualRate / 2 / 100;
    const monthly = Math.pow(1 + semiAnnual, 2 / 12) - 1;
    const p = (principal * (monthly * Math.pow(1 + monthly, n))) / (Math.pow(1 + monthly, n) - 1);
    return Number.isFinite(p) ? p : null;
  }, [amount, rate, years]);

  // Intérêts totaux + coût total — calculs déterministes (zéro invention).
  const { totalInterest, totalCost } = useMemo<{ totalInterest: number | null; totalCost: number | null }>(() => {
    if (monthlyPayment === null) return { totalInterest: null, totalCost: null };
    const principal = parseLocaleFloat(amount) ?? DEFAULTS.amount;
    const n = (parseLocaleFloat(years) ?? DEFAULTS.years) * 12;
    const total = monthlyPayment * n;
    return { totalInterest: total - principal, totalCost: total };
  }, [monthlyPayment, amount, years]);

  // Animation smooth du résultat — countUp depuis ancienne valeur (audit P0 council Motion).
  // 420ms cubic-bezier easing déjà dans useCountUp (cubic ease-out).
  const previousPaymentRef = useRef<number>(0);
  const targetPayment = monthlyPayment ?? 0;
  const animatedPayment = useCountUp(targetPayment, {
    from: previousPaymentRef.current,
    duration: 420,
    start: monthlyPayment !== null,
    decimals: 0,
  });
  useEffect(() => {
    previousPaymentRef.current = targetPayment;
  }, [targetPayment]);

  return (
    <section id="calc-preview" className="relative py-24 md:py-32 surface-cream overflow-hidden scroll-mt-24">
      {/* Filigrane "$" Cormorant background */}
      <span
        aria-hidden="true"
        className="absolute -top-16 -right-12 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/8 text-[24rem] leading-none pointer-events-none select-none"
      >
        $
      </span>

      <Container size="lg" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Header column — 5/12 */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <p className="eyebrow text-[color:var(--color-taupe-dark)] inline-flex items-center gap-3 mb-5">
              <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
              {t("home.calcPreview.eyebrow")}
            </p>
            <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-3xl md:text-4xl uppercase tracking-[0.04em] leading-[1.1] mb-5">
              {t("home.calcPreview.title")}
            </h2>
            <div className="w-12 h-px bg-[color:var(--color-bronze)] mb-6" />
            <p className="text-base leading-[1.65] text-[color:var(--color-navy-deep)]/80 mb-8">
              {t("home.calcPreview.subtitle")}
            </p>

            <Link
              to="/outils"
              hash="calculateur"
              className="group inline-flex items-center gap-2 font-[var(--font-display)] text-sm font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-bronze-deep)] hover:text-[color:var(--color-bronze)] transition-colors"
            >
              <span className="relative">
                {t("home.calcPreview.ctaFull")}
                <span className="absolute left-0 -bottom-1 w-full h-px bg-[color:var(--color-bronze)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {/* Calculator column — 7/12 */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-5 gap-0 border border-[color:var(--color-taupe)]/50">
            {/* Inputs sliders — 3/5 */}
            <div className="md:col-span-3 bg-[color:var(--color-surface)] p-7 md:p-8 space-y-7">
              <CalcSliderMini
                id="prev-amount"
                label={t("home.calcPreview.amountLabel")}
                value={amount}
                onChange={setAmount}
                min={RANGES.amount.min}
                max={RANGES.amount.max}
                step={RANGES.amount.step}
                format={(v) => formatLocaleCurrency(Math.round(v), lang)}
              />
              <CalcSliderMini
                id="prev-rate"
                label={t("home.calcPreview.rateLabel")}
                value={rate}
                onChange={setRate}
                min={RANGES.rate.min}
                max={RANGES.rate.max}
                step={RANGES.rate.step}
                format={(v) => `${v.toFixed(2)} %`}
              />
              <CalcSliderMini
                id="prev-years"
                label={t("home.calcPreview.yearsLabel")}
                value={years}
                onChange={setYears}
                min={RANGES.years.min}
                max={RANGES.years.max}
                step={RANGES.years.step}
                format={(v) => `${Math.round(v)} ${lang === "fr" ? "ans" : "years"}`}
              />
            </div>

            {/* Result compute theatre — 2/5 */}
            <div className="md:col-span-2 surface-navy p-7 md:p-8 flex flex-col justify-between gap-6 relative overflow-hidden">
              <span
                aria-hidden="true"
                className="absolute -top-6 -right-4 font-[var(--font-editorial)] italic text-[color:var(--color-bronze)]/12 text-[10rem] leading-none pointer-events-none select-none"
              >
                $
              </span>
              <div className="relative">
                <p className="eyebrow text-[color:var(--color-taupe)] mb-3">
                  {t("home.calcPreview.resultLabel")}
                </p>
                <p
                  className="font-[var(--font-display)] font-extrabold text-[color:var(--color-cream)] text-3xl md:text-4xl tracking-[-0.02em] leading-[0.95] tabular-nums"
                  aria-live="polite"
                >
                  {monthlyPayment !== null
                    ? formatLocaleCurrency(Math.round(animatedPayment), lang)
                    : "—"}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="block w-5 h-px bg-[color:var(--color-bronze)]" aria-hidden="true" />
                  <p className="font-[var(--font-editorial)] italic text-[color:var(--color-cream)]/70 text-xs">
                    {lang === "fr" ? "par mois" : "per month"}
                  </p>
                </div>

                {/* Audit P0 council UX : 3 lignes contexte sous le résultat.
                    System 1 ne traite pas un nombre nu — donner référents (intérêts, coût total)
                    + ligne empathique pour dédramatiser. */}
                {monthlyPayment !== null && totalInterest !== null && totalCost !== null && (
                  <div className="mt-5 pt-4 border-t border-[color:var(--color-taupe)]/20 space-y-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-taupe)]">
                        {lang === "fr" ? "Intérêts sur la durée" : "Interest over term"}
                      </span>
                      <span className="font-[var(--font-display)] text-sm tabular-nums text-[color:var(--color-cream)]/85">
                        {formatLocaleCurrency(Math.round(totalInterest), lang)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-taupe)]">
                        {lang === "fr" ? "Coût total" : "Total cost"}
                      </span>
                      <span className="font-[var(--font-display)] text-sm tabular-nums text-[color:var(--color-cream)]/85">
                        {formatLocaleCurrency(Math.round(totalCost), lang)}
                      </span>
                    </div>
                    <p className="font-[var(--font-editorial)] italic text-[10px] text-[color:var(--color-cream)]/60 leading-snug pt-1">
                      {lang === "fr"
                        ? "Ce chiffre n'est pas votre verdict — c'est un point de départ pour la conversation."
                        : "This number isn't your verdict — it's a starting point for the conversation."}
                    </p>
                  </div>
                )}
              </div>

              <Link to="/outils" hash="calculateur" className="btn-bronze btn-shine w-full text-xs">
                {t("home.calcPreview.ctaTools")}
              </Link>
            </div>
          </div>
        </div>

        {/* Footer méthodologie + lexique — pédagogie hypothécaire */}
        <div className="mt-12 pt-8 border-t border-[color:var(--color-taupe)]/30 text-center max-w-2xl mx-auto">
          <p className="font-[var(--font-editorial)] italic text-sm md:text-base text-[color:var(--color-navy-deep)]/70 leading-relaxed mb-4">
            {lang === "fr"
              ? "Composé semi-annuel canadien — la formule a ses termes."
              : "Canadian semi-annual compounding — the formula has its terms."}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-sm">
            <button
              type="button"
              onClick={() => openGlossary()}
              className="text-glow-hover inline-flex items-center gap-2 font-[var(--font-editorial)] italic text-[color:var(--color-navy-deep)]/85 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[color:var(--color-bronze-deep)]" strokeWidth={1.5} aria-hidden />
              {lang === "fr" ? "Voir le lexique" : "View glossary"}
            </button>
            <span className="text-[color:var(--color-bronze)]/40 select-none hidden sm:inline" aria-hidden>·</span>
            <Link
              to="/colophon"
              className="text-glow-hover inline-flex items-center gap-2 font-[var(--font-editorial)] italic text-[color:var(--color-navy-deep)]/85"
            >
              <Layers className="w-3.5 h-3.5 text-[color:var(--color-bronze-deep)]" strokeWidth={1.5} aria-hidden />
              {lang === "fr" ? "Colophon" : "Colophon"}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

function CalcSliderMini({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}) {
  const numValue = parseLocaleFloat(value) ?? min;
  const clamped = Math.max(min, Math.min(max, numValue));
  const percent = ((clamped - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="eyebrow text-[color:var(--color-taupe-dark)]">
          {label}
        </label>
        {/* Fix MEDIUM : output sans htmlFor (l'attribut for sur output doit pointer vers les
            éléments source du calcul, pas l'input — sémantique imprécise). Output autonome OK. */}
        <output
          aria-live="polite"
          className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-base md:text-lg tabular-nums"
        >
          {format(clamped)}
        </output>
      </div>
      <div className="relative pt-1">
        <div
          className="absolute top-1/2 left-0 h-px bg-[color:var(--color-bronze)] pointer-events-none transition-[width] duration-150"
          style={{ width: `${percent}%`, transform: "translateY(-50%)" }}
          aria-hidden="true"
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={clamped}
          onChange={(e) => onChange(e.target.value)}
          className="calc-slider relative z-10"
          aria-label={label}
        />
      </div>
    </div>
  );
}
