import { Router } from "express";
import { storage } from "../storage";
import { asyncHandler } from "./utils";
import { calcularPreco, modeloPadraoMolhado } from "../pricingService";

export const lotsRouter = Router();

lotsRouter.get("/", asyncHandler(async (req, res) => {
  const producerId = req.query.producer_id as string | undefined;
  const status = req.query.status as string | undefined;
  res.json(await storage.listLots({ producerId, status }));
}));

lotsRouter.post("/", asyncHandler(async (req, res) => {
  const { producerId, tipo, safra, pesoKg, origemTalhao } = req.body;
  if (!producerId || !tipo || !safra || !pesoKg) {
    res.status(400).json({ message: "Campos obrigatórios: producerId, tipo, safra, pesoKg" });
    return;
  }

  const lot = await storage.createLot({ producerId, tipo, safra, pesoKg: Number(pesoKg), origemTalhao });
  await storage.createLotEvent({ lotId: lot.id, tipoEvento: "registro", detalhes: { tipo, safra, pesoKg } });
  res.status(201).json(lot);
}));

lotsRouter.get("/:id", asyncHandler(async (req, res) => {
  const lot = await storage.getLotById(req.params.id);
  if (!lot) {
    res.status(404).json({ message: "Lote não encontrado" });
    return;
  }
  res.json(lot);
}));

// Quality evaluation (checklist)
lotsRouter.post("/:id/avaliar", asyncHandler(async (req, res) => {
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
lotsRouter.post("/:id/preco", asyncHandler(async (req, res) => {
  const { modalidade = "molhado_baba", indice_fidelidade = 0 } = req.body;
  const lot = await storage.getLotById(req.params.id);
  if (!lot) {
    res.status(404).json({ message: "Lote não encontrado" });
    return;
  }
  if (lot.scoreQualidade == null) {
    res.status(400).json({ message: "Lote ainda não avaliado. Execute /avaliar primeiro." });
    return;
  }

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

// Negotiation
lotsRouter.post("/:id/proposta", asyncHandler(async (req, res) => {
  const {
    precoOferecidoRKg, precoSugeridoRKg = 0, precoMinRKg = 0,
    justificativa, condicoesPagamento, validadeDias, obsInternas,
  } = req.body;

  if (!precoOferecidoRKg || Number(precoOferecidoRKg) <= 0) {
    res.status(400).json({ message: "precoOferecidoRKg é obrigatório e deve ser > 0" });
    return;
  }

  const lot = await storage.getLotById(req.params.id);
  if (!lot) {
    res.status(404).json({ message: "Lote não encontrado" });
    return;
  }

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

lotsRouter.get("/:id/negociacao", asyncHandler(async (req, res) => {
  const lot = await storage.getLotById(req.params.id);
  if (!lot) {
    res.status(404).json({ message: "Lote não encontrado" });
    return;
  }
  const negotiation = await storage.getLatestNegotiationForLot(req.params.id);
  res.json({ lot, negotiation: negotiation ?? null });
}));

// Producer accepts/rejects
lotsRouter.post("/:id/resposta-produtor", asyncHandler(async (req, res) => {
  const { negotiationId, acao } = req.body;
  if (!negotiationId || !acao) {
    res.status(400).json({ message: "negotiationId e acao são obrigatórios" });
    return;
  }

  const lot = await storage.getLotById(req.params.id);
  if (!lot) {
    res.status(404).json({ message: "Lote não encontrado" });
    return;
  }

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

lotsRouter.get("/:id/timeline", asyncHandler(async (req, res) => {
  const lot = await storage.getLotById(req.params.id);
  if (!lot) {
    res.status(404).json({ message: "Lote não encontrado" });
    return;
  }

  const [events, negotiation] = await Promise.all([
    storage.listLotEvents(req.params.id),
    storage.getLatestNegotiationForLot(req.params.id),
  ]);

  res.json({ lot, events, negotiation: negotiation ?? null });
}));
