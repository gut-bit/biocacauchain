import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { Globe, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ASSETS from "./assets";

const QuoteForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // Format message for WhatsApp
    const message = `Olá! Gostaria de solicitar um orçamento.\n\n*Nome:* ${data.name}\n*Empresa:* ${data.company}\n*Interesse:* ${data.product}\n*Mensagem:* ${data.message}`;

    const whatsappUrl = `https://wa.me/5593992356251?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');

    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-cocoa-950 font-bold rounded-full px-8 h-14 text-base shadow-lg shadow-gold-500/20 animate-pulse">
          {t('nav.quote')}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-cocoa-950 border-cocoa-800 overflow-y-auto sm:max-w-md w-full">
        <div className="flex flex-col gap-6 mt-8">
          <div>
            <h3 className="font-display text-2xl text-white mb-2">{t('form.title')}</h3>
            <p className="text-cocoa-300 text-sm">{t('form.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-cocoa-300">{t('form.name')}</label>
              <input
                required
                name="name"
                id="name"
                className="w-full px-4 py-3 rounded-lg bg-cocoa-900 border border-cocoa-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all text-white placeholder:text-cocoa-500"
                placeholder={t('form.name')}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="company" className="text-xs font-bold uppercase tracking-wider text-cocoa-300">{t('form.company')}</label>
              <input
                required
                name="company"
                id="company"
                className="w-full px-4 py-3 rounded-lg bg-cocoa-900 border border-cocoa-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all text-white placeholder:text-cocoa-500"
                placeholder={t('form.company')}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="product" className="text-xs font-bold uppercase tracking-wider text-cocoa-300">{t('form.product')}</label>
              <select
                name="product"
                id="product"
                className="w-full px-4 py-3 rounded-lg bg-cocoa-900 border border-cocoa-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all text-white placeholder:text-cocoa-500"
              >
                <option value="Néctar de Cacau">{t('form.prod.nectar')}</option>
                <option value="Amêndoas">{t('form.prod.beans')}</option>
                <option value="Nibs">{t('form.prod.nibs')}</option>
                <option value="Líquor">{t('form.prod.liquor')}</option>
                <option value="Manteiga">{t('form.prod.butter')}</option>
                <option value="Pó">{t('form.prod.powder')}</option>
                <option value="Outro">{t('form.prod.other')}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-cocoa-300">{t('form.message')}</label>
              <textarea
                name="message"
                id="message"
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-cocoa-900 border border-cocoa-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all text-white placeholder:text-cocoa-500 resize-none"
                placeholder={t('form.message')}
              />
            </div>

            <Button type="submit" size="lg" className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full font-bold h-12 text-base">
              {t('form.submit')}
            </Button>
            <p className="text-center text-xs text-cocoa-400 mt-2">
              {t('form.disclaimer')}
            </p>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Impact = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-leaf-950 text-white relative overflow-hidden" id="impacto">
      {/* Clean High-Res Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={ASSETS.dense_trees}
          className="w-full h-full object-cover opacity-20 grayscale-[20%] contrast-125"
          alt="Floresta de Cacau Background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-leaf-950/95 via-leaf-950/80 to-leaf-950/60" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Visual Side */}
          <div className="w-full lg:w-1/2 relative group">
            {/* Floating decorative element */}
            <div className="absolute -top-12 -left-12 w-40 z-20 animate-pulse delay-1000 hidden md:block">
              <img
                src={ASSETS.macaw}
                alt="Arara"
                className="rounded-full border-4 border-leaf-900/50 shadow-2xl object-cover aspect-square"
              />
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-leaf-700/30">
              <img
                src={ASSETS.infra_aerial_1}
                alt="Plantação e Fábrica na Floresta"
                className="w-full h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            </div>

            <div className="absolute -bottom-8 -right-8 bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 max-w-xs z-30 hidden md:block">
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(i => <Award key={i} className="w-4 h-4 text-gold-400 fill-gold-400" />)}
              </div>
              <p className="font-display text-xl leading-tight text-white mb-2">{t('impact.quote')}</p>
              <p className="text-xs text-leaf-200 font-bold uppercase tracking-wider">- Helton Gutzeit</p>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-leaf-900/80 border border-leaf-700 text-leaf-300 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
              <Globe className="w-3 h-3 text-leaf-400" />
              <span>{t('impact.badge')}</span>
            </div>

            <h2 className="font-display text-5xl md:text-6xl mb-8 leading-tight text-white">
              {t('impact.title.1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600 italic">
                {t('impact.title.2')}
              </span>
            </h2>

            <p className="text-leaf-100/90 text-lg leading-relaxed mb-10 font-light border-l-2 border-leaf-700 pl-6">
              {t('impact.desc')}
            </p>

            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="p-4 rounded-xl bg-leaf-900/40 border border-leaf-800 hover:border-leaf-600 transition-colors">
                <div className="text-4xl font-display text-white mb-1 flex items-baseline gap-1">
                  +300<span className="text-xl text-leaf-400">%</span>
                </div>
                <div className="text-xs text-leaf-300 uppercase tracking-wider font-medium">{t('impact.stat1')}</div>
              </div>
              <div className="p-4 rounded-xl bg-leaf-900/40 border border-leaf-800 hover:border-leaf-600 transition-colors">
                <div className="text-4xl font-display text-white mb-1">100%</div>
                <div className="text-xs text-leaf-300 uppercase tracking-wider font-medium">{t('impact.stat2')}</div>
              </div>
            </div>

            <div>
              <QuoteForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
