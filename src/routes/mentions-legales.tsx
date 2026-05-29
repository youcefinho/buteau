import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { config } from "@/lib/config";
import { LegalPageWrap } from "@/components/layout/LegalPageWrap";
import { AmfDisclaimer } from "@/components/layout/AmfDisclaimer";
import { SchemaJsonLd, breadcrumbs } from "@/components/layout/SchemaJsonLd";

export const Route = createFileRoute("/mentions-legales")({
  component: MentionsLegalesPage,
});

function MentionsLegalesPage() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const lastUpdatedLabel = isFr
    ? `Dernière mise à jour — ${config.legal.effectiveDate}`
    : `Last updated — ${config.legal.effectiveDate}`;

  return (
    <LegalPageWrap
      eyebrow={isFr ? "Information légale" : "Legal information"}
      title={isFr ? "Mentions légales" : "Legal notice"}
      lastUpdated={lastUpdatedLabel}
    >
      <SchemaJsonLd schema={breadcrumbs.mentionsLegales(lang)} />
      {isFr ? <BodyFr /> : <BodyEn />}
    </LegalPageWrap>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-[var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.25rem,1.8vw,1.5rem)] uppercase tracking-[0.04em] mt-10 mb-3 text-balance">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="leading-relaxed text-pretty hyphens-auto">{children}</p>;
}

function BodyFr() {
  return (
    <>
      <H2>Identité du courtier</H2>
      <P>
        <strong>Nom commercial :</strong> {config.name}
        <br />
        <strong>Cabinet d'attache :</strong> {config.cabinet}
        <br />
        <strong>Industrie :</strong> Courtage hypothécaire — Quebec
        <br />
        <strong>NEQ :</strong>{" "}
        {config.legal.neq || (
          <em className="not-italic text-[color:var(--color-taupe-dark)]">
            (Numéro d'entreprise du Québec — à compléter)
          </em>
        )}
      </P>

      <H2>Coordonnées</H2>
      <P>
        <strong>Adresse :</strong> {config.legal.streetAddress}
        <br />
        <strong>Téléphone :</strong>{" "}
        <a href={`tel:${config.phone.raw}`} className="underline hover:text-[color:var(--color-navy)]">
          {config.phone.display}
        </a>
        <br />
        <strong>Courriel :</strong>{" "}
        <a href={`mailto:${config.email}`} className="underline hover:text-[color:var(--color-navy)] break-all">
          {config.email}
        </a>
      </P>

      <H2>Inscription auprès de l'Autorité des marchés financiers (AMF)</H2>
      <P>
        <strong>Numéro de certificat AMF :</strong>{" "}
        {config.amf.certificateNumberAndrew || (
          <em className="not-italic text-[color:var(--color-taupe-dark)]">(à compléter — voir AMF.qc.ca)</em>
        )}
      </P>
      <AmfDisclaimer variant="card" className="my-6" />

      <H2>Hébergement</H2>
      <P>
        Ce site est hébergé sur Cloudflare Workers (Cloudflare, Inc., 101 Townsend St,
        San Francisco, CA 94107, États-Unis). Les requêtes peuvent transiter par des
        serveurs au Canada, aux États-Unis ou ailleurs selon le routage Cloudflare.
      </P>

      <H2>Propriété intellectuelle</H2>
      <P>
        L'ensemble du contenu de ce site (textes, images, logos, structure, code) est
        la propriété de l'Équipe Buteau ou de ses partenaires (notamment Planiprêt et les
        institutions financières partenaires). Toute reproduction non autorisée est
        interdite.
      </P>

      <H2>Limitation de responsabilité</H2>
      <P>
        Les informations diffusées sur ce site le sont à titre informatif uniquement.
        Elles ne constituent ni une offre de financement ni un engagement contractuel.
        Toute demande hypothécaire est sujette à approbation par le prêteur, selon les
        critères en vigueur à ce moment.
      </P>
      <P>
        Le calculateur hypothécaire fournit une estimation basée sur la formule
        canadienne semi-annuelle. Les paiements réels peuvent varier selon le prêteur,
        l'amortissement, la fréquence et les taxes municipales / SCHL.
      </P>

      <H2>Droit applicable et juridiction</H2>
      <P>
        Le présent site est régi par les lois en vigueur dans la province de Québec et
        les lois fédérales du Canada applicables. Tout litige relèvera des tribunaux
        compétents du district de Laval.
      </P>

      <H2>Crédits</H2>
      <P>
        Site conçu et développé par <a href="https://intralys.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[color:var(--color-navy)]">Intralys</a>.
      </P>
    </>
  );
}

function BodyEn() {
  return (
    <>
      <H2>Broker identity</H2>
      <P>
        <strong>Trade name:</strong> {config.name}
        <br />
        <strong>Brokerage firm:</strong> {config.cabinet}
        <br />
        <strong>Industry:</strong> Mortgage brokerage — Quebec
        <br />
        <strong>NEQ:</strong>{" "}
        {config.legal.neq || (
          <em className="not-italic text-[color:var(--color-taupe-dark)]">(Quebec business number — to be filled)</em>
        )}
      </P>

      <H2>Contact</H2>
      <P>
        <strong>Address:</strong> {config.legal.streetAddress}
        <br />
        <strong>Phone:</strong>{" "}
        <a href={`tel:${config.phone.raw}`} className="underline hover:text-[color:var(--color-navy)]">
          {config.phone.display}
        </a>
        <br />
        <strong>Email:</strong>{" "}
        <a href={`mailto:${config.email}`} className="underline hover:text-[color:var(--color-navy)] break-all">
          {config.email}
        </a>
      </P>

      <H2>AMF registration</H2>
      <P>
        <strong>AMF certificate number:</strong>{" "}
        {config.amf.certificateNumberAndrew || (
          <em className="not-italic text-[color:var(--color-taupe-dark)]">(to be filled — see lautorite.qc.ca)</em>
        )}
      </P>
      <AmfDisclaimer variant="card" className="my-6" />

      <H2>Hosting</H2>
      <P>
        This website is hosted on Cloudflare Workers (Cloudflare, Inc., 101 Townsend St,
        San Francisco, CA 94107, USA). Requests may transit through servers in Canada,
        the United States, or elsewhere depending on Cloudflare routing.
      </P>

      <H2>Intellectual property</H2>
      <P>
        All content on this site (texts, images, logos, structure, code) belongs to
        Équipe Buteau or its partners (notably Planiprêt and partner financial institutions).
        Unauthorized reproduction is prohibited.
      </P>

      <H2>Liability limitation</H2>
      <P>
        Information published on this site is for informational purposes only. It does
        not constitute a financing offer or a contractual commitment. Every mortgage
        request is subject to lender approval based on criteria in effect at that time.
      </P>
      <P>
        The mortgage calculator provides an estimate based on the Canadian semi-annual
        formula. Actual payments may vary depending on the lender, amortization, frequency,
        and municipal / CMHC taxes.
      </P>

      <H2>Governing law and jurisdiction</H2>
      <P>
        This site is governed by the laws in force in the province of Quebec and applicable
        federal Canadian laws. Any dispute will fall under the courts of the Laval district.
      </P>

      <H2>Credits</H2>
      <P>
        Site designed and developed by <a href="https://intralys.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[color:var(--color-navy)]">Intralys</a>.
      </P>
    </>
  );
}
