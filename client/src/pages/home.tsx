import { useState, useEffect, useRef } from "react";
import PrecosWidget from "@/components/PrecosWidget";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Leaf, Factory, Globe, CheckCircle2, Menu, Snowflake, Layers, Box, Droplet, Scale, Award, Instagram, Truck, Thermometer, Clock, Spline, Beaker, Smartphone, Sun, QrCode, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/lib/i18n";

// Asset Imports
import hero_bg from "@assets/hero_bg.jpg";
import cocoa_pod from "@assets/cocoa_pod.jpg";
import certificate from "@assets/certificate.jpg";
import logo_vertical from "@assets/logo_vertical.png";
import logo_horizontal from "@assets/logo_horizontal.png";
import cocoa_hands from "@assets/cocoa_hands.jpg";
import cut_test from "@assets/cut_test.jpg";
import factory_ext from "@assets/factory_ext.jpg";
import pod_qr from "@assets/pod_qr.jpg";
import helton_teaching from "@assets/helton_teaching.jpg";
import logo_shirt from "@assets/logo_shirt.jpg";
import helton_profile from "@assets/helton_profile.jpg";
import field_team from "@assets/field_team.jpg";
import open_pod_smile from "@assets/open_pod_smile.jpg";
import worker_portrait from "@assets/worker_portrait.jpg";
import macaw from "@assets/macaw.jpg";
import dense_trees from "@assets/dense_trees.jpg";
import harvest_pole from "@assets/harvest_pole.jpg";
import qr_code from "@assets/qr_code.jpg";
import warehouse from "@assets/warehouse.png";
import logo_qualitheo from "@assets/logo_qualitheo.jpg";
import farm_worker from "@assets/farm_worker.jpg";

import product_nectar_branded from "@assets/product_nectar_branded.png";
import product_beans_branded from "@assets/product_beans_branded.png";
import product_nibs_branded from "@assets/product_nibs_branded.png";
import product_liquor_branded from "@assets/product_liquor_branded.png";
import product_butter_branded from "@assets/product_butter_branded.png";
import product_powder_branded from "@assets/product_powder_branded.png";

import art_floating_beans from "@assets/art_floating_beans.png";
import art_nibs_pile from "@assets/art_nibs_pile.png";
import art_pod_isolated from "@assets/art_pod_isolated.png";
import art_tech_wireframe from "@assets/art_tech_wireframe.png";

import partner_beantobar from "@assets/partner_beantobar.png";
import partner_bonnat from "@assets/partner_bonnat.png";
import partner_ibc from "@assets/partner_ibc.png";
import partner_mad from "@assets/partner_mad.webp";
import partner_btm from "@assets/partner_btm.webp";
import partner_lasevicius from "@assets/partner_lasevicius.avif";

import infra_hero from "@assets/infra_hero.jpg";
import infra_aerial_1 from "@assets/infra_aerial_1.jpg";
import infra_aerial_2 from "@assets/infra_aerial_2.jpg";
import infra_drying_beds from "@assets/infra_drying_beds.jpg";
import infra_aerial_3 from "@assets/infra_aerial_3.jpg";
import infra_aerial_4 from "@assets/infra_aerial_4.jpg";
import infra_interior_1 from "@assets/infra_interior_1.jpg";
import infra_cold_room from "@assets/infra_cold_room.jpg";
import infra_interior_2 from "@assets/infra_interior_2.jpg";
import infra_warehouse_wide from "@assets/infra_warehouse_wide.jpg";
import infra_fermentation from "@assets/infra_fermentation.jpg";
import hero_video from "@assets/hero_video.mp4";
import infographic_process from "@assets/infographic_process.png";

const ASSETS = {
  hero_bg, // Full-quality hero background
  hero_video,
  infographic_process,
  infra_interior_branded: infra_hero, // removed heavy asset, keep key for safety
  infra_hero,
  infra_aerial_1,
  infra_aerial_2,
  infra_drying_beds,
  infra_aerial_3,
  infra_aerial_4,
  infra_interior_1,
  infra_cold_room,
  infra_interior_2,
  infra_warehouse_wide,
  infra_fermentation,
  cocoa_pod,
  warehouse,
  logo_qualitheo,
  logo_vertical,
  logo_horizontal,
  farm_worker,
  certificate,
  cocoa_hands,
  cut_test,
  factory_ext,
  pod_qr,
  helton_teaching,
  logo_shirt,
  helton_profile,
  field_team,
  open_pod_smile,
  worker_portrait,
  macaw,
  dense_trees,
  harvest_pole,
  qr_code,
  // Products (Updated)
  nectar: product_nectar_branded,
  beans_container: product_beans_branded,
  nibs_bags: product_nibs_branded,
  liquor_blocks: product_liquor_branded,
  butter_blocks: product_butter_branded,
  powder_bags: product_powder_branded,

  floating_beans: art_floating_beans,
  nibs_pile: art_nibs_pile,
  pod_isolated: art_pod_isolated,
  tech_wireframe: art_tech_wireframe,

  // Partners
  partner_beantobar,
  partner_bonnat,
  partner_ibc,
  partner_mad,
  partner_btm,
  partner_lasevicius,
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close marketplace dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const close = () => setDropdownOpen(false);
    document.addEventListener("click", close, { capture: true });
    return () => document.removeEventListener("click", close, { capture: true });
  }, [dropdownOpen]);

  const navLinks = [
    { key: 'nav.origin', href: '#origem' },
    { key: 'nav.process', href: '#processo' },
    { key: 'nav.products', href: '#produtos' },
    { key: 'nav.impact', href: '#impacto' },
    { key: 'nav.contact', href: '#contato' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? "bg-cocoa-50/90 backdrop-blur-md py-4 border-b border-cocoa-200 shadow-sm"
        : "bg-transparent py-6 text-white"
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-12 w-auto flex items-center justify-center">
            {/* Logo changes color based on scroll state using CSS filters for white version */}
            <img
              src={ASSETS.logo_horizontal}
              alt="Qualitheo Logo"
              className={`h-full w-auto object-contain transition-all duration-500 ${isScrolled ? '' : 'brightness-0 invert'}`}
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={`text-sm font-medium uppercase tracking-widest hover:opacity-70 transition-opacity ${isScrolled ? "text-cocoa-900" : "text-white/90"
                }`}
            >
              {t(item.key)}
            </a>
          ))}

          {/* Marketplace dropdown */}
          <div className="relative group">
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className={`flex items-center gap-1 text-sm font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${isScrolled
                ? "border-gold-500 text-gold-700 hover:bg-gold-50"
                : "border-gold-400 text-gold-300 hover:bg-white/10"
                }`}>
              Marketplace {dropdownOpen ? '↑' : '↓'}
            </button>
            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-60 rounded-2xl border border-white/10 shadow-2xl p-2 z-50" style={{background: '#1c0d04'}}>
              {/* Originação — highlighted */}
              <a href="/originacao"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm bg-green-800/60 text-green-300 hover:bg-green-700/60 hover:text-white transition-all font-semibold mb-1">
                <span>🌿</span> Originação — Comprar Cacau
              </a>
              <a href="/portal-produtor"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-cocoa-200 hover:bg-white/10 hover:text-white transition-all">
                <span>🌾</span> Portal do Produtor
              </a>
              <div className="border-t border-white/10 my-1" />
              <a href="/catalogo-b2b"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-cocoa-200 hover:bg-white/10 hover:text-white transition-all">
                <span>🏭</span> Ingredientes B2B
              </a>
              <a href="/loja"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-cocoa-200 hover:bg-white/10 hover:text-white transition-all">
                <span>🍃</span> Loja Cerimonial
              </a>
            </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/20">
            <button
              onClick={() => setLanguage('en')}
              className={`flex items-center gap-2 px-2 py-1 rounded transition-all ${language === 'en' ? 'bg-white/20 ring-1 ring-white/50' : 'opacity-60 hover:opacity-100'}`}
              title="English"
            >
              <img src="https://flagcdn.com/us.svg" alt="USA Flag" className="w-5 h-auto rounded shadow-sm object-cover" />
              <span className={`text-xs font-bold ${isScrolled ? "text-cocoa-900" : "text-white"}`}>EN</span>
            </button>
            <button
              onClick={() => setLanguage('pt')}
              className={`flex items-center gap-2 px-2 py-1 rounded transition-all ${language === 'pt' ? 'bg-white/20 ring-1 ring-white/50' : 'opacity-60 hover:opacity-100'}`}
              title="Português"
            >
              <img src="https://flagcdn.com/br.svg" alt="Brazil Flag" className="w-5 h-auto rounded shadow-sm object-cover" />
              <span className={`text-xs font-bold ${isScrolled ? "text-cocoa-900" : "text-white"}`}>PTBT</span>
            </button>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-4">
          {/* Mobile Language Switcher */}
          <div className="flex items-center gap-2">
            <button onClick={() => setLanguage('en')} className={`w-6 h-4 rounded overflow-hidden shadow-sm ${language === 'en' ? 'ring-2 ring-gold-500' : 'opacity-70'}`}>
              <img src="https://flagcdn.com/us.svg" className="w-full h-full object-cover" />
            </button>
            <button onClick={() => setLanguage('pt')} className={`w-6 h-4 rounded overflow-hidden shadow-sm ${language === 'pt' ? 'ring-2 ring-gold-500' : 'opacity-70'}`}>
              <img src="https://flagcdn.com/br.svg" className="w-full h-full object-cover" />
            </button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={isScrolled ? "text-cocoa-900" : "text-white"}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-cocoa-50 border-cocoa-200">
              <div className="flex flex-col gap-6 mt-12">
                {navLinks.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    className="text-2xl font-display font-medium text-cocoa-900"
                  >
                    {t(item.key)}
                  </a>
                ))}
                <div className="border-t border-cocoa-200 pt-4 mt-2">
                  <p className="text-xs uppercase tracking-widest text-cocoa-500 mb-3">Originação</p>
                  <a href="/originacao"
                    className="flex items-center gap-2 text-xl font-display font-semibold text-green-700 hover:text-green-900 transition-colors">
                    <span>🌿</span> Comprar Cacau
                  </a>
                  <a href="/portal-produtor"
                    className="flex items-center gap-2 text-xl font-display font-medium text-cocoa-800 hover:text-gold-600 transition-colors">
                    <span>🌾</span> Portal Produtor
                  </a>
                  <p className="text-xs uppercase tracking-widest text-cocoa-500 mb-2 mt-4">Marketplace</p>
                  <a href="/catalogo-b2b"
                    className="flex items-center gap-2 text-xl font-display font-medium text-cocoa-800 hover:text-gold-600 transition-colors">
                    <span>🏭</span> Ingredientes B2B
                  </a>
                  <a href="/loja"
                    className="flex items-center gap-2 text-xl font-display font-medium text-cocoa-800 hover:text-gold-600 transition-colors">
                    <span>🍃</span> Loja Cerimonial
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

// Pre-render all hero slides simultaneously — CSS opacity crossfade, no mount/unmount
const HeroSlideshow = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Slides: start with the full-quality hero_bg so first paint is sharp
  const slides = [
    { type: 'image' as const, src: ASSETS.hero_bg, duration: 6000 },
    { type: 'video' as const, src: ASSETS.hero_video, duration: 14000 },
    { type: 'image' as const, src: ASSETS.dense_trees, duration: 6000 },
  ];

  useEffect(() => {
    const advance = () =>
      setActiveIdx((prev) => (prev + 1) % slides.length);

    const timer = setTimeout(advance, slides[activeIdx].duration);
    return () => clearTimeout(timer);
  }, [activeIdx]);

  // When the video slide becomes active, restart + play the video
  useEffect(() => {
    if (!videoRef.current) return;
    if (activeIdx === 1) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {/* autoplay blocked - muted so usually fine */});
    }
  }, [activeIdx]);

  return (
    <div className="absolute inset-0">
      {/* Slide 0 — fast-loading aerial photo (104KB) */}
      <div
        className="hero-slide absolute inset-0 transition-opacity duration-[2500ms] ease-in-out"
        style={{ opacity: activeIdx === 0 ? 1 : 0 }}
      >
        <img
          src={slides[0].src}
          alt=""
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Slide 1 — video (always mounted, hidden when inactive) */}
      <div
        className="hero-slide absolute inset-0 transition-opacity duration-[2500ms] ease-in-out"
        style={{ opacity: activeIdx === 1 ? 1 : 0 }}
      >
        <video
          ref={videoRef}
          src={slides[1].src}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Slide 2 — secondary image */}
      <div
        className="hero-slide absolute inset-0 transition-opacity duration-[2500ms] ease-in-out"
        style={{ opacity: activeIdx === 2 ? 1 : 0 }}
      >
        <img
          src={slides[2].src}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Slide indicator dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`rounded-full transition-all duration-500 ${
              i === activeIdx
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const { t } = useLanguage();

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-cocoa-950">
      {/* Parallax wrapper */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
        <HeroSlideshow />
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-cocoa-950/80 z-10 pointer-events-none" />
      </motion.div>

      {/* Floating decorative beans — subtle, low-opacity */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <motion.div
          style={{ y: useTransform(scrollY, [0, 800], [0, 160]) }}
          className="absolute top-[12%] right-[6%] w-28 md:w-40 opacity-30 blur-[1px]"
        >
          <img src={ASSETS.floating_beans} alt="" className="w-full h-auto" />
        </motion.div>
      </div>

      {/* Text content */}
      <div className="relative z-20 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white text-xs font-medium uppercase tracking-widest mb-6">
            <Award className="w-3 h-3 text-gold-400" />
            <span>{t('hero.badge')}</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-medium leading-[1.08] mb-6 drop-shadow-xl">
            {t('hero.title.1')} <br />
            <span className="italic font-light text-gold-400">{t('hero.title.2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-10 font-light leading-relaxed drop-shadow-md">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gold-500 hover:bg-gold-600 text-cocoa-950 font-bold rounded-full px-8 h-14 text-base shadow-xl shadow-gold-500/25 transition-all hover:scale-[1.03]"
              onClick={() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('hero.cta.products')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-md border-white/40 text-white hover:bg-white/20 rounded-full px-8 h-14 text-base transition-all hover:scale-[1.03]"
              onClick={() => document.getElementById('diagrama-processo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('hero.cta.factory')}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

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

const Features = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-cocoa-900 border-t border-cocoa-800" id="origem">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: Leaf,
              title: t('features.origin.title'),
              desc: t('features.origin.desc')
            },
            {
              icon: Factory,
              title: t('features.industry.title'),
              desc: t('features.industry.desc')
            },
            {
              icon: Globe,
              title: t('features.global.title'),
              desc: t('features.global.desc')
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex flex-col items-start p-8 rounded-2xl bg-cocoa-800/50 border border-cocoa-700 hover:border-gold-500/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-6 text-gold-400 group-hover:bg-gold-500/20 transition-colors">
                <feature.icon strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl mb-3 text-white">{feature.title}</h3>
              <p className="text-cocoa-300 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

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

const AboutSplit = () => {
  return (
    <section className="py-0 bg-cocoa-900 border-t border-cocoa-800 overflow-hidden relative" id="processo">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none z-0">
        <img src={ASSETS.tech_wireframe} className="w-[800px] h-[800px] absolute -right-40 -top-40 rotate-12" />
      </div>

      <div className="flex flex-col lg:flex-row h-auto min-h-[800px] relative z-10">
        <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-auto group">
          <img
            src={ASSETS.pod_qr}
            alt="Rastreabilidade QR Code"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

          {/* Tech Overlay Badge */}
          <div className="absolute bottom-8 left-8 right-8 bg-black/40 backdrop-blur-xl p-6 rounded-xl border border-white/10 text-white">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden shadow-lg border border-white/20 bg-white p-1">
                <img src={ASSETS.qr_code} alt="QR Code" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-green-400 mb-1">
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Traceability Tech</span>
                </div>
                <h4 className="font-display text-xl mb-1">Rastreabilidade Total</h4>
                <p className="text-sm text-white/80">Cada lote conta uma história. Do clone 24 ao produto final.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-cocoa-900 text-cocoa-50 p-12 md:p-24 flex flex-col justify-center relative">
          {/* Subtle bean background */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 opacity-10 pointer-events-none">
            <img src={ASSETS.floating_beans} alt="" />
          </div>

          <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-6">O Padrão Qualitheo</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
            Ciência e Natureza em <span className="text-gold-400 italic">Sintonia</span>
          </h2>
          <p className="text-cocoa-200 text-lg leading-relaxed mb-8">
            Não vendemos apenas cacau; vendemos consistência. Nossa estrutura de originação e compra aplica protocolos rigorosos de pós-colheita, monitorados digitalmente.
          </p>

          <ul className="space-y-4 mb-10">
            {[
              "Rastreabilidade total via QR Code por lote",
              "Monitoramento biométrico da fermentação",
              "Secagem híbrida em estufas solares tech",
              "Análise sensorial em laboratório próprio"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-cocoa-100">
                <CheckCircle2 className="w-5 h-5 text-leaf-500" />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex gap-4">
            <Button variant="outline" className="self-start border-cocoa-700 text-cocoa-100 hover:bg-cocoa-800 hover:text-white">
              Protocolos Técnicos
            </Button>
            <Button variant="ghost" className="text-gold-400 hover:text-gold-300 hover:bg-transparent p-0">
              Ver Certificações <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductBlock = ({
  title,
  subtitle,
  description,
  products,
  image,
  align = "left",
  accentColor = "gold" // gold or leaf
}: {
  title: string;
  subtitle: string;
  description: string;
  products: { name: string; desc: string; formats: string[] }[];
  image: string;
  align?: "left" | "right";
  accentColor?: "gold" | "leaf";
}) => {
  return (
    <div className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mb-32 ${align === "right" ? "lg:flex-row-reverse" : ""}`}>
      <div className="w-full lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl"
        >
          <img src={image} alt={title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>
      </div>

      <div className="w-full lg:w-1/2">
        <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-6 border ${accentColor === "leaf" ? "bg-leaf-500/10 text-leaf-400 border-leaf-500/30" : "bg-gold-500/10 text-gold-400 border-gold-500/30"}`}>
          {subtitle}
        </span>
        <h3 className="font-display text-3xl md:text-4xl text-white mb-6">{title}</h3>
        <p className="text-cocoa-300 text-lg mb-10 leading-relaxed">{description}</p>

        <div className="space-y-6">
          {products.map((product, idx) => (
            <div key={idx} className="border-l-2 border-cocoa-700 pl-6 hover:border-gold-500 transition-colors">
              <h4 className="font-display text-xl text-gold-400 mb-2">{product.name}</h4>
              <p className="text-cocoa-400 text-sm mb-4">{product.desc}</p>

              <div className="flex flex-wrap gap-2">
                {product.formats.map((fmt, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-1 bg-cocoa-800 text-cocoa-300 text-xs font-medium rounded border border-cocoa-700">
                    <Box className="w-3 h-3 mr-1 opacity-50" />
                    {fmt}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-cocoa-900 border-t border-cocoa-800" id="produtos">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <span className="text-gold-500 font-bold uppercase tracking-widest text-xs mb-3 block">{t('products.label')}</span>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6">{t('products.title')}</h2>
          <p className="text-cocoa-300 text-lg">
            Produtos de cacau fino de origem rastreada, para o mercado gourmet e industrial.
          </p>
        </div>

        {/* BLOCO 1: Néctar */}
        <ProductBlock
          align="left"
          subtitle={t('products.nectar.title')}
          title="Frozen Cacao Nectar"
          description={t('products.nectar.desc')}
          image={ASSETS.nectar}
          accentColor="leaf"
          products={[
            {
              name: t('products.nectar.title'),
              desc: t('products.nectar.desc'),
              formats: ["Tetra Pak 1L", "Galão 5L", "Galão 25L", "Tambor"]
            }
          ]}
        />

        <Separator className="my-24 bg-cocoa-700/50" />

        {/* BLOCO 2: Amêndoas */}
        <ProductBlock
          align="right"
          subtitle={t('products.beans.title')}
          title="Fermented Cacao Beans"
          description={t('products.beans.desc')}
          image={ASSETS.beans_container}
          products={[
            {
              name: t('products.beans.title'),
              desc: t('products.beans.desc'),
              formats: ["Sacos Juta 60kg", "Palete 1 Ton", "Meio Container (12.5T)", "Container Cheio (25T)"]
            }
          ]}
        />

        <Separator className="my-24 bg-cocoa-700/50" />

        {/* BLOCO 3: Nibs */}
        <ProductBlock
          align="left"
          subtitle={t('products.nibs.title')}
          title="Cacao Nibs"
          description={t('products.nibs.desc')}
          image={ASSETS.nibs_bags}
          products={[
            {
              name: t('products.nibs.title'),
              desc: t('products.nibs.desc'),
              formats: ["Varejo (100g - 1kg)", "Sacos (5kg - 60kg)", "Big Bag 1 Ton", "Container (12.5T/25T)"]
            }
          ]}
        />

        <Separator className="my-24 bg-cocoa-700/50" />

        {/* BLOCO 4: Liquor */}
        <ProductBlock
          align="right"
          subtitle={t('products.liquor.title')}
          title="Cacao Liquor Block"
          description={t('products.liquor.desc')}
          image={ASSETS.liquor_blocks}
          products={[
            {
              name: t('products.liquor.title'),
              desc: t('products.liquor.desc'),
              formats: ["Blocos 12.5kg", "Blocos 100kg", "Blocos 500kg", "Bloco 1 Ton", "Container (12.5T/25T)"]
            }
          ]}
        />

        <Separator className="my-24 bg-cocoa-700/50" />

        {/* BLOCO 5: Butter */}
        <ProductBlock
          align="left"
          subtitle={t('products.butter.title')}
          title="Cacao Butter Block"
          description={t('products.butter.desc')}
          image={ASSETS.butter_blocks}
          products={[
            {
              name: t('products.butter.title'),
              desc: t('products.butter.desc'),
              formats: ["Blocos 12.5kg", "Blocos 100kg", "Blocos 500kg", "Bloco 1 Ton", "Container (12.5T/25T)"]
            }
          ]}
        />

        <Separator className="my-24 bg-cocoa-700/50" />

        {/* BLOCO 6: Powder */}
        <ProductBlock
          align="right"
          subtitle={t('products.powder.title')}
          title="Cacao Powder"
          description={t('products.powder.desc')}
          image={ASSETS.powder_bags}
          products={[
            {
              name: t('products.powder.title'),
              desc: t('products.powder.desc'),
              formats: ["Sacos 25kg", "Sacos 60kg", "Big Bag 1 Ton"]
            }
          ]}
        />

      </div>
    </section>
  );
};

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

const Partners = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-cocoa-900 border-t border-cocoa-800 relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <img src={ASSETS.tech_wireframe} className="w-full h-full object-cover" />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <p className="text-sm font-bold uppercase tracking-widest text-gold-500/80 mb-12">
          {t('partners.title')}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
          {[
            { src: ASSETS.partner_bonnat, alt: "Bonnat Chocolatier", width: "w-32" },
            { src: ASSETS.partner_lasevicius, alt: "Casa Lasevicius", width: "w-28" },
            { src: ASSETS.partner_beantobar, alt: "Bean to Bar Brasil", width: "w-36" },
            { src: ASSETS.partner_mad, alt: "MAD", width: "w-28" },
            { src: ASSETS.partner_btm, alt: "BTM", width: "w-24" },
            { src: ASSETS.partner_ibc, alt: "IBC", width: "w-32" },
          ].map((logo, idx) => (
            <div
              key={idx}
              className={`group relative ${logo.width} aspect-[3/2] flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-50 hover:opacity-100 hover:scale-110`}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-w-full max-h-full object-contain brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t } = useLanguage();

  const navLinks = [
    { key: 'nav.origin', label: 'Origem' },
    { key: 'nav.process', label: 'Processo Industrial' },
    { key: 'nav.products', label: 'Produtos' },
    { key: 'nav.sustainability', label: 'Sustentabilidade' },
    { key: 'nav.blog', label: 'Blog' }
  ];

  return (
    <footer className="bg-cocoa-950 text-cocoa-200 py-20 border-t border-cocoa-900 relative overflow-hidden" id="contato">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-soft-light">
        <img src={ASSETS.infra_aerial_2} className="w-full h-full object-cover blur-3xl grayscale" />
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
              <a href="#" className="w-10 h-10 rounded-full bg-cocoa-900 border border-cocoa-800 flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-cocoa-950 transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-cocoa-900 border border-cocoa-800 flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-cocoa-950 transition-all duration-300">
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
                  <p className="text-white font-medium">Helton Gutzeit</p>
                  <p className="text-xs text-gold-500 uppercase tracking-wider font-bold">CEO & Founder</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-cocoa-300">
                <a href="mailto:gut@qualihteo.com" className="flex items-center gap-3 hover:text-white transition-colors p-2 hover:bg-cocoa-800/50 rounded-lg -ml-2">
                  <div className="w-1 h-1 rounded-full bg-gold-500"></div>
                  gut@qualihteo.com
                </a>
                <a href="mailto:Qualitheo@gmail.com" className="flex items-center gap-3 hover:text-white transition-colors p-2 hover:bg-cocoa-800/50 rounded-lg -ml-2">
                  <div className="w-1 h-1 rounded-full bg-gold-500"></div>
                  Qualitheo@gmail.com
                </a>
                <a href="https://wa.me/5593992356251" className="flex items-center gap-3 hover:text-white transition-colors p-2 hover:bg-cocoa-800/50 rounded-lg -ml-2">
                  <div className="w-1 h-1 rounded-full bg-gold-500"></div>
                  +55 93 99235-6251
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

// ============================================================
// Marketplace Section – acesso rápido a todos os portais
// ============================================================
const MarketplaceSection = () => (
  <section className="py-24 bg-cocoa-950 relative z-20" id="marketplace">
    <div className="container mx-auto px-6">
      <div className="text-center mb-14">
        <span className="inline-block text-gold-400 font-bold uppercase tracking-widest text-xs mb-3">Plataforma Gut Cacau</span>
        <h2 className="font-display text-4xl md:text-5xl text-white mb-4">Acesse o <span className="text-gold-400 italic">Marketplace</span></h2>
        <p className="text-cocoa-400 text-lg max-w-xl mx-auto">
          Originação, ingredientes B2B e cacau cerimonial — tudo em um só lugar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            href: "/catalogo-b2b",
            emoji: "🏭",
            title: "Ingredientes B2B",
            subtitle: "Qualitheo",
            desc: "Nibs, liquor, manteiga e pasta para indústria. Preços por volume, MOQ e condições B2B.",
            cta: "Ver catálogo",
            color: "from-amber-900/40 to-cocoa-900",
            accent: "bg-gold-500 text-cocoa-950",
          },
          {
            href: "/loja",
            emoji: "🍃",
            title: "Loja Cerimonial",
            subtitle: "Para o consumidor",
            desc: "Cacau fino para preparo de bebida ritual, chá e culinária. Compra via WhatsApp.",
            cta: "Comprar agora",
            color: "from-green-900/40 to-cocoa-900",
            accent: "bg-green-600 text-white",
          },
          {
            href: "/portal-produtor",
            emoji: "🌾",
            title: "Portal do Produtor",
            subtitle: "Originação",
            desc: "Cadastre-se, registre lotes de cacau molhado e receba propostas de compra da Qualitheo.",
            cta: "Acessar portal",
            color: "from-blue-900/40 to-cocoa-900",
            accent: "bg-blue-600 text-white",
          },
          {
            href: "/portal-qualitheo",
            emoji: "⚙️",
            title: "Gestão Qualitheo",
            subtitle: "Uso interno",
            desc: "Avalie lotes, calcule preços com o motor Qualitheo e envie propostas aos produtores.",
            cta: "Área interna",
            color: "from-purple-900/40 to-cocoa-900",
            accent: "bg-purple-600 text-white",
          },
        ].map((card) => (
          <a key={card.href} href={card.href}
            className={`group relative bg-gradient-to-b ${card.color} border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-white/30 transition-all hover:-translate-y-1 cursor-pointer`}>
            <div className="text-4xl">{card.emoji}</div>
            <div>
              <p className="text-xs text-cocoa-500 uppercase tracking-widest mb-1">{card.subtitle}</p>
              <h3 className="font-display text-xl text-white mb-2">{card.title}</h3>
              <p className="text-cocoa-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
            <div className="mt-auto">
              <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold ${card.accent} transition-all group-hover:gap-2.5`}>
                {card.cta} →
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-gold-200 selection:text-cocoa-900">
      <Navbar />
      <Hero />
      <PrecosWidget />
      <InfrastructureShowcase />
      <MarketThesis />
      <ProcessDiagram />
      <Features />
      <AboutSplit />
      <Products />
      <Impact />
      <MarketplaceSection />
      <Partners />
      <Footer />
    </div>
  );
}
