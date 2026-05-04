/**
 * routes.ts — Gutcacau API Gateway
 *
 * All routes backed by DrizzleStorage (PostgreSQL). No in-memory state.
 * Fully Modularized using express.Router() abstractions.
 */

import type { Express } from "express";
import { createServer, type Server } from "http";

// Imports Modulares
import { marketRouter } from "./routes/market.router";
import { catalogRouter } from "./routes/catalog.router";
import { ordersRouter } from "./routes/orders.router";
import { producersRouter } from "./routes/producers.router";
import { lotsRouter } from "./routes/lots.router";
import { analyticsRouter } from "./routes/analytics.router";
import { adminRouter } from "./routes/admin.router";
import { contentRouter } from "./routes/content.router";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ─── API Gateways ─────────────────────────────────────────────────────────────
  
  // Mercado Qualitheo
  app.use("/api/precos-mercado", marketRouter);
  
  // Vitrine B2B
  app.use("/api", catalogRouter); // Montado em /api para englobar /brands e /products
  
  // Carrinhos e Checkout
  app.use("/api/orders", ordersRouter);
  
  // Originação Produtores
  app.use("/api/producers", producersRouter);
  
  // Lotes & Trackability
  app.use("/api/lots", lotsRouter);
  
  // Analytics Hub
  app.use("/api/analytics", analyticsRouter);

  // Admin Control Panel (internal only, token-gated)
  app.use("/api/admin", adminRouter);

  // Content Blocks (public CMS API)
  app.use("/api/content", contentRouter);

  return httpServer;
}

