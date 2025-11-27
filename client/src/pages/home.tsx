import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Leaf, Factory, Globe, CheckCircle2, Menu, Snowflake, Layers, Box, Droplet, Scale, Award, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

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
import infra_interior_branded from "@assets/infra_interior_branded.png";
import hero_video from "@assets/hero_video.mp4";

const ASSETS = {
  hero_bg: infra_hero, // Fallback/Initial
  hero_video,
  infra_interior_branded,
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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
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

        <div className="hidden md:flex items-center gap-8">
          {["Origem", "Processo", "Produtos", "Impacto", "Contato"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`text-sm font-medium uppercase tracking-widest hover:opacity-70 transition-opacity ${
                isScrolled ? "text-cocoa-900" : "text-white/90"
              }`}
            >
              {item}
            </a>
          ))}
        </div>
        
        <div className="md:hidden">
             <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={isScrolled ? "text-cocoa-900" : "text-white"}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-cocoa-50 border-cocoa-200">
                <div className="flex flex-col gap-6 mt-12">
                  {["Origem", "Processo", "Produtos", "Impacto", "Contato"].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="text-2xl font-display font-medium text-cocoa-900"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </nav>
  );
};

const FloatingElements = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const rotate = useTransform(scrollY, [0, 1000], [0, 180]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Hero Section Elements */}
      <motion.div 
        style={{ y: y1, rotate }}
        className="absolute top-[10%] right-[5%] w-32 md:w-48 opacity-60 blur-[1px]"
      >
        <img src={ASSETS.floating_beans} alt="" className="w-full h-auto" />
      </motion.div>
      
      <motion.div 
        style={{ y: y2 }}
        className="absolute top-[40%] left-[2%] w-24 md:w-32 opacity-40 blur-[2px]"
      >
        <img src={ASSETS.floating_beans} alt="" className="w-full h-full scale-x-[-1]" />
      </motion.div>

      {/* Process Section Elements */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-[120vh] right-[-5%] w-64 md:w-96 opacity-20"
      >
        <img src={ASSETS.tech_wireframe} alt="" className="w-full h-full invert opacity-50" />
      </motion.div>

       {/* Product Section Elements */}
       <motion.div 
        style={{ y: y2, rotate: -45 }}
        className="absolute top-[250vh] left-[5%] w-40 opacity-80"
      >
        <img src={ASSETS.pod_isolated} alt="" className="w-full h-full drop-shadow-2xl" />
      </motion.div>
    </div>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  
  // Background slider logic
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const slides = [
    { type: 'video', src: ASSETS.hero_video, duration: 12000 }, // Play video for 12s
    { type: 'image', src: ASSETS.infra_interior_branded, duration: 6000 } // Show image for 6s
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, slides[currentSlideIndex].duration);
    
    return () => clearTimeout(timer);
  }, [currentSlideIndex]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-cocoa-950">
      <FloatingElements />
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 z-0"
      >
        {/* Gradient darkened for text readability on the bright aerial shot */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-cocoa-900/90 z-20" />
        
        <AnimatePresence mode="popLayout">
          {slides[currentSlideIndex].type === 'video' ? (
             <motion.div
                key="video-slide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5, ease: "easeInOut" }} // Slow fade
                className="absolute inset-0 w-full h-full"
             >
               <video
                 src={slides[currentSlideIndex].src}
                 autoPlay
                 muted
                 loop
                 playsInline
                 className="absolute inset-0 w-full h-full object-cover"
               />
             </motion.div>
          ) : (
            <motion.img
              key="image-slide"
              src={slides[currentSlideIndex].src}
              alt="Agroindústria Qualitheo"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: "easeInOut" }} // Slow fade
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          )}
        </AnimatePresence>
      </motion.div>

      <div className="relative z-30 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white text-xs font-medium uppercase tracking-widest mb-6">
            <Award className="w-3 h-3 text-gold-400" />
            <span>Cocoa of Excellence Award Winner</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-medium leading-[1.1] mb-6 drop-shadow-lg">
            Excelência <br />
            <span className="italic font-light text-gold-400">em escala industrial</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light leading-relaxed drop-shadow-md">
            A maior infraestrutura de pós-colheita da Amazônia. Conectamos a origem ao mundo com tecnologia, rastreabilidade e precisão.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-cocoa-950 font-bold rounded-full px-8 h-14 text-base shadow-lg shadow-gold-500/20">
              Nossos Produtos
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/40 text-white hover:bg-white/20 rounded-full px-8 h-14 text-base">
              Conheça a Fabrica
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InfrastructureShowcase = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="relative py-24 bg-cocoa-900 -mt-10 rounded-t-[3rem] z-30 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-12 mb-12">
           <div className="max-w-3xl">
              <h3 className="text-gold-400 font-bold uppercase tracking-widest text-sm mb-4">Infraestrutura de Ponta</h3>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-6">Tecnologia em Meio à Floresta</h2>
              <p className="text-cocoa-200 leading-relaxed text-lg">
                Nossa unidade de beneficiamento conta com estufas solares automatizadas, pátios de secagem de alta capacidade e armazéns climatizados, garantindo homogeneidade e segurança alimentar para grandes volumes.
              </p>
           </div>
           
           {/* Bento Grid Layout for Collage */}
           <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
              {/* Large Main Image - Factory Aerial */}
              <div className="md:col-span-4 md:row-span-2 relative group overflow-hidden rounded-2xl shadow-2xl border border-white/10 cursor-pointer" onClick={() => setSelectedImage(ASSETS.infra_aerial_3)}>
                <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-medium text-white">
                   Unidade de Beneficiamento
                </div>
                <img 
                  src={ASSETS.infra_aerial_3} 
                  alt="Vista Aérea da Fábrica" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>

              {/* Top Right - Drying Beds */}
              <div className="md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-2xl shadow-xl border border-white/10 cursor-pointer" onClick={() => setSelectedImage(ASSETS.infra_drying_beds)}>
                 <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-medium text-white">
                   Estufas Solares
                </div>
                <img 
                  src={ASSETS.infra_drying_beds} 
                  alt="Estufas de Secagem" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>

              {/* Bottom Right - Interior/Warehouse */}
              <div className="md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-2xl shadow-xl border border-white/10 cursor-pointer" onClick={() => setSelectedImage(ASSETS.infra_warehouse_wide)}>
                 <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-medium text-white">
                   Armazenamento
                </div>
                <img 
                  src={ASSETS.infra_warehouse_wide} 
                  alt="Armazém Interno" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
           </div>

           {/* Secondary Row of Smaller Images */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="h-40 rounded-xl overflow-hidden border border-white/10 group cursor-pointer" onClick={() => setSelectedImage(ASSETS.infra_fermentation)}>
                <img src={ASSETS.infra_fermentation} alt="Fermentação" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="h-40 rounded-xl overflow-hidden border border-white/10 group cursor-pointer" onClick={() => setSelectedImage(ASSETS.infra_interior_1)}>
                <img src={ASSETS.infra_interior_1} alt="Maquinário" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="h-40 rounded-xl overflow-hidden border border-white/10 group cursor-pointer" onClick={() => setSelectedImage(ASSETS.infra_aerial_4)}>
                <img src={ASSETS.infra_aerial_4} alt="Vista Alta" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="h-40 rounded-xl overflow-hidden border border-white/10 group cursor-pointer" onClick={() => setSelectedImage(ASSETS.infra_cold_room)}>
                <img src={ASSETS.infra_cold_room} alt="Câmara Fria" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
  return (
    <section className="py-24 bg-white relative z-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-start">
           <div className="md:w-1/2">
             <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-cocoa-100 text-cocoa-700 text-xs font-bold uppercase tracking-widest">
                <Scale className="w-3 h-3" />
                <span>Tese de Mercado</span>
             </div>
             <h2 className="font-display text-4xl md:text-5xl text-cocoa-900 mb-6 leading-tight">
               Valorização em um <br/>Cenário Volátil
             </h2>
             <p className="text-cocoa-600 text-lg leading-relaxed mb-8">
               Com a oferta global de cacau apertada e preços historicamente elevados, o mercado exige mais do que volume: exige confiança. A volatilidade reforça o prêmio pago por qualidade consistente e rastreabilidade real.
             </p>
             <div className="p-6 bg-cocoa-50 rounded-2xl border border-cocoa-100">
                <h4 className="font-display text-xl text-cocoa-800 mb-2">O Diferencial Qualitheo</h4>
                <p className="text-cocoa-600">
                  Somos pioneiros na compra do fruto (pods) direto do produtor. Isso nos permite capturar valor integral: fermentação controlada, produção de nibs e extração de polpa, além de operar trading de bulk quando racional.
                </p>
             </div>
           </div>
           
           <div className="md:w-1/2">
              <div className="relative">
                 <div className="absolute -top-6 -left-6 w-24 h-24 bg-gold-100 rounded-full -z-10 opacity-50 blur-xl"></div>
                 <img src={ASSETS.cocoa_hands} alt="Negociação Justa" className="rounded-2xl shadow-xl w-full object-cover h-[500px]" />
                 
                 <div className="absolute bottom-8 -left-8 bg-white p-6 rounded-xl shadow-lg max-w-xs border border-cocoa-100">
                    <h4 className="font-bold text-cocoa-900 mb-1">Política de Fornecedor</h4>
                    <p className="text-sm text-cocoa-500 mb-3">Ganha-ganha orientado por eficiência.</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-xs font-medium text-cocoa-700">
                        <CheckCircle2 className="w-3 h-3 text-gold-500" />
                        Preço Justo & Crédito Tokenizado
                      </li>
                      <li className="flex items-center gap-2 text-xs font-medium text-cocoa-700">
                        <CheckCircle2 className="w-3 h-3 text-gold-500" />
                        Assistência, Insumos & Carbono
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
  return (
    <section className="py-24 bg-cocoa-50" id="origem">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: Leaf,
              title: "Origem Amazônica",
              desc: "Produzido em sistemas agroflorestais no Pará, preservando a floresta e garantindo a biodiversidade."
            },
            {
              icon: Factory,
              title: "Indústria 4.0",
              desc: "Processamento controlado com protocolos de fermentação e secagem de precisão para qualidade superior."
            },
            {
              icon: Globe,
              title: "Conexão Global",
              desc: "Logística integrada que conecta o produtor amazônico aos mercados mais exigentes do mundo."
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-full bg-cocoa-100 flex items-center justify-center mb-6 text-cocoa-700">
                <feature.icon strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl mb-3 text-cocoa-900">{feature.title}</h3>
              <p className="text-cocoa-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSplit = () => {
  return (
    <section className="py-0 bg-white overflow-hidden relative" id="processo">
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
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>
      </div>
      
      <div className="w-full lg:w-1/2">
        <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-6 ${accentColor === "leaf" ? "bg-leaf-500/10 text-leaf-700" : "bg-gold-500/10 text-gold-700"}`}>
          {subtitle}
        </span>
        <h3 className="font-display text-3xl md:text-4xl text-cocoa-900 mb-6">{title}</h3>
        <p className="text-cocoa-600 text-lg mb-10 leading-relaxed">{description}</p>
        
        <div className="space-y-8">
          {products.map((product, idx) => (
            <div key={idx} className="border-l-2 border-cocoa-200 pl-6 hover:border-gold-500 transition-colors">
              <h4 className="font-display text-xl text-cocoa-800 mb-2">{product.name}</h4>
              <p className="text-cocoa-500 text-sm mb-4">{product.desc}</p>
              
              <div className="flex flex-wrap gap-2">
                {product.formats.map((fmt, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-1 bg-cocoa-100 text-cocoa-600 text-xs font-medium rounded">
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
  return (
    <section className="py-24 bg-white" id="produtos">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="font-display text-4xl md:text-5xl text-cocoa-900 mb-6">Showcase de Produtos</h2>
          <p className="text-cocoa-600 text-lg">
            A Qualitheo apresenta sua linha completa de derivados, unindo a origem nobre do fruto à precisão da escala industrial para o mercado global B2B.
          </p>
        </div>

        {/* BLOCO 1: Néctar */}
        <ProductBlock
          align="left"
          subtitle="A Essência Fresca"
          title="Frozen Cacao Nectar"
          description="O puro frescor da floresta, conhecido como 'Suco de Deus'. Extraído via 'Clean Extraction' e submetido a congelamento rápido (Flash Frozen) para preservar nutrientes e o sabor cítrico único."
          image={ASSETS.nectar}
          accentColor="leaf"
          products={[
            {
              name: "Néctar de Cacau",
              desc: "Ideal para indústria de bebidas, sucos premium, sorveterias e mixologia.",
              formats: ["Tetra Pak 1L", "Galão 5L", "Galão 25L", "Tambor"]
            }
          ]}
        />

        <Separator className="my-24 bg-cocoa-100" />

        {/* BLOCO 2: Amêndoas */}
        <ProductBlock
          align="right"
          subtitle="Matéria-Prima Fundamental"
          title="Fermented Cacao Beans"
          description="O alicerce da indústria. Amêndoas selecionadas na origem, com fermentação rigorosa para perfil aromático superior. Qualidade 'Export Standard'."
          image={ASSETS.beans_container}
          products={[
            {
              name: "Amêndoas Padrão Exportação",
              desc: "Para fabricantes Bean-to-Bar e grandes indústrias moageiras.",
              formats: ["Sacos Juta 60kg", "Palete 1 Ton", "Meio Container (12.5T)", "Container Cheio (25T)"]
            }
          ]}
        />

        <Separator className="my-24 bg-cocoa-100" />

        {/* BLOCO 3: Nibs */}
        <ProductBlock
          align="left"
          subtitle="Crocância e Sabor Puro"
          title="Cacao Nibs"
          description="Amêndoas torradas e trituradas em pedaços puros. Sabor intenso de chocolate e textura crocante sem adição de açúcar."
          image={ASSETS.nibs_bags}
          products={[
            {
              name: "Cacao Nibs",
              desc: "Perfeito para barras de cereais, granolas, iogurtes e cervejarias artesanais.",
              formats: ["Varejo (100g - 1kg)", "Sacos (5kg - 60kg)", "Big Bag 1 Ton", "Container (12.5T/25T)"]
            }
          ]}
        />
        
        <Separator className="my-24 bg-cocoa-100" />

        {/* BLOCO 4: Liquor */}
        <ProductBlock
          align="right"
          subtitle="O Coração do Chocolate"
          title="Cacao Liquor Block"
          description="Pasta de cacau pura, obtida da moagem das amêndoas torradas. A base essencial para qualquer chocolate de alta qualidade."
          image={ASSETS.liquor_blocks}
          products={[
            {
              name: "Cacao Liquor",
              desc: "Matéria-prima base para chocolates, coberturas e confeitaria.",
              formats: ["Blocos 12.5kg", "Blocos 100kg", "Blocos 500kg", "Bloco 1 Ton", "Container (12.5T/25T)"]
            }
          ]}
        />

        <Separator className="my-24 bg-cocoa-100" />

        {/* BLOCO 5: Butter */}
        <ProductBlock
          align="left"
          subtitle="A Nobreza da Gordura"
          title="Cacao Butter Block"
          description="Manteiga de cacau pura, extraída por prensagem. Responsável pela textura aveludada e derretimento perfeito do chocolate."
          image={ASSETS.butter_blocks}
          products={[
            {
              name: "Cacao Butter",
              desc: "Essencial para chocolates nobres, cosméticos e indústria farmacêutica.",
              formats: ["Blocos 12.5kg", "Blocos 100kg", "Blocos 500kg", "Bloco 1 Ton", "Container (12.5T/25T)"]
            }
          ]}
        />

        <Separator className="my-24 bg-cocoa-100" />

        {/* BLOCO 6: Powder */}
        <ProductBlock
          align="right"
          subtitle="Versatilidade em Pó"
          title="Cacao Powder"
          description="Cacau em pó alcalino ou natural, resultado da prensagem da torta de cacau. Sabor intenso e solubilidade ideal."
          image={ASSETS.powder_bags}
          products={[
            {
              name: "Fine Quality Standard Cacao Powder",
              desc: "Para bebidas, panificação, sobremesas e indústria de lácteos.",
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    // Format message for WhatsApp
    const message = `Olá! Gostaria de solicitar um orçamento.\n\n*Nome:* ${data.name}\n*Empresa:* ${data.company}\n*Interesse:* ${data.product}\n*Mensagem:* ${data.message}`;
    
    const whatsappUrl = `https://wa.me/5593992356251?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Optional: Attempt mailto as fallback/secondary (browsers might block dual popups)
    // const mailtoUrl = `mailto:gut@qualihteo.com?subject=Orçamento Qualitheo - ${data.company}&body=${encodeURIComponent(message)}`;
    // window.location.href = mailtoUrl;
    
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
         <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-cocoa-950 font-bold rounded-full px-8 h-14 text-base shadow-lg shadow-gold-500/20 animate-pulse">
            Solicitar Orçamento
         </Button>
      </SheetTrigger>
      <SheetContent className="bg-cocoa-50 border-cocoa-200 overflow-y-auto sm:max-w-md w-full">
        <div className="flex flex-col gap-6 mt-8">
          <div>
            <h3 className="font-display text-2xl text-cocoa-900 mb-2">Solicite Cotação</h3>
            <p className="text-cocoa-600 text-sm">Preencha os dados abaixo para iniciar seu atendimento comercial.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-cocoa-700">Nome Completo</label>
              <input 
                required
                name="name"
                id="name"
                className="w-full px-4 py-3 rounded-lg bg-white border border-cocoa-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all text-cocoa-900"
                placeholder="Seu nome"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="company" className="text-xs font-bold uppercase tracking-wider text-cocoa-700">Empresa</label>
              <input 
                required
                name="company"
                id="company"
                className="w-full px-4 py-3 rounded-lg bg-white border border-cocoa-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all text-cocoa-900"
                placeholder="Nome da sua empresa"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="product" className="text-xs font-bold uppercase tracking-wider text-cocoa-700">Interesse Principal</label>
              <select 
                name="product"
                id="product"
                className="w-full px-4 py-3 rounded-lg bg-white border border-cocoa-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all text-cocoa-900"
              >
                <option value="Néctar de Cacau">Néctar de Cacau</option>
                <option value="Amêndoas">Amêndoas Fermentadas</option>
                <option value="Nibs">Nibs de Cacau</option>
                <option value="Líquor">Líquor (Massa)</option>
                <option value="Manteiga">Manteiga de Cacau</option>
                <option value="Pó">Cacau em Pó</option>
                <option value="Outro">Outro / Múltiplos</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-cocoa-700">Mensagem (Opcional)</label>
              <textarea 
                name="message"
                id="message"
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-white border border-cocoa-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all text-cocoa-900 resize-none"
                placeholder="Volume estimado ou detalhes adicionais..."
              />
            </div>

            <Button type="submit" size="lg" className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full font-bold h-12 text-base">
               Enviar via WhatsApp
            </Button>
            <p className="text-center text-xs text-cocoa-400 mt-2">
              Você será redirecionado para o WhatsApp da Qualitheo.
            </p>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Impact = () => {
  return (
    <section className="py-24 bg-leaf-800 text-white relative overflow-hidden" id="impacto">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
         <img src={ASSETS.dense_trees} className="w-full h-full object-cover" alt="Floresta de Cacau" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 relative">
             <div className="absolute -top-10 -left-10 w-32 z-20 animate-pulse delay-1000">
                <img src={ASSETS.macaw} alt="Arara" className="rounded-full border-4 border-white/20 shadow-xl" />
             </div>
             {/* Swapped image to focus on plantation/nature as requested */}
             <img 
              src={ASSETS.infra_aerial_1} 
              alt="Plantação e Fábrica na Floresta" 
              className="rounded-2xl shadow-2xl rotate-1 border border-white/10 w-full h-[500px] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-xl max-w-[200px] text-cocoa-900 z-20">
                <p className="font-display text-lg leading-tight">"Garantimos a compra, garantimos o futuro."</p>
                <p className="text-xs text-cocoa-500 mt-2 font-bold uppercase tracking-wider">- Helton Gutzeit</p>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-leaf-600/50 border border-leaf-400/30 text-leaf-100 text-xs font-bold uppercase tracking-widest">
                <Globe className="w-3 h-3" />
                <span>Bioeconomia Amazônica</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl mb-8 leading-tight">
              Impacto Real <br/><span className="text-leaf-300">além da floresta</span>
            </h2>
            <p className="text-leaf-100 text-lg leading-relaxed mb-8">
              A Qualitheo não é apenas uma agroindústria; somos um ecossistema. Ao profissionalizar o produtor com assistência técnica e garantir a compra de toda a safra, criamos um ciclo virtuoso onde a floresta em pé vale mais.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mt-12 border-t border-leaf-600 pt-8">
              <div>
                <div className="text-4xl font-display text-gold-400 mb-2 flex items-baseline gap-1">
                    +300<span className="text-xl">%</span>
                </div>
                <div className="text-sm text-leaf-200 uppercase tracking-wider">Renda do Produtor</div>
              </div>
              <div>
                <div className="text-4xl font-display text-gold-400 mb-2">100%</div>
                <div className="text-sm text-leaf-200 uppercase tracking-wider">Rastreabilidade</div>
              </div>
            </div>
            
             <div className="mt-10">
                <QuoteForm />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Partners = () => {
  return (
    <section className="py-20 bg-white border-t border-cocoa-100">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-cocoa-300 mb-12">
          Parceiros e Clientes que Confiam na Qualitheo
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-80">
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
              className={`grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110 hover:opacity-100 opacity-60 ${logo.width} aspect-[3/2] flex items-center justify-center`}
            >
              <img 
                src={logo.src} 
                alt={logo.alt} 
                className="max-w-full max-h-full object-contain mix-blend-multiply" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-cocoa-950 text-cocoa-200 py-16 border-t border-cocoa-900" id="contato">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 flex flex-col items-start">
            <div className="bg-white p-4 rounded-xl mb-6 w-fit">
              <img src={ASSETS.logo_vertical} alt="Qualitheo Logo" className="h-32 w-auto object-contain" />
            </div>
            <p className="max-w-md text-cocoa-400 leading-relaxed">
              Agroindústria bioeconômica que conecta a riqueza da Amazônia ao mundo com qualidade, tecnologia e transparência.
            </p>
            <div className="mt-8">
               <QuoteForm />
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              {["Origem", "Processo", "Produtos", "Sustentabilidade", "Blog"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-gold-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Contato</h4>
            <ul className="space-y-3 text-cocoa-400">
              <li className="font-medium text-white">Helton Gutzeit | CEO</li>
              <li>
                <a href="mailto:gut@qualihteo.com" className="hover:text-gold-400">gut@qualihteo.com</a>
              </li>
              <li>
                 <a href="mailto:Qualitheo@gmail.com" className="hover:text-gold-400">Qualitheo@gmail.com</a>
              </li>
              <li>
                 <a href="https://wa.me/5593992356251" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400">
                  +55 93 99235-6251
                 </a>
              </li>
              <li>Pará, Amazônia, Brasil</li>
              <li className="pt-4 flex flex-col gap-4">
                <div className="flex gap-4">
                  <a 
                    href="https://www.instagram.com/gutcacao" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-cocoa-900 flex items-center justify-center hover:bg-cocoa-800 cursor-pointer transition-colors text-gold-500 hover:text-gold-400"
                    title="Siga-nos no Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
                {/* QR Code Display */}
                <div className="mt-2 bg-white p-2 rounded-lg w-32 h-32 shadow-lg border border-cocoa-800">
                  <img src={ASSETS.qr_code} alt="Instagram QR Code" className="w-full h-full object-contain" />
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-cocoa-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-cocoa-500">
          <p>&copy; 2025 Qualitheo. Todos os direitos reservados.</p>
          <p>Desenvolvido com orgulho na Amazônia.</p>
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-gold-200 selection:text-cocoa-900">
      <Navbar />
      <Hero />
      <InfrastructureShowcase />
      <MarketThesis />
      <Features />
      <AboutSplit />
      <Products />
      <Impact />
      <Partners />
      <Footer />
    </div>
  );
}
