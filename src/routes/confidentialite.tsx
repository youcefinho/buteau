import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/lib/LanguageContext";
import { config } from "@/lib/config";
import { LegalPageWrap } from "@/components/layout/LegalPageWrap";
import { SchemaJsonLd, breadcrumbs } from "@/components/layout/SchemaJsonLd";

/**
 * Politique de confidentialité — conforme Loi 25 Quebec (en vigueur sept 2023).
 * 9 sections obligatoires :
 *   1. Objet de la politique
 *   2. Renseignements collectés
 *   3. Finalités de la collecte
 *   4. Communication a des tiers
 *   5. Conservation
 *   6. Droits de la personne concernée (Loi 25 art. 27 à 41)
 *   7. Consentement (Loi 25 art. 12 à 14)
 *   8. Sécurité des renseignements
 *   9. DPO + recours CAI
 *
 * Cf. skill `intralys-consent-loi25` + `intralys-compliance`.
 */
export const Route = createFileRoute("/confidentialite")({
  component: PrivacyPage,
});

function PrivacyPage() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  return (
    <LegalPageWrap
      eyebrow={isFr ? "Loi 25 — Quebec" : "Quebec Privacy Law (Bill 25)"}
      title={isFr ? "Politique de confidentialité" : "Privacy policy"}
      lastUpdated={
        isFr
          ? `Dernière mise à jour — ${config.legal.effectiveDate}`
          : `Last updated — ${config.legal.effectiveDate}`
      }
    >
      <SchemaJsonLd schema={breadcrumbs.confidentialite(lang)} />
      {isFr ? <BodyFr /> : <BodyEn />}
    </LegalPageWrap>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-[family-name:var(--font-display)] font-bold text-[color:var(--color-navy-deep)] text-[clamp(1.25rem,1.8vw,1.5rem)] uppercase tracking-[0.04em] mt-10 mb-3 text-balance">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="leading-relaxed text-pretty hyphens-auto">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-6 space-y-2 leading-relaxed">{children}</ul>;
}

function BodyFr() {
  return (
    <>
      <H2>1. Objet</H2>
      <P>
        La présente politique de confidentialité décrit comment l'Équipe Buteau,
        opérant sous {config.cabinet}, collecte, utilise, communique et protège vos
        renseignements personnels, conformément à la Loi sur la protection des
        renseignements personnels dans le secteur privé (RLRQ c. P-39.1, dite « Loi 25 »).
      </P>

      <H2>2. Renseignements collectés</H2>
      <P>Lorsque vous interagissez avec notre site, nous pouvons collecter :</P>
      <UL>
        <li>
          <strong>Lors d'un formulaire de contact :</strong> nom complet, courriel,
          numéro de téléphone (optionnel), message (optionnel), date et heure du
          consentement, adresse IP hachée (SHA-256), navigateur (user agent).
        </li>
        <li>
          <strong>Lors de l'utilisation de notre calculateur :</strong> les
          paramètres saisis (montant, taux, durée) restent dans votre navigateur et
          ne sont pas transmis à nos serveurs.
        </li>
        <li>
          <strong>Témoins (cookies) :</strong> sous réserve de votre consentement,
          analyse d'audience (Google Analytics 4, Microsoft Clarity), pixels marketing
          (Meta Pixel, Google Ads). Aucun cookie publicitaire n'est déposé sans votre
          consentement explicite.
        </li>
      </UL>

      <H2>3. Finalités de la collecte</H2>
      <UL>
        <li>Répondre à vos demandes de courtage hypothécaire.</li>
        <li>Préparer et structurer votre dossier de financement.</li>
        <li>Mesurer l'audience du site et améliorer nos services (consentement requis).</li>
        <li>Respecter nos obligations légales et règlementaires (AMF).</li>
      </UL>

      <H2>4. Communication à des tiers</H2>
      <P>Vos renseignements peuvent être communiqués à :</P>
      <UL>
        <li>
          <strong>Planiprêt</strong> (cabinet d'attache) — pour le traitement
          réglementaire de votre dossier hypothécaire.
        </li>
        <li>
          <strong>Institutions financières prêteuses</strong> — uniquement avec votre
          autorisation explicite et dans le strict cadre de votre demande hypothécaire.
        </li>
        <li>
          <strong>Sous-traitants techniques</strong> — Cloudflare (hébergement),
          GoHighLevel (CRM), Google (analyse audience), Microsoft Clarity (UX),
          Meta (publicité, sous consentement). Un contrat de protection des
          renseignements personnels encadre chacune de ces relations.
        </li>
      </UL>
      <P>
        <strong>Transferts hors Québec :</strong> certains sous-traitants (notamment
        Cloudflare, Meta, Microsoft, Google) traitent vos données aux États-Unis ou
        ailleurs. Nous évaluons l'équivalence de protection avant tout transfert,
        conformément à la Loi 25 art. 17.
      </P>

      <H2>5. Conservation</H2>
      <UL>
        <li>
          <strong>Données de contact (lead) :</strong> conservées 5 ans à compter du
          dernier contact, puis détruites de manière sécurisée.
        </li>
        <li>
          <strong>Journaux techniques (logs) :</strong> conservés 30 jours pour la
          sécurité et l'analyse.
        </li>
        <li>
          <strong>Témoins (cookies) :</strong> durée précisée dans la fenêtre de
          consentement, généralement 13 mois maximum.
        </li>
      </UL>

      <H2>6. Vos droits (Loi 25 art. 27 à 41)</H2>
      <P>Vous avez le droit de :</P>
      <UL>
        <li>Accéder à vos renseignements personnels et obtenir une copie.</li>
        <li>Faire rectifier des renseignements inexacts, incomplets ou équivoques.</li>
        <li>Demander la cessation de la diffusion de vos renseignements.</li>
        <li>Retirer votre consentement à tout moment.</li>
        <li>Demander la portabilité de vos renseignements (sous format technologique structuré).</li>
        <li>Demander la suppression de vos renseignements (lorsque la conservation n'est plus nécessaire).</li>
      </UL>
      <P>Pour exercer ces droits, contactez notre Responsable de la protection des renseignements personnels (DPO) — voir section 9.</P>

      <H2>7. Consentement</H2>
      <P>
        Votre consentement est obtenu explicitement, par étapes : (a) à la soumission
        d'un formulaire (case à cocher obligatoire et non pré-cochée), (b) au choix
        de vos préférences de témoins (cookies), via la fenêtre de consentement
        affichée à votre première visite. Vous pouvez retirer votre consentement à
        tout moment via les liens du pied de page ou en contactant notre DPO.
      </P>

      <H2>8. Sécurité des renseignements</H2>
      <P>Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables :</P>
      <UL>
        <li>Connexion HTTPS/TLS systématique sur l'ensemble du site.</li>
        <li>Hachage des adresses IP (SHA-256) avant stockage (minimisation des données).</li>
        <li>Sanitization des données entrantes côté serveur, validation stricte des champs.</li>
        <li>Limites de débit (rate limiting) et détection automatisée de bots (4 couches de défense).</li>
        <li>Accès limité aux personnes nécessaires, sous obligation de confidentialité.</li>
      </UL>

      <H2>9. Responsable de la protection des renseignements personnels (DPO) et recours</H2>
      <P>
        <strong>DPO :</strong> Andrew Buteau
        <br />
        <strong>Courriel :</strong>{" "}
        <a
          href={`mailto:${config.legal.dpoEmail || config.email}`}
          className="underline hover:text-[color:var(--color-navy)] break-all"
        >
          {config.legal.dpoEmail || config.email}
        </a>
        <br />
        <strong>Adresse postale :</strong> {config.legal.streetAddress}
      </P>
      <P>
        Si vous n'êtes pas satisfait de notre traitement de votre demande, vous pouvez
        déposer une plainte auprès de la <strong>Commission d'accès à l'information du
        Québec (CAI)</strong> :{" "}
        <a
          href="https://www.cai.gouv.qc.ca"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[color:var(--color-navy)]"
        >
          cai.gouv.qc.ca
        </a>
        .
      </P>
    </>
  );
}

function BodyEn() {
  return (
    <>
      <H2>1. Purpose</H2>
      <P>
        This privacy policy describes how Équipe Buteau, operating under {config.cabinet},
        collects, uses, communicates, and protects your personal information,
        in accordance with Quebec's Act respecting the protection of personal
        information in the private sector (RSQ c. P-39.1, "Bill 25").
      </P>

      <H2>2. Information collected</H2>
      <P>When you interact with our site, we may collect:</P>
      <UL>
        <li>
          <strong>Contact form:</strong> full name, email, phone (optional), message
          (optional), consent date/time, hashed IP address (SHA-256), browser user agent.
        </li>
        <li>
          <strong>Calculator usage:</strong> entered parameters (amount, rate, term)
          stay in your browser and are not transmitted to our servers.
        </li>
        <li>
          <strong>Cookies:</strong> subject to your consent, audience analytics
          (Google Analytics 4, Microsoft Clarity), marketing pixels (Meta Pixel,
          Google Ads). No advertising cookie is set without your explicit consent.
        </li>
      </UL>

      <H2>3. Purposes of collection</H2>
      <UL>
        <li>Respond to your mortgage brokerage inquiries.</li>
        <li>Prepare and structure your financing file.</li>
        <li>Measure site audience and improve our services (consent required).</li>
        <li>Comply with our legal and regulatory obligations (AMF).</li>
      </UL>

      <H2>4. Disclosure to third parties</H2>
      <P>Your information may be shared with:</P>
      <UL>
        <li>
          <strong>Planiprêt</strong> (brokerage firm) — for regulatory processing of
          your mortgage file.
        </li>
        <li>
          <strong>Lender financial institutions</strong> — only with your explicit
          authorization and strictly within your mortgage request.
        </li>
        <li>
          <strong>Technical subcontractors</strong> — Cloudflare (hosting), GoHighLevel
          (CRM), Google (audience analytics), Microsoft Clarity (UX), Meta (advertising,
          consent-based). A data protection agreement governs each relationship.
        </li>
      </UL>
      <P>
        <strong>Transfers outside Quebec:</strong> some subcontractors (Cloudflare,
        Meta, Microsoft, Google) process your data in the United States or elsewhere.
        We assess equivalent protection before any transfer, per Bill 25 §17.
      </P>

      <H2>5. Retention</H2>
      <UL>
        <li><strong>Lead data:</strong> retained 5 years from last contact, then securely destroyed.</li>
        <li><strong>Technical logs:</strong> retained 30 days for security and analysis.</li>
        <li><strong>Cookies:</strong> duration disclosed in the consent banner, max 13 months.</li>
      </UL>

      <H2>6. Your rights (Bill 25 §27 to §41)</H2>
      <P>You have the right to:</P>
      <UL>
        <li>Access your personal information and get a copy.</li>
        <li>Have inaccurate, incomplete or ambiguous information rectified.</li>
        <li>Request the cessation of dissemination of your information.</li>
        <li>Withdraw your consent at any time.</li>
        <li>Request portability of your information (in a structured technological format).</li>
        <li>Request deletion of your information (when retention is no longer necessary).</li>
      </UL>
      <P>To exercise these rights, contact our Data Protection Officer (DPO) — see section 9.</P>

      <H2>7. Consent</H2>
      <P>
        Your consent is obtained explicitly, in stages: (a) on form submission
        (mandatory non-pre-checked checkbox), (b) on choosing your cookie preferences,
        via the consent banner displayed on your first visit. You can withdraw your
        consent at any time via the footer links or by contacting our DPO.
      </P>

      <H2>8. Information security</H2>
      <P>We implement reasonable technical and organizational measures:</P>
      <UL>
        <li>Site-wide HTTPS/TLS connection.</li>
        <li>Hashing of IP addresses (SHA-256) before storage (data minimization).</li>
        <li>Server-side input sanitization and strict field validation.</li>
        <li>Rate limiting and automated bot detection (4-layer defense).</li>
        <li>Access restricted to necessary personnel under confidentiality obligations.</li>
      </UL>

      <H2>9. Data Protection Officer (DPO) and remedies</H2>
      <P>
        <strong>DPO:</strong> Andrew Buteau
        <br />
        <strong>Email:</strong>{" "}
        <a
          href={`mailto:${config.legal.dpoEmail || config.email}`}
          className="underline hover:text-[color:var(--color-navy)] break-all"
        >
          {config.legal.dpoEmail || config.email}
        </a>
        <br />
        <strong>Mailing address:</strong> {config.legal.streetAddress}
      </P>
      <P>
        If you are not satisfied with our handling of your request, you may file a
        complaint with the <strong>Commission d'accès à l'information du Québec (CAI)</strong>:{" "}
        <a
          href="https://www.cai.gouv.qc.ca"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[color:var(--color-navy)]"
        >
          cai.gouv.qc.ca
        </a>
        .
      </P>
    </>
  );
}
