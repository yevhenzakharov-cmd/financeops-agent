import { describe, expect, test } from "vitest";
import {
  buildClientProductionReadinessPackage,
  summarizeClientProductionReadinessPackage,
  validateClientProductionReadinessPackage
} from "../../src/client-config/client-production-readiness-package.js";

describe("client production readiness package", () => {
  test("builds a production readiness package", () => {
    const readinessPackage = buildClientProductionReadinessPackage();

    expect(readinessPackage.packageVersion).toBe("client-production-readiness-package-v1");
    expect(readinessPackage.status).toBe("production_blocked");
    expect(readinessPackage.gates.length).toBeGreaterThanOrEqual(12);
  });

  test("covers required production readiness categories", () => {
    const readinessPackage = buildClientProductionReadinessPackage();
    const categories = readinessPackage.gates.map((gate) => gate.category);

    expect(categories).toContain("data");
    expect(categories).toContain("authentication");
    expect(categories).toContain("authorization");
    expect(categories).toContain("secrets");
    expect(categories).toContain("finance_controls");
    expect(categories).toContain("payment_controls");
    expect(categories).toContain("accounting_controls");
    expect(categories).toContain("audit_logging");
    expect(categories).toContain("monitoring");
    expect(categories).toContain("deployment");
    expect(categories).toContain("incident_response");
    expect(categories).toContain("compliance");
  });

  test("keeps payment, accounting, deployment, and compliance blocked until client-owned controls exist", () => {
    const readinessPackage = buildClientProductionReadinessPackage();

    expect(readinessPackage.gates.find((gate) => gate.id === "production-payment-controls")?.status).toBe(
      "blocked_until_client_owned"
    );
    expect(readinessPackage.gates.find((gate) => gate.id === "production-accounting-controls")?.status).toBe(
      "blocked_until_client_owned"
    );
    expect(readinessPackage.gates.find((gate) => gate.id === "production-deployment")?.status).toBe(
      "blocked_until_client_owned"
    );
    expect(readinessPackage.gates.find((gate) => gate.id === "production-compliance")?.status).toBe(
      "blocked_until_client_owned"
    );
  });

  test("summarizes production readiness", () => {
    const summary = summarizeClientProductionReadinessPackage();

    expect(summary.packageVersion).toBe("client-production-readiness-package-v1");
    expect(summary.gateCount).toBeGreaterThanOrEqual(12);
    expect(summary.blockedUntilClientOwnedGateCount).toBeGreaterThanOrEqual(6);
    expect(summary.productionBlockerCount).toBeGreaterThanOrEqual(8);
    expect(summary.clientProductionInputCount).toBeGreaterThanOrEqual(8);
  });

  test("validates the default production readiness package", () => {
    const validation = validateClientProductionReadinessPackage();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
