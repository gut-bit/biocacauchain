import { Router } from "express";
import { storage } from "../storage";
import { asyncHandler } from "./utils";

export const marketRouter = Router();

marketRouter.get("/", asyncHandler(async (_req, res) => {
  const rows = await storage.listMarketPrices();
  const precos = rows.map(r => ({
    tipo: r.tipo,
    descricao: r.descricao,
    precoMedioRKg: Number(r.precoMedioRKg),
    variacao: Number(r.variacaoDia),
    unidade: r.unidade,
  }));

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

marketRouter.post("/", asyncHandler(async (req, res) => {
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
