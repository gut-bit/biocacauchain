import { useState, useEffect, useCallback } from "react";
import { BarChart3, RefreshCw, Package, TrendingUp } from "lucide-react";

// ─── Origination Analytics Dashboard ──────────────────────────────────────────
export default function OriginationDashboard() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = useCallback(() => {
        setLoading(true);
        fetch('/api/analytics/origination')
            .then(r => r.json())
            .then(data => setAnalytics(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 30000); // refresh every 30s
        return () => clearInterval(interval);
    }, [fetchAnalytics]);

    if (loading && !analytics) {
        return <div className="container mx-auto max-w-7xl px-4 mt-6 mb-8"><div className="animate-pulse bg-white border border-gray-100 rounded-3xl h-48 w-full"></div></div>;
    }
    
    if (!analytics) return null;

    const formatKg = (kg: number) => (kg / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + " ton";
    const formatCurrency = (val: number) => "R$ " + val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="container mx-auto max-w-7xl px-4 mt-8 mb-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-gray-900 flex items-center gap-2 text-xl tracking-tight">
                        <BarChart3 className="w-6 h-6 text-green-700" /> Dashboard Analítico (Macro)
                    </h2>
                    <button onClick={fetchAnalytics} className="text-xs text-gray-400 hover:text-green-700 font-medium flex items-center gap-1 transition-colors">
                        <RefreshCw className="w-3.5 h-3.5" /> Atualizar agora
                    </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Lotes & Funil */}
                    <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100/80">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-1.5"><Package className="w-4 h-4 text-gray-400"/> Funil (Lotes)</p>
                        <div className="flex justify-between items-end">
                            <div className="text-center w-1/3 border-r border-gray-200">
                                <p className="text-3xl font-extrabold text-gray-800">{analytics.funnel.draft}</p>
                                <p className="text-xs font-medium text-gray-500 mt-1">Abertos</p>
                            </div>
                            <div className="text-center w-1/3 border-r border-gray-200">
                                <p className="text-3xl font-extrabold text-blue-600">{analytics.funnel.em_negociacao}</p>
                                <p className="text-xs font-medium text-blue-600/80 mt-1">Negociação</p>
                            </div>
                            <div className="text-center w-1/3">
                                <p className="text-3xl font-extrabold text-green-600">{analytics.funnel.comprado}</p>
                                <p className="text-xs font-medium text-green-600/80 mt-1">Comprados</p>
                            </div>
                        </div>
                    </div>

                    {/* Volume Físico */}
                    <div className="bg-green-50/50 rounded-2xl p-5 border border-green-100">
                        <p className="text-xs font-semibold text-green-800 uppercase tracking-widest mb-4 flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-green-500"/> Volume Físico</p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm border-b border-green-100/50 pb-2">
                                <span className="text-green-700/80 font-medium">Em Prospecção</span>
                                <span className="font-bold text-gray-800">{formatKg(analytics.weightKg.draft)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-green-100/50 pb-2">
                                <span className="text-green-700/80 font-medium">Lotes Propostos</span>
                                <span className="font-bold text-blue-700">{formatKg(analytics.weightKg.em_negociacao)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-green-800 font-semibold">Garantido / Estoque</span>
                                <span className="font-extrabold text-green-700">{formatKg(analytics.weightKg.comprado)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Financeiro */}
                    <div className="bg-gradient-to-br from-green-950 to-green-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <TrendingUp className="w-24 h-24" />
                        </div>
                        <p className="text-xs font-semibold text-green-200 uppercase tracking-widest mb-4 relative z-10 flex items-center justify-between">
                            Compromisso Financeiro
                        </p>
                        <div className="space-y-4 relative z-10">
                            <div>
                                <p className="text-xs text-green-200/80 mb-0.5 font-medium">Capital Comprometido (Negociando)</p>
                                <p className="text-2xl font-bold text-blue-300 tracking-tight">{formatCurrency(analytics.financialR$.em_negociacao)}</p>
                            </div>
                            <div className="pt-3 border-t border-green-800">
                                <p className="text-xs text-green-200/80 mb-0.5 font-medium">Capital Executado (Comprados)</p>
                                <p className="text-3xl font-extrabold text-green-400 tracking-tight">{formatCurrency(analytics.financialR$.comprado)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

