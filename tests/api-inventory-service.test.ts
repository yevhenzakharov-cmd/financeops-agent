import { describe, expect, test } from "vitest";

import {
  buildApiInventoryPackage,
  getApiInventoryRoutes
} from "../src/api/api-inventory-service.js";

describe("api inventory service", () => {
  test("lists stable route groups", () => {
    const routes = getApiInventoryRoutes();

    expect(routes.length).toBeGreaterThan(0);
    expect(routes.some((route) => route.path === "/health")).toBe(true);
    expect(routes.some((route) => route.path === "/run-financeops-agent")).toBe(true);
    expect(routes.some((route) => route.path === "/artifacts/*")).toBe(true);
    expect(routes.some((route) => route.path === "/client/*")).toBe(true);
  });

  test("marks action routes as demo-key protected", () => {
    const routes = getApiInventoryRoutes();

    const protectedRoutes = routes.filter((route) => route.accessLevel === "demo_api_key_required");

    expect(protectedRoutes).toHaveLength(2);
    expect(protectedRoutes.map((route) => route.path)).toContain("/run-financeops-agent");
    expect(protectedRoutes.map((route) => route.path)).toContain("/payments/:paymentRecommendationId/approve-and-send");
  });

  test("builds an inventory package with auth and error model", () => {
    const result = buildApiInventoryPackage();

    expect(result.title).toBe("API Inventory Package");
    expect(result.version).toBe("api-inventory-v1");
    expect(result.status).toBe("ready");
    expect(result.summary.totalRoutes).toBe(result.routes.length);
    expect(result.authBoundary.protectedHeader).toBe("x-demo-api-key");
    expect(result.errorModel.notFoundCode).toBe("route_not_found");
  });

  test("summarizes route groups consistently", () => {
    const result = buildApiInventoryPackage();

    const groupedTotal = Object.values(result.summary.groups).reduce((sum, count) => sum + count, 0);

    expect(groupedTotal).toBe(result.summary.totalRoutes);
    expect(result.summary.groups.protected_action).toBe(2);
    expect(result.summary.publicDemoRoutes).toBe(result.summary.totalRoutes - result.summary.protectedActionRoutes);
  });
});
