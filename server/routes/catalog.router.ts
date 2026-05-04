import { Router } from "express";
import { storage } from "../storage";
import { asyncHandler } from "./utils";

export const catalogRouter = Router();

catalogRouter.get("/brands", asyncHandler(async (_req, res) => {
  res.json(await storage.listBrands());
}));

catalogRouter.get("/products", asyncHandler(async (req, res) => {
  const brandSlug = req.query.brand as string | undefined;
  res.json(await storage.listProducts({ brandSlug }));
}));

catalogRouter.get("/products/:slug", asyncHandler(async (req, res) => {
  const product = await storage.getProductBySlug(req.params.slug);
  if (!product) {
    res.status(404).json({ message: "Produto não encontrado" });
    return;
  }
  res.json(product);
}));

catalogRouter.get("/products/:slug/precos", asyncHandler(async (req, res) => {
  const product = await storage.getProductBySlug(req.params.slug);
  if (!product) {
    res.status(404).json({ message: "Produto não encontrado" });
    return; 
  }

  const priceListName = (req.query.price_list as string) || "B2B Brasil";
  const priceList = await storage.getPriceListByName(priceListName);
  if (!priceList) {
    res.status(404).json({ message: "Lista de preço não encontrada" });
    return;
  }

  const prices = await storage.getProductPrices(product.id, priceList.id);
  if (!prices) {
    res.status(404).json({ message: "Preço não configurado" });
    return;
  }

  res.json({
    product_id: product.id,
    price_list: priceList.nome,
    preco_unitario: prices.precoUnitario,
    moeda: prices.moeda,
    moq: prices.moq,
    descontos_por_volume: prices.descontosPorVolume,
  });
}));
