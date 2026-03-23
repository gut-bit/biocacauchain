import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Trash2, CheckCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderItem {
    id: string;
    productId: string;
    quantidade: string;
    precoUnitario: string;
    subtotal: string;
}

interface Order {
    id: string;
    status: string;
    totalBruto: string;
    descontos: string;
    totalLiquido: string;
    moeda: string;
}

// Pega o orderId do scope global --- em produção, use context/session
declare const orderId: string | null;

export default function Carrinho() {
    const [order, setOrder] = useState<Order | null>(null);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmed, setConfirmed] = useState(false);
    const [condicoesPagamento, setCondicoesPagamento] = useState("30/60/90 DDL");
    const [observacoes, setObservacoes] = useState("");
    const [referenciaCliente, setReferenciaCliente] = useState("");
    const [confirming, setConfirming] = useState(false);

    // Busca o orderId do localStorage ou window
    const getOrderId = () => (window as any).__gutcacau_order_id as string | null;

    useEffect(() => {
        const id = getOrderId();
        if (!id) {
            setLoading(false);
            return;
        }
        fetch(`/api/orders/${id}`)
            .then((r) => r.json())
            .then((data) => {
                setOrder(data.order);
                setItems(data.items || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleConfirm = async () => {
        const id = getOrderId();
        if (!id) return;
        setConfirming(true);
        try {
            const r = await fetch(`/api/orders/${id}/confirmar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ condicoesPagamento, observacoes, referenciaCliente }),
            });
            if (r.ok) {
                setConfirmed(true);
                (window as any).__gutcacau_order_id = null;
            }
        } finally {
            setConfirming(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cocoa-950 text-white flex items-center justify-center">
                <p className="text-cocoa-400">Carregando carrinho...</p>
            </div>
        );
    }

    if (confirmed) {
        return (
            <div className="min-h-screen bg-cocoa-950 text-white flex flex-col items-center justify-center gap-6">
                <CheckCircle className="w-16 h-16 text-green-400" />
                <h1 className="font-display text-3xl font-medium">Pedido enviado!</h1>
                <p className="text-cocoa-400 text-center max-w-md">
                    Seu pedido foi recebido pela Qualitheo. Nossa equipe comercial entrará em contato para confirmar condições de entrega e pagamento.
                </p>
                <Link href="/catalogo-b2b">
                    <Button className="bg-gold-500 hover:bg-gold-600 text-cocoa-950 font-bold rounded-full px-8">
                        Continuar comprando
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cocoa-950 text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-cocoa-900/95 backdrop-blur-md border-b border-white/10 px-6 py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <Link href="/catalogo-b2b">
                        <button className="flex items-center gap-2 text-cocoa-300 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Voltar ao catálogo</span>
                        </button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-gold-400" />
                        <span className="font-display font-semibold">Carrinho B2B</span>
                    </div>
                    <div />
                </div>
            </header>

            <div className="container mx-auto px-6 py-12 max-w-4xl">
                {!order || items.length === 0 ? (
                    <div className="text-center py-20">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-cocoa-600" />
                        <p className="text-cocoa-400 mb-6">Seu carrinho está vazio.</p>
                        <Link href="/catalogo-b2b">
                            <Button className="bg-gold-500 hover:bg-gold-600 text-cocoa-950 font-bold rounded-full px-8">
                                Ver catálogo
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Itens */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="font-display text-2xl mb-4">Itens do pedido</h2>
                            {items.map((item) => (
                                <div key={item.id} className="bg-cocoa-900 rounded-xl border border-white/10 p-4 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-cocoa-400">Produto ID: {item.productId}</p>
                                        <p className="text-white font-medium">{Number(item.quantidade).toFixed(0)} kg</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-cocoa-500">Preço unitário</p>
                                        <p className="text-gold-400 font-bold">R$ {parseFloat(item.precoUnitario).toFixed(2)}/kg</p>
                                        <p className="text-sm text-white">Subtotal: R$ {parseFloat(item.subtotal).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resumo e checkout */}
                        <div className="space-y-4">
                            <div className="bg-cocoa-900 rounded-xl border border-white/10 p-5 space-y-3">
                                <h3 className="font-display text-lg">Resumo</h3>
                                <div className="flex justify-between text-sm">
                                    <span className="text-cocoa-400">Subtotal bruto</span>
                                    <span>R$ {parseFloat(order.totalBruto).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-green-400">
                                    <span>Descontos por volume</span>
                                    <span>- R$ {parseFloat(order.descontos).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                                    <span>Total líquido</span>
                                    <span className="text-gold-400 text-xl">R$ {parseFloat(order.totalLiquido).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Condições */}
                            <div className="bg-cocoa-900 rounded-xl border border-white/10 p-5 space-y-3">
                                <h3 className="font-display text-base mb-2">Condições do pedido</h3>
                                <div>
                                    <label className="text-xs text-cocoa-400 mb-1 block">Condições de pagamento</label>
                                    <input
                                        className="w-full bg-cocoa-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                                        value={condicoesPagamento}
                                        onChange={(e) => setCondicoesPagamento(e.target.value)}
                                        placeholder="Ex: 30/60/90 DDL"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-cocoa-400 mb-1 block">Referência interna</label>
                                    <input
                                        className="w-full bg-cocoa-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                                        value={referenciaCliente}
                                        onChange={(e) => setReferenciaCliente(e.target.value)}
                                        placeholder="Número do pedido interno"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-cocoa-400 mb-1 block">Observações</label>
                                    <textarea
                                        className="w-full bg-cocoa-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500 resize-none"
                                        rows={3}
                                        value={observacoes}
                                        onChange={(e) => setObservacoes(e.target.value)}
                                        placeholder="Instruções de entrega, etc."
                                    />
                                </div>
                                <Button
                                    className="w-full bg-gold-500 hover:bg-gold-600 text-cocoa-950 font-bold rounded-xl py-3"
                                    onClick={handleConfirm}
                                    disabled={confirming}
                                >
                                    {confirming ? "Enviando..." : "Enviar pedido para Qualitheo"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
