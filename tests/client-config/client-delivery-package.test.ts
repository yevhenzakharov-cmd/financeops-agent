import { describe, expect, test } from "vitest";
import {
  buildClientDeliveryPackage,
  summarizeClientDeliveryPackage,
  validateClientDeliveryPackage
} from "../../src/client-config/client-delivery-package.js";

describe("client delivery package", () => {
  test("builds a reviewer-facing delivery package", () => {
    const deliveryPackage = buildClientDeliveryPackage();

    expect(deliveryPackage.packageVersion).toBe("client-delivery-package-v1");
    expect(deliveryPackage.artifacts.length).toBeGreaterThanOrEqual(6);
    expect(deliveryPackage.suggestedDemoNarrative.length).toBeGreaterThanOrEqual(5);
  });

  test("includes required client planning endpoints", () => {
    const deliveryPackage = buildClientDeliveryPackage();
    const endpoints = deliveryPackage.artifacts.map((artifact) => artifact.sourceEndpoint);

    expect(endpoints).toContain("/client/work-order");
    expect(endpoints).toContain("/client/implementation-manifest");
    expect(endpoints).toContain("/client/adapter-registry");
    expect(endpoints).toContain("/client/implementation-roadmap");
    expect(endpoints).toContain("/client/deployment-profile");
    expect(endpoints).toContain("/client/acceptance-gate");
  });

  test("blocks unsupported production claims", () => {
    const deliveryPackage = buildClientDeliveryPackage();

    expect(deliveryPackage.blockedProductionClaims.join(" ")).toContain(
      "Do not claim production readiness"
    );
    expect(deliveryPackage.blockedProductionClaims.join(" ")).toContain("human approval");
  });

  test("summarizes delivery package counts", () => {
    const summary = summarizeClientDeliveryPackage();

    expect(summary.packageVersion).toBe("client-delivery-package-v1");
    expect(summary.artifactCount).toBeGreaterThanOrEqual(6);
    expect(summary.blockedUntilClientOwnedCount).toBeGreaterThanOrEqual(1);
  });

  test("validates the default delivery package", () => {
    const validation = validateClientDeliveryPackage();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
