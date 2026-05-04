import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import ASSETS from "./assets";

const InfrastructureShowcase = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { t } = useLanguage();

  return (
    <section className="relative py-24 bg-cocoa-900 -mt-10 rounded-t-[3rem] z-30 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-12 mb-12">
          <div className="max-w-3xl">
            <h3 className="text-gold-400 font-bold uppercase tracking-widest text-sm mb-4">{t('infra.label')}</h3>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-6">{t('infra.title')}</h2>
            <p className="text-cocoa-200 leading-relaxed text-lg">
              {t('infra.desc')}
            </p>
          </div>

          {/* Bento Grid Layout for Collage */}
          <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
            {/* Large Main Image - Factory Aerial */}
            <div className="md:col-span-4 md:row-span-2 relative group overflow-hidden rounded-2xl shadow-2xl border border-white/10 cursor-pointer" onClick={() => setSelectedImage(ASSETS.dense_trees)}>
              <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-medium text-white">
                {t('features.origin.title')}
              </div>
              <img
                src={ASSETS.dense_trees}
                alt="Gutzeit Farms"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Top Right - Harvesting */}
            <div className="md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-2xl shadow-xl border border-white/10 cursor-pointer" onClick={() => setSelectedImage(ASSETS.harvest_pole)}>
              <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-medium text-white">
                Colheita
              </div>
              <img
                src={ASSETS.harvest_pole}
                alt="Colheita"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Bottom Right - Farm Worker/Team */}
            <div className="md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-2xl shadow-xl border border-white/10 cursor-pointer" onClick={() => setSelectedImage(ASSETS.macaw)}>
              <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-medium text-white">
                Fauna
              </div>
              <img
                src={ASSETS.macaw}
                alt="Fauna"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Secondary Row of Smaller Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-40 rounded-xl overflow-hidden border border-white/10 group cursor-pointer" onClick={() => setSelectedImage(ASSETS.infra_fermentation)}>
              <img src={ASSETS.infra_fermentation} alt="Fermentação" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="h-40 rounded-xl overflow-hidden border border-white/10 group cursor-pointer" onClick={() => setSelectedImage(ASSETS.infra_interior_1)}>
              <img src={ASSETS.infra_interior_1} alt="Maquinário" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="h-40 rounded-xl overflow-hidden border border-white/10 group cursor-pointer" onClick={() => setSelectedImage(ASSETS.infra_aerial_4)}>
              <img src={ASSETS.infra_aerial_4} alt="Vista Alta" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="h-40 rounded-xl overflow-hidden border border-white/10 group cursor-pointer" onClick={() => setSelectedImage(ASSETS.infra_cold_room)}>
              <img src={ASSETS.infra_cold_room} alt="Câmara Fria" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-12" onClick={() => setSelectedImage(null)}>
          <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
            <img src={selectedImage} alt="Full screen view" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
            <button className="absolute top-4 right-4 text-white/80 hover:text-white text-sm uppercase tracking-widest">Fechar [ESC]</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default InfrastructureShowcase;
