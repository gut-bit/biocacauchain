import { useState } from "react";
import { Link } from "wouter";
import { Package, ShoppingCart as CartIcon, Box, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import { CATALOG_PRODUCTS, type CatalogProduct } from "@/lib/productCatalog";
import { useCart } from "@/hooks/useCart";

// ── Cart state ────────────────────────────────────────────────────────────────

interface CartItem {
  productId: string;
  quantidade: number;
}

export default function CatalogoB2B() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [qtdMap, setQtdMap] = useState<Record<string, number>>({});
  const [addingId, setAddingId] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);
  const { orderId, setOrderId } = useCart();

  const getQty = (p: CatalogProduct) => qtdMap[p.id] ?? p.moqKg;
  const inCart = (p: CatalogProduct) => cart.some(i => i.productId === p.id);

  const handleAddToCart = async (produto: CatalogProduct) => {
    const quantidade = getQty(produto);
    setAddingId(produto.id);

    try {
      let currentOrderId = orderId;
      if (!currentOrderId) {
        const r = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId: "cust_demo_b2b", tipo: "b2b" }),
        });
        const order = await r.json();
        currentOrderId = order.id;
        setOrderId(order.id);
      }
      await fetch(`/api/orders/${currentOrderId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: produto.id, quantidade }),
      });
    } catch (_) {
      // Graceful degradation — update local cart even if API is unavailable
    }

    setCart(prev => {
      const exists = prev.find(i => i.productId === produto.id);
      if (exists) return prev.map(i => i.productId === produto.id ? { ...i, quantidade } : i);
      return [...prev, { productId: produto.id, quantidade }];
    });

    setAddingId(null);
    setDoneId(produto.id);
    setTimeout(() => setDoneId(null), 2000);
  };

  return (
    <AppShell>
      <Helmet>
        <title>Catálogo B2B | Ingredientes Qualitheo para Indústria</title>
        <meta name="description" content="Catálogo B2B de cacau fino, nibs, liquor, manteiga e pó para a indústria chocolateira. Descontos por volume e compras diretas da Qualitheo." />
      </Helmet>

      <PageHeader
        badge="Catálogo B2B"
        title={<>Ingredientes <span className="text-gold-400 italic">Qualitheo</span></>}
        subtitle="Cacau amazônico premium para indústria chocolateira, confeitaria e bebidas. Preços B2B indicativos — entre em contato para condições de volume."
      />

      {/* Cart summary bar */}
      {cart.length > 0 && (
        <div className="bg-cocoa-800 border-b border-white/10 px-6 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <span className="text-sm text-cocoa-300">
              <span className="text-gold-400 font-bold">{cart.length}</span> produto(s) no carrinho
            </span>
            <Link href="/carrinho">
              <Button className="bg-gold-500 hover:bg-gold-600 text-cocoa-950 font-bold rounded-full text-xs px-5 py-1.5 flex items-center gap-2">
                <CartIcon className="w-3.5 h-3.5" /> Ver Carrinho
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Product grid */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATALOG_PRODUCTS.map((produto) => (
              <div
                key={produto.id}
                className="bg-cocoa-900 rounded-2xl border border-white/10 overflow-hidden hover:border-gold-500/40 transition-all duration-300 group flex flex-col"
              >
                {/* Product image */}
                <div className="relative h-52 bg-gradient-to-br from-cocoa-800 to-cocoa-700 overflow-hidden">
                  <img
                    src={produto.image}
                    alt={produto.nome}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-black/60 text-white border-white/20 text-xs capitalize">
                    {produto.tipoProduto}
                  </Badge>
                  <Badge className="absolute top-3 right-3 bg-cocoa-900/80 text-cocoa-300 border-white/10 text-xs">
                    {produto.linha}
                  </Badge>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display text-lg font-medium text-white mb-1">{produto.nome}</h3>
                  <p className="text-xs text-cocoa-500 italic mb-3">{produto.nameEn}</p>
                  <p className="text-cocoa-400 text-sm mb-4 line-clamp-2 leading-relaxed">{produto.descricao}</p>

                  {/* Technical specs */}
                  <div className="bg-cocoa-800/60 rounded-xl p-3 mb-4 space-y-1.5">
                    {Object.entries(produto.specs).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs">
                        <span className="text-cocoa-500 capitalize">{k.replace(/_/g, " ")}</span>
                        <span className="text-cocoa-300 font-medium">{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Formats */}
                  <div className="mb-4">
                    <p className="text-xs text-cocoa-500 uppercase tracking-wider mb-2">Formatos disponíveis</p>
                    <div className="flex flex-wrap gap-1.5">
                      {produto.formats.map(fmt => (
                        <span key={fmt} className="inline-flex items-center gap-1 px-2 py-0.5 bg-cocoa-800 text-cocoa-300 text-xs rounded border border-cocoa-700">
                          <Box className="w-2.5 h-2.5 opacity-50" />
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price + MOQ */}
                  <div className="bg-cocoa-800 rounded-xl p-3 mb-4">
                    <div className="flex items-end gap-1 mb-1">
                      {produto.precoIndicativo ? (
                        <>
                          <span className="text-2xl font-bold text-gold-400">
                            R$ {produto.precoIndicativo.toFixed(2)}
                          </span>
                          <span className="text-cocoa-400 text-sm mb-0.5">/{produto.unidadeBase}</span>
                          <span className="text-cocoa-600 text-xs mb-0.5 ml-1">(indicativo)</span>
                        </>
                      ) : (
                        <span className="text-cocoa-400 text-sm">Consulte preço</span>
                      )}
                    </div>
                    <p className="text-xs text-cocoa-500">
                      MOQ: <span className="text-cocoa-300">{produto.moqKg} {produto.unidadeBase}</span>
                    </p>
                  </div>

                  {/* Quantity + Add to cart */}
                  <div className="flex items-center gap-2 mt-auto">
                    <input
                      type="number"
                      aria-label={`Quantidade de ${produto.nome}`}
                      min={produto.moqKg}
                      step={produto.moqKg >= 100 ? 100 : 25}
                      value={getQty(produto)}
                      onChange={e => setQtdMap(prev => ({ ...prev, [produto.id]: Number(e.target.value) }))}
                      className="w-24 bg-cocoa-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-center focus:outline-none focus:border-gold-500"
                    />
                    <Button
                      className={`flex-1 font-bold rounded-xl text-sm transition-all ${
                        doneId === produto.id
                          ? "bg-green-500 hover:bg-green-500 text-white"
                          : "bg-gold-500 hover:bg-gold-600 text-cocoa-950"
                      }`}
                      onClick={() => handleAddToCart(produto)}
                      disabled={addingId === produto.id}
                    >
                      {addingId === produto.id ? (
                        "Adicionando..."
                      ) : doneId === produto.id ? (
                        <span className="flex items-center justify-center gap-1.5">
                          <CheckCircle className="w-4 h-4" /> Adicionado
                        </span>
                      ) : inCart(produto) ? (
                        "✓ Atualizar"
                      ) : (
                        "Adicionar ao pedido"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* B2B contact CTA */}
          <div className="mt-16 bg-cocoa-900 border border-white/10 rounded-2xl p-8 text-center">
            <h2 className="font-display text-2xl text-white mb-2">Precisa de volumes maiores ou condições especiais?</h2>
            <p className="text-cocoa-400 mb-6 max-w-xl mx-auto">
              Para contratos de médio e longo prazo, exportação, ou condições personalizadas de pagamento — fale diretamente com a equipe comercial Qualitheo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:gut@qualihteo.com"
                rel="noopener noreferrer"
                className="bg-gold-500 hover:bg-gold-600 text-cocoa-950 font-bold px-8 py-3 rounded-full text-sm transition-colors"
              >
                Falar com Comercial
              </a>
              <a
                href="https://wa.me/5593992356251"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3 rounded-full text-sm transition-colors"
              >
                WhatsApp →
              </a>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
