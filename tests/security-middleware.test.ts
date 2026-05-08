import { describe, expect, test } from "vitest";
import {
  SECURITY_RATE_LIMIT_MAX_REQUESTS,
  SECURITY_RATE_LIMIT_WINDOW_MS,
  buildSecurityStatus
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
});
