import { Router } from "express";
import { storage } from "../storage";
import { asyncHandler } from "./utils";

/**
 * admin.router.ts — Internal control panel API
 *
 * All endpoints require the header:  X-Admin-Token: gutz140-internal
 * This is a lightweight internal-use gate; not a public-facing auth system.
 */

export const adminRouter = Router();

// ── Auth middleware ──────────────────────────────────────────────────────────
const ADMIN_TOKEN = "gutz140-internal";

adminRouter.use((req, res, next) => {
  if (req.headers["x-admin-token"] !== ADMIN_TOKEN) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
});

// ── Market Prices ────────────────────────────────────────────────────────────
adminRouter.get("/market", asyncHandler(async (_req, res) => {
  const rows = await storage.listMarketPrices();
  res.json(rows);
}));

adminRouter.post("/market", asyncHandler(async (req, res) => {
  const { tipo, descricao, precoMedioRKg } = req.body;
  if (!tipo || !descricao) {
    res.status(400).json({ message: "tipo and descricao are required" });
    return;
  }
  const row = await storage.createMarketPrice({
    tipo,
    descricao,
    precoMedioRKg: precoMedioRKg ?? "0",
  });
  res.status(201).json(row);
}));

adminRouter.patch("/market/:tipo", asyncHandler(async (req, res) => {
  const { tipo } = req.params;
  const row = await storage.upsertMarketPrice(tipo, req.body as any);
  res.json(row);
}));

adminRouter.delete("/market/:id", asyncHandler(async (req, res) => {
  await storage.deleteMarketPrice(req.params.id);
  res.json({ message: "Deleted" });
}));

// ── Products ─────────────────────────────────────────────────────────────────
adminRouter.get("/products", asyncHandler(async (_req, res) => {
  const rows = await storage.listProducts();
  res.json(rows);
}));

adminRouter.post("/products", asyncHandler(async (req, res) => {
  const { nome, brandId, tipoProduto, linha, descricao, unidadeBase } = req.body;
  if (!nome || !brandId || !tipoProduto || !linha) {
    res.status(400).json({ message: "nome, brandId, tipoProduto, and linha are required" });
    return;
  }
  const row = await storage.createProduct({ nome, brandId, tipoProduto, linha, descricao, unidadeBase });
  res.status(201).json(row);
}));

adminRouter.patch("/products/:id", asyncHandler(async (req, res) => {
  const row = await storage.updateProduct(req.params.id, req.body);
  res.json(row);
}));

adminRouter.delete("/products/:id", asyncHandler(async (req, res) => {
  const hard = req.query.hard === "true";
  await storage.deleteProduct(req.params.id, hard);
  res.json({ message: hard ? "Hard deleted" : "Archived (ativo=false)" });
}));

// ── Product Prices ───────────────────────────────────────────────────────────
adminRouter.get("/product-prices", asyncHandler(async (_req, res) => {
  const rows = await storage.listProductPrices();
  res.json(rows);
}));

adminRouter.post("/product-prices", asyncHandler(async (req, res) => {
  const { productId, priceListId, precoUnitario, moeda, moq, descontosPorVolume } = req.body;
  if (!productId || !priceListId || !precoUnitario) {
    res.status(400).json({ message: "productId, priceListId, and precoUnitario are required" });
    return;
  }
  const row = await storage.createProductPrice({ productId, priceListId, precoUnitario, moeda, moq, descontosPorVolume });
  res.status(201).json(row);
}));

adminRouter.patch("/product-prices/:id", asyncHandler(async (req, res) => {
  const row = await storage.updateProductPrice(req.params.id, req.body);
  res.json(row);
}));

adminRouter.delete("/product-prices/:id", asyncHandler(async (req, res) => {
  await storage.deleteProductPrice(req.params.id);
  res.json({ message: "Deleted" });
}));

// ── Brands & Price Lists (read-only for admin dropdowns) ─────────────────────
adminRouter.get("/brands", asyncHandler(async (_req, res) => {
  const rows = await storage.listAllBrands();
  res.json(rows);
}));

adminRouter.get("/price-lists", asyncHandler(async (_req, res) => {
  const rows = await storage.listAllPriceLists();
  res.json(rows);
}));

// ── Pricing Model ────────────────────────────────────────────────────────────
adminRouter.get("/pricing-model", asyncHandler(async (_req, res) => {
  const model = await storage.getActivePricingModel();
  res.json(model);
}));

adminRouter.patch("/pricing-model", asyncHandler(async (req, res) => {
  const model = await storage.upsertPricingModel(req.body);
  res.json(model);
}));

// ── Content Blocks ───────────────────────────────────────────────────────────
adminRouter.get("/content", asyncHandler(async (_req, res) => {
  const rows = await storage.listContentBlocks();
  res.json(rows);
}));

adminRouter.patch("/content/:key", asyncHandler(async (req, res) => {
  const { key } = req.params;
  const block = await storage.upsertContentBlock(key, req.body);
  res.json(block);
}));

adminRouter.post("/content/seed", asyncHandler(async (_req, res) => {
  await storage.seedContentBlocks();
  res.json({ message: "Content blocks seeded" });
}));
