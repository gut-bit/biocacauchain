import { Router } from "express";
import { storage } from "../storage";
import { asyncHandler } from "./utils";

export const analyticsRouter = Router();

analyticsRouter.get("/origination", asyncHandler(async (_req, res) => {
  const analytics = await storage.getOriginationAnalytics();
  res.json(analytics);
}));
