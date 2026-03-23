import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "./lib/i18n";

// Route-based code splitting — each page is only fetched when navigated to.
// This dramatically reduces the initial JS bundle (portal pages are ~50KB each).
const Home = lazy(() => import("@/pages/home"));
const CatalogoB2B = lazy(() => import("@/pages/catalogo-b2b"));
const Carrinho = lazy(() => import("@/pages/carrinho"));
const PortalProdutor = lazy(() => import("@/pages/portal-produtor"));
const PortalQualitheo = lazy(() => import("@/pages/portal-qualitheo"));
const LoteTimeline = lazy(() => import("@/pages/lote-timeline"));
const LojaCerimonial = lazy(() => import("@/pages/loja-cerimonial"));
const Originacao = lazy(() => import("@/pages/originacao"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Minimal dark loading overlay — matches the site's dark cocoa theme,
// preventing jarring white flash during route transitions.
const PageFallback = () => (
  <div
    style={{
      minHeight: "100dvh",
      background: "#130a04",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        border: "3px solid #3d1f09",
        borderTopColor: "#c9922a",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
        {/* Lot traceability */}
        <Route path="/lote/:id/timeline" component={LoteTimeline} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Toaster />
        <Router />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
