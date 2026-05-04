import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, ZoomIn, Truck, Spline, Beaker, Sun, QrCode, Factory } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import ASSETS from "./assets";

const ProcessDiagram = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-cocoa-950 overflow-x-hidden border-t border-cocoa-900" id="diagrama-processo">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-4 block">{t('process.label')}</span>
          <h2 className="font-display text-3xl md:text-4xl text-white mb-6">{t('process.title')}</h2>
          <p className="text-cocoa-300 max-w-2xl mx-auto text-lg">
            {t('process.desc')}
          </p>
        </div>

        {/* Infographic Overview */}
        <div className="mb-24 bg-cocoa-900/70 backdrop-blur-sm p-4 md:p-8 rounded-2xl border border-cocoa-800">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/3">
              <h3 className="font-display text-2xl text-white mb-4">{t('process.map.title')}</h3>
              <p className="text-cocoa-300 mb-6">
                {t('process.map.desc')}
              </p>
              <div className="flex gap-2 text-sm text-cocoa-300">
                <CheckCircle2 className="w-4 h-4 text-gold-500" />
                <span>{t('process.check1')}</span>
              </div>
              <div className="flex gap-2 text-sm text-cocoa-300 mt-2">
                <CheckCircle2 className="w-4 h-4 text-gold-500" />
                <span>{t('process.check2')}</span>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative group cursor-zoom-in">
                    <img
                      src={ASSETS.infographic_process}
                      alt="Infográfico do Processo Qualitheo"
                      className="w-full h-auto rounded-lg shadow-md border border-slate-100 transition-all duration-300 group-hover:brightness-95"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10 rounded-lg">
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-cocoa-900 font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <ZoomIn className="w-4 h-4" />
                        <span>{t('process.zoom')}</span>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 bg-transparent border-none shadow-none flex items-center justify-center">
                  <DialogTitle className="sr-only">Diagrama do Processo Qualitheo</DialogTitle>
                  <div className="relative w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                    <img
                      src={ASSETS.infographic_process}
                      alt="Infográfico do Processo Qualitheo Detalhado"
                      className="max-w-full max-h-full object-contain rounded-lg shadow-2xl bg-white"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Detailed Step-by-Step with Real Photos */}
        <div className="space-y-24">
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

            {/* Step 1 */}
            <div className="group">
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6 shadow-xl border border-cocoa-800">
                <img src={ASSETS.infra_warehouse_wide} alt="Recepção" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-gold-500 text-cocoa-950 w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg shadow-lg shadow-gold-500/30">1</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <Truck className="w-8 h-8 mb-3 text-gold-400" />
                  <h3 className="font-display text-2xl">{t('process.step1')}</h3>
                </div>
              </div>
              <p className="text-cocoa-300 leading-relaxed">
                {t('process.desc1')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="group">
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6 shadow-xl border border-cocoa-800">
                <img src={ASSETS.infra_interior_1} alt="Segregação" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-gold-500 text-cocoa-950 w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg shadow-lg shadow-gold-500/30">2</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <Spline className="w-8 h-8 mb-3 text-gold-400" />
                  <h3 className="font-display text-2xl">{t('process.step2')}</h3>
                </div>
              </div>
              <p className="text-cocoa-300 leading-relaxed">
                {t('process.desc2')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="group">
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6 shadow-xl border border-cocoa-800">
                <img src={ASSETS.infra_fermentation} alt="Fermentação" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-gold-500 text-cocoa-950 w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg shadow-lg shadow-gold-500/30">3</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <Beaker className="w-8 h-8 mb-3 text-gold-400" />
                  <h3 className="font-display text-2xl">{t('process.step3')}</h3>
                </div>
              </div>
              <p className="text-cocoa-300 leading-relaxed">
                {t('process.desc3')}
              </p>
            </div>

            {/* Step 4 */}
            <div className="group">
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6 shadow-xl border border-cocoa-800">
                <img src={ASSETS.infra_drying_beds} alt="Secagem" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-gold-500 text-cocoa-950 w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg shadow-lg shadow-gold-500/30">4</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <Sun className="w-8 h-8 mb-3 text-gold-400" />
                  <h3 className="font-display text-2xl">{t('process.step4')}</h3>
                </div>
              </div>
              <p className="text-cocoa-300 leading-relaxed">
                {t('process.desc4')}
              </p>
            </div>

            {/* Step 5 */}
            <div className="group">
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6 shadow-xl border border-cocoa-800">
                <img src={ASSETS.cut_test} alt="Qualidade" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-gold-500 text-cocoa-950 w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg shadow-lg shadow-gold-500/30">5</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <QrCode className="w-8 h-8 mb-3 text-gold-400" />
                  <h3 className="font-display text-2xl">{t('process.step5')}</h3>
                </div>
              </div>
              <p className="text-cocoa-300 leading-relaxed">
                {t('process.desc5')}
              </p>
            </div>

            {/* Step 6 */}
            <div className="group">
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6 shadow-xl border border-cocoa-800">
                <img src={ASSETS.infra_interior_2} alt="Indústria" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-gold-500 text-cocoa-950 w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg shadow-lg shadow-gold-500/30">6</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <Factory className="w-8 h-8 mb-3 text-gold-400" />
                  <h3 className="font-display text-2xl">{t('process.step6')}</h3>
                </div>
              </div>
              <p className="text-cocoa-300 leading-relaxed">
                {t('process.desc6')}
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ProcessDiagram;
