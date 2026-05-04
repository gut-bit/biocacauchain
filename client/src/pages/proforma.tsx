import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderItem {
  id: string;
  productId: string;
  produtoNome: string;
  produtoSlug: string;
  unidade: string;
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
  createdAt: string;
  condicoesPagamento: string | null;
  observacoes: string | null;
  referenciaCliente: string | null;
}

export default function Proforma({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.order);
        setItems(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching proforma data", err);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cocoa-50 text-cocoa-950 flex items-center justify-center">
        <p className="font-sans text-cocoa-500">Gerando documento...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-cocoa-50 text-cocoa-950 flex items-center justify-center">
        <p className="font-sans text-red-500">Documento não encontrado.</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date(order.createdAt).toLocaleDateString("pt-BR");
  
  // Expiration is usually 7 days for a Proforma
  const expirationDate = new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR");

  return (
    <div className="min-h-screen bg-white text-cocoa-950 font-sans">
      
      {/* Non-printable action bar */}
      <div className="print:hidden bg-cocoa-950 text-white py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => window.close()} className="flex items-center gap-2 text-cocoa-300 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Fechar janela</span>
        </button>
        <div className="font-display font-medium text-lg text-gold-500">
          Proforma Invoice PI-{order.id.slice(0,8).toUpperCase()}
        </div>
        <Button 
          onClick={handlePrint}
          className="bg-gold-500 hover:bg-gold-600 text-cocoa-950 font-bold flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Imprimir / PDF
        </Button>
      </div>

      {/* Printable A4 Document Area */}
      <div className="max-w-4xl mx-auto p-8 md:p-12 print:p-0 print:max-w-none">
        
        {/* Header section */}
        <div className="flex justify-between items-start border-b-2 border-cocoa-950 pb-6 mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-cocoa-950 mb-1">
              PROFORMA INVOICE
            </h1>
            <p className="text-cocoa-600 font-medium">DOCUMENTO PRELIMINAR B2B</p>
          </div>
          <div className="text-right">
            <img src="/logo-qualitheo.png" alt="Qualitheo Logo" className="h-12 object-contain ml-auto mb-2 grayscale" />
            <p className="text-sm font-bold text-cocoa-900">Agroindústria Qualitheo S/A</p>
            <p className="text-xs text-cocoa-600">Rodovia BR-163, Km 12 - Zona Rural</p>
            <p className="text-xs text-cocoa-600">Medicilândia, Pará - Brasil</p>
            <p className="text-xs text-cocoa-600">CNPJ: 45.123.456/0001-99</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Bill To */}
          <div className="bg-cocoa-50 p-4 rounded-lg print:bg-transparent print:border print:border-cocoa-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cocoa-500 mb-2">Faturado para (Comprador)</h3>
            {/* The real buyer info would go here from the customer object, hardcoding placeholder for layout */}
            <p className="font-bold text-cocoa-950 mb-1">Cliente B2B / Distribuidor</p>
            <p className="text-sm text-cocoa-700">Rua Exemplo das Indústrias, 400</p>
            <p className="text-sm text-cocoa-700">São Paulo, SP - Brasil</p>
            {order.referenciaCliente && (
              <p className="text-xs text-cocoa-600 mt-2 font-mono">Ref. do Cliente: {order.referenciaCliente}</p>
            )}
          </div>

          /* Document Meta */
          <div className="grid grid-cols-2 gap-y-4 gap-x-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cocoa-500 mb-1">Emissão</h3>
              <p className="text-sm font-medium">{invoiceDate}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cocoa-500 mb-1">Válido até</h3>
              <p className="text-sm font-medium text-red-700">{expirationDate}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cocoa-500 mb-1">Cód. Pedido</h3>
              <p className="text-sm font-mono font-bold">PI-{order.id.slice(0,8).toUpperCase()}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cocoa-500 mb-1">Condições Pgto</h3>
              <p className="text-sm font-medium">{order.condicoesPagamento || "A combinar"}</p>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <table className="w-full text-left mb-8 border-collapse">
          <thead>
            <tr className="border-b-2 border-cocoa-900 text-cocoa-950">
              <th className="py-3 px-2 text-sm font-bold w-1/2">Descrição do Produto (SKU)</th>
              <th className="py-3 px-2 text-sm font-bold text-right">Qtde</th>
              <th className="py-3 px-2 text-sm font-bold text-right">Preço Unit.</th>
              <th className="py-3 px-2 text-sm font-bold text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} className={`border-b border-cocoa-100 ${idx % 2 !== 0 ? 'bg-cocoa-50/50 print:bg-transparent' : ''}`}>
                <td className="py-3 px-2">
                  <p className="font-bold text-sm text-cocoa-900">{item.produtoNome}</p>
                  <p className="text-xs text-cocoa-500 font-mono">SKU: {item.produtoSlug}</p>
                </td>
                <td className="py-3 px-2 text-sm text-right">
                  {Number(item.quantidade).toFixed(0)} <span className="text-xs text-cocoa-500">{item.unidade}</span>
                </td>
                <td className="py-3 px-2 text-sm text-right font-mono">
                  {order.moeda} {parseFloat(item.precoUnitario).toFixed(2)}
                </td>
                <td className="py-3 px-2 text-sm text-right font-bold font-mono">
                  {order.moeda} {parseFloat(item.subtotal).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex justify-end mb-12">
          <div className="w-1/2 md:w-1/3 space-y-3 border-t-2 border-cocoa-900 pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-cocoa-600 uppercase font-bold text-xs tracking-wider">Subtotal Bruto</span>
              <span className="font-mono">{order.moeda} {parseFloat(order.totalBruto).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cocoa-600 uppercase font-bold text-xs tracking-wider">Descontos</span>
              <span className="font-mono text-red-600">- {order.moeda} {parseFloat(order.descontos).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-cocoa-200 pt-3">
              <span className="text-cocoa-950 uppercase font-black text-sm tracking-widest">Total Líquido</span>
              <span className="font-mono font-black text-xl text-cocoa-950">{order.moeda} {parseFloat(order.totalLiquido).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer & Banking Info */}
        <div className="text-xs text-cocoa-600 border-t border-cocoa-200 pt-6 mt-6 grid grid-cols-2 gap-8 print:break-inside-avoid">
          <div>
            <h4 className="font-bold text-cocoa-900 mb-2 uppercase tracking-widest">Dados Bancários</h4>
            <p>Banco: Itaú BBA (341)</p>
            <p>Agência: 0001 | Conta: 12345-6</p>
            <p>Beneficiário: Agroindústria Qualitheo S/A</p>
            <p>CNPJ/PIX: 45.123.456/0001-99</p>
          </div>
          <div>
            <h4 className="font-bold text-cocoa-900 mb-2 uppercase tracking-widest">Termos e Observações</h4>
            <p className="mb-2">Incoterm: FOB Medicilândia / EXW</p>
            {order.observacoes && (
               <p className="italic bg-cocoa-50 p-2 border-l-2 border-gold-500 rounded-r mt-2">"{order.observacoes}"</p>
            )}
            <p className="mt-2 text-[10px] text-cocoa-400">Este documento não é um documento fiscal. A Nota Fiscal será emitida após a liquidação contábil financeira e o faturamento oficial.</p>
          </div>
        </div>

      </div>

      {/* Basic responsive print styling is handled by tailwind 'print:' classes. */}
      {/* For page margins, it's best handled globally or by the browser default. */}
      <style>{`
        @media print {
          @page { margin: 10mm; size: A4 portrait; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

    </div>
  );
}
