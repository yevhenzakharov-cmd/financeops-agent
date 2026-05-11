import { describe, expect, test } from "vitest";
import {
  SECURITY_RATE_LIMIT_MAX_REQUESTS,
  SECURITY_RATE_LIMIT_WINDOW_MS,
  buildDemoRateLimitMiddleware,
  buildSecurityHeadersMiddleware,
  buildSecurityStatus,
  securityStatusHandler
} from "../src/api/security-middleware.js";

describe("security middleware status", () => {
  test("documents demo HTTP hardening boundaries", () => {
    const status = buildSecurityStatus();

    expect(status.status).toBe("ready");
    expect(status.securityHeaders.enabled).toBe(true);
    expect(status.securityHeaders.poweredByDisabled).toBe(true);
    expect(status.securityHeaders.provider).toBe("helmet");
    expect(status.rateLimit.enabled).toBe(true);
    expect(status.rateLimit.provider).toBe("express-rate-limit");
    expect(status.rateLimit.windowMs).toBe(SECURITY_RATE_LIMIT_WINDOW_MS);
    expect(status.rateLimit.maxRequests).toBe(SECURITY_RATE_LIMIT_MAX_REQUESTS);
    expect(status.rateLimit.legacyHeaders).toBe(false);
    expect(status.reviewerNotes.some((note) => note.includes("not a complete production security program"))).toBe(true);
  });

  test("builds the Helmet security headers middleware", () => {
    const middleware = buildSecurityHeadersMiddleware();

    expect(typeof middleware).toBe("function");
  });

  test("builds the demo rate limit middleware", () => {
    const middleware = buildDemoRateLimitMiddleware();

    expect(typeof middleware).toBe("function");
  });

  test("returns security status through the Express handler", () => {
    const responsePayloads: unknown[] = [];

    const mockResponse = {
      json(payload: unknown) {
        responsePayloads.push(payload);
        return this;
      }
    };

    securityStatusHandler({} as never, mockResponse as never);

    expect(responsePayloads).toHaveLength(1);
    expect(responsePayloads[0]).toMatchObject({
      status: "success",
      result: {
        status: "ready",
        securityHeaders: {
          enabled: true,
          provider: "helmet"
        },
        rateLimit: {
          enabled: true,
          provider: "express-rate-limit",
          windowMs: SECURITY_RATE_LIMIT_WINDOW_MS,
          maxRequests: SECURITY_RATE_LIMIT_MAX_REQUESTS
        }
      }
    });
  });
});
