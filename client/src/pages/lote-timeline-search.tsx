/**
 * lote-timeline-search.tsx
 * Public Traceability Search Page — /rastreabilidade
 *
 * Visitors paste a lot QR / ID and are navigated to /lote/:id/timeline
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Search, QrCode, ChevronRight, Leaf, Award, Truck } from "lucide-react";
import { Helmet } from "react-helmet-async";

const DEMO_LOTS = [
  { id: "QT-2024-001", label: "Cacau Fino Fermentado", safra: "2024", status: "comprado" },
  { id: "QT-2024-002", label: "Cacau Molhado — Lote Piloto", safra: "2024", status: "em_negociacao" },
  { id: "QT-2024-003", label: "Amêndoa Seca Premium", safra: "2024", status: "em_processamento" },
];

const STEPS = [
  { icon: Leaf,   label: "Colheita & Quebra",     desc: "Seleção criteriosa de frutos maduros" },
  { icon: Award,  label: "Fermentação & Secagem",  desc: "Controle biométrico em tempo real" },
  { icon: QrCode, label: "QR Code por Lote",       desc: "Rastreabilidade da roça ao consumidor" },
  { icon: Truck,  label: "Entrega Documentada",    desc: "Certificado de origem e qualidade" },
];

export default function LoteTimelineSearch() {
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();

  const go = (id: string) => {
    const clean = id.trim();
    if (!clean) return;
    navigate(`/lote/${encodeURIComponent(clean)}/timeline`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    go(query);
  };

  return (
    <div className="min-h-screen bg-cocoa-950 text-white">
      <Helmet>
        <title>Rastreabilidade — Qualitheo</title>
        <meta name="description" content="Rastreie qualquer lote de cacau Qualitheo do campo ao produto final. Escaneie o QR Code ou insira o código do lote." />
      </Helmet>

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-cocoa-800">
        <div className="absolute inset-0 bg-gradient-to-br from-cocoa-950 via-cocoa-900 to-leaf-950 opacity-90" />
        <div className="relative container mx-auto px-6 py-24 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold uppercase tracking-widest">
            <QrCode className="w-3 h-3" />
            Rastreabilidade Total · Qualitheo Chain
          </div>
          <h1 className="font-display text-5xl md:text-6xl mb-6 leading-tight">
            De qual lote é seu cacau?
          </h1>
          <p className="text-cocoa-200 text-lg mb-10 leading-relaxed">
            Insira o código do lote ou escaneie o QR Code da embalagem para ver a história completa — da colheita à entrega.
          </p>

          {/* Search box */}
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cocoa-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Ex: QT-2024-001"
                aria-label="Código do lote"
                className="w-full pl-11 pr-4 py-4 bg-cocoa-900 border border-cocoa-700 rounded-2xl text-white placeholder:text-cocoa-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm font-mono transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!query.trim()}
              className="px-6 py-4 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 disabled:cursor-not-allowed text-cocoa-950 font-bold rounded-2xl transition-all hover:scale-[1.02] text-sm"
            >
              Rastrear
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-4xl">

        {/* Demo lots */}
        <section className="mb-16">
          <p className="text-cocoa-400 text-xs font-bold uppercase tracking-widest mb-4">Lotes de demonstração</p>
          <div className="space-y-3">
            {DEMO_LOTS.map(lot => (
              <button
                key={lot.id}
                onClick={() => go(lot.id)}
                className="w-full flex items-center justify-between bg-cocoa-900 hover:bg-cocoa-800 border border-cocoa-800 hover:border-cocoa-700 rounded-2xl p-5 transition-all group text-left"
              >
                <div>
                  <p className="font-mono text-gold-400 text-sm mb-0.5">{lot.id}</p>
                  <p className="font-medium text-white">{lot.label}</p>
                  <p className="text-xs text-cocoa-500 mt-0.5">Safra {lot.safra}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                    lot.status === "comprado"          ? "bg-green-500/20 text-green-400 border-green-500/30" :
                    lot.status === "em_negociacao"     ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                                                        "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  }`}>
                    {lot.status.replace(/_/g, " ")}
                  </span>
                  <ChevronRight className="w-4 h-4 text-cocoa-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section>
          <p className="text-cocoa-400 text-xs font-bold uppercase tracking-widest mb-8">Como funciona</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="bg-cocoa-900 rounded-2xl border border-cocoa-800 p-5 text-center">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <p className="font-medium text-white text-sm mb-1">{step.label}</p>
                  <p className="text-xs text-cocoa-400 leading-snug">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
