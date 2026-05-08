import { useState, useRef, useEffect, type FormEvent } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

/**
 * ContactForm — capture leads avec defense en profondeur 4 couches.
 *
 * 1. Honeypot field caché (display:none + tabindex=-1 + aria-hidden + autocomplete random)
 *    NB : on choisit un nom de champ générique mais NON suggestif pour éviter que les
 *    password managers le remplissent automatiquement (1Password / LastPass / Bitwarden).
 *    Cf. skill `intralys-form-honeypot`.
 * 2. Timing detection : capture form_started_at au mount, envoie au worker pour
 *    rejet < 3s (bot pattern Serujan/EG validé en prod).
 * 3. Rate limit : géré côté worker via D1 (30s par IP).
 * 4. Validation : email regex + maxLen + consent + sanitize côté worker.
 *
 * Consent Loi 25 art. 23 : checkbox EXPLICITE obligatoire avant submit.
 */

type Status = "idle" | "submitting" | "success" | "error";

type ContactFormProps = {
  source?: string; // "home_contact_form" | "calc_cta" | etc.
};

export function ContactForm({ source = "home_contact_form" }: ContactFormProps) {
  const { t, lang } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const formStartedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    formStartedAtRef.current = Date.now();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorCode(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      full_name: String(fd.get("full_name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? "") || undefined,
      message: String(fd.get("message") ?? "") || undefined,
      consent: fd.get("consent") === "on",
      honeypot: String(fd.get("contact_check_url") ?? ""), // honeypot field
      form_started_at: formStartedAtRef.current,
      source,
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as { error?: string } | null;

      if (!res.ok) {
        setErrorCode(data?.error ?? "unknown_error");
        setStatus("error");
        return;
      }

      setStatus("success");
      e.currentTarget.reset();
    } catch (err) {
      console.error("Lead submit error:", err);
      setErrorCode("network_error");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12 space-y-4">
        <CheckCircle2
          size={56}
          className="mx-auto text-[color:var(--color-bronze)]"
          aria-hidden="true"
        />
        <h3 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-xl uppercase tracking-[0.04em]">
          {t("form.successTitle")}
        </h3>
        <p className="text-sm text-[color:var(--color-taupe-dark)] max-w-sm mx-auto">
          {t("form.successBody")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-busy={status === "submitting"}>
      {/* === HONEYPOT === */}
      {/* Champ caché — DOIT rester vide. Le naming "contact_check_url" est volontairement
          générique pour éviter que les password managers le remplissent automatiquement
          (un nom comme "name", "email" ou "address" serait dangereux). */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", top: "-9999px", width: 0, height: 0, overflow: "hidden" }}
      >
        <label htmlFor="contact_check_url">Leave this field empty</label>
        <input
          id="contact_check_url"
          name="contact_check_url"
          type="text"
          tabIndex={-1}
          autoComplete="new-password-no-fill-pls"
          defaultValue=""
        />
      </div>

      {/* === Champs visibles === */}
      <Field
        id="full_name"
        name="full_name"
        label={t("form.fullNameLabel")}
        type="text"
        required
        autoComplete="name"
      />
      <Field
        id="email"
        name="email"
        label={t("form.emailLabel")}
        type="email"
        required
        autoComplete="email"
        inputMode="email"
      />
      <Field
        id="phone"
        name="phone"
        label={t("form.phoneLabel")}
        type="tel"
        autoComplete="tel"
        inputMode="tel"
      />
      <Field
        id="message"
        name="message"
        label={t("form.messageLabel")}
        type="textarea"
      />

      {/* === Consent Loi 25 art. 23 === */}
      <label className="flex items-start gap-3 pt-2 cursor-pointer">
        <input
          name="consent"
          type="checkbox"
          required
          className="mt-1 w-4 h-4 accent-[color:var(--color-bronze)] cursor-pointer shrink-0"
        />
        <span className="text-xs leading-relaxed text-[color:var(--color-navy-deep)]/85">
          {t("form.consentLabel")}{" "}
          <a
            href="/confidentialite"
            className="underline underline-offset-2 hover:text-[color:var(--color-bronze-deep)]"
          >
            {t("form.consentLinkLabel")}
          </a>
          .
        </span>
      </label>

      {/* === Erreur === */}
      {status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-800 text-sm"
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            {t(`form.errors.${errorCode ?? "unknown_error"}`) ||
              (lang === "fr" ? "Une erreur est survenue." : "An error occurred.")}
          </span>
        </div>
      )}

      {/* === Submit === */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className={cn("btn-bronze w-full", status === "submitting" && "opacity-70 cursor-wait")}
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            {t("form.submitting")}
          </>
        ) : (
          t("form.submitLabel")
        )}
      </button>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type,
  required,
  autoComplete,
  inputMode,
}: {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  required?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "decimal" | "numeric";
}) {
  const baseClass =
    "w-full px-4 py-3 border-2 border-[color:var(--color-taupe)] bg-[color:var(--color-cream)] text-sm text-[color:var(--color-navy-deep)] outline-none transition-colors focus:border-[color:var(--color-bronze)]";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="eyebrow text-[color:var(--color-taupe-dark)] block">
        {label} {required && <span className="text-[color:var(--color-bronze-deep)]">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={4}
          className={cn(baseClass, "resize-y min-h-[100px]")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className={baseClass}
        />
      )}
    </div>
  );
}
