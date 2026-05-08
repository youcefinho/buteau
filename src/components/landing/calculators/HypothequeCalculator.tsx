import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "../SectionHeading";
import { parseLocaleFloat, formatLocaleCurrency } from "@/lib/parseLocaleFloat";
import { AmortizationSparkline } from "./AmortizationSparkline";

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
 * Anti-pattern :
 *   parseLocaleFloat(x) || 0 mange le 0 légitime saisi par l'utilisateur.
 *   On utilise `?? defaultValue` (nullish coalescing) à la place.
 */
const DEFAULTS = {
  amount: 400000,
  rate: 5.5,
  years: 25,
};

export function HypothequeCalculator() {
  const { t, lang } = useLanguage();
  const [amountInput, setAmountInput] = useState<string>(String(DEFAULTS.amount));
  const [rateInput, setRateInput] = useState<string>(String(DEFAULTS.rate));
  const [yearsInput, setYearsInput] = useState<string>(String(DEFAULTS.years));

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
          {/* Inputs column (3/5) — magazine layout, espace généreux */}
          <div className="lg:col-span-3 space-y-8 bg-[color:var(--color-surface)] border border-[color:var(--color-taupe)]/50 p-8 md:p-12">
            <CalcField
              id="calc-amount"
              label={t("tools.calc.amountLabel")}
              value={amountInput}
              onChange={setAmountInput}
              autoComplete="off"
              inputMode="decimal"
            />
            <CalcField
              id="calc-rate"
              label={t("tools.calc.rateLabel")}
              value={rateInput}
              onChange={setRateInput}
              autoComplete="off"
              inputMode="decimal"
            />
            <CalcField
              id="calc-years"
              label={t("tools.calc.yearsLabel")}
              value={yearsInput}
              onChange={setYearsInput}
              autoComplete="off"
              inputMode="numeric"
            />
          </div>

          {/* Result column (2/5) — compute theatre vraiment énorme. Audit P1-F. */}
          <div className="lg:col-span-2 surface-navy p-8 md:p-12 flex flex-col justify-between gap-10 relative overflow-hidden">
            {/* Filigrane "$" éditorial en arrière-plan */}
            <span
              className="absolute -top-8 -right-6 font-[var(--font-editorial)] italic text-[color:var(--color-bronze)]/10 text-[16rem] leading-none pointer-events-none select-none"
              aria-hidden="true"
            >
              $
            </span>

            <div className="relative">
              <p className="eyebrow text-[color:var(--color-taupe)] mb-4">
                {t("tools.calc.resultLabel")}
              </p>
              <p
                className="font-[var(--font-display)] font-extrabold text-[color:var(--color-cream)] text-5xl md:text-6xl lg:text-7xl tracking-[-0.025em] leading-[0.9]"
                aria-live="polite"
              >
                {monthlyPayment !== null
                  ? formatLocaleCurrency(Math.round(monthlyPayment), lang)
                  : "—"}
              </p>
              <div className="flex items-center gap-3 mt-5">
                <span className="w-6 h-px bg-[color:var(--color-bronze)]" aria-hidden="true" />
                <p className="font-[var(--font-editorial)] italic text-[color:var(--color-cream)]/70 text-sm">
                  {lang === "fr" ? "par mois" : "per month"}
                </p>
              </div>
            </div>

            <Link to="/" hash="contact" className="btn-bronze w-full relative">
              {t("tools.calc.ctaLabel")}
            </Link>
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

              <div className="signature-line w-12 bg-[color:var(--color-bronze)]" />

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

              <p className="text-[10px] leading-relaxed text-[color:var(--color-taupe-dark)] pt-2 italic border-t border-[color:var(--color-taupe)]/30 mt-4">
                {lang === "fr"
                  ? "Estimation à taux constant. La réalité varie selon les renouvellements, les paiements anticipés et les conditions du prêteur."
                  : "Estimate at constant rate. Actual values vary with renewals, prepayments, and lender conditions."}
              </p>
            </div>
          </div>
        )}

        {/* Disclaimer AMF en bas */}
        <p className="text-xs leading-relaxed text-[color:var(--color-taupe-dark)] max-w-3xl mx-auto text-center mt-8 italic">
          {t("tools.calc.disclaimer")}
        </p>
      </Container>
    </section>
  );
}

function CalcField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  inputMode?: "decimal" | "numeric";
}) {
  // Pattern magazine éditorial : pas de cadre fermé, juste une fine ligne
  // taupe en bas qui s'épaissit en bronze au focus (audit P2-M).
  return (
    <div className="space-y-2 pb-3 border-b border-[color:var(--color-taupe)]/50 focus-within:border-[color:var(--color-bronze)] transition-colors">
      <label
        htmlFor={id}
        className="eyebrow text-[color:var(--color-taupe-dark)] block"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="w-full px-0 py-1 bg-transparent text-2xl md:text-3xl font-[var(--font-display)] font-bold tracking-[-0.01em] text-[color:var(--color-navy-deep)] outline-none border-none placeholder:text-[color:var(--color-taupe)]"
      />
    </div>
  );
}
