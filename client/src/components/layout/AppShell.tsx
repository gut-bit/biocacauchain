import { useState, useEffect, type ReactNode } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import ASSETS from "@/components/home/assets";

/**
 * AppShell — Shared layout wrapper for all internal pages (B2B, Cart, Origination, etc.)
 *
 * Usage:  <AppShell> ...page content... </AppShell>
 *
 * The Home page does NOT use this — it has its own Navbar + Footer with the
 * landing-page-specific layout.
 */

interface AppShellProps {
  children: ReactNode;
  /** If true, uses a light (white) theme instead of dark cocoa. Default: false (dark). */
  light?: boolean;
}

export default function AppShell({ children, light = false }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { orderId } = useCart();

  // ---------- Navigation data ----------
  const siteLinks = [
    { label: "Início", href: "/" },
    { label: "Originação", href: "/originacao" },
    { label: "Catálogo B2B", href: "/catalogo-b2b" },
    { label: "Loja Cerimonial", href: "/loja" },
    { label: "Carrinho", href: "/carrinho", icon: ShoppingCart },
  ];

  const adminLinks = [
    { label: "Portal Produtor", href: "/portal-produtor" },
    { label: "Portal Admin", href: "/portal-qualitheo" },
  ];

  // ---------- Styles ----------
  const bgHeader = light
    ? "bg-white/95 border-b border-gray-200 shadow-sm"
    : "bg-cocoa-900/95 border-b border-white/10";
  const textColor = light ? "text-gray-900" : "text-white";
  const mutedText = light ? "text-gray-500" : "text-cocoa-300";
  const pageBg = light ? "bg-white" : "bg-cocoa-950";
  const footerBg = light ? "bg-gray-100 text-gray-600 border-t border-gray-200" : "bg-cocoa-950 text-cocoa-400 border-t border-white/10";

  return (
    <div className={`min-h-screen ${pageBg} ${textColor} flex flex-col`}>
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 backdrop-blur-md px-6 py-3 ${bgHeader}`}>
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="h-10 flex items-center cursor-pointer">
              <img
                src={ASSETS.logo_horizontal}
                alt="Qualitheo Logo"
                className={`h-full w-auto object-contain transition-all duration-300 ${light ? "" : "brightness-0 invert"}`}
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-5">
            {siteLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`text-sm font-medium hover:opacity-70 transition-opacity cursor-pointer ${mutedText} hover:${textColor}`}>
                  {link.icon ? (
                    <span className="flex items-center gap-1.5">
                      <link.icon className="w-4 h-4" />
                      {link.label}
                      {link.href === "/carrinho" && orderId && (
                        <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                      )}
                    </span>
                  ) : (
                    link.label
                  )}
                </span>
              </Link>
            ))}

            {/* Separator */}
            <div className={`w-px h-5 ${light ? "bg-gray-300" : "bg-white/20"}`} />

            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`text-xs font-medium uppercase tracking-wider hover:opacity-70 transition-opacity cursor-pointer ${mutedText}`}>
                  {link.label}
                </span>
              </Link>
            ))}

            {/* Language */}
            <div className={`flex items-center gap-2 ml-2 pl-3 border-l ${light ? "border-gray-300" : "border-white/20"}`}>
              <button
                onClick={() => setLanguage("en")}
                className={`w-6 h-4 rounded overflow-hidden shadow-sm ${language === "en" ? "ring-2 ring-gold-500" : "opacity-60 hover:opacity-100"}`}
              >
                <img src="https://flagcdn.com/us.svg" alt="EN" className="w-full h-full object-cover" />
              </button>
              <button
                onClick={() => setLanguage("pt")}
                className={`w-6 h-4 rounded overflow-hidden shadow-sm ${language === "pt" ? "ring-2 ring-gold-500" : "opacity-60 hover:opacity-100"}`}
              >
                <img src="https://flagcdn.com/br.svg" alt="PT" className="w-full h-full object-cover" />
              </button>
            </div>
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile language flags */}
            <div className="flex items-center gap-1.5">
              <button aria-label="English" onClick={() => setLanguage("en")} className={`w-5 h-3.5 rounded overflow-hidden ${language === "en" ? "ring-2 ring-gold-500" : "opacity-60"}`}>
                <img src="https://flagcdn.com/us.svg" alt="EN" className="w-full h-full object-cover" />
              </button>
              <button aria-label="Português" onClick={() => setLanguage("pt")} className={`w-5 h-3.5 rounded overflow-hidden ${language === "pt" ? "ring-2 ring-gold-500" : "opacity-60"}`}>
                <img src="https://flagcdn.com/br.svg" alt="PT" className="w-full h-full object-cover" />
              </button>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={textColor}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-cocoa-50 border-cocoa-200">
                <div className="flex flex-col gap-4 mt-10">
                  <p className="text-xs uppercase tracking-widest text-cocoa-500 mb-1">Navegação</p>
                  {siteLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span className="text-xl font-display font-medium text-cocoa-900 hover:text-gold-600 transition-colors cursor-pointer block">
                        {link.label}
                      </span>
                    </Link>
                  ))}
                  <div className="border-t border-cocoa-200 pt-3 mt-2" />
                  <p className="text-xs uppercase tracking-widest text-cocoa-500 mb-1">Administração</p>
                  {adminLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span className="text-lg font-display font-medium text-cocoa-800 hover:text-gold-600 transition-colors cursor-pointer block">
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ─── Page Content ──────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <footer className={`py-8 px-6 text-center text-sm ${footerBg}`}>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Qualitheo Agroindustries. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/"><span className="hover:underline cursor-pointer">Início</span></Link>
            <Link href="/catalogo-b2b"><span className="hover:underline cursor-pointer">Catálogo B2B</span></Link>
            <Link href="/originacao"><span className="hover:underline cursor-pointer">Originação</span></Link>
            <a href="mailto:gut@qualihteo.com" className="hover:underline">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
