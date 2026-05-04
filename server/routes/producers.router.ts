import { Router } from "express";
import { storage } from "../storage";
import { asyncHandler } from "./utils";

export const producersRouter = Router();

producersRouter.post("/", asyncHandler(async (req, res) => {
  const { userId, tipo, nome, nomeFantasia, fazendaNome, cpfCnpj, municipio, estado, contatoEmail, contatoTelefone } = req.body;

  if (!nome || !cpfCnpj || !municipio || !estado) {
    res.status(400).json({ message: "Campos obrigatórios: nome, cpfCnpj, municipio, estado" });
    return;
  }

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

producersRouter.get("/:id", asyncHandler(async (req, res) => {
  const producer = await storage.getProducerById(req.params.id);
  if (!producer) {
    res.status(404).json({ message: "Produtor não encontrado" });
    return;
  }

  const [property, compliance] = await Promise.all([
    storage.getProducerProperty(producer.id),
    storage.getProducerCompliance(producer.id),
  ]);

  res.json({ producer, property: property ?? null, compliance: compliance ?? null });
}));

// Producer property upsert
producersRouter.put("/:id/property", asyncHandler(async (req, res) => {
  const prop = await storage.upsertProducerProperty(req.params.id, req.body);
  res.json(prop);
}));

// Producer compliance upsert
producersRouter.put("/:id/compliance", asyncHandler(async (req, res) => {
  const comp = await storage.upsertProducerCompliance(req.params.id, req.body);
  res.json(comp);
}));
