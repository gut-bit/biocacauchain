/**
 * admin.tsx — BioCacauChain Internal Control Panel
 *
 * Access: /admin
 * Login: Ton / Gutz140
 * Auth: sessionStorage (client-side gate) + X-Admin-Token header on all API calls
 *
 * Tabs:
 *  1. Preços de Mercado  — preços diários do cacau (molhado, seco, amêndoa)
 *  2. Modelo de Precificação — parâmetros do motor de cálculo de compra
 *  3. Produtos B2B  — preços, MOQ e descontos por volume dos produtos do catálogo
 */
import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  Lock, Settings, Package, Globe2, Users, FileText,
  Save, CheckCircle2, AlertCircle, Loader2, LogOut,
  TrendingUp, ShieldCheck, Plus, Trash2, RefreshCw,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const ADMIN_USER = "Ton";
const ADMIN_PASS = "Gutz140";
const ADMIN_TOKEN = "gutz140-internal";
const SESSION_KEY = "biocacau_admin_auth";

function adminFetch(url: string, opts: RequestInit = {}) {
  return fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Token": ADMIN_TOKEN,
      ...(opts.headers ?? {}),
    },
  });
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface MarketPrice {
  id: string;
  tipo: string;
  descricao: string;
  precoMedioRKg: string;
  variacaoDia: string;
  unidade: string;
  premiumQualidade: string;
  descontoLogistica: string;
  fatorSocioAmbiental: string;
  notas: string;
  atualizadoPor: string;
}

interface PricingModel {
  id: string;
  precoRefMercadoUsdTon: string;
  fxUsdBrl: string;
  precoRefSecoBrutoRKg: string;
  fatorConversaoBabaParaSeco: string;
  custoProcessamentoRKgSeco: string;
  margemQualitheoPct: string;
  bonusQualidadePctMin: string;
  bonusQualidadePctMax: string;
  bonusFidelidadePctMax: string;
}

interface Product {
  id: string;
  brandId: string;
  nome: string;
  slug: string;
  tipoProduto: string;
  linha: string;
  descricao: string;
  unidadeBase: string;
  ativo: boolean;
}

interface ProductPrice {
  id: string;
  productId: string;
  priceListId: string;
  precoUnitario: string;
  moeda: string;
  moq: string;
  descontosPorVolume: Record<string, number> | null;
}

interface Brand {
  id: string;
  nome: string;
  slug: string;
}

interface PriceListItem {
  id: string;
  nome: string;
  moeda: string;
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 600)); // UX delay
    if (user.trim() === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onLogin();
    } else {
      setError("Usuário ou senha incorretos.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-emerald-900 flex items-center justify-center p-4">
      <Helmet>
        <title>Admin — BioCacauChain</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="w-full max-w-sm">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-emerald-300" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Painel Admin</h1>
          <p className="text-emerald-300/80 text-sm mt-1">BioCacauChain · Acesso Interno</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-widest mb-2">
                Usuário
              </label>
              <input
                id="admin-user"
                type="text"
                autoComplete="username"
                value={user}
                onChange={e => setUser(e.target.value)}
                placeholder="Login"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-emerald-200 uppercase tracking-widest mb-2">
                Senha
              </label>
              <input
                id="admin-pass"
                type="password"
                autoComplete="current-password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-300 text-sm bg-red-900/30 border border-red-500/30 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-white font-bold rounded-xl py-3.5 text-sm transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {loading ? "Verificando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Área restrita. Acesso não autorizado é proibido.
        </p>
      </div>
    </div>
  );
}

// ─── Market Prices Tab ────────────────────────────────────────────────────────
function MarketTab() {
  const [rows, setRows] = useState<MarketPrice[]>([]);
  const [edited, setEdited] = useState<Record<string, Partial<MarketPrice>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newTipo, setNewTipo] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPreco, setNewPreco] = useState("0");
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminFetch("/api/admin/market")
      .then(r => r.json())
      .then(d => { setRows(Array.isArray(d) ? d : []); setEdited({}); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (id: string, field: keyof MarketPrice, val: string) =>
    setEdited(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));

  const save = async (row: MarketPrice) => {
    setSaving(row.id);
    const patch = { ...row, ...edited[row.id] };
    try {
      await adminFetch(`/api/admin/market/${row.tipo}`, {
        method: "PATCH",
        body: JSON.stringify({
          descricao: patch.descricao,
          precoMedioRKg: patch.precoMedioRKg,
          premiumQualidade: patch.premiumQualidade,
          descontoLogistica: patch.descontoLogistica,
          fatorSocioAmbiental: patch.fatorSocioAmbiental,
          notas: patch.notas,
          atualizadoPor: patch.atualizadoPor || "Admin",
        }),
      });
      setSaved(row.id);
      setTimeout(() => setSaved(null), 2000);
      load();
    } finally {
      setSaving(null);
    }
  };

  const handleCreate = async () => {
    if (!newTipo.trim() || !newDesc.trim()) return;
    setCreating(true);
    try {
      await adminFetch("/api/admin/market", {
        method: "POST",
        body: JSON.stringify({ tipo: newTipo.trim().toLowerCase().replace(/\s+/g, "_"), descricao: newDesc.trim(), precoMedioRKg: newPreco }),
      });
      setShowNew(false); setNewTipo(""); setNewDesc(""); setNewPreco("0");
      load();
    } finally { setCreating(false); }
  };

  const handleDelete = async (row: MarketPrice) => {
    if (!confirm(`Remover "${row.descricao}"? Esta ação não pode ser desfeita.`)) return;
    await adminFetch(`/api/admin/market/${row.id}`, { method: "DELETE" });
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Create button */}
      <div className="flex justify-end">
        <button onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all">
          <Plus className="w-4 h-4" /> Nova Categoria
        </button>
      </div>

      {/* New category form */}
      {showNew && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-emerald-900">Nova Categoria de Preço</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Identificador (ex: cacau_fino_gourmet)" type="text" value={newTipo} onChange={setNewTipo} />
            <Field label="Descrição (ex: Cacau Fino de Aroma Gourmet)" type="text" value={newDesc} onChange={setNewDesc} />
            <Field label="Preço Médio (R$/kg)" type="number" step="0.10" value={newPreco} onChange={setNewPreco} highlight="green" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={creating || !newTipo.trim() || !newDesc.trim()}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-gray-300 disabled:text-gray-500 transition-all flex items-center gap-1.5">
              {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Criar
            </button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-800">Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {rows.map(row => {
          const val = (f: keyof MarketPrice) =>
            (edited[row.id]?.[f] ?? row[f]) as string;
          const isSaving = saving === row.id;
          const isSaved = saved === row.id;

          return (
            <div key={row.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">{row.tipo}</p>
                  <input
                    aria-label="Descrição do tipo de cacau"
                    value={val("descricao")}
                    onChange={e => set(row.id, "descricao", e.target.value)}
                    className="text-lg font-bold text-gray-900 bg-transparent border-0 focus:outline-none focus:border-b-2 focus:border-emerald-500 w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDelete(row)} title="Remover categoria"
                    className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => save(row)}
                    disabled={isSaving}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isSaved
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                     isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                     <Save className="w-3.5 h-3.5" />}
                    {isSaved ? "Salvo!" : "Salvar"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Field label="Preço Médio (R$/kg)" type="number" step="0.10"
                  value={val("precoMedioRKg")} onChange={v => set(row.id, "precoMedioRKg", v)}
                  highlight="green" />
                <Field label="Premium Qualidade (%)" type="number"
                  value={val("premiumQualidade")} onChange={v => set(row.id, "premiumQualidade", v)} />
                <Field label="Desconto Logística (%)" type="number"
                  value={val("descontoLogistica")} onChange={v => set(row.id, "descontoLogistica", v)} />
                <Field label="Bônus Socioambiental (%)" type="number"
                  value={val("fatorSocioAmbiental")} onChange={v => set(row.id, "fatorSocioAmbiental", v)} />
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nota pública" type="text"
                  value={val("notas")} onChange={v => set(row.id, "notas", v)} />
                <Field label="Atualizado por" type="text"
                  value={val("atualizadoPor")} onChange={v => set(row.id, "atualizadoPor", v)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Pricing Model Tab ────────────────────────────────────────────────────────
function PricingModelTab() {
  const [model, setModel] = useState<PricingModel | null>(null);
  const [edited, setEdited] = useState<Partial<PricingModel>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    adminFetch("/api/admin/pricing-model")
      .then(r => r.json())
      .then(d => {
        if (d && d.id) {
          setModel(d);
          setEdited({});
        } else {
          // No model in DB yet — pre-fill with sensible defaults so user can save one
          setModel(null);
          setEdited({
            precoRefMercadoUsdTon: "5200",
            fxUsdBrl: "5.10",
            precoRefSecoBrutoRKg: "26.52",
            fatorConversaoBabaParaSeco: "2.80",
            custoProcessamentoRKgSeco: "3.50",
            margemQualitheoPct: "0.20",
            bonusQualidadePctMin: "0.05",
            bonusQualidadePctMax: "0.10",
            bonusFidelidadePctMax: "0.05",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const val = (f: keyof PricingModel): string =>
    (edited[f] ?? model?.[f] ?? "") as string;
  const set = (f: keyof PricingModel, v: string) =>
    setEdited(prev => ({ ...prev, [f]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await adminFetch("/api/admin/pricing-model", {
        method: "PATCH",
        body: JSON.stringify(edited),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      load();
    } finally {
      setSaving(false);
    }
  };

  // Live preview calculation
  const precoRefSeco = parseFloat(val("precoRefSecoBrutoRKg")) || 0;
  const margem = parseFloat(val("margemQualitheoPct")) || 0;
  const fator = parseFloat(val("fatorConversaoBabaParaSeco")) || 1;
  const precoMin = precoRefSeco * (1 - margem) * 0.9;
  const precoMinMolhado = precoMin / fator;
  const precoSugSeco = precoMin * 1.07;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Preview card */}
      <div className="bg-gradient-to-br from-green-950 to-green-900 rounded-2xl p-6 text-white">
        <p className="text-xs font-semibold text-green-300 uppercase tracking-widest mb-4">
          Preview — Preço calculado em tempo real
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-green-300/80 mb-1">Mínimo Seco</p>
            <p className="text-2xl font-extrabold">R$ {precoMin.toFixed(2)}</p>
            <p className="text-xs text-green-400/60">/kg</p>
          </div>
          <div>
            <p className="text-xs text-green-300/80 mb-1">Sugerido Seco</p>
            <p className="text-2xl font-extrabold text-green-300">R$ {precoSugSeco.toFixed(2)}</p>
            <p className="text-xs text-green-400/60">/kg</p>
          </div>
          <div>
            <p className="text-xs text-green-300/80 mb-1">Molhado (÷ {fator.toFixed(2)})</p>
            <p className="text-2xl font-extrabold text-amber-300">R$ {precoMinMolhado.toFixed(2)}</p>
            <p className="text-xs text-green-400/60">/kg</p>
          </div>
        </div>
      </div>

      {/* Parameters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900">Parâmetros do Motor de Precificação</h3>
          <button
            onClick={save}
            disabled={saving || Object.keys(edited).length === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              saved
                ? "bg-emerald-100 text-emerald-700"
                : saving || Object.keys(edited).length === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
             saved ? <CheckCircle2 className="w-3.5 h-3.5" /> :
             <Save className="w-3.5 h-3.5" />}
            {saved ? "Salvo!" : "Salvar Modelo"}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Preço ref. mercado (USD/ton)" type="number"
            value={val("precoRefMercadoUsdTon")} onChange={v => set("precoRefMercadoUsdTon", v)} />
          <Field label="Câmbio USD/BRL" type="number" step="0.01"
            value={val("fxUsdBrl")} onChange={v => set("fxUsdBrl", v)} />
          <Field label="Preço ref. seco bruto (R$/kg)" type="number" step="0.01" highlight="green"
            value={val("precoRefSecoBrutoRKg")} onChange={v => set("precoRefSecoBrutoRKg", v)} />
          <Field label="Fator conversão baba→seco" type="number" step="0.01"
            value={val("fatorConversaoBabaParaSeco")} onChange={v => set("fatorConversaoBabaParaSeco", v)} />
          <Field label="Custo processamento (R$/kg seco)" type="number" step="0.10"
            value={val("custoProcessamentoRKgSeco")} onChange={v => set("custoProcessamentoRKgSeco", v)} />
          <Field label="Margem Qualitheo (%)" type="number" step="0.01"
            value={val("margemQualitheoPct")} onChange={v => set("margemQualitheoPct", v)} />
          <Field label="Bônus qualidade min (%)" type="number" step="0.01"
            value={val("bonusQualidadePctMin")} onChange={v => set("bonusQualidadePctMin", v)} />
          <Field label="Bônus qualidade max (%)" type="number" step="0.01"
            value={val("bonusQualidadePctMax")} onChange={v => set("bonusQualidadePctMax", v)} />
          <Field label="Bônus fidelidade max (%)" type="number" step="0.01"
            value={val("bonusFidelidadePctMax")} onChange={v => set("bonusFidelidadePctMax", v)} />
        </div>
      </div>
    </div>
  );
}

// ─── Volume Discounts Editor ──────────────────────────────────────────────────
function VolumeDiscountsEditor({ value, onChange }: { value: Record<string, number> | null; onChange: (v: Record<string, number>) => void }) {
  const entries = Object.entries(value ?? {});
  const [newRange, setNewRange] = useState("");
  const [newPct, setNewPct] = useState("0");

  const update = (oldKey: string, newKey: string, pct: number) => {
    const copy = { ...(value ?? {}) };
    if (oldKey !== newKey) delete copy[oldKey];
    copy[newKey] = pct;
    onChange(copy);
  };
  const remove = (key: string) => {
    const copy = { ...(value ?? {}) };
    delete copy[key];
    onChange(copy);
  };
  const add = () => {
    if (!newRange.trim()) return;
    onChange({ ...(value ?? {}), [newRange.trim()]: parseFloat(newPct) || 0 });
    setNewRange(""); setNewPct("0");
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-500">Descontos por Volume</label>
      {entries.map(([range, pct]) => (
        <div key={range} className="flex items-center gap-2">
          <input value={range} onChange={e => update(range, e.target.value, pct)}
            className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            placeholder="50-199" aria-label="Faixa de volume" />
          <input type="number" step="0.01" value={pct} onChange={e => update(range, range, parseFloat(e.target.value) || 0)}
            className="w-20 text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-right focus:outline-none focus:ring-1 focus:ring-emerald-400"
            aria-label="Percentual desconto" />
          <span className="text-xs text-gray-400">%</span>
          <button onClick={() => remove(range)} title="Remover faixa" aria-label="Remover faixa de desconto" className="text-red-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
        </div>
      ))}
      <div className="flex items-center gap-2 pt-1">
        <input value={newRange} onChange={e => setNewRange(e.target.value)} placeholder="1000+"
          className="flex-1 text-xs border border-dashed border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          aria-label="Nova faixa" />
        <input type="number" step="0.01" value={newPct} onChange={e => setNewPct(e.target.value)}
          className="w-20 text-xs border border-dashed border-gray-300 rounded-lg px-2 py-1.5 text-right focus:outline-none focus:ring-1 focus:ring-emerald-400"
          aria-label="Novo percentual" />
        <button onClick={add} title="Adicionar faixa" aria-label="Adicionar faixa de desconto" className="text-emerald-600 hover:text-emerald-800"><Plus className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [prices, setPrices] = useState<ProductPrice[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [priceLists, setPriceLists] = useState<PriceListItem[]>([]);
  const [editedProducts, setEditedProducts] = useState<Record<string, Partial<Product>>>({});
  const [editedPrices, setEditedPrices] = useState<Record<string, Partial<ProductPrice>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProd, setNewProd] = useState({ nome: "", brandId: "", tipoProduto: "", linha: "qualitheo_b2b", descricao: "", unidadeBase: "kg" });

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      adminFetch("/api/admin/products").then(r => r.json()),
      adminFetch("/api/admin/product-prices").then(r => r.json()),
      adminFetch("/api/admin/brands").then(r => r.json()),
      adminFetch("/api/admin/price-lists").then(r => r.json()),
    ]).then(([prods, prs, br, pl]) => {
      setProducts(Array.isArray(prods) ? prods : []);
      setPrices(Array.isArray(prs) ? prs : []);
      setBrands(Array.isArray(br) ? br : []);
      setPriceLists(Array.isArray(pl) ? pl : []);
      setEditedProducts({});
      setEditedPrices({});
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (product: Product) => {
    setSaving(product.id);
    const prodPatch = editedProducts[product.id];
    const price = prices.find(p => p.productId === product.id);
    const pricePatch = price ? editedPrices[price.id] : undefined;

    try {
      if (prodPatch && Object.keys(prodPatch).length > 0) {
        await adminFetch(`/api/admin/products/${product.id}`, {
          method: "PATCH",
          body: JSON.stringify(prodPatch),
        });
      }
      if (price && pricePatch && Object.keys(pricePatch).length > 0) {
        await adminFetch(`/api/admin/product-prices/${price.id}`, {
          method: "PATCH",
          body: JSON.stringify(pricePatch),
        });
      }
      setSaved(product.id);
      setTimeout(() => setSaved(null), 2000);
      load();
    } finally {
      setSaving(null);
    }
  };

  const handleCreate = async () => {
    if (!newProd.nome.trim() || !newProd.brandId || !newProd.tipoProduto.trim()) return;
    setCreating(true);
    try {
      const created = await adminFetch("/api/admin/products", {
        method: "POST",
        body: JSON.stringify(newProd),
      }).then(r => r.json());
      // Auto-create a price entry for the first price list
      if (priceLists.length > 0) {
        await adminFetch("/api/admin/product-prices", {
          method: "POST",
          body: JSON.stringify({ productId: created.id, priceListId: priceLists[0].id, precoUnitario: "0", moq: "1" }),
        });
      }
      setShowNew(false);
      setNewProd({ nome: "", brandId: "", tipoProduto: "", linha: "qualitheo_b2b", descricao: "", unidadeBase: "kg" });
      load();
    } finally { setCreating(false); }
  };

  const handleDelete = async (prod: Product) => {
    if (!confirm(`Remover "${prod.nome}"? O produto será arquivado.`)) return;
    await adminFetch(`/api/admin/products/${prod.id}`, { method: "DELETE" });
    load();
  };

  const toggleActive = async (prod: Product) => {
    await adminFetch(`/api/admin/products/${prod.id}`, {
      method: "PATCH",
      body: JSON.stringify({ ativo: !prod.ativo }),
    });
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      {/* Create button */}
      <div className="flex justify-end">
        <button onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all">
          <Plus className="w-4 h-4" /> Novo Produto
        </button>
      </div>

      {/* New product form */}
      {showNew && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-emerald-900">Novo Produto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nome (ex: Cacau Fino de Aroma Gourmet)" type="text" value={newProd.nome} onChange={v => setNewProd(p => ({ ...p, nome: v }))} />
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Marca</label>
              <select value={newProd.brandId} onChange={e => setNewProd(p => ({ ...p, brandId: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" aria-label="Marca">
                <option value="">Selecione...</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
              </select>
            </div>
            <Field label="Tipo/Categoria (ex: cacau_seco, nibs, liquor)" type="text" value={newProd.tipoProduto} onChange={v => setNewProd(p => ({ ...p, tipoProduto: v }))} />
            <Field label="Linha (ex: qualitheo_b2b)" type="text" value={newProd.linha} onChange={v => setNewProd(p => ({ ...p, linha: v }))} />
            <Field label="Unidade (kg, un, kit)" type="text" value={newProd.unidadeBase} onChange={v => setNewProd(p => ({ ...p, unidadeBase: v }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
            <textarea value={newProd.descricao} onChange={e => setNewProd(p => ({ ...p, descricao: e.target.value }))} rows={2}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400" aria-label="Descrição do novo produto" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={creating || !newProd.nome.trim() || !newProd.brandId || !newProd.tipoProduto.trim()}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-gray-300 disabled:text-gray-500 transition-all flex items-center gap-1.5">
              {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Criar Produto
            </button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-800">Cancelar</button>
          </div>
        </div>
      )}

      {products.map(prod => {
        const price = prices.find(p => p.productId === prod.id);
        const pVal = (f: keyof Product): string => (editedProducts[prod.id]?.[f] ?? prod[f]) as string;
        const prVal = (f: keyof ProductPrice): string => (price ? (editedPrices[price.id]?.[f] ?? price[f]) as string : "");
        const currentDiscounts = price
          ? (editedPrices[price.id]?.descontosPorVolume ?? price.descontosPorVolume) as Record<string, number> | null
          : null;

        const setP = (f: keyof Product, v: string) =>
          setEditedProducts(prev => ({ ...prev, [prod.id]: { ...prev[prod.id], [f]: v } }));
        const setPr = (f: keyof ProductPrice, v: string | Record<string, number>) => {
          if (!price) return;
          setEditedPrices(prev => ({ ...prev, [price.id]: { ...prev[price.id], [f]: v } }));
        };

        const isSaving = saving === prod.id;
        const isSaved = saved === prod.id;

        return (
          <div key={prod.id} className={`bg-white rounded-2xl border shadow-sm p-6 ${prod.ativo ? "border-gray-100" : "border-red-200 opacity-60"}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 mr-4">
                {/* Editable tipoProduto */}
                <input
                  aria-label="Tipo do produto"
                  value={pVal("tipoProduto")}
                  onChange={e => setP("tipoProduto", e.target.value)}
                  className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1 bg-transparent border-0 border-b border-transparent hover:border-gray-300 focus:border-emerald-500 focus:outline-none w-full transition-colors"
                  placeholder="Tipo (ex: cacau_seco)"
                />
                <input
                  aria-label="Nome do produto"
                  value={pVal("nome")}
                  onChange={e => setP("nome", e.target.value)}
                  className="text-base font-bold text-gray-900 bg-transparent border-0 border-b border-transparent hover:border-gray-300 focus:border-emerald-500 focus:outline-none w-full transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                {/* Active toggle */}
                <button onClick={() => toggleActive(prod)} title={prod.ativo ? "Desativar" : "Ativar"}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${prod.ativo ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                  {prod.ativo ? "Ativo" : "Inativo"}
                </button>
                <button onClick={() => handleDelete(prod)} title="Remover produto"
                  className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => save(prod)}
                  disabled={isSaving}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    isSaved ? "bg-emerald-100 text-emerald-700" :
                    "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                   isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                   <Save className="w-3.5 h-3.5" />}
                  {isSaved ? "Salvo!" : "Salvar"}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1">Descrição</label>
              <textarea
                aria-label="Descrição do produto"
                value={pVal("descricao")}
                onChange={e => setP("descricao", e.target.value)}
                rows={2}
                className="w-full text-sm text-gray-700 border border-gray-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* Extra fields: linha, unidade */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Field label="Linha" type="text" value={pVal("linha")} onChange={v => setP("linha", v)} />
              <Field label="Unidade base" type="text" value={pVal("unidadeBase")} onChange={v => setP("unidadeBase", v)} />
            </div>

            {/* Pricing */}
            {price && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Preço unitário (R$/kg ou un)" type="number" step="0.50" highlight="green"
                    value={prVal("precoUnitario")} onChange={v => setPr("precoUnitario", v)} />
                  <Field label="MOQ (quantidade mínima)" type="number"
                    value={prVal("moq")} onChange={v => setPr("moq", v)} />
                  <Field label="Moeda" type="text"
                    value={prVal("moeda")} onChange={v => setPr("moeda", v)} />
                </div>
                <VolumeDiscountsEditor
                  value={currentDiscounts}
                  onChange={v => setPr("descontosPorVolume", v as any)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


// ─── Shared UI Components ─────────────────────────────────────────────────────
function Field({
  label, type = "text", step, value, onChange, highlight,
}: {
  label: string;
  type?: string;
  step?: string;
  value: string;
  onChange: (v: string) => void;
  highlight?: "green";
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input
        aria-label={label}
        type={type}
        step={step}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full border rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 transition-colors ${
          highlight === "green"
            ? "border-emerald-300 bg-emerald-50 text-emerald-900 focus:ring-emerald-400"
            : "border-gray-200 bg-white text-gray-900 focus:ring-emerald-400"
        }`}
      />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    </div>
  );
}

// ─── Content Block Row ────────────────────────────────────────────────────────
interface ContentBlockRow {
  key: string;
  section: string;
  pt: string;
  en: string;
  type: string;
}

function BilingualField({
  label, blockKey, pt, en, onSave, type = "text",
}: {
  label: string;
  blockKey: string;
  pt: string;
  en: string;
  onSave: (key: string, pt: string, en: string) => Promise<void>;
  type?: string;
}) {
  const [localPt, setLocalPt] = useState(pt);
  const [localEn, setLocalEn] = useState(en);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const multiline = type === "multiline";

  // Sync when parent refreshes
  useEffect(() => { setLocalPt(pt); setLocalEn(en); }, [pt, en]);

  const save = async () => {
    setSaving(true);
    try {
      await onSave(blockKey, localPt, localEn);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const dirty = localPt !== pt || localEn !== en;

  return (
    <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">{blockKey}</p>
          <p className="font-semibold text-gray-800 text-sm mt-0.5">{label}</p>
        </div>
        <button
          onClick={save}
          disabled={saving || !dirty}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            saved ? "bg-emerald-100 text-emerald-700" :
            dirty ? "bg-emerald-600 text-white hover:bg-emerald-700" :
            "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> :
           saved ? <CheckCircle2 className="w-3 h-3" /> :
           <Save className="w-3 h-3" />}
          {saved ? "Salvo!" : "Salvar"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-emerald-700 font-bold mb-1 uppercase tracking-wider">🇧🇷 PT</label>
          {multiline ? (
            <textarea
              aria-label={`${label} — Português`}
              value={localPt}
              onChange={e => setLocalPt(e.target.value)}
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          ) : (
            <input
              aria-label={`${label} — Português`}
              type="text"
              value={localPt}
              onChange={e => setLocalPt(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          )}
        </div>
        <div>
          <label className="block text-xs text-blue-700 font-bold mb-1 uppercase tracking-wider">🇺🇸 EN</label>
          {multiline ? (
            <textarea
              aria-label={`${label} — English`}
              value={localEn}
              onChange={e => setLocalEn(e.target.value)}
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <input
              aria-label={`${label} — English`}
              type="text"
              value={localEn}
              onChange={e => setLocalEn(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Site Content Tab ─────────────────────────────────────────────────────────
function SiteContentTab() {
  const [blocks, setBlocks] = useState<Record<string, ContentBlockRow>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    adminFetch("/api/admin/content")
      .then(r => r.json())
      .then((rows: ContentBlockRow[]) => {
        const map: Record<string, ContentBlockRow> = {};
        if (Array.isArray(rows)) rows.forEach(r => { map[r.key] = r; });
        setBlocks(map);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveBlock = async (key: string, pt: string, en: string) => {
    await adminFetch(`/api/admin/content/${encodeURIComponent(key)}`, {
      method: "PATCH",
      body: JSON.stringify({ pt, en }),
    });
    load();
  };

  const reseed = async () => {
    await adminFetch("/api/admin/content/seed", { method: "POST" });
    load();
  };

  const b = (key: string) => blocks[key] ?? { key, section: "", pt: "", en: "", type: "text" };

  const FIELDS: { label: string; key: string; type?: string }[] = [
    { label: "Badge do Hero", key: "hero.badge" },
    { label: "Título Hero (linha 1)", key: "hero.title.1" },
    { label: "Título Hero (linha 2 — itálico)", key: "hero.title.2" },
    { label: "Subtítulo do Hero", key: "hero.subtitle", type: "multiline" },
    { label: "CTA Hero — Produtos", key: "hero.cta.products" },
    { label: "CTA Hero — Fábrica", key: "hero.cta.factory" },
    { label: "Sobre — Label", key: "about.label" },
    { label: "Sobre — Título", key: "about.title" },
    { label: "Sobre — Texto", key: "about.body", type: "multiline" },
    { label: "Sobre — Badge Rastreabilidade", key: "about.traceability.badge" },
    { label: "Sobre — Título Rastreabilidade", key: "about.traceability.title" },
    { label: "Sobre — Desc. Rastreabilidade", key: "about.traceability.desc", type: "multiline" },
    { label: "Sobre — Botão Protocolos", key: "about.btn.protocols" },
    { label: "Sobre — Botão Certificações", key: "about.btn.certs" },
    { label: "Site — Empresa", key: "site.company" },
    { label: "Site — Endereço", key: "site.address" },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">Edite o texto do site em Português e Inglês. Salve linha por linha.</p>
        <button
          onClick={reseed}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
          title="Restaurar padrões (não sobrescreve edições existentes)"
        >
          <RefreshCw className="w-3 h-3" /> Restaurar padrões
        </button>
      </div>
      {FIELDS.map(f => (
        <BilingualField
          key={f.key}
          blockKey={f.key}
          label={f.label}
          pt={b(f.key).pt}
          en={b(f.key).en}
          type={f.type}
          onSave={saveBlock}
        />
      ))}
    </div>
  );
}

// ─── About Bullets Tab (sub-section inside SiteContent) ───────────────────────
function BulletEditor() {
  // Handled inline in SiteContentTab above as list_json blocks — kept simple
  return null;
}

// ─── Contact Tab ──────────────────────────────────────────────────────────────
function ContactTab() {
  const [blocks, setBlocks] = useState<Record<string, ContentBlockRow>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    adminFetch("/api/admin/content")
      .then(r => r.json())
      .then((rows: ContentBlockRow[]) => {
        const map: Record<string, ContentBlockRow> = {};
        if (Array.isArray(rows)) rows.forEach(r => { map[r.key] = r; });
        setBlocks(map);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveBlock = async (key: string, pt: string, en: string) => {
    await adminFetch(`/api/admin/content/${encodeURIComponent(key)}`, {
      method: "PATCH",
      body: JSON.stringify({ pt, en }),
    });
    load();
  };

  const b = (key: string) => blocks[key] ?? { key, section: "", pt: "", en: "", type: "text" };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700">
        Estes dados aparecem no rodapé do site. Edições ficam visíveis imediatamente após recarregar a página.
      </div>
      {[
        { label: "Nome do Contato", key: "contact.name" },
        { label: "Cargo", key: "contact.role" },
        { label: "Email Principal", key: "contact.email1" },
        { label: "Email Secundário", key: "contact.email2" },
        { label: "WhatsApp (URL)", key: "contact.whatsapp" },
        { label: "WhatsApp (exibição)", key: "contact.whatsapp.display" },
        { label: "Instagram (URL)", key: "contact.instagram" },
        { label: "Website (URL)", key: "contact.website" },
      ].map(f => (
        <BilingualField
          key={f.key}
          blockKey={f.key}
          label={f.label}
          pt={b(f.key).pt}
          en={b(f.key).en}
          onSave={saveBlock}
        />
      ))}
    </div>
  );
}

// ─── Partners Tab ─────────────────────────────────────────────────────────────
interface PartnerEntry {
  name: string;
  logoKey?: string;
  logoUrl?: string;
  siteUrl?: string;
  width?: string;
}

const LOGO_KEYS = ["partner_bonnat", "partner_lasevicius", "partner_beantobar", "partner_mad", "partner_btm"];
const WIDTH_OPTIONS = ["w-20", "w-24", "w-28", "w-32", "w-36", "w-40", "w-48"];

function PartnersTab() {
  const [list, setList] = useState<PartnerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminFetch("/api/admin/content")
      .then(r => r.json())
      .then((rows: ContentBlockRow[]) => {
        if (Array.isArray(rows)) {
          const row = rows.find(r => r.key === "partners.list");
          if (row?.pt) {
            try { setList(JSON.parse(row.pt)); } catch { setList([]); }
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      const json = JSON.stringify(list);
      await adminFetch("/api/admin/content/partners.list", {
        method: "PATCH",
        body: JSON.stringify({ pt: json, en: json }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const addPartner = () => setList(prev => [...prev, { name: "Novo Parceiro", logoKey: "", siteUrl: "#", width: "w-28" }]);
  const remove = (i: number) => setList(prev => prev.filter((_, idx) => idx !== i));
  const update = (i: number, patch: Partial<PartnerEntry>) =>
    setList(prev => prev.map((p, idx) => idx === i ? { ...p, ...patch } : p));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{list.length} parceiro(s) — arraste para reordenar (em breve)</p>
        <div className="flex gap-2">
          <button
            onClick={addPartner}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
          <button
            onClick={save}
            disabled={saving}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              saved ? "bg-emerald-100 text-emerald-700" : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
             saved ? <CheckCircle2 className="w-3.5 h-3.5" /> :
             <Save className="w-3.5 h-3.5" />}
            {saved ? "Salvo!" : "Salvar Lista"}
          </button>
        </div>
      </div>

      {list.map((p, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-mono text-gray-400">#{i + 1}</p>
            <button
              onClick={() => remove(i)}
              className="text-red-400 hover:text-red-600 transition-colors"
              title="Remover parceiro"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Nome</label>
              <input
                aria-label="Nome do parceiro"
                value={p.name}
                onChange={e => update(i, { name: e.target.value })}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Logo (asset key)</label>
              <select
                aria-label="Logo key do parceiro"
                value={p.logoKey ?? ""}
                onChange={e => update(i, { logoKey: e.target.value })}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">— URL externo —</option>
                {LOGO_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Largura (CSS)</label>
              <select
                aria-label="Largura do logo"
                value={p.width ?? "w-28"}
                onChange={e => update(i, { width: e.target.value })}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {WIDTH_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">URL do site (link)</label>
              <input
                aria-label="URL do site do parceiro"
                value={p.siteUrl ?? ""}
                onChange={e => update(i, { siteUrl: e.target.value })}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="https://..."
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">URL do logo externo (se sem asset key)</label>
              <input
                aria-label="URL externa do logo"
                value={p.logoUrl ?? ""}
                onChange={e => update(i, { logoUrl: e.target.value })}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="https://exemplo.com/logo.png"
              />
            </div>
          </div>
        </div>
      ))}

      {list.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Nenhum parceiro. Clique em Adicionar.</p>
        </div>
      )}
    </div>
  );
}

// ─── About Bullets Tab ────────────────────────────────────────────────────────
function BulletsTab() {
  const [ptBullets, setPtBullets] = useState<string[]>([]);
  const [enBullets, setEnBullets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminFetch("/api/admin/content")
      .then(r => r.json())
      .then((rows: ContentBlockRow[]) => {
        if (Array.isArray(rows)) {
          const row = rows.find(r => r.key === "about.bullets");
          if (row) {
            try { setPtBullets(JSON.parse(row.pt)); } catch { setPtBullets([]); }
            try { setEnBullets(JSON.parse(row.en)); } catch { setEnBullets([]); }
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      await adminFetch("/api/admin/content/about.bullets", {
        method: "PATCH",
        body: JSON.stringify({ pt: JSON.stringify(ptBullets), en: JSON.stringify(enBullets) }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const maxLen = Math.max(ptBullets.length, enBullets.length);
  const updatePt = (i: number, v: string) => setPtBullets(prev => { const a = [...prev]; a[i] = v; return a; });
  const updateEn = (i: number, v: string) => setEnBullets(prev => { const a = [...prev]; a[i] = v; return a; });
  const add = () => { setPtBullets(prev => [...prev, ""]); setEnBullets(prev => [...prev, ""]); };
  const remove = (i: number) => {
    setPtBullets(prev => prev.filter((_, idx) => idx !== i));
    setEnBullets(prev => prev.filter((_, idx) => idx !== i));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Bullets do bloco &quot;O Padrão Qualitheo&quot; — aparecem com ícone ✓</p>
        <div className="flex gap-2">
          <button onClick={add} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700">
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
          <button onClick={save} disabled={saving} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            saved ? "bg-emerald-100 text-emerald-700" : "bg-emerald-600 hover:bg-emerald-700 text-white"}` }>
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saved ? "Salvo!" : "Salvar"}
          </button>
        </div>
      </div>

      {Array.from({ length: maxLen }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-gray-400">Bullet #{i + 1}</span>
            <button onClick={() => remove(i)} title="Remover bullet" className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-emerald-700 font-bold mb-1">🇧🇷 PT</label>
              <input aria-label={`Bullet ${i+1} PT`} value={ptBullets[i] ?? ""} onChange={e => updatePt(i, e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-xs text-blue-700 font-bold mb-1">🇺🇸 EN</label>
              <input aria-label={`Bullet ${i+1} EN`} value={enBullets[i] ?? ""} onChange={e => updateEn(i, e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
type Tab = "market" | "pricing" | "products" | "content" | "contact" | "partners" | "bullets";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "market", label: "Preços de Mercado", icon: TrendingUp },
  { id: "pricing", label: "Modelo de Cálculo", icon: Settings },
  { id: "products", label: "Produtos & Preços", icon: Package },
  { id: "content", label: "Textos do Site", icon: FileText },
  { id: "contact", label: "Contato", icon: Globe2 },
  { id: "partners", label: "Parceiros", icon: Users },
  { id: "bullets", label: "Bullets Sobre", icon: CheckCircle2 },
];

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("market");

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Admin — BioCacauChain</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <header className="bg-gradient-to-r from-green-950 to-green-900 px-6 py-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Painel de Controle</h1>
              <p className="text-xs text-green-300/70">BioCacauChain · Interno</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-green-300/80 hover:text-white text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="flex gap-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all ${
                  tab === t.id
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <main className="container mx-auto max-w-5xl px-6 py-8">
        {tab === "market" && <MarketTab />}
        {tab === "pricing" && <PricingModelTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "content" && <SiteContentTab />}
        {tab === "contact" && <ContactTab />}
        {tab === "partners" && <PartnersTab />}
        {tab === "bullets" && <BulletsTab />}
      </main>
    </div>
  );
}

// ─── Root Page ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [auth, setAuth] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuth(false);
  };

  if (!auth) return <LoginScreen onLogin={() => setAuth(true)} />;
  return <Dashboard onLogout={handleLogout} />;
}
