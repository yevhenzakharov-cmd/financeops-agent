import type { NextFunction, Request, Response } from "express";

import { buildApiErrorBody } from "./error-response.js";

export const DEMO_API_KEY_HEADER = "x-demo-api-key";
export const LOCAL_DEMO_API_KEY = "local-demo-key";

export interface DemoAuthStatus {
  enabled: true;
  headerName: typeof DEMO_API_KEY_HEADER;
  productionKeyConfigured: boolean;
  localFallbackAllowed: boolean;
  protectedRoutes: string[];
  note: string;
}

export function getConfiguredDemoApiKey(): string | null {
  const configured = process.env.DEMO_API_KEY?.trim();

  if (configured) {
    return configured;
  }

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return LOCAL_DEMO_API_KEY;
}

export function buildDemoAuthStatus(): DemoAuthStatus {
  const productionKeyConfigured = Boolean(process.env.DEMO_API_KEY?.trim());

  return {
    enabled: true,
    headerName: DEMO_API_KEY_HEADER,
    productionKeyConfigured,
    localFallbackAllowed: !productionKeyConfigured && process.env.NODE_ENV !== "production",
    protectedRoutes: [
      "POST /run-financeops-agent",
      "POST /payments/:paymentRecommendationId/approve-and-send"
    ],
    note:
      "Demo API key gating protects action-like routes while keeping read-only reviewer endpoints public."
  };
}

export function requireDemoApiKey(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const expectedApiKey = getConfiguredDemoApiKey();

  if (!expectedApiKey) {
    res.status(500).json(
      buildApiErrorBody(
        "demo_auth_not_configured",
        "DEMO_API_KEY must be configured before protected action routes can run in production.",
        req
      )
    );
    return;
  }

  const providedApiKey = req.header(DEMO_API_KEY_HEADER);

  if (!providedApiKey) {
    res.status(401).json(
      buildApiErrorBody(
        "missing_demo_api_key",
        `Missing required ${DEMO_API_KEY_HEADER} header.`,
        req
      )
    );
    return;
  }

  if (providedApiKey !== expectedApiKey) {
    res.status(403).json(
      buildApiErrorBody(
        "invalid_demo_api_key",
        "Invalid demo API key.",
        req
      )
    );
    return;
  }

  next();
}
