import type { Express } from "express";

import {
  buildAuditVisibilityPackage,
  getAuditHealth,
  summarizeLatestAuditLog
} from "../audit-read-service.js";

export function registerAuditRoutes(app: Express): void {
  app.get("/audit/health", (_req, res) => {
    res.json({
      status: "success",
      health: getAuditHealth()
    });
  });

  app.get("/audit/summary", (_req, res) => {
    res.json({
      status: "success",
      summary: summarizeLatestAuditLog()
    });
  });

  app.get("/audit/visibility", (_req, res) => {
    res.json({
      status: "success",
      result: buildAuditVisibilityPackage()
    });
  });
}
