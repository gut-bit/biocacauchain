import { useState, useCallback, useEffect } from "react";
import { Link } from "wouter";
import {
    ArrowLeft, ArrowRight, User, Building2, Users, Layers,
    CheckSquare, TrendingUp, MapPin, Shield, CheckCircle2,
    AlertCircle, Loader2, Leaf, Plus, Package
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type ProfileType = "individual" | "empresa" | "cooperativa";
type Step = "dashboard" | "perfil" | "cadastro" | "propriedade" | "compliance" | "lote" | "checklist" | "preco";

interface PrecoData {
    lot_id: string;
    preco_min_r_kg: string;
    preco_max_r_kg: string;
    preco_sugerido_r_kg: string;
    componentes: Record<string, any>;
}

// Representa a tabela de preços do dia buscada do backend
interface TabelaPrecos {
    precos: { tipo: string; descricao: string; precoMedioRKg: number; }[];
    premiumQualidade: number;
    descontoLogistica: number;
    fatorSocioAmbiental: number;
    atualizadoEm: string;
}


// ─── Checklist items ──────────────────────────────────────────────────────────
const CHECKLIST = [
    { key: "selecao_frutos", label: "Seleção de frutos saudáveis" },
    { key: "higiene_colheita", label: "Higiene durante a colheita" },
    { key: "tempo_colheita_quebra", label: "Tempo entre colheita e quebra (< 24h)" },
    { key: "selecao_interna", label: "Seleção interna das sementes" },
    { key: "uniformidade_lote", label: "Uniformidade do lote" },
    { key: "ausencia_corpos_estranhos", label: "Ausência de corpos estranhos" },
    { key: "condicoes_transporte", label: "Condições de transporte" },
];

// ─── Step config ──────────────────────────────────────────────────────────────
const STEPS = [
    { id: "perfil" as Step, label: "Perfil", icon: User },
    { id: "cadastro" as Step, label: "Dados", icon: Building2 },
    { id: "propriedade" as Step, label: "Propriedade", icon: MapPin },
    { id: "compliance" as Step, label: "Conformidade", icon: Shield },
    { id: "lote" as Step, label: "Lote", icon: Layers },
    { id: "checklist" as Step, label: "Qualidade", icon: CheckSquare },
    { id: "preco" as Step, label: "Precificação", icon: TrendingUp },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
    );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
            {children}
        </select>
    );
}

function PrimaryBtn({ children, loading, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
    return (
        <button
            {...props}
            className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-bold rounded-xl py-3 text-sm flex items-center justify-center gap-2 transition-colors"
        >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Aguarde...</> : children}
        </button>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PortalProdutor() {
    const [step, setStep] = useState<Step>("dashboard");
    const [profileType, setProfileType] = useState<ProfileType>("individual");
    const [producerId, setProducerId] = useState<string | null>(null);
    const [lotId, setLotId] = useState<string | null>(null);
    const [scoreQualidade, setScoreQualidade] = useState<number | null>(null);
    const [precoData, setPrecoData] = useState<PrecoData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Dashboard Data
    const [tabela, setTabela] = useState<TabelaPrecos | null>(null);
    const [loadingDashboard, setLoadingDashboard] = useState(true);

    // Forms
    const [prodForm, setProdForm] = useState({
        nome: "", nomeFantasia: "", cpfCnpj: "", municipio: "", estado: "PA",
        contatoEmail: "", contatoTelefone: "",
    });
    const [propForm, setPropForm] = useState({
        areaTotal: "", areaCacau: "", bioma: "Amazônia", sistemaProducao: "cabruca",
        coordLat: "", coordLon: "", numCAR: "",
    });
    const [compliance, setCompliance] = useState({
        carRegularizado: false,
        semTrabalhoInfantil: false,
        semDesmatamento: false,
        emitirNF: false,
        certificacoes: [] as string[],
    });
    const [loteForm, setLoteForm] = useState({
        tipo: "molhado_baba", safra: "2026-1", pesoKg: 1500, origemTalhao: "",
    });
    const [check, setCheck] = useState<Record<string, number>>(
        Object.fromEntries(CHECKLIST.map(i => [i.key, 8]))
    );
    const totalCheck = Object.values(check).reduce((a, b) => a + b, 0);

    // ─── Handlers ───────────────────────────────────────────────────────────────
    const api = useCallback(async (path: string, body?: object) => {
        const r = await fetch(path, {
            method: body ? "POST" : "GET",
            headers: { "Content-Type": "application/json" },
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!r.ok) throw new Error((await r.json()).message || "Erro na requisição");
        return r.json();
    }, []);

    // Load Dashboard Data (Market Prices)
    useEffect(() => {
        api("/api/precos-mercado")
            .then(data => setTabela(data))
            .catch(err => console.error("Erro ao carregar preços do mercado:", err))
            .finally(() => setLoadingDashboard(false));
    }, [api]);

    const go = (next: Step) => { setError(null); setSuccess(null); setStep(next); };

    const handleCadastro = async () => {
        setLoading(true); setError(null);
        try {
            if (!prodForm.nome || !prodForm.cpfCnpj || !prodForm.municipio)
                throw new Error("Preencha nome, CPF/CNPJ e município");
            const prod = await api("/api/producers", {
                ...prodForm,
                fazendaNome: prodForm.nomeFantasia,
                tipo: profileType,
            });
            setProducerId(prod.id);
            go("propriedade");
        } catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
    };

    const handleLote = async () => {
        if (!producerId) return;
        setLoading(true); setError(null);
        try {
            const lot = await api("/api/lots", { producerId, ...loteForm });
            setLotId(lot.id);
            go("checklist");
        } catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
    };

    const handleAvaliar = async () => {
        if (!lotId) return;
        setLoading(true); setError(null);
        try {
            const res = await api(`/api/lots/${lotId}/avaliar`, { itens: check });
            setScoreQualidade(res.score_qualidade);
            go("preco");
        } catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
    };

    const handlePreco = async () => {
        if (!lotId) return;
        setLoading(true); setError(null);
        try {
            const data = await api(`/api/lots/${lotId}/preco`, { modalidade: loteForm.tipo, indice_fidelidade: 0.3 });
            setPrecoData(data);
        } catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
    };

    // compliance score (0-5)
    const complianceScore = [
        compliance.carRegularizado,
        compliance.semTrabalhoInfantil,
        compliance.semDesmatamento,
        compliance.emitirNF,
        compliance.certificacoes.length > 0,
    ].filter(Boolean).length;

    const currentIdx = STEPS.findIndex(s => s.id === step);

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header com Gradiente Premium */}
            <header className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-6 py-5 sticky top-0 z-50 shadow-lg text-white">
                <div className="container mx-auto flex items-center justify-between max-w-4xl">
                    <Link href="/originacao">
                        <button className="flex items-center gap-2 text-green-100 hover:text-white transition-colors text-sm font-medium">
                            <ArrowLeft className="w-4 h-4" /> Voltar
                        </button>
                    </Link>
                    <div className="text-center">
                        <h1 className="text-xl font-bold tracking-tight">Portal do Produtor</h1>
                        <p className="text-xs text-green-200/80 uppercase tracking-widest font-semibold mt-0.5">Venda Direta Qualitheo</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                        <Leaf className="w-4 h-4 text-green-300" />
                        <span className="text-xs text-green-50 font-medium hidden sm:block">Parceiro</span>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Steps progress */}
                {step !== "dashboard" && (
                    <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 gap-2 snap-x scrollbar-hide">
                        {STEPS.map((s, i) => {
                            const Icon = s.icon;
                            const isActive = s.id === step;
                            const isDone = currentIdx > i;
                            return (
                                <div key={s.id} className="flex items-center shrink-0 snap-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${isDone ? "bg-green-600 text-white shadow-green-600/30" : isActive ? "bg-green-700 text-white ring-4 ring-green-100 shadow-green-700/40" : "bg-white border border-gray-200 text-gray-400"}`}>
                                            {isDone ? "✓" : <Icon className="w-4 h-4" />}
                                        </div>
                                        <span className={`text-[10px] uppercase tracking-wider mt-2 text-center w-full truncate ${isActive ? "text-green-800 font-bold" : isDone ? "text-green-600 font-semibold" : "text-gray-400 font-medium"}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                    {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${isDone ? "bg-green-500" : "bg-gray-200"}`} />}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Alerts */}
                {error && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-red-700 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />{error}
                    </div>
                )}
                {success && (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-green-700 text-sm">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />{success}
                    </div>
                )}

                {/* ── STEP: Dashboard ────────────────────────────────────────────────── */}
                {step === "dashboard" && (
                    <div className="space-y-6">
                        {/* Status do Mercado / Cotação */}
                        <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 rounded-3xl shadow-xl shadow-green-900/10 p-8 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579722820308-d74e571900a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] opacity-5 mix-blend-overlay" />
                            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-green-500/20 blur-3xl rounded-full pointer-events-none" />
                            <div className="absolute -left-10 -top-10 w-40 h-40 bg-emerald-400/20 blur-3xl rounded-full pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
                                <div className="flex-1 w-full">
                                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 mb-4 shadow-sm">
                                        <TrendingUp className="w-4 h-4 text-green-300" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-green-100">Mercado Hoje</span>
                                    </div>
                                    <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Cotações Qualitheo</h2>
                                    <p className="text-green-100/80 mb-6 font-medium max-w-md leading-relaxed">Referência de mercado para pagamento ao produtor. Fatores de qualidade, volume e logística podem gerar ágio sobre estes valores.</p>

                                    {loadingDashboard ? (
                                        <div className="animate-pulse flex gap-4 mt-8">
                                            <div className="h-24 bg-white/10 rounded-2xl w-40" />
                                            <div className="h-24 bg-white/10 rounded-2xl w-40" />
                                        </div>
                                    ) : tabela?.precos && tabela.precos.length > 0 ? (
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                            {tabela.precos.map(p => (
                                                <div key={p.tipo} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-all group">
                                                    <p className="text-[10px] text-green-200 uppercase tracking-widest mb-1 font-semibold">{p.descricao}</p>
                                                    <div className="flex items-baseline gap-1 relative">
                                                        <span className="text-sm text-green-300 font-bold">R$</span>
                                                        <p className="text-4xl font-black tracking-tight text-white group-hover:scale-105 transition-transform origin-left">{p.precoMedioRKg.toFixed(2)}</p>
                                                    </div>
                                                    <p className="text-xs text-green-300/80 mt-2 font-medium">por kg</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-green-200 bg-white/5 p-4 rounded-xl border border-white/10 inline-block">
                                            As cotações de hoje estão sendo formuladas. Tente novamente mais tarde.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {tabela && (
                                <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-green-200/60 font-medium">
                                    <span>Preços baseados em sacas padrão (60kg).</span>
                                    <span>Atualizado em: {new Date(tabela.atualizadoEm).toLocaleDateString("pt-BR")}</span>
                                </div>
                            )}
                        </div>

                        {/* Ações Rápidas */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center mt-6">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-center mx-auto mb-5 rotate-3 shadow-inner">
                                <Package className="w-8 h-8 text-green-600 -rotate-3" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Vender Cacau</h3>
                            <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                                Tem cacau pronto para venda? Registre as informações do seu lote, passe pela nossa verificação de conformidade socioambiental e inicie a negociação direta com a Qualitheo.
                            </p>
                            <button
                                onClick={() => go("perfil")}
                                className="bg-green-700 hover:bg-green-800 text-white font-bold rounded-full px-8 py-4 text-sm inline-flex items-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-green-700/20 active:translate-y-0 active:shadow-md"
                            >
                                <Plus className="w-4 h-4" /> Iniciar Oferta de Venda
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP: Perfil ───────────────────────────────────────────────────── */}
                {step === "perfil" && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Qual é o seu perfil?</h2>
                        <p className="text-sm text-gray-500 mb-6">Escolha o tipo de cadastro adequado.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            {[
                                { id: "individual" as ProfileType, icon: User, title: "Produtor Individual", desc: "Pessoa física com CPF" },
                                { id: "empresa" as ProfileType, icon: Building2, title: "Empresa", desc: "LTDA, EIRELI, SA com CNPJ" },
                                { id: "cooperativa" as ProfileType, icon: Users, title: "Cooperativa", desc: "Cooperativa agrícola com CNPJ" },
                            ].map(({ id, icon: Icon, title, desc }) => (
                                <button key={id} onClick={() => setProfileType(id)}
                                    className={`text-left rounded-xl border-2 p-4 transition-all ${profileType === id ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                                    <Icon className={`w-6 h-6 mb-2 ${profileType === id ? "text-green-700" : "text-gray-400"}`} />
                                    <p className={`font-semibold text-sm ${profileType === id ? "text-green-800" : "text-gray-700"}`}>{title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => go("cadastro")}
                            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl py-3 text-sm flex items-center justify-center gap-2">
                            Continuar <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* ── STEP: Cadastro ─────────────────────────────────────────────────── */}
                {step === "cadastro" && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-bold text-gray-900">Dados pessoais / empresa</h2>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium capitalize">{profileType}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">
                            {profileType === "individual" ? "Preencha seus dados pessoais." : "Preencha os dados da sua empresa/cooperativa."}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <Field label={profileType === "individual" ? "Nome completo" : "Razão social"} required>
                                    <Input value={prodForm.nome} onChange={e => setProdForm(p => ({ ...p, nome: e.target.value }))} placeholder="Nome completo ou Razão Social" />
                                </Field>
                            </div>
                            {profileType !== "individual" && (
                                <div className="sm:col-span-2">
                                    <Field label="Nome fantasia">
                                        <Input value={prodForm.nomeFantasia} onChange={e => setProdForm(p => ({ ...p, nomeFantasia: e.target.value }))} placeholder="Nome pelo qual é conhecido" />
                                    </Field>
                                </div>
                            )}
                            <Field label={profileType === "individual" ? "CPF" : "CNPJ"} required>
                                <Input value={prodForm.cpfCnpj} onChange={e => setProdForm(p => ({ ...p, cpfCnpj: e.target.value }))}
                                    placeholder={profileType === "individual" ? "000.000.000-00" : "00.000.000/0001-00"} />
                            </Field>
                            <Field label="Estado" required>
                                <Select value={prodForm.estado} onChange={e => setProdForm(p => ({ ...p, estado: e.target.value }))}>
                                    {["PA", "AM", "RO", "MT", "AC", "AP", "TO", "MA", "BA", "ES", "MG"].map(uf => <option key={uf}>{uf}</option>)}
                                </Select>
                            </Field>
                            <div className="sm:col-span-2">
                                <Field label="Município" required>
                                    <Input value={prodForm.municipio} onChange={e => setProdForm(p => ({ ...p, municipio: e.target.value }))} placeholder="Ex: Altamira, Medicilândia, Uruará" />
                                </Field>
                            </div>
                            <Field label="E-mail">
                                <Input type="email" value={prodForm.contatoEmail} onChange={e => setProdForm(p => ({ ...p, contatoEmail: e.target.value }))} placeholder="email@exemplo.com" />
                            </Field>
                            <Field label="WhatsApp">
                                <Input value={prodForm.contatoTelefone} onChange={e => setProdForm(p => ({ ...p, contatoTelefone: e.target.value }))} placeholder="(93) 99999-9999" />
                            </Field>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => go("perfil")} className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl py-3 text-sm">
                                ← Voltar
                            </button>
                            <PrimaryBtn onClick={handleCadastro} loading={loading}>
                                Salvar e continuar →
                            </PrimaryBtn>
                        </div>
                    </div>
                )}

                {/* ── STEP: Propriedade ──────────────────────────────────────────────── */}
                {step === "propriedade" && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Dados da Propriedade</h2>
                        <p className="text-sm text-gray-500 mb-6">Informações sobre sua fazenda/sítio para rastreabilidade.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Área total (hectares)">
                                <Input type="number" value={propForm.areaTotal} onChange={e => setPropForm(p => ({ ...p, areaTotal: e.target.value }))} placeholder="Ex: 50" />
                            </Field>
                            <Field label="Área de cacau (hectares)">
                                <Input type="number" value={propForm.areaCacau} onChange={e => setPropForm(p => ({ ...p, areaCacau: e.target.value }))} placeholder="Ex: 20" />
                            </Field>
                            <Field label="Bioma">
                                <Select value={propForm.bioma} onChange={e => setPropForm(p => ({ ...p, bioma: e.target.value }))}>
                                    {["Amazônia", "Mata Atlântica", "Cerrado", "Caatinga"].map(b => <option key={b}>{b}</option>)}
                                </Select>
                            </Field>
                            <Field label="Sistema de produção">
                                <Select value={propForm.sistemaProducao} onChange={e => setPropForm(p => ({ ...p, sistemaProducao: e.target.value }))}>
                                    <option value="cabruca">Cabruca (sombra alta)</option>
                                    <option value="agroflorestas">Sistemas agroflorestais</option>
                                    <option value="pleno_sol">Pleno sol (irrigado)</option>
                                    <option value="organico">Orgânico certificado</option>
                                </Select>
                            </Field>
                            <Field label="Número do CAR">
                                <Input value={propForm.numCAR} onChange={e => setPropForm(p => ({ ...p, numCAR: e.target.value }))}
                                    placeholder="PA-1234567-ABCDE" />
                            </Field>
                            <div />
                            <Field label="Latitude (opcional)">
                                <Input value={propForm.coordLat} onChange={e => setPropForm(p => ({ ...p, coordLat: e.target.value }))} placeholder="-3.1234" />
                            </Field>
                            <Field label="Longitude (opcional)">
                                <Input value={propForm.coordLon} onChange={e => setPropForm(p => ({ ...p, coordLon: e.target.value }))} placeholder="-52.5678" />
                            </Field>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => go("cadastro")} className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl py-3 text-sm">← Voltar</button>
                            <button onClick={() => go("compliance")}
                                className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl py-3 text-sm flex items-center justify-center gap-2">
                                Continuar <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* ── STEP: Compliance ───────────────────────────────────────────────── */}
                {step === "compliance" && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-bold text-gray-900">Conformidade e Boas Práticas</h2>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${complianceScore >= 4 ? "bg-green-100 text-green-700" : complianceScore >= 2 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                                {complianceScore}/5
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                            Declarações obrigatórias e certificações voluntárias. Seu perfil de conformidade é exibido para compradores.
                        </p>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 mb-6">
                            ⚠️ As declarações abaixo têm validade legal. Informações falsas podem resultar em cancelamento do cadastro.
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Declarações obrigatórias</p>
                            {[
                                {
                                    key: "carRegularizado" as keyof typeof compliance,
                                    label: "Minha propriedade possui CAR (Cadastro Ambiental Rural) regularizado",
                                    required: true
                                },
                                {
                                    key: "semTrabalhoInfantil" as keyof typeof compliance,
                                    label: "Declaro que não utilizo trabalho infantil nem análogo ao escravo em minha propriedade",
                                    required: true
                                },
                                {
                                    key: "semDesmatamento" as keyof typeof compliance,
                                    label: "Declaro que o cacau ofertado não provém de áreas desmatadas após 2008 (Marco Legal)",
                                    required: true
                                },
                                {
                                    key: "emitirNF" as keyof typeof compliance,
                                    label: "Concordo em emitir Nota Fiscal para toda transação realizada na plataforma",
                                    required: true
                                },
                            ].map(({ key, label, required }) => (
                                <label key={key} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${compliance[key as keyof typeof compliance] ? "border-green-200 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                                    <input type="checkbox" className="mt-0.5 w-4 h-4 accent-green-600 shrink-0"
                                        checked={compliance[key as keyof typeof compliance] as boolean}
                                        onChange={e => setCompliance(p => ({ ...p, [key]: e.target.checked }))} />
                                    <span className="text-sm text-gray-700">{label} {required && <span className="text-red-500">*</span>}</span>
                                </label>
                            ))}

                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-6">Certificações voluntárias (selecione as que possui)</p>
                            <div className="flex flex-wrap gap-2">
                                {["Orgânico IBD", "Rainforest Alliance", "UTZ", "Fairtrade", "USDA Organic", "ProCacau"].map(cert => {
                                    const active = compliance.certificacoes.includes(cert);
                                    return (
                                        <button key={cert} type="button" onClick={() => setCompliance(p => ({
                                            ...p,
                                            certificacoes: active ? p.certificacoes.filter(c => c !== cert) : [...p.certificacoes, cert]
                                        }))}
                                            className={`text-sm px-4 py-2 rounded-full border font-medium transition-all ${active ? "bg-green-700 text-white border-green-700" : "border-gray-300 text-gray-600 hover:border-green-400"}`}>
                                            {active ? "✓ " : ""}{cert}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-6 bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                            <span className="text-sm text-gray-600">Score de conformidade</span>
                            <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className={`w-6 h-2 rounded-full ${i < complianceScore ? "bg-green-500" : "bg-gray-200"}`} />
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => go("propriedade")} className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl py-3 text-sm">← Voltar</button>
                            <button
                                onClick={() => go("lote")}
                                disabled={!compliance.carRegularizado || !compliance.semTrabalhoInfantil || !compliance.semDesmatamento || !compliance.emitirNF}
                                className="flex-1 bg-green-700 hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 text-sm flex items-center justify-center gap-2">
                                Confirmar e continuar <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        {(!compliance.carRegularizado || !compliance.semTrabalhoInfantil || !compliance.semDesmatamento || !compliance.emitirNF) && (
                            <p className="text-xs text-red-500 text-center mt-2">As 4 declarações obrigatórias são necessárias para prosseguir</p>
                        )}
                    </div>
                )}

                {/* ── STEP: Lote ─────────────────────────────────────────────────────── */}
                {step === "lote" && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-bold text-gray-900">Registrar Lote de Cacau</h2>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Produtor cadastrado ✓</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">Informe os dados do lote para avaliação e proposta de compra.</p>
                        <div className="space-y-4">
                            <Field label="Tipo de cacau" required>
                                <Select value={loteForm.tipo} onChange={e => setLoteForm(p => ({ ...p, tipo: e.target.value }))}>
                                    <option value="molhado_baba">Cacau Molhado em Baba</option>
                                    <option value="fermentado_seco">Cacau Fermentado e Seco</option>
                                    <option value="amendoa_seca">Amêndoa Seca</option>
                                </Select>
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Safra" required>
                                    <Input value={loteForm.safra} onChange={e => setLoteForm(p => ({ ...p, safra: e.target.value }))} placeholder="2026-1" />
                                </Field>
                                <Field label="Peso estimado (kg)" required>
                                    <Input type="number" value={loteForm.pesoKg}
                                        onChange={e => setLoteForm(p => ({ ...p, pesoKg: Number(e.target.value) }))} placeholder="1500" />
                                </Field>
                            </div>
                            <Field label="Talhão de origem (opcional)">
                                <Input value={loteForm.origemTalhao} onChange={e => setLoteForm(p => ({ ...p, origemTalhao: e.target.value }))} placeholder="Ex: Talhão A2 — bloco norte" />
                            </Field>
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                                <strong>Estimativa do lote:</strong> {loteForm.pesoKg.toLocaleString("pt-BR")} kg de&nbsp;
                                {loteForm.tipo.replace(/_/g, " ")} — safra {loteForm.safra}
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => go("compliance")} className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl py-3 text-sm">← Voltar</button>
                            <PrimaryBtn onClick={handleLote} loading={loading}>Registrar lote →</PrimaryBtn>
                        </div>
                    </div>
                )}

                {/* ── STEP: Checklist ────────────────────────────────────────────────── */}
                {step === "checklist" && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Autoavaliação de Qualidade</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Avalie cada item de <strong>0</strong> (ruim) a <strong>10</strong> (excelente).
                            Isso determina diretamente o preço ofertado pela Qualitheo.
                        </p>
                        <div className="space-y-3 mb-4">
                            {CHECKLIST.map(({ key, label }) => (
                                <div key={key} className="flex items-center justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
                                    <label className="text-sm text-gray-700 flex-1">{label}</label>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setCheck(p => ({ ...p, [key]: Math.max(0, (p[key] || 0) - 1) }))}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-lg">−</button>
                                        <span className={`w-10 text-center font-extrabold text-base ${check[key] >= 8 ? "text-green-600" : check[key] >= 5 ? "text-amber-600" : "text-red-500"}`}>
                                            {check[key]}
                                        </span>
                                        <button onClick={() => setCheck(p => ({ ...p, [key]: Math.min(10, (p[key] || 0) + 1) }))}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-lg">+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={`rounded-xl p-4 flex items-center justify-between mb-6 ${totalCheck >= 56 ? "bg-green-50 border border-green-200" : totalCheck >= 42 ? "bg-amber-50 border border-amber-200" : "bg-red-50 border border-red-200"}`}>
                            <div>
                                <span className="text-sm font-medium text-gray-700">Total &nbsp;</span>
                                <span className={`text-2xl font-extrabold ${totalCheck >= 56 ? "text-green-700" : totalCheck >= 42 ? "text-amber-700" : "text-red-600"}`}>{totalCheck}</span>
                                <span className="text-gray-400 text-sm"> / 70</span>
                            </div>
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${totalCheck >= 56 ? "bg-green-200 text-green-800" : totalCheck >= 42 ? "bg-amber-200 text-amber-800" : "bg-red-200 text-red-800"}`}>
                                {totalCheck >= 56 ? "🏆 Premium" : totalCheck >= 42 ? "✅ Standard" : "⚠️ Abaixo do perfil"}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => go("lote")} className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl py-3 text-sm">← Voltar</button>
                            <PrimaryBtn onClick={handleAvaliar} loading={loading}>Enviar avaliação →</PrimaryBtn>
                        </div>
                    </div>
                )}

                {/* ── STEP: Preço ────────────────────────────────────────────────────── */}
                {step === "preco" && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Precificação Qualitheo</h2>
                        <p className="text-sm text-gray-500 mb-6">Com base no checklist, calculamos o valor justo para o seu lote.</p>

                        {scoreQualidade !== null && (
                            <div className={`rounded-xl p-5 text-center mb-6 border ${scoreQualidade >= 80 ? "bg-green-50 border-green-200" : scoreQualidade >= 60 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
                                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Score de qualidade</p>
                                <p className={`text-5xl font-extrabold ${scoreQualidade >= 80 ? "text-green-700" : scoreQualidade >= 60 ? "text-amber-700" : "text-red-600"}`}>
                                    {scoreQualidade.toFixed(1)}
                                </p>
                                <p className="text-gray-400 text-sm mt-1">de 100 pontos — {scoreQualidade >= 80 ? "🏆 Cacau Premium" : scoreQualidade >= 60 ? "✅ Standard" : "⚠️ Fora do perfil"}</p>
                            </div>
                        )}

                        {!precoData ? (
                            <PrimaryBtn onClick={handlePreco} loading={loading}>
                                Calcular preço indicativo →
                            </PrimaryBtn>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: "Mínimo", value: precoData.preco_min_r_kg, cls: "bg-red-50 border-red-100 text-red-700" },
                                        { label: "Sugerido", value: precoData.preco_sugerido_r_kg, cls: "bg-amber-50 border-amber-300 text-amber-800 shadow-md scale-105" },
                                        { label: "Máximo", value: precoData.preco_max_r_kg, cls: "bg-green-50 border-green-200 text-green-700" },
                                    ].map(({ label, value, cls }) => (
                                        <div key={label} className={`rounded-xl p-4 text-center border ${cls}`}>
                                            <p className="text-xs text-gray-500 mb-1">{label}</p>
                                            <p className="text-xl font-extrabold">R$ {parseFloat(value).toFixed(2)}</p>
                                            <p className="text-xs text-gray-400">/kg</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Componentes</p>
                                    {Object.entries(precoData.componentes).map(([k, v]) => (
                                        <div key={k} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                                            <span className="text-gray-600 capitalize">{k.replace(/_/g, " ")}</span>
                                            <span className="font-medium text-gray-900">
                                                {typeof v === "number" ? (k.includes("pct") ? `${(Number(v) * 100).toFixed(1)}%` : Number(v).toFixed(2)) : String(v)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center text-sm text-green-800">
                                    ✅ Lote <strong>#{lotId?.slice(-8)}</strong> registrado.<br />
                                    A Qualitheo entrará em contato em até <strong>48 horas</strong> com a proposta formal.
                                </div>
                                <Link href="/originacao">
                                    <button className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium rounded-xl py-3 text-sm">
                                        ← Voltar ao portal de originação
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
