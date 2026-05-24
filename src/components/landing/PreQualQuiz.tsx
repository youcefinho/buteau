import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container } from "@/components/layout/Container";
import { HeartbeatCta } from "@/components/layout/HeartbeatCta";
import { ta, translations } from "@/lib/translations";
import { useQuizTier } from "@/hooks/useQuizTier";

/**
 * PreQualQuiz — quiz 3Q tier-based unique pour courtage hypothécaire.
 *
 * Pourquoi NOVEL : aucun courtier hypothécaire concurrent ne propose un quiz
 * de pré-qualification visuel-luxe. Buteau qualifie les leads + personnalise
 * l'expérience selon le profil (primo / refi / investor / explorer).
 *
 * Logique :
 * - 3 questions, chacune avec 4 options pondérées vers un tier
 * - Score = tier le plus voté sur les 3 réponses
 * - Affichage personnalisé du résultat avec CTA spécifique
 * - Possibilité de refaire le quiz
 */

// Tier importé du hook useQuizTier pour cohérence cross-app
type Tier = "primo" | "refi" | "investor" | "explorer";

// (Ré-exporté par useQuizTier.ts)

type QuizQuestion = {
  q: string;
  options: Array<{ label: string; tier: Tier }>;
};

type QuizResult = {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
};

export function PreQualQuiz() {
  const { t, lang } = useLanguage();
  const { saveTier } = useQuizTier();
  const questions = ta<QuizQuestion[]>(translations[lang], "quiz.questions");

  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Tier[]>([]);
  const isComplete = step >= questions.length;

  // Tier le plus voté
  const winningTier = useMemo<Tier>(() => {
    if (answers.length === 0) return "explorer";
    const counts: Record<Tier, number> = { primo: 0, refi: 0, investor: 0, explorer: 0 };
    for (const a of answers) counts[a]++;
    return (Object.entries(counts) as Array<[Tier, number]>).sort(
      (a, b) => b[1] - a[1],
    )[0][0];
  }, [answers]);

  // Persiste le tier dès que le quiz est complété — debloque les CTAs personnalisés
  // sur Hero / Calculator / ContactForm partout dans l'app.
  useEffect(() => {
    if (isComplete) {
      saveTier(winningTier);
    }
  }, [isComplete, winningTier, saveTier]);

  const result = ta<QuizResult>(translations[lang], `quiz.results.${winningTier}`);

  const handleAnswer = (tier: Tier) => {
    setAnswers((prev) => [...prev, tier]);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 0) return;
    setAnswers((prev) => prev.slice(0, -1));
    setStep((s) => s - 1);
  };

  const handleRestart = () => {
    setAnswers([]);
    setStep(0);
  };

  const currentQ = questions[step];
  const progress = isComplete ? 1 : step / questions.length;

  return (
    <section
      id="prequalification"
      className="relative py-[clamp(4rem,9vw,8rem)] surface-cream overflow-hidden"
    >
      {/* Atmospheric continuity — embers per-section signature */}

      {/* Filigrane "?" Cormorant XL background */}
      <span
        aria-hidden="true"
        className="absolute -top-20 -left-12 font-[var(--font-editorial)] italic text-[color:var(--color-taupe)]/10 text-[28rem] leading-none pointer-events-none select-none"
      >
        ?
      </span>

      <Container size="lg" className="relative">
        {/* Header */}
        <div className="text-center mb-[clamp(3rem,5vw,4rem)] max-w-2xl mx-auto">
          <p className="eyebrow text-[color:var(--color-bronze)] inline-flex items-center gap-3 mb-5">
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
            {t("quiz.eyebrow")}
            <span className="inline-block w-6 h-px bg-[color:var(--color-taupe)]" />
          </p>
          <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.875rem,4vw,3rem)] uppercase tracking-[0.04em] leading-[1.1] mb-5 text-balance">
            {t("quiz.title")}
          </h2>
          <div className="w-12 h-px bg-[color:var(--color-bronze)] mx-auto mb-6" />
          <p className="italic text-[clamp(1rem,1.4vw,1.125rem)] text-[color:var(--color-navy-deep)]/80 leading-[1.55] text-pretty">
            {t("quiz.subtitle")}
          </p>
        </div>

        {/* Quiz card */}
        <div className="max-w-3xl mx-auto bg-[color:var(--color-surface)] border border-[color:var(--color-taupe)]/45 p-[clamp(2rem,4vw,3rem)] relative overflow-hidden halo-glow">
          {!isComplete ? (
            <>
              {/* Progress bar fine bronze */}
              <div className="flex items-center justify-between mb-8">
                <p className="eyebrow text-[color:var(--color-bronze)]">
                  {t("quiz.progressLabel")}{" "}
                  <span className="italic text-[color:var(--color-navy)] text-base">
                    {String(step + 1).padStart(2, "0")}
                  </span>
                  <span className="mx-1.5 text-[color:var(--color-taupe)]">/</span>
                  <span className="italic text-[color:var(--color-bronze)] text-base">
                    {String(questions.length).padStart(2, "0")}
                  </span>
                </p>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="eyebrow text-[color:var(--color-bronze)] hover:text-[color:var(--color-navy)] transition-colors"
                  >
                    ← {t("quiz.backLabel")}
                  </button>
                )}
              </div>

              {/* Progress fill */}
              <div className="h-px bg-[color:var(--color-taupe)]/30 mb-10 overflow-hidden">
                <div
                  className="h-px bg-[color:var(--color-bronze)] transition-[width] duration-700 ease-out"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>

              {/* Question */}
              <h3
                key={step}
                className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.5rem,2.5vw,1.875rem)] uppercase tracking-[0.02em] leading-[1.2] mb-8 text-balance animate-[buteauFadeUp_500ms_ease-out_both]"
              >
                {currentQ?.q}
              </h3>

              {/* Options */}
              <ul
                key={`opts-${step}`}
                className="space-y-3 animate-[buteauFadeUp_500ms_ease-out_100ms_both]"
              >
                {currentQ?.options.map((opt, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => handleAnswer(opt.tier)}
                      className="group w-full text-left bg-[color:var(--color-cream-warm)] border border-[color:var(--color-taupe)]/40 hover:border-[color:var(--color-bronze)]/70 px-[clamp(1.25rem,2vw,1.5rem)] py-[clamp(1rem,1.5vw,1.25rem)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(16,34,61,0.2)] flex items-center justify-between gap-4"
                    >
                      <span className="flex items-baseline gap-4 flex-1">
                        <span className="italic text-[color:var(--color-bronze)] text-xl tabular-nums">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-[var(--font-display)] text-[color:var(--color-navy-deep)] text-[clamp(1rem,1.4vw,1.125rem)] leading-snug">
                          {opt.label}
                        </span>
                      </span>
                      <ArrowRight
                        size={18}
                        className="shrink-0 text-[color:var(--color-taupe)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[color:var(--color-navy)] transition-all duration-300"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="animate-[buteauFadeUp_700ms_ease-out_both] text-center md:text-left">
              {/* Eyebrow + label profil */}
              <p className="eyebrow text-[color:var(--color-navy)] inline-flex items-center gap-3 mb-5">
                <span className="inline-block w-6 h-px bg-[color:var(--color-bronze)]" />
                {result.eyebrow}
              </p>

              {/* Title personnalisé */}
              <h3 className="font-signature text-[color:var(--color-navy-deep)] text-[clamp(1.875rem,3.5vw,2.75rem)] leading-[1.15] mb-5 tracking-[-0.01em] text-balance">
                {result.title}
              </h3>

              <div className="w-12 h-px bg-[color:var(--color-bronze)] mx-auto md:mx-0 mb-7" />

              {/* Body */}
              <p className="text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.65] text-[color:var(--color-navy-deep)]/85 mb-10 max-w-2xl text-pretty hyphens-auto">
                {result.body}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start">
                <HeartbeatCta>
                  <Link to="/" hash="contact" className="btn-bronze btn-shine cta-sheen">
                    {result.ctaLabel}
                  </Link>
                </HeartbeatCta>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="group inline-flex items-center gap-2 font-[var(--font-display)] text-sm font-semibold uppercase tracking-[var(--tracking-eyebrow)] text-[color:var(--color-bronze)] hover:text-[color:var(--color-navy)] transition-colors"
                >
                  <RotateCcw
                    size={14}
                    className="transition-transform duration-500 group-hover:-rotate-180"
                    aria-hidden="true"
                  />
                  {t("quiz.restartLabel")}
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
