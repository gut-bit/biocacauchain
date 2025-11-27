import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Leaf, Droplets, Factory, Truck, Globe, CheckCircle2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const ASSETS = {
  hero_bg: "/attached_assets/dji_fly_20240713_195956_0136_1721755357579_photo_1764267587664.jpg",
  cocoa_pod: "/attached_assets/20250503_153303~2_1764267587664.jpg",
  warehouse: "/attached_assets/Gemini_Generated_Image_fx3qlvfx3qlvfx3q_1764267587665.png",
  products_mix: "/attached_assets/Gemini_Generated_Image_l31gphl31gphl31g_1764267587665.png",
  nectar: "/attached_assets/Gemini_Generated_Image_v3bi8bv3bi8bv3bi_1764267587666.png",
  logo_qualitheo: "/attached_assets/IMG-20230823-WA0095_1764267587666.jpg",
  farm_worker: "/attached_assets/Screenshot_20251009_180100_Instagram_1764267587667.jpg"
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
        <div className="flex items-center gap-2">
            {/* Using text for logo as the image might need background removal or specific styling */}
            <span className={`font-display text-2xl font-bold tracking-tight ${isScrolled ? 'text-cocoa-900' : 'text-white'}`}>
              Qualitheo
            </span>
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

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex items-center justify-center">
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-cocoa-900/90 z-10" />
        <img
          src={ASSETS.hero_bg}
          alt="Plantação de Cacau na Amazônia"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="relative z-20 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white text-xs font-medium uppercase tracking-widest mb-6">
            Agroindústria Bioeconômica da Amazônia
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-medium leading-[1.1] mb-6">
            Excelência <br />
            <span className="italic font-light text-gold-400">em cada amêndoa</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Do cultivo no coração do Pará à exportação global. Elevamos a cadeia do cacau com tecnologia, rastreabilidade e impacto real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-cocoa-950 font-bold rounded-full px-8 h-14 text-base">
              Nossos Produtos
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 rounded-full px-8 h-14 text-base">
              Conheça a Origem
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
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
    <section className="py-0 bg-white overflow-hidden" id="processo">
      <div className="flex flex-col lg:flex-row h-auto min-h-[800px]">
        <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-auto">
          <img 
            src={ASSETS.cocoa_pod} 
            alt="Cacau Fino" 
            className="absolute inset-0 w-full h-full object-cover"
          />
           <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        </div>
        <div className="w-full lg:w-1/2 bg-cocoa-900 text-cocoa-50 p-12 md:p-24 flex flex-col justify-center">
          <span className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-6">O Padrão Qualitheo</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
            Ciência e Natureza em <span className="text-gold-400 italic">Sintonia</span>
          </h2>
          <p className="text-cocoa-200 text-lg leading-relaxed mb-8">
            Não vendemos apenas cacau; vendemos consistência. Nossa estrutura de originação e compra aplica protocolos rigorosos de pós-colheita. Transformamos amêndoas brutas em ingredientes finos, controlando cada variável de sabor, acidez e aroma.
          </p>
          
          <ul className="space-y-4 mb-10">
            {[
              "Rastreabilidade total via QR Code",
              "Fermentação controlada em cochos de madeira",
              "Secagem em estufas solares monitoradas",
              "Análise sensorial laboratorial"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-cocoa-100">
                <CheckCircle2 className="w-5 h-5 text-leaf-500" />
                {item}
              </li>
            ))}
          </ul>

          <Button variant="outline" className="self-start border-cocoa-700 text-cocoa-100 hover:bg-cocoa-800 hover:text-white">
            Conheça Nossos Protocolos
          </Button>
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ title, desc, image, tag }: { title: string, desc: string, image: string, tag: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="group relative bg-white rounded-xl overflow-hidden border border-cocoa-100 shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className="aspect-[4/3] overflow-hidden bg-cocoa-100">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="p-8">
      <span className="inline-block px-3 py-1 bg-cocoa-50 text-cocoa-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
        {tag}
      </span>
      <h3 className="font-display text-2xl text-cocoa-900 mb-3">{title}</h3>
      <p className="text-cocoa-600 mb-6 line-clamp-3">{desc}</p>
      <a href="#" className="inline-flex items-center text-gold-600 font-semibold hover:text-gold-700 transition-colors group-hover:gap-2">
        Especificações <ArrowRight className="w-4 h-4 ml-1" />
      </a>
    </div>
  </motion.div>
);

const Products = () => {
  return (
    <section className="py-24 bg-cocoa-50" id="produtos">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-cocoa-900 mb-6">Nosso Portfólio</h2>
          <p className="text-cocoa-600 text-lg">
            Ingredientes desenvolvidos para a indústria de alimentos finos, cosméticos e chocolateria gourmet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductCard 
            title="Amêndoas Fermentadas"
            desc="Cacau fino de aroma com perfil sensorial complexo, notas frutadas e baixa adstringência. Ideal para chocolates Bean-to-Bar."
            image={ASSETS.products_mix}
            tag="Matéria-Prima"
          />
          <ProductCard 
            title="Néctar de Cacau"
            desc="O 'mel' do cacau extraído da polpa fresca. Rico em antioxidantes, com sabor agridoce único e tropical."
            image={ASSETS.nectar}
            tag="Inovação"
          />
          <ProductCard 
            title="Nibs de Cacau"
            desc="Amêndoas torradas e trituradas com precisão. Crocância perfeita e sabor intenso de chocolate puro."
            image={ASSETS.products_mix} /* Using mix image as placeholder for specific nibs shot if not available */
            tag="Derivado"
          />
        </div>
      </div>
    </section>
  );
};

const Impact = () => {
  return (
    <section className="py-24 bg-leaf-700 text-white relative overflow-hidden" id="impacto">
      {/* Grain texture overlay could go here */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
             <img 
              src={ASSETS.farm_worker} 
              alt="Produtor Qualitheo" 
              className="rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="font-display text-4xl md:text-5xl mb-8">
              Impacto Real no Campo
            </h2>
            <p className="text-leaf-100 text-lg leading-relaxed mb-8">
              A Qualitheo não é apenas uma compradora; somos parceiros. Ao profissionalizar a produção e garantir a compra, aumentamos a renda das famílias produtoras e incentivamos a preservação da floresta em pé.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mt-12 border-t border-leaf-600 pt-8">
              <div>
                <div className="text-4xl font-display text-gold-400 mb-2">+300%</div>
                <div className="text-sm text-leaf-200 uppercase tracking-wider">Valor Agregado</div>
              </div>
              <div>
                <div className="text-4xl font-display text-gold-400 mb-2">100%</div>
                <div className="text-sm text-leaf-200 uppercase tracking-wider">Rastreabilidade</div>
              </div>
            </div>
          </div>
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
          <div className="col-span-1 md:col-span-2">
            <span className="font-display text-3xl text-white block mb-6">Qualitheo</span>
            <p className="max-w-md text-cocoa-400 leading-relaxed">
              Agroindústria bioeconômica que conecta a riqueza da Amazônia ao mundo com qualidade, tecnologia e transparência.
            </p>
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
              <li>contato@qualitheo.com.br</li>
              <li>Pará, Amazônia, Brasil</li>
              <li className="pt-4 flex gap-4">
                {/* Social Icons Placeholders */}
                <div className="w-10 h-10 rounded-full bg-cocoa-900 flex items-center justify-center hover:bg-cocoa-800 cursor-pointer transition-colors">IN</div>
                <div className="w-10 h-10 rounded-full bg-cocoa-900 flex items-center justify-center hover:bg-cocoa-800 cursor-pointer transition-colors">LI</div>
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
      <Features />
      <AboutSplit />
      <Products />
      <Impact />
      <Footer />
    </div>
  );
}
