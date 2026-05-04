import { useState, useEffect } from "react";
import { BarChart3, ChevronUp, ChevronDown, Loader2, CheckCircle2 } from "lucide-react";

// ─── Daily Price Manager ──────────────────────────────────────────────────────
interface PrecoMercado { tipo: string; descricao: string; precoMedioRKg: number; variacao: number; unidade: string; }
interface TabelaPrecos { precos: PrecoMercado[]; premiumQualidade: number; descontoLogistica: number; fatorSocioAmbiental: number; notas: string; atualizadoEm: string; atualizadoPor: string; }

export default function PrecosManager() {
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
