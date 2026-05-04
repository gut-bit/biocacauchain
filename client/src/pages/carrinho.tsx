import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Trash2, CheckCircle, ShoppingCart, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { useCart } from "@/hooks/useCart";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";

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

export default function Carrinho() {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [condicoesPagamento, setCondicoesPagamento] = useState("30/60/90 DDL");
  const [observacoes, setObservacoes] = useState("");
  const [referenciaCliente, setReferenciaCliente] = useState("");
  const [confirming, setConfirming] = useState(false);
  const { orderId, clearCart } = useCart();

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.order);
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  const handleConfirm = async () => {
    if (!orderId) return;
    setConfirming(true);
    try {
      const r = await fetch(`/api/orders/${orderId}/confirmar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ condicoesPagamento, observacoes, referenciaCliente }),
      });
      if (r.ok) {
        setConfirmed(true);
        clearCart();
      }
    } finally {
      setConfirming(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-32">
          <p className="text-cocoa-400">Carregando carrinho...</p>
        </div>
      </AppShell>
    );
  }

  // ── Confirmed state ───────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center gap-6 py-32">
          <CheckCircle className="w-16 h-16 text-green-400" />
          <h1 className="font-display text-3xl font-medium">Pedido enviado!</h1>
          <p className="text-cocoa-400 text-center max-w-md">
            Seu pedido foi recebido pela Qualitheo. Nossa equipe comercial entrará em contato para confirmar condições de entrega e pagamento.
          </p>
          <div className="flex gap-4 mt-2">
            <Button
              onClick={() => window.open(`/pedido/${order?.id}/proforma`, '_blank')}
              className="bg-white hover:bg-gray-200 text-cocoa-950 font-bold rounded-full px-6 flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Baixar Proforma (PI)
            </Button>
            <Link href="/catalogo-b2b">
              <Button className="bg-gold-500 hover:bg-gold-600 text-cocoa-950 font-bold rounded-full px-8">
                Continuar comprando
              </Button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  // ── Main cart view ────────────────────────────────────────────────────────
  return (
    <AppShell>
      <Helmet>
        <title>Carrinho B2B | Qualitheo</title>
        <meta name="description" content="Revise seu pedido B2B e finalize a compra com a Qualitheo." />
      </Helmet>

      <PageHeader
        badge="Carrinho"
        title={<>Seu Pedido <span className="text-gold-400">B2B</span></>}
        subtitle="Revise os itens, ajuste quantidades e envie seu pedido."
      />

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
            {/* Items */}
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

            {/* Summary & checkout */}
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

              {/* Conditions */}
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
    </AppShell>
  );
}
