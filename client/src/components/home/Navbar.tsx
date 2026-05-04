import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import ASSETS from "./assets";

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

        <div className="hidden md:flex items-center gap-8">
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
              <div className="absolute top-full right-0 mt-2 w-64 rounded-2xl border border-white/10 shadow-2xl p-2 z-50 flex flex-col gap-1 bg-[#1c0d04]">
              {/* Originação — highlighted */}
              <a href="/originacao"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm bg-green-800/60 text-green-300 hover:bg-green-700/60 hover:text-white transition-all font-semibold mb-1">
                <span>🌿</span> Originação — Comprar Cacau
              </a>
              <a href="/portal-produtor"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-cocoa-200 hover:bg-white/10 hover:text-white transition-all">
                <span>🌾</span> Portal do Produtor
              </a>
              <a href="/rastreabilidade"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-cocoa-200 hover:bg-white/10 hover:text-white transition-all">
                <span>🔍</span> Rastreabilidade
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
              <a href="/carrinho"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-cocoa-200 hover:bg-white/10 hover:text-white transition-all">
                <span>🛒</span> Meu Carrinho
              </a>
              <div className="border-t border-white/10 my-1" />
              <a href="/portal-qualitheo"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-cocoa-200 hover:bg-white/10 hover:text-white transition-all">
                <span>⚙️</span> Portal Admin (Qualitheo)
              </a>
            </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className={`flex items-center gap-3 ml-2 pl-4 border-l ${isScrolled ? 'border-cocoa-300' : 'border-white/20'}`}>
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
              <span className={`text-xs font-bold ${isScrolled ? "text-cocoa-900" : "text-white"}`}>PT</span>
            </button>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-4">
          {/* Mobile Language Switcher */}
          <div className="flex items-center gap-2">
            <button aria-label="Switch to English" title="English" onClick={() => setLanguage('en')} className={`w-6 h-4 rounded overflow-hidden shadow-sm ${language === 'en' ? 'ring-2 ring-gold-500' : 'opacity-70'}`}>
              <img src="https://flagcdn.com/us.svg" alt="USA Flag" className="w-full h-full object-cover" />
            </button>
            <button aria-label="Switch to Portuguese" title="Português" onClick={() => setLanguage('pt')} className={`w-6 h-4 rounded overflow-hidden shadow-sm ${language === 'pt' ? 'ring-2 ring-gold-500' : 'opacity-70'}`}>
              <img src="https://flagcdn.com/br.svg" alt="Brazil Flag" className="w-full h-full object-cover" />
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
                  <a href="/carrinho"
                    className="flex items-center gap-2 text-xl font-display font-medium text-cocoa-800 hover:text-gold-600 transition-colors">
                    <span>🛒</span> Meu Carrinho
                  </a>
                  <p className="text-xs uppercase tracking-widest text-cocoa-500 mb-2 mt-4">Administração</p>
                  <a href="/portal-qualitheo"
                    className="flex items-center gap-2 text-xl font-display font-medium text-cocoa-800 hover:text-gold-600 transition-colors">
                    <span>⚙️</span> Portal Admin
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

export default Navbar;
