import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "./lib/i18n";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/hooks/useCart";
import { ContentProvider } from "@/providers/ContentProvider";

// Route-based code splitting — each page is only fetched when navigated to.
// This dramatically reduces the initial JS bundle (portal pages are ~50KB each).
const Home = lazy(() => import("@/pages/home"));
const CatalogoB2B = lazy(() => import("@/pages/catalogo-b2b"));
const Carrinho = lazy(() => import("@/pages/carrinho"));
const PortalProdutor = lazy(() => import("@/pages/portal-produtor"));
const PortalQualitheo = lazy(() => import("@/pages/portal-qualitheo"));
const LoteTimeline = lazy(() => import("@/pages/lote-timeline"));
const LoteTimelineSearch = lazy(() => import("@/pages/lote-timeline-search"));
const LojaCerimonial = lazy(() => import("@/pages/loja-cerimonial"));
const Originacao = lazy(() => import("@/pages/originacao"));
const Certificacao = lazy(() => import("@/pages/certificacao"));
const PerfilProdutor = lazy(() => import("@/pages/perfil-produtor"));
const Proforma = lazy(() => import("@/pages/proforma"));
const Admin = lazy(() => import("@/pages/admin"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Minimal dark loading overlay — matches the site's dark cocoa theme,
// preventing jarring white flash during route transitions.
const PageFallback = () => (
  <div className="min-h-[100dvh] bg-[#130a04] flex items-center justify-center">
    <div className="w-8 h-8 border-[3px] border-[#3d1f09] border-t-[#c9922a] rounded-full animate-spin" />
  </div>
);

function Router() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        {/* Originação hub */}
        <Route path="/originacao" component={Originacao} />
        {/* B2B Marketplace */}
        <Route path="/catalogo-b2b" component={CatalogoB2B} />
        <Route path="/carrinho" component={Carrinho} />
        {/* B2C */}
        <Route path="/loja" component={LojaCerimonial} />
        {/* Producer portal */}
        <Route path="/portal-produtor" component={PortalProdutor} />
        {/* Qualitheo internal */}
        <Route path="/portal-qualitheo" component={PortalQualitheo} />
        {/* Lot traceability & Certification */}
        <Route path="/rastreabilidade" component={LoteTimelineSearch} />
        <Route path="/lote/:id/timeline" component={LoteTimeline} />
        <Route path="/certificacao" component={Certificacao} />
        {/* Public profile */}
        <Route path="/perfil/:id" component={PerfilProdutor} />
        {/* Checkout B2B Proforma */}
        <Route path="/pedido/:id/proforma" component={Proforma} />
        {/* Internal admin panel — not linked publicly */}
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <ContentProvider>
              <CartProvider>
                <Toaster />
                <Router />
              </CartProvider>
            </ContentProvider>
          </LanguageProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
