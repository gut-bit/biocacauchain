import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import InfrastructureShowcase from "@/components/home/InfrastructureShowcase";
import MarketThesis from "@/components/home/MarketThesis";
import Features from "@/components/home/Features";
import ProcessDiagram from "@/components/home/ProcessDiagram";
import AboutSplit from "@/components/home/AboutSplit";
import Products from "@/components/home/Products";
import Impact from "@/components/home/Impact";
import Partners from "@/components/home/Partners";
import MarketplaceSection from "@/components/home/MarketplaceSection";
import Footer from "@/components/home/Footer";
import PrecosWidget from "@/components/PrecosWidget";
import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-gold-200 selection:text-cocoa-900">
      <Helmet>
        <title>BioCacauChain | Cacau Fino, Originação e Ingredientes B2B</title>
        <meta name="description" content="Plataforma líder em soluções de rastreabilidade para cacau fino. Conectamos produtores de qualidade ao mercado gourmet e à indústria chocolateira." />
      </Helmet>
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
