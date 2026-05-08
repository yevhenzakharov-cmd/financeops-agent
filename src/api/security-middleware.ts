import type { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";

export const SECURITY_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const SECURITY_RATE_LIMIT_MAX_REQUESTS = 300;

export function buildSecurityHeadersMiddleware() {
  return helmet({
    contentSecurityPolicy: false
  });
}

export function buildDemoRateLimitMiddleware() {
  return rateLimit({
    windowMs: SECURITY_RATE_LIMIT_WINDOW_MS,
    limit: SECURITY_RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      status: "error",
      error: {
        code: "rate_limit_exceeded",
        message: "Too many requests for this demo API window."
      }
    }
  });
}

export function buildSecurityStatus() {
  return {
    status: "ready",
    securityHeaders: {
      enabled: true,
      poweredByDisabled: true,
      provider: "helmet",
      note: "Helmet is used for demo-safe HTTP security headers. Content Security Policy is disabled because this API serves JSON endpoints, not browser-rendered pages."
    },
    rateLimit: {
      enabled: true,
      provider: "express-rate-limit",
      windowMs: SECURITY_RATE_LIMIT_WINDOW_MS,
      maxRequests: SECURITY_RATE_LIMIT_MAX_REQUESTS,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      scope: "demo_api_boundary"
    },
    reviewerNotes: [
      "This is a demo-safe HTTP hardening layer, not a complete production security program.",
      "Production implementations should tune limits per client traffic profile.",
      "Production implementations should use client-owned WAF, auth, monitoring, and incident response.",
      "No client-owned credentials or production data are stored in this public repository."
    ]
  };
}

export function securityStatusHandler(_req: Request, res: Response): void {
  res.json({
    status: "success",
    result: buildSecurityStatus()
  });
}
