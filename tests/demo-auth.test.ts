import { afterEach, describe, expect, test } from "vitest";

import {
  DEMO_API_KEY_HEADER,
  LOCAL_DEMO_API_KEY,
  buildDemoAuthStatus,
  getConfiguredDemoApiKey
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
