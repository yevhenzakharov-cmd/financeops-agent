import { describe, expect, test } from "vitest";
import {
  buildClientAcceptanceGate,
  summarizeClientAcceptanceGate,
  validateClientAcceptanceGate
} from "../../src/client-config/client-acceptance-gate.js";

describe("client acceptance gate", () => {
  test("builds a client acceptance gate from existing planning layers", () => {
    const gate = buildClientAcceptanceGate();

    expect(gate.gateVersion).toBe("client-acceptance-gate-v1");
    expect(gate.acceptanceItems.length).toBeGreaterThanOrEqual(6);
    expect(gate.demoAcceptanceSummary).toContain("Client work order exists.");
    expect(gate.demoAcceptanceSummary).toContain("Deployment profile exists.");
  });

  test("keeps production deployment blocked until client-owned controls exist", () => {
    const gate = buildClientAcceptanceGate();

    const productionGate = gate.acceptanceItems.find(
      (item) => item.id === "gate-production-deployment"
    );

    expect(productionGate).toBeDefined();
    expect(productionGate?.decision).toBe("blocked");
    expect(productionGate?.requiredBeforeProduction).toContain(
      "Client-owned auth is configured."
    );
  });

  test("keeps sensitive actions blocked until approval policy exists", () => {
    const gate = buildClientAcceptanceGate();

    const sensitiveActionGate = gate.acceptanceItems.find(
      (item) => item.id === "gate-sensitive-actions"
    );

    expect(sensitiveActionGate).toBeDefined();
    expect(sensitiveActionGate?.decision).toBe("blocked");
    expect(sensitiveActionGate?.requiredBeforeProduction).toContain(
      "Approval policy is encoded."
    );
  });

  test("summarizes acceptance gate state for reviewers", () => {
    const summary = summarizeClientAcceptanceGate();

    expect(summary.gateVersion).toBe("client-acceptance-gate-v1");
    expect(summary.itemCount).toBeGreaterThanOrEqual(6);
    expect(summary.blockedCount).toBeGreaterThanOrEqual(2);
    expect(summary.productionBlockerCount).toBeGreaterThanOrEqual(1);
  });

  test("validates the default acceptance gate", () => {
    const validation = validateClientAcceptanceGate();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
