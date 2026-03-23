import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ShoppingCart, ArrowLeft, Leaf, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Product {
    id: string;
    nome: string;
    slug: string;
    tipoProduto: string;
    linha: string;
    descricao: string;
    especificacoesTecnicas: Record<string, any>;
    usoPrincipal: string;
    unidadeBase: string;
    imagens: string[];
}

interface Preco {
    product_id: string;
    price_list: string;
    preco_unitario: string;
    moeda: string;
    moq: string;
    descontos_por_volume: Record<string, number>;
}

interface CartItem {
    productId: string;
    nome: string;
    quantidade: number;
}

// Carrinho global simples (em memória no cliente)
let orderId: string | null = null;

export default function CatalogoB2B() {
    const [produtos, setProdutos] = useState<Product[]>([]);
    const [precos, setPrecos] = useState<Record<string, Preco>>({});
    const [cart, setCart] = useState<CartItem[]>([]);
    const [qtdMap, setQtdMap] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/products?brand=qualitheo-agroindustries")
            .then(async (r) => {
                if (!r.ok) throw new Error(`API ${r.status}`);
                return r.json();
            })
            .then(async (prods: Product[]) => {
                if (!Array.isArray(prods)) { setLoading(false); return; }
                setProdutos(prods);
                const prefetchedPrecos: Record<string, Preco> = {};
                await Promise.all(
                    prods.map(async (p) => {
                        try {
                            const r = await fetch(`/api/products/${p.slug}/precos?price_list=B2B%20Brasil`);
                            if (r.ok) prefetchedPrecos[p.id] = await r.json();
                        } catch (_) { }
                    })
                );
                setPrecos(prefetchedPrecos);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleAddToCart = async (produto: Product) => {
        const quantidade = qtdMap[produto.id] || 50;
        setAddingId(produto.id);

        try {
            // Criar pedido se não existe
            if (!orderId) {
                const r = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    // customerId fixo para demo; em produção virá da sessão
                    body: JSON.stringify({ customerId: "cust_demo_b2b", tipo: "b2b" }),
                });
                const order = await r.json();
                orderId = order.id;
            }

            await fetch(`/api/orders/${orderId}/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: produto.id, quantidade }),
            });

            setCart((prev) => {
                const exists = prev.find((i) => i.productId === produto.id);
                if (exists) return prev.map((i) => i.productId === produto.id ? { ...i, quantidade } : i);
                return [...prev, { productId: produto.id, nome: produto.nome, quantidade }];
            });
        } catch (e) {
            console.error(e);
        } finally {
            setAddingId(null);
        }
    };

    const formatDesc = (descontos: Record<string, number>) =>
        Object.entries(descontos)
            .map(([faixa, pct]) => pct > 0 ? `${faixa} kg → -${(pct * 100).toFixed(0)}%` : null)
            .filter(Boolean)
            .join("  |  ");

    return (
        <div className="min-h-screen bg-cocoa-950 text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-cocoa-900/95 backdrop-blur-md border-b border-white/10 px-6 py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <Link href="/">
                        <button className="flex items-center gap-2 text-cocoa-300 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Voltar</span>
                        </button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Leaf className="w-5 h-5 text-gold-400" />
                        <span className="font-display font-semibold text-lg">Ingredientes <span className="text-gold-400">Qualitheo</span></span>
                    </div>
                    <Link href="/carrinho">
                        <button className="relative flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-cocoa-950 font-bold px-4 py-2 rounded-full text-sm transition-colors">
                            <ShoppingCart className="w-4 h-4" />
                            <span>Carrinho</span>
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="py-16 px-6 bg-gradient-to-b from-cocoa-900 to-cocoa-950">
                <div className="container mx-auto text-center">
                    <Badge className="mb-4 bg-gold-500/20 text-gold-400 border border-gold-500/30 uppercase tracking-widest text-xs">
                        Catálogo B2B
                    </Badge>
                    <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">
                        Ingredientes <span className="text-gold-400 italic">Qualitheo</span>
                    </h1>
                    <p className="text-cocoa-300 text-lg max-w-2xl mx-auto">
                        Cacau amazônico premium para indústria chocolateira, confeitaria e bebidas.
                        Consulte preços B2B, descontos por volume e condições de pedido.
                    </p>
                </div>
            </section>

            {/* Grid de produtos */}
            <section className="py-12 px-6">
                <div className="container mx-auto">
                    {loading ? (
                        <div className="text-center py-20 text-cocoa-400">Carregando catálogo...</div>
                    ) : produtos.length === 0 ? (
                        <div className="text-center py-20 text-cocoa-400">
                            <Package className="w-12 h-12 mx-auto mb-4 opacity-40" />
                            <p>Nenhum produto disponível no momento.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {produtos.map((produto) => {
                                const preco = precos[produto.id];
                                const inCart = cart.find((i) => i.productId === produto.id);
                                return (
                                    <div key={produto.id} className="bg-cocoa-900 rounded-2xl border border-white/10 overflow-hidden hover:border-gold-500/40 transition-all group">
                                        <div className="h-48 bg-gradient-to-br from-cocoa-800 to-cocoa-700 flex items-center justify-center relative overflow-hidden">
                                            {produto.imagens && produto.imagens.length > 0 ? (
                                                <img src={produto.imagens[0]} alt={produto.nome} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                                            ) : (
                                                <Leaf className="w-16 h-16 text-cocoa-600 group-hover:text-gold-500/50 transition-colors" />
                                            )}
                                            <Badge className="absolute top-3 left-3 bg-black/60 text-white border-white/20 text-xs shadow-md drop-shadow-sm">
                                                {produto.tipoProduto.replace(/_/g, " ").toUpperCase()}
                                            </Badge>
                                        </div>

                                        <div className="p-5">
                                            <h3 className="font-display text-lg font-medium mb-2">{produto.nome}</h3>
                                            <p className="text-cocoa-400 text-sm mb-4 line-clamp-2">{produto.descricao}</p>

                                            {/* Specs */}
                                            {produto.especificacoesTecnicas && (
                                                <div className="space-y-1 mb-4">
                                                    {Object.entries(produto.especificacoesTecnicas).slice(0, 3).map(([k, v]) => (
                                                        <div key={k} className="flex justify-between text-xs">
                                                            <span className="text-cocoa-500 capitalize">{k.replace(/_/g, " ")}</span>
                                                            <span className="text-cocoa-300">{String(v)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Preço */}
                                            {preco ? (
                                                <div className="bg-cocoa-800 rounded-xl p-3 mb-4">
                                                    <div className="flex items-end gap-1 mb-1">
                                                        <span className="text-2xl font-bold text-gold-400">
                                                            R$ {parseFloat(preco.preco_unitario).toFixed(2)}
                                                        </span>
                                                        <span className="text-cocoa-400 text-sm mb-0.5">/{produto.unidadeBase}</span>
                                                    </div>
                                                    <p className="text-xs text-cocoa-500">MOQ: {preco.moq} {produto.unidadeBase}</p>
                                                    {preco.descontos_por_volume && (
                                                        <p className="text-xs text-green-400/80 mt-1 truncate">
                                                            {formatDesc(preco.descontos_por_volume)}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-cocoa-800 rounded-xl p-3 mb-4 text-cocoa-500 text-sm">
                                                    Consulte preço
                                                </div>
                                            )}

                                            {/* Quantidade + Adicionar */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min={preco?.moq || 50}
                                                    step={1}
                                                    value={qtdMap[produto.id] || preco?.moq || 50}
                                                    onChange={(e) => setQtdMap((p) => ({ ...p, [produto.id]: Number(e.target.value) }))}
                                                    className="w-24 bg-cocoa-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-center focus:outline-none focus:border-gold-500"
                                                />
                                                <Button
                                                    className="flex-1 bg-gold-500 hover:bg-gold-600 text-cocoa-950 font-bold rounded-xl text-sm"
                                                    onClick={() => handleAddToCart(produto)}
                                                    disabled={addingId === produto.id}
                                                >
                                                    {addingId === produto.id ? "Adicionando..." : inCart ? "✓ Atualizar" : "Adicionar"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
