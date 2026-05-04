import { Router } from "express";
import { storage } from "../storage";
import { asyncHandler } from "./utils";

export const ordersRouter = Router();

ordersRouter.post("/", asyncHandler(async (req, res) => {
  const { customerId, tipo } = req.body;
  if (!customerId || !tipo) {
    res.status(400).json({ message: "customerId e tipo são obrigatórios" });
    return;
  }
  const order = await storage.createOrder({ customerId, tipo, canal: "site" });
  res.status(201).json(order);
}));

ordersRouter.get("/:orderId", asyncHandler(async (req, res) => {
  const order = await storage.getOrderById(req.params.orderId);
  if (!order) {
    res.status(404).json({ message: "Pedido não encontrado" });
    return;
  }

  const items = await storage.getOrderItemsWithProduct(req.params.orderId);
  
  const formattedItems = items.map(i => ({
    ...i.item,
    produtoNome: i.product.nome,
    produtoSlug: i.product.slug,
    unidade: i.product.unidadeBase,
  }));

  let customer = null;
  if (order.customerId) {
      customer = await storage.getUser(order.customerId);
  }

  res.json({ order, items: formattedItems, customer });
}));

ordersRouter.post("/:orderId/items", asyncHandler(async (req, res) => {
  const { productId, quantidade } = req.body;
  if (!productId || !quantidade) {
    res.status(400).json({ message: "productId e quantidade são obrigatórios" });
    return;
  }
  const result = await storage.upsertOrderItem({
    orderId: req.params.orderId,
    productId,
    quantidade: Number(quantidade),
  });
  res.json(result);
}));

ordersRouter.post("/:orderId/confirmar", asyncHandler(async (req, res) => {
  const { condicoesPagamento, observacoes, referenciaCliente } = req.body;
  const order = await storage.confirmOrder({
    orderId: req.params.orderId,
    condicoesPagamento,
    observacoes,
    referenciaCliente,
  });
  res.json(order);
}));
