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

// ── Bootstrap ─────────────────────────────────────────────────────────────────
(async () => {
  // 1. Apply additive migration SQL directly (idempotent)
  try {
    log("Applying schema migration...", "db");
    const migrationPath = join(process.cwd(), "migrations/0001_gutcacau_full_schema.sql");
    const sql = readFileSync(migrationPath, "utf-8");
    await pool.query(sql);
    log("Migration applied ✅", "db");
  } catch (e: any) {
    // Non-fatal: tables may already exist with all columns
    log(`Migration warning (may already be up to date): ${e.message}`, "db");
  }

  // 2. Seed immutable catalog data (idempotent)
  await seedInitialData();

  // 3. Register API routes
  await registerRoutes(httpServer, app);

  // 4. Centralized error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (status >= 500) console.error("[error]", err.stack ?? err.message);
    res.status(status).json({ message });
  });

  // 5. Serve frontend
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // 6. Listen
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen({ port, host: "0.0.0.0" }, () => {
    log(`🚀 Gutcacau server listening on port ${port}`);
  });
})();
