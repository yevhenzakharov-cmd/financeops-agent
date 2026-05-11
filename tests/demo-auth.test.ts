import { afterEach, describe, expect, test, vi } from "vitest";
import type { NextFunction, Request, Response } from "express";

import {
  DEMO_API_KEY_HEADER,
  LOCAL_DEMO_API_KEY,
  buildDemoAuthStatus,
  getConfiguredDemoApiKey,
  requireDemoApiKey
} from "../src/api/demo-auth.js";

const originalDemoApiKey = process.env.DEMO_API_KEY;
const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  if (originalDemoApiKey === undefined) {
    delete process.env.DEMO_API_KEY;
  } else {
    process.env.DEMO_API_KEY = originalDemoApiKey;
  }

  if (originalNodeEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = originalNodeEnv;
  }
});

describe("demo API key auth boundary", () => {
  test("uses local fallback key outside production when no key is configured", () => {
    delete process.env.DEMO_API_KEY;
    process.env.NODE_ENV = "test";

    expect(getConfiguredDemoApiKey()).toBe(LOCAL_DEMO_API_KEY);
  });

  test("uses configured DEMO_API_KEY when present", () => {
    process.env.DEMO_API_KEY = "configured-test-key";
    process.env.NODE_ENV = "test";

    expect(getConfiguredDemoApiKey()).toBe("configured-test-key");
  });

  test("does not allow local fallback in production", () => {
    delete process.env.DEMO_API_KEY;
    process.env.NODE_ENV = "production";

    expect(getConfiguredDemoApiKey()).toBeNull();
  });

  test("documents protected action-like routes", () => {
    delete process.env.DEMO_API_KEY;
    process.env.NODE_ENV = "test";

    const status = buildDemoAuthStatus();

    expect(status.enabled).toBe(true);
    expect(status.headerName).toBe(DEMO_API_KEY_HEADER);
    expect(status.localFallbackAllowed).toBe(true);
    expect(status.protectedRoutes).toContain("POST /run-financeops-agent");
    expect(status.protectedRoutes).toContain("POST /payments/:paymentRecommendationId/approve-and-send");
  });
});

function buildMockRequest(headerValue?: string): Request {
  return {
    method: "POST",
    path: "/run-financeops-agent",
    header: vi.fn((name: string) =>
      name === DEMO_API_KEY_HEADER ? headerValue : undefined
    )
  } as unknown as Request;
}

function buildMockResponse(): Response {
  const response = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  };

  return response as unknown as Response;
}

describe("requireDemoApiKey middleware", () => {
  test("returns 500 when production auth is not configured", () => {
    delete process.env.DEMO_API_KEY;
    process.env.NODE_ENV = "production";

    const req = buildMockRequest();
    const res = buildMockResponse();
    const next: NextFunction = vi.fn();

    requireDemoApiKey(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        error: expect.objectContaining({
          code: "demo_auth_not_configured"
        })
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 401 when the demo API key header is missing", () => {
    delete process.env.DEMO_API_KEY;
    process.env.NODE_ENV = "test";

    const req = buildMockRequest();
    const res = buildMockResponse();
    const next: NextFunction = vi.fn();

    requireDemoApiKey(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        error: expect.objectContaining({
          code: "missing_demo_api_key"
        })
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 403 when the demo API key is invalid", () => {
    process.env.DEMO_API_KEY = "expected-key";
    process.env.NODE_ENV = "test";

    const req = buildMockRequest("wrong-key");
    const res = buildMockResponse();
    const next: NextFunction = vi.fn();

    requireDemoApiKey(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        error: expect.objectContaining({
          code: "invalid_demo_api_key"
        })
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("calls next when the demo API key is valid", () => {
    process.env.DEMO_API_KEY = "expected-key";
    process.env.NODE_ENV = "test";

    const req = buildMockRequest("expected-key");
    const res = buildMockResponse();
    const next: NextFunction = vi.fn();

    requireDemoApiKey(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});
