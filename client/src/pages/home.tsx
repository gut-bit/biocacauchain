import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Leaf, Factory, Globe, CheckCircle2, Menu, Snowflake, Layers, Box, Droplet, Scale, Award, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const ASSETS = {
  hero_bg: "/attached_assets/dji_fly_20240713_195956_0136_1721755357579_photo_1764267587664.jpg",
  cocoa_pod: "/attached_assets/20250503_153303~2_1764267587664.jpg",
  warehouse: "/attached_assets/Gemini_Generated_Image_fx3qlvfx3qlvfx3q_1764267587665.png",
  logo_qualitheo: "/attached_assets/IMG-20230823-WA0095_1764268475827.jpg",
  logo_vertical: "/attached_assets/Logo vertical 01_1764268926778.png",
  logo_horizontal: "/attached_assets/logo horizontal 2_1764268926779.png",
  farm_worker: "/attached_assets/Screenshot_20251009_180100_Instagram_1764267587667.jpg",
  certificate: "/attached_assets/IMG_20210503_092102_287_1764268614308.jpg",
  
  // New Assets
  cocoa_hands: "/attached_assets/IMG-20230614-WA0086_1764268614307.jpg",
  cut_test: "/attached_assets/IMG_20210427_224010_677_1764268614308.jpg",
  factory_ext: "/attached_assets/IMG_20241105_080348_768_1764268614309.jpg",
  
  // Product specific assets
  nectar: "/attached_assets/Gemini_Generated_Image_v3bi8bv3bi8bv3bi_1764267587666.png",
  beans_container: "/attached_assets/Gemini_Generated_Image_197q3q197q3q197q_1764267587665.png",
  nibs_bags: "/attached_assets/Gemini_Generated_Image_t9rg9ut9rg9ut9rg_1764267587666.png",
  liquor_blocks: "/attached_assets/Gemini_Generated_Image_h2fr4gh2fr4gh2fr_1764267587665.png",
  butter_blocks: "/attached_assets/Gemini_Generated_Image_tvjurdtvjurdtvju_1764267587666.png",
  qr_code: "/attached_assets/Imagem do WhatsApp de 2025-11-04 à(s) 20.15.21_25093819_1764268868956.jpg",
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
          <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white text-xs font-medium uppercase tracking-widest mb-6">
            <Award className="w-3 h-3 text-gold-400" />
            <span>Cocoa of Excellence Award Winner</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white font-medium leading-[1.1] mb-6">
            Excelência <br />
            <span className="italic font-light text-gold-400">em cada amêndoa</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Do cultivo premiado no Pará à exportação global. Elevamos a cadeia do cacau com tecnologia, rastreabilidade e impacto real.
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
        <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-auto group">
          <img 
            src={ASSETS.cut_test} 
            alt="Teste de Corte Cacau Fino" 
            className="absolute inset-0 w-full h-full object-cover"
          />
           <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
           
           {/* Award Badge Overlay */}
           <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 text-white">
              <div className="flex items-start gap-4">
                 <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-gold-400 bg-white p-1">
                    <img src={ASSETS.certificate} alt="Award" className="w-full h-full object-contain" />
                 </div>
                 <div>
                   <div className="flex items-center gap-2 text-gold-400 mb-1">
                      <Award className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Reconhecimento Internacional</span>
                   </div>
                   <h4 className="font-display text-xl mb-1">Cocoa of Excellence</h4>
                   <p className="text-sm text-white/80">Selecionado entre os 50 melhores do mundo (Salon du Chocolat, Paris).</p>
                 </div>
              </div>
           </div>
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
          subtitle="Bloco 1: A Essência Fresca"
          title="Néctar de Cacau Congelado"
          description="O puro frescor da floresta, conhecido como 'Suco de Deus'. Extraído via 'Clean Extraction' e submetido a congelamento rápido para preservar nutrientes e o sabor cítrico único."
          image={ASSETS.nectar}
          accentColor="leaf"
          products={[
            {
              name: "Néctar de Cacau (Suco de Deus)",
              desc: "Ideal para indústria de bebidas, sucos premium, sorveterias e mixologia.",
              formats: ["Tetra Pak 1L", "Galão 5L", "Bombona 25L", "Barrica 80L"]
            }
          ]}
        />

        <Separator className="my-24 bg-cocoa-100" />

        {/* BLOCO 2: Amêndoas */}
        <ProductBlock
          align="right"
          subtitle="Bloco 2: Matéria-Prima Fundamental"
          title="Amêndoas Fermentadas"
          description="O alicerce da indústria. Amêndoas selecionadas na origem, com fermentação rigorosa para perfil aromático superior. Qualidade 'Export Standard'."
          image={ASSETS.beans_container}
          products={[
            {
              name: "Amêndoas Padrão Exportação",
              desc: "Para fabricantes Bean-to-Bar e grandes indústrias moageiras.",
              formats: ["Sacos Juta 60kg", "Paletes 1 Ton", "Meio Container (12.5T)", "Container Cheio (25T)"]
            }
          ]}
        />

        <Separator className="my-24 bg-cocoa-100" />

        {/* BLOCO 3: Nibs */}
        <ProductBlock
          align="left"
          subtitle="Bloco 3: Crocância e Sabor Puro"
          title="Nibs de Cacau"
          description="Amêndoas torradas e trituradas em pedaços puros. Sabor intenso de chocolate e textura crocante sem adição de açúcar."
          image={ASSETS.nibs_bags}
          products={[
            {
              name: "Cacao Nibs",
              desc: "Perfeito para barras de cereais, granolas, iogurtes e cervejarias artesanais.",
              formats: ["Varejo 100g/500g", "Sacos 5kg/25kg/60kg", "Big Bags 1 Ton"]
            }
          ]}
        />

        <Separator className="my-24 bg-cocoa-100" />

        {/* BLOCO 4: Processamento Secundário */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start mb-12">
           <div className="w-full lg:w-1/2 sticky top-24">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              {/* Using liquor/butter image */}
              <img src={ASSETS.liquor_blocks} alt="Processamento Secundário" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
               <div className="absolute bottom-8 left-8 text-white">
                 <h3 className="font-display text-3xl mb-2">O Coração do Chocolate</h3>
                 <p className="text-white/80">Processamento Secundário de Alta Precisão</p>
               </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
             <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-6 bg-gold-500/10 text-gold-700">
              Bloco 4: Processamento Secundário
            </span>
            <h3 className="font-display text-3xl md:text-4xl text-cocoa-900 mb-6">Ingredientes Industriais</h3>
            <p className="text-cocoa-600 text-lg mb-10 leading-relaxed">
              Os produtos resultantes da moagem e prensagem. Ingredientes base essenciais para a indústria de confeitaria mundial.
            </p>

            <div className="space-y-10">
              {[
                {
                  title: "Líquor de Cacau (Massa)",
                  desc: "100% cacau puro moído. A alma de qualquer chocolate.",
                  formats: ["Blocos Sólidos 25kg", "Paletes 500kg a 25T"]
                },
                {
                  title: "Manteiga de Cacau",
                  desc: "Gordura nobre 'The Golden Fat'. Para chocolate, confeitaria e cosméticos.",
                  formats: ["Blocos Sólidos 25kg", "Paletes Industriais"]
                },
                {
                  title: "Pó de Cacau (Fine Quality)",
                  desc: "Pó finíssimo de cor rica e sabor intenso. Para bebidas e panificação.",
                  formats: ["Sacos Papel 25kg", "Sacos Juta 60kg", "Big Bags 1 Ton"]
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-cocoa-50 p-6 rounded-xl border border-cocoa-100 hover:border-gold-400 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-display text-xl text-cocoa-900">{item.title}</h4>
                    {idx === 1 ? <Droplet className="text-gold-500 w-5 h-5" /> : idx === 0 ? <Layers className="text-cocoa-700 w-5 h-5" /> : <Snowflake className="text-cocoa-500 w-5 h-5" />}
                  </div>
                  <p className="text-cocoa-600 text-sm mb-4">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.formats.map((fmt, i) => (
                       <span key={i} className="inline-flex items-center px-2 py-1 bg-white border border-cocoa-200 text-cocoa-600 text-xs font-medium rounded">
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
              src={ASSETS.cocoa_hands} 
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
          <div className="col-span-1 md:col-span-2 flex flex-col items-start">
            <div className="bg-white p-4 rounded-xl mb-6 w-fit">
              <img src={ASSETS.logo_vertical} alt="Qualitheo Logo" className="h-32 w-auto object-contain" />
            </div>
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
              <li className="font-medium text-white">Helton Gutzeit | CEO</li>
              <li>contato@qualitheo.com.br</li>
              <li>+55 93 99235-6251</li>
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
      <Features />
      <AboutSplit />
      <Products />
      <Impact />
      <Footer />
    </div>
  );
}
