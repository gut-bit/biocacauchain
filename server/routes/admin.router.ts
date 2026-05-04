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

// ─── Auth middleware ──────────────────────────────────────────────────────────
const ADMIN_TOKEN = "gutz140-internal";

adminRouter.use((req, res, next) => {
  if (req.headers["x-admin-token"] !== ADMIN_TOKEN) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
});

// ─── Market Prices ────────────────────────────────────────────────────────────
adminRouter.get("/market", asyncHandler(async (_req, res) => {
  const rows = await storage.listMarketPrices();
  res.json(rows);
}));

adminRouter.patch("/market/:tipo", asyncHandler(async (req, res) => {
  const { tipo } = req.params;
  const row = await storage.upsertMarketPrice(tipo, req.body as any);
  res.json(row);
}));

// ─── Products ─────────────────────────────────────────────────────────────────
adminRouter.get("/products", asyncHandler(async (_req, res) => {
  const rows = await storage.listProducts();
  res.json(rows);
}));

adminRouter.patch("/products/:id", asyncHandler(async (req, res) => {
  const row = await storage.updateProduct(req.params.id, req.body);
  res.json(row);
}));

// ─── Product Prices ───────────────────────────────────────────────────────────
adminRouter.get("/product-prices", asyncHandler(async (_req, res) => {
  const rows = await storage.listProductPrices();
  res.json(rows);
}));

adminRouter.patch("/product-prices/:id", asyncHandler(async (req, res) => {
  const row = await storage.updateProductPrice(req.params.id, req.body);
  res.json(row);
}));

// ─── Pricing Model ────────────────────────────────────────────────────────────
adminRouter.get("/pricing-model", asyncHandler(async (_req, res) => {
  const model = await storage.getActivePricingModel();
  res.json(model);
}));

adminRouter.patch("/pricing-model", asyncHandler(async (req, res) => {
  const model = await storage.upsertPricingModel(req.body);
  res.json(model);
}));

// ─── Content Blocks ───────────────────────────────────────────────────────────
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

