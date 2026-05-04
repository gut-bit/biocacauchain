import { Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ── Shared Types ────────────────────────────────────────────────────────────

export interface Product {
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

export interface Preco {
  product_id: string;
  price_list: string;
  preco_unitario: string;
  moeda: string;
  moq: string;
  descontos_por_volume: Record<string, number>;
}

// ── Component ───────────────────────────────────────────────────────────────

interface ProductCardProps {
  produto: Product;
  preco?: Preco;
  inCart: boolean;
  isAdding: boolean;
  quantity: number;
  onQuantityChange: (id: string, qty: number) => void;
  onAddToCart: (produto: Product) => void;
}

const formatDesc = (descontos: Record<string, number>) =>
  Object.entries(descontos)
    .map(([faixa, pct]) => (pct > 0 ? `${faixa} kg → -${(pct * 100).toFixed(0)}%` : null))
    .filter(Boolean)
    .join("  |  ");

export default function ProductCard({
  produto,
  preco,
  inCart,
  isAdding,
  quantity,
  onQuantityChange,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="bg-cocoa-900 rounded-2xl border border-white/10 overflow-hidden hover:border-gold-500/40 transition-all group">
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-cocoa-800 to-cocoa-700 flex items-center justify-center relative overflow-hidden">
        {produto.imagens && produto.imagens.length > 0 ? (
          <img
            src={produto.imagens[0]}
            alt={produto.nome}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <Leaf className="w-16 h-16 text-cocoa-600 group-hover:text-gold-500/50 transition-colors" />
        )}
        <Badge className="absolute top-3 left-3 bg-black/60 text-white border-white/20 text-xs shadow-md drop-shadow-sm">
          {produto.tipoProduto.replace(/_/g, " ").toUpperCase()}
        </Badge>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-display text-lg font-medium mb-2">{produto.nome}</h3>
        <p className="text-cocoa-400 text-sm mb-4 line-clamp-2">{produto.descricao}</p>

        {/* Specs */}
        {produto.especificacoesTecnicas && (
          <div className="space-y-1 mb-4">
            {Object.entries(produto.especificacoesTecnicas)
              .slice(0, 3)
              .map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="text-cocoa-500 capitalize">{k.replace(/_/g, " ")}</span>
                  <span className="text-cocoa-300">{String(v)}</span>
                </div>
              ))}
          </div>
        )}

        {/* Price */}
        {preco ? (
          <div className="bg-cocoa-800 rounded-xl p-3 mb-4">
            <div className="flex items-end gap-1 mb-1">
              <span className="text-2xl font-bold text-gold-400">
                R$ {parseFloat(preco.preco_unitario).toFixed(2)}
              </span>
              <span className="text-cocoa-400 text-sm mb-0.5">/{produto.unidadeBase}</span>
            </div>
            <p className="text-xs text-cocoa-500">
              MOQ: {preco.moq} {produto.unidadeBase}
            </p>
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

        {/* Quantity + Add */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            aria-label="Quantidade"
            title="Quantidade"
            min={preco?.moq || 50}
            step={1}
            value={quantity}
            onChange={(e) => onQuantityChange(produto.id, Number(e.target.value))}
            className="w-24 bg-cocoa-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white text-center focus:outline-none focus:border-gold-500"
          />
          <Button
            className="flex-1 bg-gold-500 hover:bg-gold-600 text-cocoa-950 font-bold rounded-xl text-sm"
            onClick={() => onAddToCart(produto)}
            disabled={isAdding}
          >
            {isAdding ? "Adicionando..." : inCart ? "✓ Atualizar" : "Adicionar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
