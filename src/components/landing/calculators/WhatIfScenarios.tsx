import { useMemo } from "react";
import { TrendingDown, Clock } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { formatLocaleCurrency } from "@/lib/parseLocaleFloat";

/**
 * "Et si..." — comparative scenarios sous le calculator.
 *
 * Pourquoi NOVEL : aucun calculator hypothécaire concurrent ne montre les
 * scenarios alternatifs en temps réel. Buteau démontre la valeur ajoutée d'un
 * courtier ("voici ce qu'un petit ajustement change concrètement").
 *
 * 2 scenarios live :
 * 1. Paiement +100$/mois -> économie intérêts + mois épargnés
 * 2. Amortissement 20 ans (vs 25) -> nouveau paiement + économie intérêts
 */
type WhatIfScenariosProps = {
  principal: number;
  monthlyPayment: number;
  monthlyRate: number;
  numberOfPayments: number;
  totalInterest: number;
};

export function WhatIfScenarios({
  principal,
  monthlyPayment,
  monthlyRate,
  numberOfPayments,
  totalInterest,
}: WhatIfScenariosProps) {
  const { t, lang } = useLanguage();

  // Scenario 1 : paiement +100$/mois — calcule combien de mois pour solder + intérêts totaux
  const scenarioAccelerated = useMemo(() => {
    if (principal <= 0 || monthlyPayment <= 0 || monthlyRate < 0) return null;
    const newPayment = monthlyPayment + 100;
    let balance = principal;
    let cumulativeInterest = 0;
    let months = 0;
    const maxIter = 600; // safety cap (50 ans)

    while (balance > 0.01 && months < maxIter) {
      const interest = balance * monthlyRate;
      const principalPart = Math.max(0, newPayment - interest);
      cumulativeInterest += interest;
      balance -= principalPart;
      months += 1;
    }

    if (months >= maxIter) return null;

    const interestSavings = totalInterest - cumulativeInterest;
    const monthsSaved = numberOfPayments - months;

    return {
      newPayment,
      interestSavings: Math.max(0, interestSavings),
      monthsSaved: Math.max(0, monthsSaved),
      newTotalInterest: cumulativeInterest,
    };
  }, [principal, monthlyPayment, monthlyRate, numberOfPayments, totalInterest]);

  // Scenario 2 : amortissement 20 ans (240 mois) — recalcule paiement + intérêts totaux
  const scenarioShorter = useMemo(() => {
    if (principal <= 0 || monthlyRate < 0) return null;
    const newPayments = 240;
    if (newPayments >= numberOfPayments) return null; // Si l'utilisateur a déjà <=20 ans, skip

    let newMonthly: number;
    if (monthlyRate === 0) {
      newMonthly = principal / newPayments;
    } else {
      newMonthly =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, newPayments))) /
        (Math.pow(1 + monthlyRate, newPayments) - 1);
    }

    if (!Number.isFinite(newMonthly)) return null;

    const newTotalPaid = newMonthly * newPayments;
    const newTotalInterest = newTotalPaid - principal;
    const interestSavings = totalInterest - newTotalInterest;

    return {
      newMonthly,
      newTotalInterest,
      interestSavings: Math.max(0, interestSavings),
    };
  }, [principal, monthlyRate, numberOfPayments, totalInterest]);

  if (!scenarioAccelerated && !scenarioShorter) return null;

  return (
    <div className="mt-8 max-w-5xl mx-auto">
      {/* Header signature */}
      <div className="text-center mb-7">
        <p className="font-[family-name:var(--font-editorial)]  text-[color:var(--color-navy)] text-[clamp(1.5rem,2.5vw,1.875rem)]">
          {t("tools.calc.scenariosTitle")}
        </p>
        <p className="text-sm text-[color:var(--color-taupe-dark)]  mt-2 max-w-md mx-auto">
          {t("tools.calc.scenariosSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Scenario 1 — Paiement accéléré */}
        {scenarioAccelerated && (
          <article className="group bg-[color:var(--color-cream-warm)] border border-[color:var(--color-taupe)]/40 p-6 md:p-7 transition-all duration-500 hover:border-[color:var(--color-orange)]/70 relative overflow-hidden">
            {/* Halo bronze top-right */}
            <span
              aria-hidden="true"
              className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[color:var(--color-bronze)]/8 blur-3xl pointer-events-none"
            />

            <div className="flex items-start gap-3 mb-4 relative">
              <TrendingDown
                size={20}
                strokeWidth={1.5}
                className="shrink-0 mt-0.5 text-[color:var(--color-navy)]"
                aria-hidden="true"
              />
              <h4 className="font-[family-name:var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(0.875rem,1.2vw,1rem)] uppercase tracking-[0.04em] leading-snug">
                {t("tools.calc.scenarioAcceleratedTitle")}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-4 relative">
              <div>
                <p className="eyebrow text-[color:var(--color-taupe-dark)] mb-1.5">
                  {t("tools.calc.scenarioSavingsLabel")}
                </p>
                <p className="font-[family-name:var(--font-display)] font-extrabold text-[color:var(--color-navy)] text-[clamp(1.5rem,2.5vw,1.875rem)] tracking-[-0.01em] tabular-nums">
                  {formatLocaleCurrency(Math.round(scenarioAccelerated.interestSavings), lang)}
                </p>
              </div>
              <div className="border-l border-[color:var(--color-taupe)]/40 pl-4">
                <p className="eyebrow text-[color:var(--color-taupe-dark)] mb-1.5">
                  {t("tools.calc.scenarioMonthsSavedLabel")}
                </p>
                <p className="font-[family-name:var(--font-display)] font-extrabold text-[color:var(--color-navy-deep)] text-[clamp(1.5rem,2.5vw,1.875rem)] tracking-[-0.01em] tabular-nums">
                  {scenarioAccelerated.monthsSaved}
                </p>
              </div>
            </div>
          </article>
        )}

        {/* Scenario 2 — Amortissement 20 ans */}
        {scenarioShorter && (
          <article className="group bg-[color:var(--color-cream-warm)] border border-[color:var(--color-taupe)]/40 p-6 md:p-7 transition-all duration-500 hover:border-[color:var(--color-orange)]/70 relative overflow-hidden">
            <span
              aria-hidden="true"
              className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[color:var(--color-bronze)]/8 blur-3xl pointer-events-none"
            />

            <div className="flex items-start gap-3 mb-4 relative">
              <Clock
                size={20}
                strokeWidth={1.5}
                className="shrink-0 mt-0.5 text-[color:var(--color-navy)]"
                aria-hidden="true"
              />
              <h4 className="font-[family-name:var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(0.875rem,1.2vw,1rem)] uppercase tracking-[0.04em] leading-snug">
                {t("tools.calc.scenarioShorterTitle")}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-4 relative">
              <div>
                <p className="eyebrow text-[color:var(--color-taupe-dark)] mb-1.5">
                  {t("tools.calc.scenarioNewPaymentLabel")}
                </p>
                <p className="font-[family-name:var(--font-display)] font-extrabold text-[color:var(--color-navy-deep)] text-[clamp(1.5rem,2.5vw,1.875rem)] tracking-[-0.01em] tabular-nums">
                  {formatLocaleCurrency(Math.round(scenarioShorter.newMonthly), lang)}
                </p>
              </div>
              <div className="border-l border-[color:var(--color-taupe)]/40 pl-4">
                <p className="eyebrow text-[color:var(--color-taupe-dark)] mb-1.5">
                  {t("tools.calc.scenarioSavingsLabel")}
                </p>
                <p className="font-[family-name:var(--font-display)] font-extrabold text-[color:var(--color-navy)] text-[clamp(1.5rem,2.5vw,1.875rem)] tracking-[-0.01em] tabular-nums">
                  {formatLocaleCurrency(Math.round(scenarioShorter.interestSavings), lang)}
                </p>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
