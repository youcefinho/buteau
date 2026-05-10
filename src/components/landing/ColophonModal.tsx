import { useLanguage } from "@/lib/LanguageContext";
import { useColophon } from "@/lib/ColophonContext";
import { ModalShell } from "@/components/layout/ModalShell";
import { ColophonContent } from "@/components/landing/ColophonContent";

/**
 * ColophonModal — Buteau (wrapper modal pur).
 * Le contenu est délégué à ColophonContent (single source).
 * La page SEO est routes/colophon.tsx (réutilise ColophonContent variant="page").
 */
export function ColophonModal() {
  const { lang } = useLanguage();
  const { isOpen, close } = useColophon();
  const isFr = lang === "fr";

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={close}
      eyebrow={isFr ? "Mentions techniques" : "Technical credits"}
      title={isFr ? "Colophon" : "Colophon"}
      closeLabel={isFr ? "Fermer le colophon" : "Close colophon"}
      ariaLabelledById="colophon-title"
      printable
      printLabel={isFr ? "Imprimer le colophon" : "Print colophon"}
    >
      <ColophonContent variant="modal" onClose={close} />
    </ModalShell>
  );
}
