import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { seedInitialData } from "./seeds";
import { pool } from "./db";
import { readFileSync } from "fs";
import { join } from "path";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage { rawBody: unknown; }
}

app.use(express.json({ verify: (req, _res, buf) => { req.rawBody = buf; } }));
app.use(express.urlencoded({ extended: false }));

// ── Request logger ────────────────────────────────────────────────────────────
export function log(message: string, source = "express") {
  const time = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  console.log(`${time} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  res.on("finish", () => {
    if (path.startsWith("/api")) {
      log(`${req.method} ${path} ${res.statusCode} in ${Date.now() - start}ms`);
    }
  });
  next();
});

// ── Health check (always responds, no DB needed) ──────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// ── Bootstrap ─────────────────────────────────────────────────────────────────
(async () => {
  // 1. Register API routes FIRST
  await registerRoutes(httpServer, app);

  // 2. Centralized error handler (must come after routes, before static)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (status >= 500) console.error("[error]", err.stack ?? err.message);
    res.status(status).json({ message });
  });

  // 3. Serve frontend (wildcard * must be last)
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // 4. Listen — MUST come after all middleware is registered
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen({ port, host: "0.0.0.0" }, () => {
    log(`🚀 Gutcacau server listening on port ${port}`);
    log(`NODE_ENV=${process.env.NODE_ENV ?? "unset"}`);
  });

  // 5. DB migration & seed — async after server is ready (non-blocking for startup)
  setImmediate(async () => {
    // Run migrations in order — both are idempotent (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS)
    const migrations = [
      "migrations/0000_superb_wonder_man.sql",
      "migrations/0001_gutcacau_full_schema.sql",
      "migrations/0002_content_blocks.sql",
    ];
    for (const file of migrations) {
      try {
        log(`Applying migration: ${file}`, "db");
        const sql = readFileSync(join(process.cwd(), file), "utf-8");
        await pool.query(sql);
        log(`✅ ${file} applied`, "db");
      } catch (e: any) {
        log(`Migration note (${file}): ${e.message}`, "db");
      }
    }

    await seedInitialData();

    // Seed content blocks (idempotent — always safe to run)
    try {
      const { storage } = await import("./storage");
      await storage.seedContentBlocks();
      log("✅ Content blocks seeded", "db");
    } catch (e: any) {
      log(`Content seed note: ${e.message}`, "db");
    }
  });
})();
