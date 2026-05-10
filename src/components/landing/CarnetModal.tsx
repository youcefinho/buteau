import { useLanguage } from "@/lib/LanguageContext";
import { useCarnet } from "@/lib/CarnetContext";
import { ModalShell } from "@/components/layout/ModalShell";
import { CarnetContent } from "@/components/landing/CarnetContent";

/**
 * CarnetModal — Buteau (wrapper modal pur).
 * Le contenu est délégué à CarnetContent (single source).
 * La page SEO est routes/carnet.tsx (réutilise CarnetContent variant="page").
 */
export function CarnetModal() {
  const { lang } = useLanguage();
  const { isOpen, close } = useCarnet();
  const isFr = lang === "fr";

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={close}
      eyebrow={isFr ? "Service éditorial" : "Editorial service"}
      title={isFr ? "Le carnet" : "The address book"}
      closeLabel={isFr ? "Fermer le carnet" : "Close address book"}
      ariaLabelledById="carnet-title"
      printable
      printLabel={isFr ? "Imprimer le carnet" : "Print address book"}
    >
      <CarnetContent variant="modal" onClose={close} />
    </ModalShell>
  );
}
