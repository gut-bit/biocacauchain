import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Package, CheckSquare, TrendingUp, Handshake, Truck, XCircle } from "lucide-react";

interface LotEvent {
    id: string;
    lotId: string;
    tipoEvento: string;
    dataEvento: string;
    detalhes: Record<string, any>;
}

interface Lot {
    id: string;
    tipo: string;
    safra: string;
    pesoKg: string;
    scoreQualidade: string | null;
    status: string;
    createdAt: string;
}

const eventConfig: Record<string, { icon: any; label: string; color: string }> = {
    registro: { icon: Package, label: "Lote registrado", color: "text-cocoa-400 border-cocoa-700 bg-cocoa-800" },
    avaliacao: { icon: CheckSquare, label: "Avaliação de qualidade", color: "text-blue-400 border-blue-700 bg-blue-900/20" },
    proposta_qualitheo: { icon: TrendingUp, label: "Proposta da Qualitheo", color: "text-gold-400 border-gold-700 bg-gold-900/20" },
    compra: { icon: Handshake, label: "Compra confirmada", color: "text-green-400 border-green-700 bg-green-900/20" },
    recusa_produtor: { icon: XCircle, label: "Proposta recusada", color: "text-red-400 border-red-700 bg-red-900/20" },
    fermentacao: { icon: Package, label: "Fermentação", color: "text-purple-400 border-purple-700 bg-purple-900/20" },
    secagem: { icon: Package, label: "Secagem", color: "text-orange-400 border-orange-700 bg-orange-900/20" },
    envio: { icon: Truck, label: "Envio realizado", color: "text-teal-400 border-teal-700 bg-teal-900/20" },
};

export default function LoteTimeline() {
    const [, params] = useRoute("/lote/:id/timeline");
    const lotId = params?.id;

    const [lot, setLot] = useState<Lot | null>(null);
    const [events, setEvents] = useState<LotEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!lotId) return;
        fetch(`/api/lots/${lotId}/timeline`)
            .then(r => r.json())
            .then(data => { setLot(data.lot); setEvents(data.events); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [lotId]);

    const fmt = (iso: string) => {
        if (!iso) return "—";
        const d = new Date(iso);
        return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="min-h-screen bg-cocoa-950 text-white">
            <header className="sticky top-0 z-50 bg-cocoa-900/95 backdrop-blur-md border-b border-white/10 px-6 py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <Link href="/portal-qualitheo">
                        <button className="flex items-center gap-2 text-cocoa-300 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" /><span className="text-sm">Gestão de lotes</span>
                        </button>
                    </Link>
                    <span className="font-display font-semibold">Rastreabilidade do <span className="text-gold-400">Lote</span></span>
                    <div />
                </div>
            </header>

            <div className="container mx-auto px-6 py-10 max-w-2xl">
                {loading ? (
                    <p className="text-cocoa-400 text-center py-20">Carregando timeline...</p>
                ) : !lot ? (
                    <p className="text-cocoa-400 text-center py-20">Lote não encontrado</p>
                ) : (
                    <>
                        {/* Cabeçalho do lote */}
                        <div className="bg-cocoa-900 rounded-2xl border border-white/10 p-5 mb-8">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-xs text-cocoa-500 font-mono mb-1">#{lot.id}</p>
                                    <h2 className="font-display text-2xl">{lot.tipo.replace(/_/g, " ")}</h2>
                                    <p className="text-cocoa-400 text-sm">Safra {lot.safra}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-white">{Number(lot.pesoKg).toFixed(0)} kg</p>
                                    {lot.scoreQualidade && <p className="text-gold-400 text-sm">Score {lot.scoreQualidade}/100</p>}
                                </div>
                            </div>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${lot.status === "comprado" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                                    lot.status === "em_negociacao" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                                        "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}`}>
                                {lot.status.replace(/_/g, " ")}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="relative">
                            {/* Linha vertical */}
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />

                            {events.length === 0 ? (
                                <p className="text-cocoa-500 text-sm pl-16">Nenhum evento registrado ainda.</p>
                            ) : (
                                <div className="space-y-6">
                                    {events.map((event, i) => {
                                        const cfg = eventConfig[event.tipoEvento] || { icon: Package, label: event.tipoEvento, color: "text-cocoa-400 border-cocoa-700 bg-cocoa-800" };
                                        const Icon = cfg.icon;
                                        return (
                                            <div key={event.id} className="relative pl-16">
                                                {/* Ícone */}
                                                <div className={`absolute left-0 w-12 h-12 rounded-full border flex items-center justify-center ${cfg.color}`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>

                                                <div className="bg-cocoa-900 rounded-xl border border-white/10 p-4">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <h4 className="font-medium text-white text-sm">{cfg.label}</h4>
                                                        <span className="text-xs text-cocoa-500">{fmt(event.dataEvento)}</span>
                                                    </div>

                                                    {/* Detalhes do evento */}
                                                    {event.detalhes && Object.keys(event.detalhes).length > 0 && (
                                                        <div className="mt-2 space-y-1">
                                                            {Object.entries(event.detalhes).map(([k, v]) => (
                                                                <div key={k} className="flex justify-between text-xs">
                                                                    <span className="text-cocoa-500 capitalize">{k.replace(/_/g, " ")}</span>
                                                                    <span className="text-cocoa-300 font-mono">
                                                                        {typeof v === "number" ? v.toFixed(2) : String(v)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
