/**
 * content.router.ts — Public read-only API for content blocks
 *
 * GET /api/content      — Returns all blocks as { key: { pt, en, type } }
 * GET /api/content/:key — Single block
 *
 * No authentication required — public content.
 */
import { Router } from "express";
import { storage } from "../storage";
import { asyncHandler } from "./utils";

export const contentRouter = Router();

// GET /api/content — all blocks as a flat map
contentRouter.get("/", asyncHandler(async (_req, res) => {
  const rows = await storage.listContentBlocks();
  // Return as a map: { "hero.badge": { pt: "...", en: "...", type: "text" } }
  const map: Record<string, { pt: string; en: string; type: string }> = {};
  for (const row of rows) {
    map[row.key] = { pt: row.pt, en: row.en, type: row.type };
  }
  res.json(map);
}));

// GET /api/content/:key — single block
contentRouter.get("/:key", asyncHandler(async (req, res) => {
  const block = await storage.getContentBlock(req.params.key);
  if (!block) {
    res.status(404).json({ message: "Content block not found" });
    return;
  }
  res.json(block);
}));
