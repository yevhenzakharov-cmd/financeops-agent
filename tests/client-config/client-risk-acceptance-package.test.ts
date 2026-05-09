import { describe, expect, test } from "vitest";
import {
  buildClientRiskAcceptancePackage,
  summarizeClientRiskAcceptancePackage,
  validateClientRiskAcceptancePackage
} from "../../src/client-config/client-risk-acceptance-package.js";

describe("client risk acceptance package", () => {
  test("builds a risk acceptance package", () => {
    const riskPackage = buildClientRiskAcceptancePackage();

    expect(riskPackage.packageVersion).toBe("client-risk-acceptance-package-v1");
    expect(riskPackage.status).toBe("production_blocked");
    expect(riskPackage.items.length).toBeGreaterThanOrEqual(10);
  });

  test("covers required risk acceptance categories", () => {
    const riskPackage = buildClientRiskAcceptancePackage();
    const categories = riskPackage.items.map((item) => item.category);

    expect(categories).toContain("data");
    expect(categories).toContain("security");
    expect(categories).toContain("payments");
    expect(categories).toContain("accounting");
    expect(categories).toContain("ai_governance");
    expect(categories).toContain("auditability");
    expect(categories).toContain("deployment");
    expect(categories).toContain("compliance");
    expect(categories).toContain("procurement");
    expect(categories).toContain("operations");
  });

  test("keeps payment, accounting, and deployment risks blocked for production", () => {
    const riskPackage = buildClientRiskAcceptancePackage();

    expect(riskPackage.items.find((item) => item.id === "risk-payment-boundary")?.decision).toBe(
      "blocked_for_production"
    );
    expect(riskPackage.items.find((item) => item.id === "risk-accounting-writeback")?.decision).toBe(
      "blocked_for_production"
    );
    expect(riskPackage.items.find((item) => item.id === "risk-deployment")?.decision).toBe(
      "blocked_for_production"
    );
  });

  test("summarizes risk acceptance readiness", () => {
    const summary = summarizeClientRiskAcceptancePackage();

    expect(summary.packageVersion).toBe("client-risk-acceptance-package-v1");
    expect(summary.itemCount).toBeGreaterThanOrEqual(10);
    expect(summary.acceptedForDemoCount).toBeGreaterThanOrEqual(1);
    expect(summary.blockedForProductionCount).toBeGreaterThanOrEqual(3);
    expect(summary.residualRiskCount).toBeGreaterThanOrEqual(4);
  });

  test("validates the default risk acceptance package", () => {
    const validation = validateClientRiskAcceptancePackage();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
