import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Try multiple candidate paths — handles both local dev and Cloud Run container layouts
  const candidates = [
    path.resolve(process.cwd(), "dist", "public"),  // Cloud Run: /app/dist/public
    path.resolve(process.cwd(), "public"),            // Fallback: /app/public
    path.resolve(__dirname, "..", "public"),          // CJS bundle sibling
    path.resolve(__dirname, "public"),                // CJS same-dir
  ];

  const distPath = candidates.find((p) => fs.existsSync(p));

  console.log(`[static] cwd=${process.cwd()} __dirname=${__dirname}`);
  console.log(`[static] candidates: ${candidates.join(", ")}`);
  console.log(`[static] resolved distPath: ${distPath ?? "NOT FOUND"}`);

  if (!distPath) {
    console.error("[static] ⚠️  Build directory not found — serving API only (no frontend assets).");
    // Register a fallback so Express doesn't silently 404 all non-API routes
    app.use("*", (_req, res) => {
      res.status(503).send("Frontend build not found. Run `npm run build` first.");
    });
    return;
  }

  app.use(express.static(distPath));

  // SPA fallthrough: serve index.html for all non-API routes
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
