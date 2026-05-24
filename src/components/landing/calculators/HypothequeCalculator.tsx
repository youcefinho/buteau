import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Share2, Check } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { HeartbeatCta } from "@/components/layout/HeartbeatCta";
import { SectionHeading } from "../SectionHeading";
import { parseLocaleFloat, formatLocaleCurrency } from "@/lib/parseLocaleFloat";
import { AmortizationSparkline } from "./AmortizationSparkline";
import { WhatIfScenarios } from "./WhatIfScenarios";

/**
 * Calculateur hypothécaire — formule canadienne (composé semi-annuel).
 *
 * Au Canada, les hypothèques sont composées 2 fois par an, pas 12.
 * Formule :
 *   i_sa = nominal_rate% / 2                  (taux semi-annuel)
 *   i_m  = (1 + i_sa/100)^(2/12) - 1          (taux mensuel équivalent)
 *   P    = principal * i_m / (1 - (1 + i_m)^-n)   où n = duree_ans * 12
 *
 * NE PAS utiliser monthly_rate = annual_rate / 12 (c'est la formule US).
 *
 * UX : sliders visuels (vs text inputs) — le user explore les paramètres en
 * draggant. Pattern luxury fintech (Wealthsimple, Wise) adapté à un courtage.
 */
const DEFAULTS = {
  amount: 400000,
  rate: 5.5,
  years: 25,
};

const RANGES = {
  amount: { min: 100000, max: 1500000, step: 5000 },
  rate: { min: 1, max: 9, step: 0.05 },
  years: { min: 5, max: 30, step: 1 },
};

export function HypothequeCalculator() {
  const { t, lang } = useLanguage();

  // Initialise depuis URL search params si présents (?amount=400000&rate=5.5&years=25)
  // Permet le partage de scénarios entre utilisateurs (synergie viralité).
  const initialFromUrl = useMemo(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const a = params.get("amount");
    const r = params.get("rate");
    const y = params.get("years");
    if (!a && !r && !y) return null;
    return {
      amount: a ?? String(DEFAULTS.amount),
      rate: r ?? String(DEFAULTS.rate),
      years: y ?? String(DEFAULTS.years),
    };
  }, []);

  const [amountInput, setAmountInput] = useState<string>(
    initialFromUrl?.amount ?? String(DEFAULTS.amount),
  );
  const [rateInput, setRateInput] = useState<string>(
    initialFromUrl?.rate ?? String(DEFAULTS.rate),
  );
  const [yearsInput, setYearsInput] = useState<string>(
    initialFromUrl?.years ?? String(DEFAULTS.years),
  );
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  // Reset le copied state après 2s
  useEffect(() => {
    if (!shareCopied) return;
    const t = window.setTimeout(() => setShareCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [shareCopied]);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("amount", amountInput);
    url.searchParams.set("rate", rateInput);
    url.searchParams.set("years", yearsInput);
    url.hash = "calculateur";
    try {
      await navigator.clipboard.writeText(url.toString());
      setShareCopied(true);
    } catch {
      // Fallback : selectionner le champ d'URL temporaire
      const tmp = document.createElement("input");
      tmp.value = url.toString();
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      document.body.removeChild(tmp);
      setShareCopied(true);
    }
  };

  // Multi-résultats : paiement mensuel + total intérêts + total payé + monthly rate canadien
  // Donne au user la VRAIE image (pas juste le paiement, mais la facture totale 25 ans).
  const result = useMemo<{
    monthlyPayment: number;
    totalInterest: number;
    totalPaid: number;
    monthlyRate: number;
    numberOfPayments: number;
    principal: number;
  } | null>(() => {
    const principal = parseLocaleFloat(amountInput) ?? DEFAULTS.amount;
    const annualRate = parseLocaleFloat(rateInput) ?? DEFAULTS.rate;
    const years = parseLocaleFloat(yearsInput) ?? DEFAULTS.years;

    if (principal <= 0 || years <= 0) return null;

    const numberOfPayments = years * 12;

    let monthlyRate: number;
    let monthlyPayment: number;

    if (annualRate === 0) {
      monthlyRate = 0;
      monthlyPayment = principal / numberOfPayments;
    } else {
      // Formule canadienne : composé semi-annuel.
      const semiAnnualRate = annualRate / 2 / 100;
      monthlyRate = Math.pow(1 + semiAnnualRate, 2 / 12) - 1;
      monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    if (!Number.isFinite(monthlyPayment)) return null;

    const totalPaid = monthlyPayment * numberOfPayments;
    const totalInterest = totalPaid - principal;

    return {
      monthlyPayment,
      totalInterest,
      totalPaid,
      monthlyRate,
      numberOfPayments,
      principal,
    };
  }, [amountInput, rateInput, yearsInput]);

  const monthlyPayment = result?.monthlyPayment ?? null;

  return (
    <section id="calculateur" className="py-24 surface-cream">
      <Container size="lg">
        <SectionHeading
          eyebrow={t("tools.calc.eyebrow")}
          title={t("tools.calc.title")}
          subtitle={t("tools.calc.subtitle")}
          tone="light"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Inputs column (3/5) — sliders visuels luxury */}
          <div className="lg:col-span-3 space-y-9 bg-[color:var(--color-surface)] border border-[color:var(--color-taupe)]/50 p-8 md:p-12">
            <CalcSliderField
              id="calc-amount"
              label={t("tools.calc.amountLabel")}
              value={amountInput}
              onChange={setAmountInput}
              min={RANGES.amount.min}
              max={RANGES.amount.max}
              step={RANGES.amount.step}
              format={(v) => formatLocaleCurrency(Math.round(v), lang)}
              minLabel={formatLocaleCurrency(RANGES.amount.min, lang)}
              maxLabel={formatLocaleCurrency(RANGES.amount.max, lang)}
            />
            <CalcSliderField
              id="calc-rate"
              label={t("tools.calc.rateLabel")}
              value={rateInput}
              onChange={setRateInput}
              min={RANGES.rate.min}
              max={RANGES.rate.max}
              step={RANGES.rate.step}
              format={(v) => `${v.toFixed(2)} %`}
              minLabel={`${RANGES.rate.min} %`}
              maxLabel={`${RANGES.rate.max} %`}
            />
            <CalcSliderField
              id="calc-years"
              label={t("tools.calc.yearsLabel")}
              value={yearsInput}
              onChange={setYearsInput}
              min={RANGES.years.min}
              max={RANGES.years.max}
              step={RANGES.years.step}
              format={(v) => `${Math.round(v)} ${lang === "fr" ? "ans" : "years"}`}
              minLabel={`${RANGES.years.min}`}
              maxLabel={`${RANGES.years.max}`}
            />
          </div>

          {/* Result column (2/5) — compute theatre vraiment énorme. Audit P1-F. */}
          <div className="lg:col-span-2 surface-navy p-8 md:p-12 flex flex-col justify-between gap-10 relative overflow-hidden">
            {/* Filigrane "$" éditorial en arrière-plan */}
            <span
              className="absolute -top-8 -right-6 font-[var(--font-editorial)] italic text-[color:var(--color-taupe-dark)]/10 text-[16rem] leading-none pointer-events-none select-none"
              aria-hidden="true"
            >
              $
            </span>

            <div className="relative">
              <p className="eyebrow text-[color:var(--color-taupe)] mb-4">
                {t("tools.calc.resultLabel")}
              </p>
              <p
                className="font-[var(--font-display)] font-extrabold text-[color:var(--color-cream)] text-[clamp(3rem,6vw,4.5rem)] tracking-[-0.025em] leading-[0.9]"
                aria-live="polite"
              >
                {monthlyPayment !== null
                  ? formatLocaleCurrency(Math.round(monthlyPayment), lang)
                  : "—"}
              </p>
              <div className="flex items-center gap-3 mt-5">
                <span className="w-6 h-px bg-[color:var(--color-taupe-dark)]" aria-hidden="true" />
                <p className="italic text-[color:var(--color-cream)]/70 text-sm">
                  {lang === "fr" ? "par mois" : "per month"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <HeartbeatCta className="cta-heartbeat--block">
                <Link to="/" hash="contact" className="btn-bronze cta-sheen w-full relative">
                  {t("tools.calc.ctaLabel")}
                </Link>
              </HeartbeatCta>
              <button
                type="button"
                onClick={handleShare}
                className="group w-full inline-flex items-center justify-center gap-2 py-2 font-[var(--font-display)] text-xs font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-cream)]/70 hover:text-[color:var(--color-taupe-light)] transition-colors"
              >
                {shareCopied ? (
                  <Check size={14} className="text-[color:var(--color-taupe-light)]" aria-hidden="true" />
                ) : (
                  <Share2 size={14} aria-hidden="true" />
                )}
                {shareCopied ? t("tools.calc.shareCopiedLabel") : t("tools.calc.shareLabel")}
              </button>
            </div>
          </div>
        </div>

        {/* === NOVEL : Sparkline amortization + multi-résultats (jamais fait sur autre client) === */}
        {result && (
          <div className="mt-10 max-w-5xl mx-auto bg-[color:var(--color-surface)] border border-[color:var(--color-taupe)]/40 p-7 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sparkline column */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-baseline justify-between gap-3">
                <p className="eyebrow text-[color:var(--color-taupe-dark)]">
                  {lang === "fr" ? "Courbe d'amortissement" : "Amortization curve"}
                </p>
                <p className="text-xs italic text-[color:var(--color-taupe-dark)]">
                  {lang === "fr"
                    ? `sur ${result.numberOfPayments / 12} ans`
                    : `over ${result.numberOfPayments / 12} years`}
                </p>
              </div>
              <AmortizationSparkline
                principal={result.principal}
                monthlyPayment={result.monthlyPayment}
                monthlyRate={result.monthlyRate}
                numberOfPayments={result.numberOfPayments}
              />
              <p className="text-[10px] italic text-[color:var(--color-taupe-dark)] mt-2">
                {lang === "fr"
                  ? "Plus le contrat avance, plus la part capital remplace les intérêts."
                  : "As the loan progresses, the principal share replaces the interest share."}
              </p>
            </div>

            {/* Multi-résultats column — total intérêts vs total payé */}
            <div className="lg:col-span-5 space-y-5 lg:border-l lg:border-[color:var(--color-taupe)]/40 lg:pl-8">
              <div>
                <p className="eyebrow text-[color:var(--color-taupe-dark)] mb-2">
                  {lang === "fr" ? "Intérêts totaux" : "Total interest"}
                </p>
                <p className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-3xl tracking-[-0.01em] tabular-nums">
                  {formatLocaleCurrency(Math.round(result.totalInterest), lang)}
                </p>
              </div>

              <div className="signature-line w-12 bg-[color:var(--color-taupe-dark)]" />

              <div>
                <p className="eyebrow text-[color:var(--color-taupe-dark)] mb-2">
                  {lang === "fr" ? "Coût total du prêt" : "Total cost of loan"}
                </p>
                <p className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-3xl tracking-[-0.01em] tabular-nums">
                  {formatLocaleCurrency(Math.round(result.totalPaid), lang)}
                </p>
                <p className="text-xs italic text-[color:var(--color-taupe-dark)] mt-1">
                  {lang === "fr" ? "capital + intérêts" : "principal + interest"}
                </p>
              </div>

              <p className="text-[10px] leading-relaxed text-[color:var(--color-taupe-dark)] pt-2 italic border-t border-[color:var(--color-taupe)]/30 mt-4 text-pretty hyphens-auto">
                {lang === "fr"
                  ? "Estimation à taux constant. La réalité varie selon les renouvellements, les paiements anticipés et les conditions du prêteur."
                  : "Estimate at constant rate. Actual values vary with renewals, prepayments, and lender conditions."}
              </p>
            </div>
          </div>
        )}

        {/* === NOVEL : "Et si..." comparative scenarios live === */}
        {result && (
          <WhatIfScenarios
            principal={result.principal}
            monthlyPayment={result.monthlyPayment}
            monthlyRate={result.monthlyRate}
            numberOfPayments={result.numberOfPayments}
            totalInterest={result.totalInterest}
          />
        )}

        {/* Disclaimer AMF en bas */}
        <p className="text-xs leading-relaxed text-[color:var(--color-taupe-dark)] max-w-3xl mx-auto text-center mt-8 italic text-pretty hyphens-auto">
          {t("tools.calc.disclaimer")}
        </p>
      </Container>
    </section>
  );
}

function CalcSliderField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
  minLabel,
  maxLabel,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  minLabel: string;
  maxLabel: string;
}) {
  const numValue = parseLocaleFloat(value) ?? min;
  const clamped = Math.max(min, Math.min(max, numValue));
  const percent = ((clamped - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      {/* Label eyebrow + value display */}
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="eyebrow text-[color:var(--color-taupe-dark)]">
          {label}
        </label>
        <output
          htmlFor={id}
          className="font-[var(--font-display)] font-bold tracking-[-0.01em] text-[color:var(--color-navy-deep)] text-[clamp(1.25rem,1.8vw,1.5rem)] tabular-nums"
        >
          {format(clamped)}
        </output>
      </div>

      {/* Slider track avec fill bronze */}
      <div className="relative pt-1">
        {/* Fill colored portion (bronze) — utilise pseudo-element via background */}
        <div
          className="absolute top-1/2 left-0 h-px bg-[color:var(--color-taupe-dark)] pointer-events-none transition-[width] duration-150"
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

      {/* Min/Max labels */}
      <div className="flex justify-between text-[10px] eyebrow text-[color:var(--color-taupe-dark)]/70">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
