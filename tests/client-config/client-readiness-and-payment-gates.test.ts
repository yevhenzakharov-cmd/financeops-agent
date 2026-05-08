import { describe, expect, test } from "vitest";
import { buildClientImplementationReadiness } from "../../src/client-config/client-implementation-readiness.js";
import { buildClientOutputDeliveryPlan } from "../../src/client-config/client-output-delivery-plan.js";
import { buildClientTestScenarioPack } from "../../src/client-config/client-test-scenarios.js";
import { buildClientValidationMatrix } from "../../src/client-config/client-validation-matrix.js";
import { evaluateClientFieldCoverage } from "../../src/client-config/client-field-coverage.js";
import { mockGameStudioReadinessFixture } from "../../src/client-config/client-readiness-fixture.js";

describe("client readiness and payment gates", () => {
  test("blocks implementation readiness when required payment data is missing", () => {
    const readiness = buildClientImplementationReadiness(mockGameStudioReadinessFixture);

    expect(readiness.readinessStatus).toBe("blocked");
    expect(readiness.readinessScore).toBe(67);
    expect(readiness.blockerSummary).toContain("Missing required field: Vendor payment method");
    expect(readiness.dataRequestPacket.status).toBe("blocked_waiting_for_client_data");
    expect(readiness.dataRequestPacket.requiredFromClient).toContain("Vendor payment method");
  });

  test("calculates readiness coverage from provided, missing, mapping, and optional fields", () => {
    const coverage = evaluateClientFieldCoverage(mockGameStudioReadinessFixture.fieldRequirements);

    expect(coverage.totalFields).toBe(7);
    expect(coverage.requiredFields).toBe(6);
    expect(coverage.providedRequiredFields).toBe(4);
    expect(coverage.coverageScore).toBe(67);
    expect(coverage.readinessLevel).toBe("blocked");
    expect(coverage.missingRequiredFields).toEqual(["Vendor payment method"]);
    expect(coverage.needsMappingFields).toEqual(["Bank transaction ID"]);
  });

  test("keeps payment approval output blocked until client payment profile data exists", () => {
    const outputPlan = buildClientOutputDeliveryPlan();

    const paymentOutput = outputPlan.targets.find(
      (target) => target.id === "output-payment-approval"
    );

    expect(paymentOutput).toBeDefined();
    expect(paymentOutput?.status).toBe("blocked");
    expect(paymentOutput?.deliveryNotes).toContain(
      "Prepare payment recommendation only after required vendor data is provided."
    );
    expect(paymentOutput?.deliveryNotes).toContain("Never send payment without approval.");
  });

  test("keeps payment approval scenario blocked and documents required safety inputs", () => {
    const scenarioPack = buildClientTestScenarioPack();

    const paymentScenario = scenarioPack.scenarios.find(
      (scenario) => scenario.id === "scenario-payment-approval"
    );

    expect(paymentScenario).toBeDefined();
    expect(paymentScenario?.status).toBe("blocked");
    expect(paymentScenario?.inputRequirements).toEqual([
      "Vendor payment method",
      "Authorized approver",
      "Idempotency key"
    ]);
    expect(scenarioPack.blockedScenarios).toContain("Payment approval recommendation");
  });

  test("marks unsafe payment preparation as a blocked validation case", () => {
    const matrix = buildClientValidationMatrix();

    const paymentCase = matrix.cases.find(
      (validationCase) => validationCase.id === "validation-payment-block"
    );

    expect(paymentCase).toBeDefined();
    expect(paymentCase?.status).toBe("blocked");
    expect(paymentCase?.expectedResult).toContain(
      "Payment workflow stays excluded from production and go-live scope."
    );
    expect(matrix.blockedCount).toBeGreaterThanOrEqual(1);
    expect(matrix.productionDecision).toContain("blocked");
  });
});
