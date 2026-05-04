import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";

interface PrecoMercado {
    tipo: string;
    descricao: string;
    precoMedioRKg: number;
    variacao: number;
    unidade: string;
}

interface TabelaPrecos {
    precos: PrecoMercado[];
    premiumQualidade: number;
    descontoLogistica: number;
    fatorSocioAmbiental: number;
    notas: string;
    atualizadoEm: string;
    atualizadoPor: string;
}

function VariacaoBadge({ v }: { v: number }) {
    if (v > 0) return (
        <span className="flex items-center gap-0.5 text-green-400 text-xs font-bold">
            <TrendingUp className="w-3 h-3" />+{v.toFixed(1)}%
        </span>
    );
    if (v < 0) return (
        <span className="flex items-center gap-0.5 text-red-400 text-xs font-bold">
            <TrendingDown className="w-3 h-3" />{v.toFixed(1)}%
        </span>
    );
    return (
        <span className="flex items-center gap-0.5 text-gray-400 text-xs">
            <Minus className="w-3 h-3" />—
        </span>
    );
}

export default function PrecosWidget() {
    const [tabela, setTabela] = useState<TabelaPrecos | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchPrecos = () => {
        setLoading(true);
        fetch("/api/precos-mercado")
            .then(r => r.json())
            .then(setTabela)
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchPrecos(); }, []);

    if (loading) return null;
    if (!tabela || !tabela.precos) return null;

    const updatedDate = new Date(tabela.atualizadoEm).toLocaleDateString("pt-BR", {
        day: "2-digit", month: "short", year: "numeric"
    });

    return (
        <section className="relative bg-gradient-to-r from-cocoa-950 via-cocoa-900 to-cocoa-950 border-y border-white/10 py-6 px-4 overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,#fff_0,#fff_1px,transparent_0,transparent_50%)] bg-[size:12px_12px]" />

            <div className="container mx-auto max-w-6xl relative">
                {/* Header row */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs font-semibold text-cocoa-300 uppercase tracking-widest">
                            Preços Qualitheo — Compra de Cacau
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-cocoa-500">Atualizado {updatedDate}</span>
                        <button onClick={fetchPrecos} aria-label="Atualizar preços" title="Atualizar preços" className="text-cocoa-500 hover:text-cocoa-300 transition-colors">
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Price cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    {tabela.precos.map(p => (
                        <div key={p.tipo} className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition-all group">
                            <div>
                                <p className="text-xs text-cocoa-400 mb-0.5">{p.descricao}</p>
                                <p className="text-2xl font-extrabold text-white">
                                    R$ <span className="text-gold-400">{p.precoMedioRKg.toFixed(2)}</span>
                                </p>
                                <p className="text-xs text-cocoa-500">{p.unidade}</p>
                            </div>
                            <div className="text-right">
                                <VariacaoBadge v={p.variacao} />
                                <p className="text-xs text-cocoa-600 mt-1">dia</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Premium factors row */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-cocoa-400 border-t border-white/8 pt-3">
                    <span>
                        🏆 Premium Qualidade:
                        <strong className="text-green-400 ml-1">+{tabela.premiumQualidade}%</strong>
                    </span>
                    <span>
                        🚚 Logística:
                        <strong className="text-red-400 ml-1">−{tabela.descontoLogistica}%</strong>
                    </span>
                    <span>
                        🌿 Bônus Socioambiental:
                        <strong className="text-green-400 ml-1">+{tabela.fatorSocioAmbiental}%</strong>
                    </span>
                    <span className="ml-auto text-cocoa-600 italic hidden md:block">{tabela.notas}</span>
                </div>
            </div>
        </section>
    );
}
