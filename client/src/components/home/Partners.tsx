import { useLanguage } from "@/lib/i18n";
import { useContent } from "@/providers/ContentProvider";
import ASSETS from "./assets";

// Map partner logoKey strings to actual imported assets
const LOGO_MAP: Record<string, string> = {
  partner_bonnat: ASSETS.partner_bonnat,
  partner_lasevicius: ASSETS.partner_lasevicius,
  partner_beantobar: ASSETS.partner_beantobar,
  partner_mad: ASSETS.partner_mad,
  partner_btm: ASSETS.partner_btm,
};

interface PartnerEntry {
  name: string;
  logoKey?: string;
  logoUrl?: string;
  siteUrl?: string;
  width?: string;
}

const Partners = () => {
  const { t } = useLanguage();
  const { cb, raw } = useContent();

  // Parse partners list from content block; fall back to hardcoded defaults
  let partners: PartnerEntry[] = [];
  try {
    const block = raw["partners.list"];
    const locale = (raw["partners.list"]?.pt ?? "[]");
    partners = JSON.parse(locale);
  } catch {
    partners = [
      { name: "Bonnat Chocolatier", logoKey: "partner_bonnat", siteUrl: "#", width: "w-32" },
      { name: "Casa Lasevicius", logoKey: "partner_lasevicius", siteUrl: "#", width: "w-28" },
      { name: "Bean to Bar Brasil", logoKey: "partner_beantobar", siteUrl: "#", width: "w-36" },
      { name: "MAD", logoKey: "partner_mad", siteUrl: "#", width: "w-28" },
      { name: "BTM", logoKey: "partner_btm", siteUrl: "#", width: "w-24" },
    ];
  }

  return (
    <section className="py-20 bg-cocoa-900 border-t border-cocoa-800 relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <img src={ASSETS.tech_wireframe} alt="Decorative Pattern" className="w-full h-full object-cover" />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <p className="text-sm font-bold uppercase tracking-widest text-gold-500/80 mb-12">
          {t('partners.title')}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
          {partners.map((partner, idx) => {
            const logoSrc = partner.logoKey
              ? LOGO_MAP[partner.logoKey]
              : partner.logoUrl ?? "";
            const widthClass = partner.width ?? "w-28";
            return (
              <a
                key={idx}
                href={partner.siteUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                title={partner.name}
                className={`group relative ${widthClass} aspect-[3/2] flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-50 hover:opacity-100 hover:scale-110`}
              >
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-500"
                  />
                ) : (
                  <span className="text-xs font-bold text-cocoa-400 uppercase tracking-widest">
                    {partner.name}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Partners;
