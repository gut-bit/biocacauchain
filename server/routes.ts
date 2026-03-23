/**
 * routes.ts — Gutcacau API
 *
 * All routes backed by DrizzleStorage (PostgreSQL). No in-memory state.
 * Pattern: async handler → try/catch → next(err) for centralized error handling.
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, NotFoundError } from "./storage";
import { calcularPreco, modeloPadraoMolhado } from "./pricingService";

// ── Typed async handler wrapper ───────────────────────────────────────────────
function asyncHandler(
  fn: (req: any, res: any, next: any) => Promise<any>
) {
  return (req: any, res: any, next: any) => fn(req, res, next).catch(next);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ══════════════════════════════════════════════════════════════════════════
  // MARKET PRICES — public GET / Qualitheo POST (DB-backed)
  // ══════════════════════════════════════════════════════════════════════════

  app.get("/api/precos-mercado", asyncHandler(async (_req, res) => {
    const rows = await storage.listMarketPrices();
    // Shape into the format expected by PrecosWidget
    const precos = rows.map(r => ({
      tipo: r.tipo,
      descricao: r.descricao,
      precoMedioRKg: Number(r.precoMedioRKg),
      variacao: Number(r.variacaoDia),
      unidade: r.unidade,
    }));

    // Use first row for shared factors (all rows have identical values, set by operator)
    const first = rows[0];
    res.json({
      precos,
      premiumQualidade: Number(first?.premiumQualidade ?? 15),
      descontoLogistica: Number(first?.descontoLogistica ?? 5),
      fatorSocioAmbiental: Number(first?.fatorSocioAmbiental ?? 5),
      notas: first?.notas ?? "",
      atualizadoEm: first?.createdAt ?? new Date(),
      atualizadoPor: first?.atualizadoPor ?? "Qualitheo",
    });
  }));

  app.post("/api/precos-mercado", asyncHandler(async (req, res) => {
    const { precos, premiumQualidade, descontoLogistica, fatorSocioAmbiental, notas, atualizadoPor } = req.body;

    if (!Array.isArray(precos) || precos.length === 0) {
      res.status(400).json({ message: "precos[] é obrigatório" });
      return;
    }

    const updated = [];
    for (const p of precos) {
      const row = await storage.upsertMarketPrice(p.tipo, {
        descricao: p.descricao,
        precoMedioRKg: String(p.precoMedioRKg),
        premiumQualidade: premiumQualidade !== undefined ? String(premiumQualidade) : undefined,
        descontoLogistica: descontoLogistica !== undefined ? String(descontoLogistica) : undefined,
        fatorSocioAmbiental: fatorSocioAmbiental !== undefined ? String(fatorSocioAmbiental) : undefined,
        notas,
        atualizadoPor: atualizadoPor ?? "Qualitheo",
      } as any);
      updated.push(row);
    }

    // Return in widget format
    res.json({
      precos: updated.map(r => ({
        tipo: r.tipo,
        descricao: r.descricao,
        precoMedioRKg: Number(r.precoMedioRKg),
        variacao: Number(r.variacaoDia),
        unidade: r.unidade,
      })),
      premiumQualidade: Number(updated[0]?.premiumQualidade ?? 15),
      descontoLogistica: Number(updated[0]?.descontoLogistica ?? 5),
      fatorSocioAmbiental: Number(updated[0]?.fatorSocioAmbiental ?? 5),
      notas: updated[0]?.notas ?? "",
      atualizadoEm: updated[0]?.createdAt ?? new Date(),
      atualizadoPor: updated[0]?.atualizadoPor ?? "Qualitheo",
    });
  }));

  // ══════════════════════════════════════════════════════════════════════════
  // CATALOG — brands, products, prices
  // ══════════════════════════════════════════════════════════════════════════

  app.get("/api/brands", asyncHandler(async (_req, res) => {
    res.json(await storage.listBrands());
  }));

  app.get("/api/products", asyncHandler(async (req, res) => {
    const brandSlug = req.query.brand as string | undefined;
    res.json(await storage.listProducts({ brandSlug }));
  }));

  app.get("/api/products/:slug", asyncHandler(async (req, res) => {
    const product = await storage.getProductBySlug(req.params.slug);
    if (!product) return res.status(404).json({ message: "Produto não encontrado" });
    res.json(product);
  }));

  app.get("/api/products/:slug/precos", asyncHandler(async (req, res) => {
    const product = await storage.getProductBySlug(req.params.slug);
    if (!product) return res.status(404).json({ message: "Produto não encontrado" });

    const priceListName = (req.query.price_list as string) || "B2B Brasil";
    const priceList = await storage.getPriceListByName(priceListName);
    if (!priceList) return res.status(404).json({ message: "Lista de preço não encontrada" });

    const prices = await storage.getProductPrices(product.id, priceList.id);
    if (!prices) return res.status(404).json({ message: "Preço não configurado" });

    res.json({
      product_id: product.id,
      price_list: priceList.nome,
      preco_unitario: prices.precoUnitario,
      moeda: prices.moeda,
      moq: prices.moq,
      descontos_por_volume: prices.descontosPorVolume,
    });
  }));

  // ══════════════════════════════════════════════════════════════════════════
  // ORDERS (B2B cart & checkout)
  // ══════════════════════════════════════════════════════════════════════════

  app.post("/api/orders", asyncHandler(async (req, res) => {
    const { customerId, tipo } = req.body;
    if (!customerId || !tipo)
      return res.status(400).json({ message: "customerId e tipo são obrigatórios" });
    const order = await storage.createOrder({ customerId, tipo, canal: "site" });
    res.status(201).json(order);
  }));

  app.get("/api/orders/:orderId", asyncHandler(async (req, res) => {
    const order = await storage.getOrderById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Pedido não encontrado" });
    res.json({ order });
  }));

  app.post("/api/orders/:orderId/items", asyncHandler(async (req, res) => {
    const { productId, quantidade } = req.body;
    if (!productId || !quantidade)
      return res.status(400).json({ message: "productId e quantidade são obrigatórios" });
    const result = await storage.upsertOrderItem({
      orderId: req.params.orderId,
      productId,
      quantidade: Number(quantidade),
    });
    res.json(result);
  }));

  app.post("/api/orders/:orderId/confirmar", asyncHandler(async (req, res) => {
    const { condicoesPagamento, observacoes, referenciaCliente } = req.body;
    const order = await storage.confirmOrder({
      orderId: req.params.orderId,
      condicoesPagamento,
      observacoes,
      referenciaCliente,
    });
    res.json(order);
  }));

  // ══════════════════════════════════════════════════════════════════════════
  // ORIGINATION — Producers
  // ══════════════════════════════════════════════════════════════════════════

  app.post("/api/producers", asyncHandler(async (req, res) => {
    const { userId, tipo, nome, nomeFantasia, fazendaNome, cpfCnpj, municipio, estado, contatoEmail, contatoTelefone } = req.body;

    if (!nome || !cpfCnpj || !municipio || !estado)
      return res.status(400).json({ message: "Campos obrigatórios: nome, cpfCnpj, municipio, estado" });

    const producer = await storage.createProducer({
      userId: userId ?? null,
      tipo: tipo ?? "individual",
      nome,
      nomeFantasia: nomeFantasia ?? null,
      fazendaNome: fazendaNome ?? null,
      cpfCnpj,
      municipio,
      estado,
      contatoEmail: contatoEmail ?? null,
      contatoTelefone: contatoTelefone ?? null,
      documentos: {},
      ativo: true,
    });

    res.status(201).json(producer);
  }));

  app.get("/api/producers/:id", asyncHandler(async (req, res) => {
    const producer = await storage.getProducerById(req.params.id);
    if (!producer) return res.status(404).json({ message: "Produtor não encontrado" });

    const [property, compliance] = await Promise.all([
      storage.getProducerProperty(producer.id),
      storage.getProducerCompliance(producer.id),
    ]);

    res.json({ producer, property: property ?? null, compliance: compliance ?? null });
  }));

  // Producer property upsert
  app.put("/api/producers/:id/property", asyncHandler(async (req, res) => {
    const prop = await storage.upsertProducerProperty(req.params.id, req.body);
    res.json(prop);
  }));

  // Producer compliance upsert
  app.put("/api/producers/:id/compliance", asyncHandler(async (req, res) => {
    const comp = await storage.upsertProducerCompliance(req.params.id, req.body);
    res.json(comp);
  }));

  // ══════════════════════════════════════════════════════════════════════════
  // ORIGINATION — Lots
  // ══════════════════════════════════════════════════════════════════════════

  app.get("/api/analytics/origination", asyncHandler(async (_req, res) => {
    const analytics = await storage.getOriginationAnalytics();
    res.json(analytics);
  }));

  app.get("/api/lots", asyncHandler(async (req, res) => {
    const producerId = req.query.producer_id as string | undefined;
    const status = req.query.status as string | undefined;
    res.json(await storage.listLots({ producerId, status }));
  }));

  app.post("/api/lots", asyncHandler(async (req, res) => {
    const { producerId, tipo, safra, pesoKg, origemTalhao } = req.body;
    if (!producerId || !tipo || !safra || !pesoKg)
      return res.status(400).json({ message: "Campos obrigatórios: producerId, tipo, safra, pesoKg" });

    const lot = await storage.createLot({ producerId, tipo, safra, pesoKg: Number(pesoKg), origemTalhao });
    await storage.createLotEvent({ lotId: lot.id, tipoEvento: "registro", detalhes: { tipo, safra, pesoKg } });
    res.status(201).json(lot);
  }));

  app.get("/api/lots/:id", asyncHandler(async (req, res) => {
    const lot = await storage.getLotById(req.params.id);
    if (!lot) return res.status(404).json({ message: "Lote não encontrado" });
    res.json(lot);
  }));

  // Quality evaluation (checklist)
  app.post("/api/lots/:id/avaliar", asyncHandler(async (req, res) => {
    const itens: Record<string, number> = req.body.itens ?? {};
    const CHECKLIST_KEYS = [
      "selecao_frutos", "higiene_colheita", "tempo_colheita_quebra",
      "selecao_interna", "uniformidade_lote", "ausencia_corpos_estranhos",
      "condicoes_transporte",
    ];
    const total = CHECKLIST_KEYS.reduce((sum, k) => sum + (Number(itens[k]) || 0), 0);
    const scoreQualidade = Math.min(100, (total / 70) * 100);

    const lot = await storage.updateLotScoreQualidade(req.params.id, scoreQualidade, itens);
    await storage.createLotEvent({ lotId: lot.id, tipoEvento: "avaliacao", detalhes: { itens, scoreQualidade } });
    res.json({ lot_id: lot.id, score_qualidade: scoreQualidade });
  }));

  // Pricing calculation (does NOT persist — read-only price suggestion)
  app.post("/api/lots/:id/preco", asyncHandler(async (req, res) => {
    const { modalidade = "molhado_baba", indice_fidelidade = 0 } = req.body;
    const lot = await storage.getLotById(req.params.id);
    if (!lot) return res.status(404).json({ message: "Lote não encontrado" });
    if (lot.scoreQualidade == null)
      return res.status(400).json({ message: "Lote ainda não avaliado. Execute /avaliar primeiro." });

    const preco = calcularPreco({
      modalidade: modalidade as any,
      scoreQualidade: Number(lot.scoreQualidade),
      indiceFidelidade: Number(indice_fidelidade),
      modelo: modeloPadraoMolhado,
    });
    res.json({
      lot_id: lot.id,
      modalidade,
      preco_min_r_kg: preco.precoMinRKg.toFixed(2),
      preco_max_r_kg: preco.precoMaxRKg.toFixed(2),
      preco_sugerido_r_kg: preco.precoSugeridoRKg.toFixed(2),
      componentes: preco.componentes,
    });
  }));

  // ══════════════════════════════════════════════════════════════════════════
  // ORIGINATION — Negotiations (Qualitheo proposta)
  // ══════════════════════════════════════════════════════════════════════════

  app.post("/api/lots/:id/proposta", asyncHandler(async (req, res) => {
    const {
      precoOferecidoRKg, precoSugeridoRKg = 0, precoMinRKg = 0,
      justificativa, condicoesPagamento, validadeDias, obsInternas,
    } = req.body;

    if (!precoOferecidoRKg || Number(precoOferecidoRKg) <= 0)
      return res.status(400).json({ message: "precoOferecidoRKg é obrigatório e deve ser > 0" });

    const lot = await storage.getLotById(req.params.id);
    if (!lot) return res.status(404).json({ message: "Lote não encontrado" });

    const negotiation = await storage.createLotNegotiation({
      lotId: req.params.id,
      precoOferecidoRKg: Number(precoOferecidoRKg),
      precoSugeridoRKg: Number(precoSugeridoRKg),
      precoMinRKg: Number(precoMinRKg),
      justificativa,
      condicoesPagamento,
      validadeDias: validadeDias ? Number(validadeDias) : 5,
      obsInternas,
    });

    await storage.updateLotStatus(req.params.id, "em_negociacao");
    await storage.createLotEvent({
      lotId: req.params.id,
      tipoEvento: "proposta_qualitheo",
      detalhes: {
        negotiation_id: negotiation.id,
        preco_oferecido_r_kg: precoOferecidoRKg,
        validade_dias: validadeDias,
      },
    });

    res.status(201).json(negotiation);
  }));

  app.get("/api/lots/:id/negociacao", asyncHandler(async (req, res) => {
    const lot = await storage.getLotById(req.params.id);
    if (!lot) return res.status(404).json({ message: "Lote não encontrado" });
    const negotiation = await storage.getLatestNegotiationForLot(req.params.id);
    res.json({ lot, negotiation: negotiation ?? null });
  }));

  // Producer accepts/rejects proposal
  app.post("/api/lots/:id/resposta-produtor", asyncHandler(async (req, res) => {
    const { negotiationId, acao } = req.body;
    if (!negotiationId || !acao)
      return res.status(400).json({ message: "negotiationId e acao são obrigatórios" });

    const lot = await storage.getLotById(req.params.id);
    if (!lot) return res.status(404).json({ message: "Lote não encontrado" });

    if (acao === "aceitar") {
      const negotiation = await storage.updateLotNegotiationStatus({ negotiationId, status: "aceita_produtor" });
      const lotAtualizado = await storage.updateLotStatus(req.params.id, "comprado");
      await storage.createLotEvent({
        lotId: req.params.id,
        tipoEvento: "compra",
        detalhes: { negotiation_id: negotiationId, preco_final_r_kg: negotiation.precoOferecidoRKg },
      });
      return res.json({ lot: lotAtualizado, negotiation });
    }

    if (acao === "recusar") {
      const negotiation = await storage.updateLotNegotiationStatus({ negotiationId, status: "recusada_produtor" });
      const lotAtualizado = await storage.updateLotStatus(req.params.id, "draft");
      await storage.createLotEvent({ lotId: req.params.id, tipoEvento: "recusa_produtor", detalhes: { negotiation_id: negotiationId } });
      return res.json({ lot: lotAtualizado, negotiation });
    }

    res.status(400).json({ message: "Ação inválida. Use 'aceitar' ou 'recusar'." });
  }));

  // ══════════════════════════════════════════════════════════════════════════
  // TRACEABILITY — Lot timeline
  // ══════════════════════════════════════════════════════════════════════════

  app.get("/api/lots/:id/timeline", asyncHandler(async (req, res) => {
    const lot = await storage.getLotById(req.params.id);
    if (!lot) return res.status(404).json({ message: "Lote não encontrado" });

    const [events, negotiation] = await Promise.all([
      storage.listLotEvents(req.params.id),
      storage.getLatestNegotiationForLot(req.params.id),
    ]);

    res.json({ lot, events, negotiation: negotiation ?? null });
  }));

  return httpServer;
}
