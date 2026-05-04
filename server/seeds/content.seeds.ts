/**
 * content.seeds.ts — Default content block values
 *
 * All seeds are idempotent: INSERT ... ON CONFLICT DO NOTHING
 * Run on every startup (server/index.ts) to ensure blocks exist.
 */

export interface ContentBlockSeed {
  key: string;
  section: string;
  pt: string;
  en: string;
  type?: string;
}

export const contentSeeds: ContentBlockSeed[] = [
  // ── Hero ─────────────────────────────────────────────────────────────────────
  {
    key: "hero.badge",
    section: "hero",
    pt: "Cacau de Origem Brasileira Certificado",
    en: "Certified Brazilian Origin Cacao",
  },
  {
    key: "hero.title.1",
    section: "hero",
    pt: "Cacau Premium",
    en: "Premium Cacao",
  },
  {
    key: "hero.title.2",
    section: "hero",
    pt: "da Amazônia",
    en: "from the Amazon",
  },
  {
    key: "hero.subtitle",
    section: "hero",
    pt: "Da fazenda à fábrica de chocolate — rastreabilidade total, qualidade consistente e preços transparentes para compradores B2B em todo o mundo.",
    en: "From farm to chocolate factory — full traceability, consistent quality and transparent pricing for B2B buyers worldwide.",
  },
  {
    key: "hero.cta.products",
    section: "hero",
    pt: "Ver Produtos B2B",
    en: "View B2B Products",
  },
  {
    key: "hero.cta.factory",
    section: "hero",
    pt: "Nossa Fábrica",
    en: "Our Factory",
  },

  // ── About / Padrão Qualitheo ──────────────────────────────────────────────────
  {
    key: "about.label",
    section: "about",
    pt: "O Padrão Qualitheo",
    en: "The Qualitheo Standard",
  },
  {
    key: "about.title",
    section: "about",
    pt: "Ciência e Natureza em Sintonia",
    en: "Science and Nature in Harmony",
  },
  {
    key: "about.body",
    section: "about",
    pt: "Não vendemos apenas cacau; vendemos consistência. Nossa estrutura de originação e compra aplica protocolos rigorosos de pós-colheita, monitorados digitalmente.",
    en: "We don't just sell cacao; we sell consistency. Our sourcing and procurement infrastructure applies rigorous post-harvest protocols, monitored digitally.",
  },
  {
    key: "about.bullets",
    section: "about",
    type: "list_json",
    pt: JSON.stringify([
      "Rastreabilidade total via QR Code por lote",
      "Monitoramento biométrico da fermentação",
      "Secagem híbrida em estufas solares tech",
      "Análise sensorial em laboratório próprio",
    ]),
    en: JSON.stringify([
      "Full lot-level traceability via QR Code",
      "Biometric monitoring of fermentation",
      "Hybrid drying in tech solar greenhouses",
      "Sensory analysis in our own laboratory",
    ]),
  },
  {
    key: "about.traceability.badge",
    section: "about",
    pt: "Traceability Tech",
    en: "Traceability Tech",
  },
  {
    key: "about.traceability.title",
    section: "about",
    pt: "Rastreabilidade Total",
    en: "Full Traceability",
  },
  {
    key: "about.traceability.desc",
    section: "about",
    pt: "Cada lote conta uma história. Do clone 24 ao produto final.",
    en: "Every lot tells a story. From clone 24 to the final product.",
  },
  {
    key: "about.btn.protocols",
    section: "about",
    pt: "Protocolos Técnicos",
    en: "Technical Protocols",
  },
  {
    key: "about.btn.certs",
    section: "about",
    pt: "Ver Certificações",
    en: "See Certifications",
  },

  // ── Contact / Footer ──────────────────────────────────────────────────────────
  {
    key: "contact.name",
    section: "contact",
    pt: "Helton Gutzeit",
    en: "Helton Gutzeit",
  },
  {
    key: "contact.role",
    section: "contact",
    pt: "CEO & Founder",
    en: "CEO & Founder",
  },
  {
    key: "contact.email1",
    section: "contact",
    type: "email",
    pt: "gut@qualitheo.com",
    en: "gut@qualitheo.com",
  },
  {
    key: "contact.email2",
    section: "contact",
    type: "email",
    pt: "Qualitheo@gmail.com",
    en: "Qualitheo@gmail.com",
  },
  {
    key: "contact.whatsapp",
    section: "contact",
    type: "url",
    pt: "https://wa.me/5593992356251",
    en: "https://wa.me/5593992356251",
  },
  {
    key: "contact.whatsapp.display",
    section: "contact",
    pt: "+55 93 99235-6251",
    en: "+55 93 99235-6251",
  },
  {
    key: "contact.instagram",
    section: "contact",
    type: "url",
    pt: "https://instagram.com/qualitheo",
    en: "https://instagram.com/qualitheo",
  },
  {
    key: "contact.website",
    section: "contact",
    type: "url",
    pt: "https://qualitheo.com",
    en: "https://qualitheo.com",
  },

  // ── Site global ────────────────────────────────────────────────────────────────
  {
    key: "site.company",
    section: "site",
    pt: "Qualitheo Agroindustries",
    en: "Qualitheo Agroindustries",
  },
  {
    key: "site.address",
    section: "site",
    pt: "Transamazônica, Pará — Brasil",
    en: "Transamazonica Highway, Pará — Brazil",
  },

  // ── Partners ────────────────────────────────────────────────────────────────────
  {
    key: "partners.list",
    section: "partners",
    type: "list_json",
    pt: JSON.stringify([
      { name: "Bonnat Chocolatier", logoKey: "partner_bonnat", siteUrl: "https://www.bonnat-chocolatier.com", width: "w-32" },
      { name: "Casa Lasevicius", logoKey: "partner_lasevicius", siteUrl: "#", width: "w-28" },
      { name: "Bean to Bar Brasil", logoKey: "partner_beantobar", siteUrl: "#", width: "w-36" },
      { name: "MAD", logoKey: "partner_mad", siteUrl: "#", width: "w-28" },
      { name: "BTM", logoKey: "partner_btm", siteUrl: "#", width: "w-24" },
    ]),
    en: JSON.stringify([
      { name: "Bonnat Chocolatier", logoKey: "partner_bonnat", siteUrl: "https://www.bonnat-chocolatier.com", width: "w-32" },
      { name: "Casa Lasevicius", logoKey: "partner_lasevicius", siteUrl: "#", width: "w-28" },
      { name: "Bean to Bar Brasil", logoKey: "partner_beantobar", siteUrl: "#", width: "w-36" },
      { name: "MAD", logoKey: "partner_mad", siteUrl: "#", width: "w-28" },
      { name: "BTM", logoKey: "partner_btm", siteUrl: "#", width: "w-24" },
    ]),
  },
];
