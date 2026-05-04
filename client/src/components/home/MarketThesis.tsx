import { Scale, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import ASSETS from "./assets";

const MarketThesis = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-cocoa-950 relative z-20 overflow-hidden">
      {/* Subtle grain texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%222.65%22%20numOctaves%3D%224%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E')]" />
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          <div className="md:w-1/2">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-widest">
              <Scale className="w-3 h-3" />
              <span>{t('market.label')}</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-6 leading-tight">
              {t('market.title')}
            </h2>
            <p className="text-cocoa-300 text-lg leading-relaxed mb-8">
              {t('market.desc')}
            </p>
            <div className="p-6 bg-cocoa-900/80 rounded-2xl border border-cocoa-800 backdrop-blur-sm">
              <h4 className="font-display text-xl text-gold-400 mb-2">{t('market.diff.title')}</h4>
              <p className="text-cocoa-300">
                {t('market.diff.desc')}
              </p>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gold-500 rounded-full -z-10 opacity-10 blur-2xl"></div>
              <img src={ASSETS.cocoa_hands} alt="Negociação Justa" loading="lazy" decoding="async" className="rounded-2xl shadow-2xl w-full object-cover h-[500px] brightness-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa-950/60 via-transparent to-transparent rounded-2xl pointer-events-none" />

              <div className="absolute bottom-8 -left-8 bg-cocoa-900/90 backdrop-blur-xl p-6 rounded-xl shadow-2xl max-w-xs border border-cocoa-700">
                <h4 className="font-bold text-white mb-1">{t('market.policy.title')}</h4>
                <p className="text-sm text-cocoa-400 mb-3">{t('market.policy.subtitle')}</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-xs font-medium text-cocoa-200">
                    <CheckCircle2 className="w-3 h-3 text-gold-500" />
                    {t('market.policy.item1')}
                  </li>
                  <li className="flex items-center gap-2 text-xs font-medium text-cocoa-200">
                    <CheckCircle2 className="w-3 h-3 text-gold-500" />
                    {t('market.policy.item2')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketThesis;
