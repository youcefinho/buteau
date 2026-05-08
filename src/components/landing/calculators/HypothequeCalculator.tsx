import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "../SectionHeading";
import { parseLocaleFloat, formatLocaleCurrency } from "@/lib/parseLocaleFloat";

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

  const monthlyPayment = useMemo<number | null>(() => {
    const principal = parseLocaleFloat(amountInput) ?? DEFAULTS.amount;
    const annualRate = parseLocaleFloat(rateInput) ?? DEFAULTS.rate;
    const years = parseLocaleFloat(yearsInput) ?? DEFAULTS.years;

    if (principal <= 0 || years <= 0) return null;

    const numberOfPayments = years * 12;

    if (annualRate === 0) {
      return principal / numberOfPayments;
    }

    // Formule canadienne : composé semi-annuel.
    const semiAnnualRate = annualRate / 2 / 100;
    const monthlyRate = Math.pow(1 + semiAnnualRate, 2 / 12) - 1;

    const payment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    return Number.isFinite(payment) ? payment : null;
  }, [amountInput, rateInput, yearsInput]);

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
          {/* Inputs column (3/5) */}
          <div className="lg:col-span-3 space-y-5 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] p-8 md:p-10">
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

          {/* Result column (2/5) — surface navy avec compute theatre */}
          <div className="lg:col-span-2 surface-navy p-8 md:p-10 flex flex-col justify-between gap-6">
            <div>
              <p className="eyebrow text-[color:var(--color-taupe)] mb-3">
                {t("tools.calc.resultLabel")}
              </p>
              <p
                className="font-[var(--font-display)] font-bold text-[color:var(--color-cream)] text-4xl md:text-5xl tracking-[-0.01em] leading-none"
                aria-live="polite"
              >
                {monthlyPayment !== null
                  ? formatLocaleCurrency(Math.round(monthlyPayment), lang)
                  : "—"}
              </p>
              <p className="text-sm text-[color:var(--color-cream)]/60 mt-3 italic">
                {lang === "fr" ? "par mois" : "per month"}
              </p>
            </div>

            <Link to="/" hash="contact" className="btn-bronze w-full">
              {t("tools.calc.ctaLabel")}
            </Link>
          </div>
        </div>

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
  return (
    <div className="space-y-2">
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
        className="w-full px-4 py-3.5 border-2 border-[color:var(--color-taupe)] bg-[color:var(--color-cream)] text-base font-[var(--font-display)] font-medium text-[color:var(--color-navy-deep)] outline-none transition-colors focus:border-[color:var(--color-bronze)]"
      />
    </div>
  );
}
