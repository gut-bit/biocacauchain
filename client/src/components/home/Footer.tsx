import { Instagram, Globe, ArrowRight, Award } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useContent } from "@/providers/ContentProvider";
import ASSETS from "./assets";

const Footer = () => {
  const { t } = useLanguage();
  const { cb } = useContent();

  const navLinks = [
    { key: 'nav.origin', label: 'Origem' },
    { key: 'nav.process', label: 'Processo Industrial' },
    { key: 'nav.products', label: 'Produtos' },
    { key: 'nav.sustainability', label: 'Sustentabilidade' },
    { key: 'nav.blog', label: 'Blog' }
  ];

  const email1 = cb("contact.email1", "gut@qualitheo.com");
  const email2 = cb("contact.email2", "Qualitheo@gmail.com");
  const whatsappUrl = cb("contact.whatsapp", "https://wa.me/5593992356251");
  const whatsappDisplay = cb("contact.whatsapp.display", "+55 93 99235-6251");
  const instagramUrl = cb("contact.instagram", "#");
  const websiteUrl = cb("contact.website", "#");
  const contactName = cb("contact.name", "Helton Gutzeit");
  const contactRole = cb("contact.role", "CEO & Founder");

  return (
    <footer className="bg-cocoa-950 text-cocoa-200 py-20 border-t border-cocoa-900 relative overflow-hidden" id="contato">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-soft-light">
        <img src={ASSETS.infra_aerial_2} alt="Aerial Background" className="w-full h-full object-cover blur-3xl grayscale" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">

          {/* Brand Column */}
          <div className="col-span-1 md:col-span-5 flex flex-col items-start">
            <div className="bg-cocoa-900/50 backdrop-blur-sm p-6 rounded-2xl mb-8 shadow-2xl shadow-black/50 border border-cocoa-800">
              <img src={ASSETS.logo_vertical} alt="Qualitheo Logo" className="h-24 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-cocoa-300/80 leading-relaxed text-lg font-light max-w-md mb-8">
              {t('footer.desc')}
            </p>
            <div className="flex gap-4">
              <a href={instagramUrl} aria-label="Instagram" title="Instagram" className="w-10 h-10 rounded-full bg-cocoa-900 border border-cocoa-800 flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-cocoa-950 transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={websiteUrl} aria-label="Website" title="Website" className="w-10 h-10 rounded-full bg-cocoa-900 border border-cocoa-800 flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-cocoa-950 transition-all duration-300">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="col-span-1 md:col-span-3">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-gold-500"></span>
              {t('footer.nav')}
            </h4>
            <ul className="space-y-4">
              {navLinks.map((item) => (
                <li key={item.key}>
                  <a href="#" className="text-cocoa-400 hover:text-gold-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-gold-500" />
                    {t(item.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="col-span-1 md:col-span-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-gold-500"></span>
              {t('footer.contact')}
            </h4>
            <div className="bg-cocoa-900/50 backdrop-blur-sm p-6 rounded-2xl border border-cocoa-800 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-medium">{contactName}</p>
                  <p className="text-xs text-gold-500 uppercase tracking-wider font-bold">{contactRole}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-cocoa-300">
                <a href={`mailto:${email1}`} className="flex items-center gap-3 hover:text-white transition-colors p-2 hover:bg-cocoa-800/50 rounded-lg -ml-2">
                  <div className="w-1 h-1 rounded-full bg-gold-500"></div>
                  {email1}
                </a>
                <a href={`mailto:${email2}`} className="flex items-center gap-3 hover:text-white transition-colors p-2 hover:bg-cocoa-800/50 rounded-lg -ml-2">
                  <div className="w-1 h-1 rounded-full bg-gold-500"></div>
                  {email2}
                </a>
                <a href={whatsappUrl} className="flex items-center gap-3 hover:text-white transition-colors p-2 hover:bg-cocoa-800/50 rounded-lg -ml-2">
                  <div className="w-1 h-1 rounded-full bg-gold-500"></div>
                  {whatsappDisplay}
                </a>
              </div>

              <div className="pt-4 border-t border-cocoa-800/50 flex items-center gap-4">
                <div className="bg-white p-1 rounded shadow-sm">
                  <img src={ASSETS.qr_code} alt="QR" className="w-12 h-12 object-contain" />
                </div>
                <p className="text-xs text-cocoa-500 leading-tight">{t('footer.scan')}</p>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-cocoa-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-cocoa-600 font-medium uppercase tracking-wider">
          <p>{t('footer.rights')}</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gold-500 transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-gold-500 transition-colors">{t('footer.terms')}</a>
            <span className="text-cocoa-700">|</span>
            <p>{t('footer.location')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
