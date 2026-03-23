import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import {
    ArrowLeft, ClipboardList, TrendingUp, Send, CheckCircle2,
    Clock, Package, RefreshCw, Loader2, Shield, AlertCircle,
    ChevronDown, ChevronUp, FileText, BarChart3
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Lot {
    id: string;
    producerId: string;
    tipo: string;
    safra: string;
    pesoKg: string;
    scoreQualidade: string | null;
    status: string;
    createdAt: string;
}

interface PrecoResult {
    lot_id: string;
    preco_min_r_kg: string;
    preco_max_r_kg: string;
    preco_sugerido_r_kg: string;
    componentes?: Record<string, any>;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CHECKLIST = [
    { key: "selecao_frutos", label: "Seleção de frutos" },
    { key: "higiene_colheita", label: "Higiene na colheita" },
    { key: "tempo_colheita_quebra", label: "Tempo colheita → quebra" },
    { key: "selecao_interna", label: "Seleção interna" },
    { key: "uniformidade_lote", label: "Uniformidade do lote" },
    { key: "ausencia_corpos_estranhos", label: "Ausência de corpos estranhos" },
    { key: "condicoes_transporte", label: "Condições de transporte" },
];

const PAYMENT_TERMS = [
    "À vista na entrega",
    "30 dias após entrega",
    "50% antecipado + 50% na entrega",
    "30/60 dias",
    "Negociação direta",
];

const STATUS = {
    draft: { label: "Novo", color: "text-amber-700", bg: "bg-amber-50 border-amber-300" },
    em_negociacao: { label: "Em negociação", color: "text-blue-700", bg: "bg-blue-50 border-blue-300" },
    comprado: { label: "Comprado", color: "text-green-700", bg: "bg-green-50 border-green-300" },
    cancelado: { label: "Cancelado", color: "text-red-700", bg: "bg-red-50 border-red-300" },
} as Record<string, { label: string; color: string; bg: string }>;

const FILTERS = [
    { value: "draft", label: "Novos Lotes" },
    { value: "em_negociacao", label: "Em Negociação" },
    { value: "comprado", label: "Comprados" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function PortalQualitheo() {
    const [lots, setLots] = useState<Lot[]>([]);
    const [loadingLots, setLoadingLots] = useState(true);
    const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
    const [precoResult, setPrecoResult] = useState<PrecoResult | null>(null);
    const [filterStatus, setFilterStatus] = useState("draft");
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Checklist state
    const [checkOpen, setCheckOpen] = useState(false);
    const [checkItens, setCheckItens] = useState<Record<string, number>>(
        Object.fromEntries(CHECKLIST.map(i => [i.key, 8]))
    );
    const totalCheck = Object.values(checkItens).reduce((a, b) => a + b, 0);
    const [avaliando, setAvaliando] = useState(false);

    // Proposal state — fully manual
    const [precoManual, setPrecoManual] = useState<string>("");
    const [justificativa, setJustificativa] = useState("");
    const [condicoesPag, setCondicoesPag] = useState(PAYMENT_TERMS[0]);
    const [validadeDias, setValidadeDias] = useState("5");
    const [obsInternas, setObsInternas] = useState("");
    const [calculando, setCalculando] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [useCalculator, setUseCalculator] = useState(false);

    // ─── Data fetch ──────────────────────────────────────────────────────────────
    const fetchLots = useCallback(() => {
        setLoadingLots(true);
        fetch(`/api/lots?status=${filterStatus}`)
            .then(r => r.json())
            .then(d => setLots(Array.isArray(d) ? d : []))
            .catch(() => setLots([]))
            .finally(() => setLoadingLots(false));
    }, [filterStatus]);

    useEffect(() => { fetchLots(); }, [fetchLots, success]);

    const selectLot = (lot: Lot) => {
        setSelectedLot(lot);
        setPrecoResult(null);
        setPrecoManual("");
        setJustificativa("");
        setObsInternas("");
        setError(null);
    };

    // ─── Handlers ────────────────────────────────────────────────────────────────
    const handleAvaliar = async () => {
        if (!selectedLot) return;
        setAvaliando(true); setError(null);
        try {
            const r = await fetch(`/api/lots/${selectedLot.id}/avaliar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itens: checkItens }),
            });
            if (!r.ok) throw new Error((await r.json()).message);
            const res = await r.json();
            setSelectedLot(l => l ? { ...l, scoreQualidade: res.score_qualidade.toFixed(1) } : l);
            setSuccess(`✅ Score de qualidade salvo: ${res.score_qualidade.toFixed(1)} / 100`);
            setCheckOpen(false);
        } catch (e: any) { setError(e.message); }
        finally { setAvaliando(false); }
    };

    const handleCalcPreco = async () => {
        if (!selectedLot) return;
        setCalculando(true); setError(null);
        try {
            const r = await fetch(`/api/lots/${selectedLot.id}/preco`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ modalidade: selectedLot.tipo, indice_fidelidade: 0.3 }),
            });
            if (!r.ok) throw new Error((await r.json()).message);
            const res = await r.json();
            setPrecoResult(res);
            setPrecoManual(parseFloat(res.preco_sugerido_r_kg).toFixed(2));
        } catch (e: any) { setError(e.message); }
        finally { setCalculando(false); }
    };

    const handleProposta = async () => {
        if (!selectedLot) return;
        const preco = parseFloat(precoManual);
        if (!preco || preco <= 0) { setError("Informe um preço válido"); return; }

        setEnviando(true); setError(null);
        try {
            const r = await fetch(`/api/lots/${selectedLot.id}/proposta`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    precoOferecidoRKg: preco,
                    precoSugeridoRKg: precoResult?.preco_sugerido_r_kg || precoManual,
                    precoMinRKg: precoResult?.preco_min_r_kg || "0",
                    justificativa,
                    condicoesPagamento: condicoesPag,
                    validadeDias: Number(validadeDias),
                    obsInternas,
                }),
            });
            if (!r.ok) throw new Error((await r.json()).message);
            setSuccess(`✅ Proposta de R$ ${preco.toFixed(2)}/kg enviada para o produtor!`);
            setSelectedLot(null);
            setFilterStatus("em_negociacao");
        } catch (e: any) { setError(e.message); }
        finally { setEnviando(false); }
    };

    const preco = parseFloat(precoManual) || 0;
    const totalLote = preco * Number(selectedLot?.pesoKg || 0);

    const stats = {
        total: lots.length,
        negociacao: lots.filter(l => l.status === "em_negociacao").length,
        comprados: lots.filter(l => l.status === "comprado").length,
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header com Gradiente Premium */}
            <header className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-6 py-5 sticky top-0 z-50 shadow-lg text-white">
                <div className="container mx-auto flex items-center justify-between">
                    <Link href="/originacao">
                        <button className="flex items-center gap-2 text-green-100 hover:text-white transition-colors text-sm font-medium">
                            <ArrowLeft className="w-4 h-4" /> Voltar
                        </button>
                    </Link>
                    <div className="text-center flex-1">
                        <h1 className="text-xl font-bold tracking-tight">Portal Qualitheo</h1>
                        <p className="text-xs text-green-200/80 uppercase tracking-widest font-semibold mt-0.5">Gestão de Originação</p>
                    </div>
                    <button onClick={fetchLots} className="text-green-200 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all" title="Atualizar lista">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Alertas */}
            {success && (
                <div className="bg-green-50/80 backdrop-blur-sm border-b border-green-200 px-6 py-3 text-green-800 text-sm flex items-center justify-center gap-2 shadow-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />{success}
                    <button onClick={() => setSuccess(null)} className="ml-4 text-green-600/60 hover:text-green-900 transition-colors">✕</button>
                </div>
            )}
            {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border-b border-red-200 px-6 py-3 text-red-800 text-sm flex items-center justify-center gap-2 shadow-sm font-medium">
                    <AlertCircle className="w-4 h-4 text-red-600" />{error}
                    <button onClick={() => setError(null)} className="ml-4 text-red-600/60 hover:text-red-900 transition-colors">✕</button>
                </div>
            )}

            {/* Dashboard Analytics */}
            <OriginationDashboard />

            <div className="container mx-auto px-4 pb-8 max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-8">

                {/* ── Sidebar (Listagem e Filtros) ─────────────────────────────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Lista de Lotes */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Package className="w-5 h-5 text-green-700" /> Lotes de Cacau
                            </h2>
                            <div className="flex flex-col gap-1">
                                {FILTERS.map(f => (
                                    <button key={f.value} onClick={() => { setFilterStatus(f.value); setSelectedLot(null); }}
                                        className={`text-sm px-3 py-2 rounded-lg text-left transition-colors flex items-center justify-between ${filterStatus === f.value ? "bg-green-100 text-green-800 font-semibold" : "text-gray-600 hover:bg-gray-100"}`}>
                                        {f.label}
                                        {filterStatus === f.value && lots.length > 0 && (
                                            <span className="bg-green-700 text-white text-xs px-1.5 py-0.5 rounded-full">{lots.length}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
                            {loadingLots ? (
                                <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-2">
                                    <Loader2 className="w-6 h-6 animate-spin" />Carregando...
                                </div>
                            ) : lots.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500 font-medium">Nenhum lote encontrado</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {filterStatus === "draft" ? "Aguardando cadastros de produtores" : "Nenhum lote neste status"}
                                    </p>
                                </div>
                            ) : (
                                lots.map(lot => {
                                    const st = STATUS[lot.status] || { label: lot.status, color: "text-gray-600", bg: "bg-gray-100 border-gray-300" };
                                    const isSelected = selectedLot?.id === lot.id;
                                    return (
                                        <button key={lot.id} onClick={() => selectLot(lot)}
                                            className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${isSelected ? "bg-green-50 border-l-4 border-l-green-700" : ""}`}>
                                            <div className="flex items-start justify-between mb-1">
                                                <p className="text-xs text-gray-400 font-mono">#{lot.id.slice(-8)}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${st.bg} ${st.color}`}>{st.label}</span>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900">{lot.tipo.replace(/_/g, " ")}</p>
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>Safra {lot.safra}</span>
                                                <span>{Number(lot.pesoKg).toLocaleString("pt-BR")} kg</span>
                                            </div>
                                            {lot.scoreQualidade && (
                                                <p className="text-xs font-medium text-green-700 mt-1">Score: {lot.scoreQualidade} / 100</p>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Main panel ──────────────────────────────────────────────────────── */}
                <div className="lg:col-span-3 space-y-4">
                    {!selectedLot ? (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                            <ClipboardList className="w-12 h-12 text-gray-200 mb-4" />
                            <p className="text-gray-500 font-medium">Selecione um lote para analisar</p>
                            <p className="text-gray-400 text-sm mt-1">Avalie a qualidade, calcule o preço e componha uma proposta para o produtor</p>
                        </div>
                    ) : (
                        <>
                            {/* Lot header */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-xs text-gray-400 font-mono mb-1">Lote #{selectedLot.id.slice(-8)}</p>
                                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">{selectedLot.tipo.replace(/_/g, " ")}</h3>
                                    </div>
                                    <Link href={`/lote/${selectedLot.id}/timeline`}>
                                        <button className="text-xs text-blue-700 hover:text-white border border-blue-200 hover:bg-blue-600 px-4 py-2 rounded-full flex items-center gap-1.5 transition-all shadow-sm">
                                            <FileText className="w-3.5 h-3.5" /> Timeline do Lote
                                        </button>
                                    </Link>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {[
                                        { label: "Safra", value: selectedLot.safra },
                                        { label: "Peso", value: `${Number(selectedLot.pesoKg).toLocaleString("pt-BR")} kg` },
                                        { label: "Score", value: selectedLot.scoreQualidade ? `${selectedLot.scoreQualidade}/100` : "Não avaliado" },
                                        { label: "Status", value: STATUS[selectedLot.status]?.label || selectedLot.status },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                                            <p className="text-sm font-bold text-gray-900">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Checklist accordion */}
                            {selectedLot.status === "draft" && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    <button onClick={() => setCheckOpen(o => !o)}
                                        className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <ClipboardList className="w-5 h-5 text-green-700" />
                                            <h4 className="font-bold text-gray-900">
                                                {selectedLot.scoreQualidade ? `Checklist salvo — Score ${selectedLot.scoreQualidade}/100` : "Avaliar qualidade do lote"}
                                            </h4>
                                        </div>
                                        {checkOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                    </button>

                                    {checkOpen && (
                                        <div className="px-5 pb-5">
                                            <p className="text-sm text-gray-500 mb-4">Avalie cada critério de 0 (ruim) a 10 (excelente).</p>
                                            <div className="space-y-3 mb-4">
                                                {CHECKLIST.map(({ key, label }) => (
                                                    <div key={key} className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
                                                        <label className="text-sm text-gray-700 flex-1">{label}</label>
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => setCheckItens(p => ({ ...p, [key]: Math.max(0, (p[key] || 0) - 1) }))}
                                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 font-bold flex items-center justify-center text-lg">−</button>
                                                            <span className={`w-8 text-center font-extrabold text-sm ${checkItens[key] >= 8 ? "text-green-600" : checkItens[key] >= 5 ? "text-amber-600" : "text-red-500"}`}>
                                                                {checkItens[key]}
                                                            </span>
                                                            <button onClick={() => setCheckItens(p => ({ ...p, [key]: Math.min(10, (p[key] || 0) + 1) }))}
                                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-green-50 hover:text-green-600 font-bold flex items-center justify-center text-lg">+</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between mb-4 bg-gray-50 rounded-xl p-3">
                                                <span className="text-sm text-gray-600 font-medium">Total</span>
                                                <div>
                                                    <span className={`text-2xl font-extrabold ${totalCheck >= 56 ? "text-green-600" : totalCheck >= 42 ? "text-amber-600" : "text-red-500"}`}>{totalCheck}</span>
                                                    <span className="text-gray-400 text-sm"> / 70 — {totalCheck >= 56 ? "Premium" : totalCheck >= 42 ? "Standard" : "Abaixo do perfil"}</span>
                                                </div>
                                            </div>
                                            <button onClick={handleAvaliar} disabled={avaliando}
                                                className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-bold rounded-xl py-3 text-sm flex items-center justify-center gap-2">
                                                {avaliando ? <><Loader2 className="w-4 h-4 animate-spin" />Salvando...</> : "Salvar avaliação"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── PROPOSTA SECTION ─────────────────────────────────────────── */}
                            {(selectedLot.status === "draft" || selectedLot.status === "em_negociacao") && (
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-700" />
                                        <h4 className="font-bold text-gray-900">Compor Proposta de Compra</h4>
                                    </div>

                                    {/* Calculator toggle */}
                                    <button onClick={() => { setUseCalculator(u => !u); if (!precoResult) handleCalcPreco(); }}
                                        className={`w-full text-sm border rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 transition-all ${useCalculator ? "border-green-600 text-green-700 bg-green-50" : "border-gray-300 text-gray-600 hover:border-gray-400"}`}>
                                        {calculando ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                                        {calculando ? "Calculando motor Qualitheo..." : useCalculator && precoResult ? "Ocultar calculadora" : "Usar calculadora de preço Qualitheo"}
                                    </button>

                                    {useCalculator && precoResult && (
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-medium">Referência — Motor Qualitheo</p>
                                            <div className="grid grid-cols-3 gap-2 mb-1">
                                                {[
                                                    { label: "Mínimo", value: precoResult.preco_min_r_kg, cls: "text-red-600" },
                                                    { label: "Sugerido", value: precoResult.preco_sugerido_r_kg, cls: "text-amber-700 font-extrabold text-xl" },
                                                    { label: "Máximo", value: precoResult.preco_max_r_kg, cls: "text-green-700" },
                                                ].map(({ label, value, cls }) => (
                                                    <div key={label} className="text-center">
                                                        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                                                        <p className={`font-bold ${cls}`}>R$ {parseFloat(value).toFixed(2)}</p>
                                                        <p className="text-xs text-gray-400">/kg</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={() => setPrecoManual(parseFloat(precoResult.preco_sugerido_r_kg).toFixed(2))}
                                                className="w-full mt-2 text-xs text-green-700 border border-green-300 hover:bg-green-50 rounded-lg py-2 transition-colors">
                                                Usar preço sugerido → R$ {parseFloat(precoResult.preco_sugerido_r_kg).toFixed(2)}/kg
                                            </button>
                                        </div>
                                    )}

                                    {/* ── PRICE INPUT — prominent manual entry ── */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2">
                                            Preço ofertado ao produtor (R$/kg) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xl">R$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={precoManual}
                                                onChange={e => setPrecoManual(e.target.value)}
                                                placeholder="0,00"
                                                className="w-full border border-green-300 rounded-xl pl-12 pr-16 py-4 text-3xl font-extrabold text-green-900 text-center bg-green-50 shadow-inner focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/kg</span>
                                        </div>
                                    </div>

                                    {/* Total valuation */}
                                    {preco > 0 && selectedLot && (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-xs text-gray-500">{Number(selectedLot.pesoKg).toLocaleString("pt-BR")} kg × R$ {preco.toFixed(2)}/kg</p>
                                                    <p className="text-xs text-gray-500">Valor total do lote</p>
                                                </div>
                                                <p className="text-2xl font-extrabold text-green-800">
                                                    R$ {totalLote.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Justification */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Justificativa / nota ao produtor <span className="text-gray-400 font-normal">(opcional)</span>
                                        </label>
                                        <textarea
                                            value={justificativa}
                                            onChange={e => setJustificativa(e.target.value)}
                                            rows={3}
                                            placeholder="Ex: Preço baseado no score de qualidade Premium do lote. Cacau com perfil aromático excelente."
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                        />
                                    </div>

                                    {/* Payment terms */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Condições de pagamento</label>
                                            <select
                                                value={condicoesPag}
                                                onChange={e => setCondicoesPag(e.target.value)}
                                                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                            >
                                                {PAYMENT_TERMS.map(t => <option key={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Validade da proposta</label>
                                            <select
                                                value={validadeDias}
                                                onChange={e => setValidadeDias(e.target.value)}
                                                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                            >
                                                {["1", "2", "3", "5", "7", "15"].map(d => <option key={d} value={d}>{d} dia{d !== "1" ? "s" : ""}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Internal notes — hidden from producer */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                            <Shield className="w-3.5 h-3.5 text-gray-400" />
                                            Observações internas <span className="text-gray-400 font-normal text-xs">(não visível ao produtor)</span>
                                        </label>
                                        <textarea
                                            value={obsInternas}
                                            onChange={e => setObsInternas(e.target.value)}
                                            rows={2}
                                            placeholder="Notas de rastreabilidade, logística, referência do pedido..."
                                            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
                                        />
                                    </div>

                                    {/* Summary */}
                                    {preco > 0 && (
                                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
                                            <p className="font-semibold text-gray-700 mb-2">Resumo da proposta</p>
                                            <div className="space-y-1 text-gray-600">
                                                <div className="flex justify-between"><span>Preço</span><strong>R$ {preco.toFixed(2)}/kg</strong></div>
                                                <div className="flex justify-between"><span>Volume</span><strong>{Number(selectedLot.pesoKg).toLocaleString("pt-BR")} kg</strong></div>
                                                <div className="flex justify-between"><span>Total</span><strong className="text-green-800">R$ {totalLote.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong></div>
                                                <div className="flex justify-between"><span>Pagamento</span><strong>{condicoesPag}</strong></div>
                                                <div className="flex justify-between"><span>Validade</span><strong>{validadeDias} dia(s)</strong></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Send button */}
                                    <button
                                        onClick={handleProposta}
                                        disabled={enviando || !precoManual || preco <= 0}
                                        className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl py-4 text-base flex items-center justify-center gap-2 transition-colors shadow-sm"
                                    >
                                        {enviando ? <><Loader2 className="w-5 h-5 animate-spin" />Enviando proposta...</> :
                                            <><Send className="w-5 h-5" /> Enviar proposta ao produtor</>}
                                    </button>
                                </div>
                            )}

                            {/* Bought */}
                            {selectedLot.status === "comprado" && (
                                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                                    <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-2" />
                                    <p className="text-green-900 font-bold text-lg">Compra realizada! 🎉</p>
                                    <p className="text-green-700 text-sm mt-1">O lote foi aceito e está em processo de coleta/entrega.</p>
                                    <Link href={`/lote/${selectedLot.id}/timeline`}>
                                        <button className="mt-4 text-green-700 border border-green-400 hover:bg-green-100 px-4 py-2 rounded-full text-sm">
                                            Ver timeline completa →
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ── TABELA DE PREÇOS DIÁRIOS ─────────────────────────────────── */}
            <div className="container mx-auto px-4 pb-10 max-w-6xl">
                <PrecosManager />
            </div>
        </div>
    );
}

// ─── Origination Analytics Dashboard ──────────────────────────────────────────
function OriginationDashboard() {
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

// ─── Daily Price Manager ──────────────────────────────────────────────────────
interface PrecoMercado { tipo: string; descricao: string; precoMedioRKg: number; variacao: number; unidade: string; }
interface TabelaPrecos { precos: PrecoMercado[]; premiumQualidade: number; descontoLogistica: number; fatorSocioAmbiental: number; notas: string; atualizadoEm: string; atualizadoPor: string; }

function PrecosManager() {
    const [tabela, setTabela] = useState<TabelaPrecos | null>(null);
    const [editPrecos, setEditPrecos] = useState<PrecoMercado[]>([]);
    const [premiumQualidade, setPremiumQualidade] = useState(15);
    const [descontoLogistica, setDescontoLogistica] = useState(5);
    const [fatorSocioAmbiental, setFatorSocioAmbiental] = useState(5);
    const [notas, setNotas] = useState("");
    const [atualizadoPor, setAtualizadoPor] = useState("Qualitheo");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetch("/api/precos-mercado")
            .then(async r => {
                if (!r.ok) throw new Error(`API ${r.status}`);
                return r.json();
            })
            .then((d: TabelaPrecos) => {
                if (!d || !Array.isArray(d.precos)) return; // no DB yet
                setTabela(d);
                setEditPrecos(d.precos.map(p => ({ ...p })));
                setPremiumQualidade(d.premiumQualidade);
                setDescontoLogistica(d.descontoLogistica);
                setFatorSocioAmbiental(d.fatorSocioAmbiental);
                setNotas(d.notas);
                setAtualizadoPor(d.atualizadoPor);
            })
            .catch(() => {/* no DB — silently degrade */})
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const r = await fetch("/api/precos-mercado", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ precos: editPrecos, premiumQualidade, descontoLogistica, fatorSocioAmbiental, notas, atualizadoPor }),
            });
            const d = await r.json();
            setTabela(d);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } finally { setSaving(false); }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-6">
            <button onClick={() => setOpen(o => !o)}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-green-700" />
                    <div>
                        <h3 className="font-bold text-gray-900">Tabela de Preços de Mercado — Atualização Diária</h3>
                        {tabela && <p className="text-xs text-gray-400 mt-0.5">Última atualização: {new Date(tabela.atualizadoEm).toLocaleString("pt-BR")} por {tabela.atualizadoPor}</p>}
                    </div>
                </div>
                {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>

            {open && (
                <div className="px-5 pb-6 border-t border-gray-100">
                    {loading ? (
                        <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
                    ) : (
                        <div className="space-y-5 pt-4">
                            <p className="text-sm text-gray-500">
                                Esses preços são exibidos publicamente na página inicial como referência de compra.
                                Os <strong>premiums individuais</strong> de cada lote variam conforme qualidade, logística e fatores socioambientais.
                            </p>

                            {/* Price table per type */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Base — Preço médio por tipo de cacau</p>
                                <div className="space-y-3">
                                    {editPrecos.map((p, i) => (
                                        <div key={p.tipo} className="flex items-center gap-4 bg-gray-50/80 hover:bg-white border hover:border-green-200 transition-all rounded-2xl p-4 shadow-sm">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-800">{p.descricao}</p>
                                                <p className="text-xs text-gray-400">{p.tipo}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500 text-sm font-medium">R$</span>
                                                <input
                                                    type="number"
                                                    step="0.10"
                                                    min="0"
                                                    value={p.precoMedioRKg}
                                                    onChange={e => setEditPrecos(prev => prev.map((item, idx) => idx === i ? { ...item, precoMedioRKg: Number(e.target.value) } : item))}
                                                    className="w-24 border-2 border-green-400 rounded-lg px-3 py-2 text-lg font-extrabold text-green-800 text-center bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                />
                                                <span className="text-gray-400 text-sm">/kg</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Factors */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Adicionais — Fatores de ajuste de preço</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    {[
                                        { label: "🏆 Premium Qualidade (%)", value: premiumQualidade, set: setPremiumQualidade, color: "border-green-400 text-green-800 bg-green-50", sign: "+" },
                                        { label: "🚚 Desconto Logística (%)", value: descontoLogistica, set: setDescontoLogistica, color: "border-red-300 text-red-800 bg-red-50", sign: "−" },
                                        { label: "🌿 Bônus Socioambiental (%)", value: fatorSocioAmbiental, set: setFatorSocioAmbiental, color: "border-blue-300 text-blue-800 bg-blue-50", sign: "+" },
                                    ].map(({ label, value, set, color, sign }) => (
                                        <div key={label}>
                                            <label className="text-xs text-gray-600 mb-1 block">{label}</label>
                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold text-sm ${color.includes("green") ? "text-green-700" : color.includes("red") ? "text-red-700" : "text-blue-700"}`}>{sign}</span>
                                                <input
                                                    type="number" step="1" min="0" max="100" value={value}
                                                    onChange={e => set(Number(e.target.value))}
                                                    className={`w-full border-2 ${color} rounded-lg px-3 py-2 text-xl font-extrabold text-center focus:outline-none`}
                                                />
                                                <span className="text-gray-400 text-sm font-bold">%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">Nota pública (exibida na home)</label>
                                <textarea rows={2} value={notas} onChange={e => setNotas(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Ex: Preços de referência para compra — safra 2026" />
                            </div>

                            {/* Updated by */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500 mb-1 block">Atualizado por</label>
                                    <input value={atualizadoPor} onChange={e => setAtualizadoPor(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Nome do operador" />
                                </div>
                                <button onClick={handleSave} disabled={saving}
                                    className="mt-4 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-bold rounded-xl px-6 py-3 text-sm flex items-center gap-2 transition-colors whitespace-nowrap">
                                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Salvando...</> :
                                        saved ? <><CheckCircle2 className="w-4 h-4" />Publicado!</> :
                                            "Publicar preços →"}
                                </button>
                            </div>

                            {saved && (
                                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    ✅ Preços publicados! O widget na página inicial já reflete os novos valores.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
