import { describe, expect, test } from "vitest";

import { buildClientSampleInputFixtures } from "../../src/client-config/client-sample-input-fixtures.js";
import { buildClientSecurityBoundary } from "../../src/client-config/client-security-boundary.js";
import { buildClientValidationMatrix } from "../../src/client-config/client-validation-matrix.js";

describe("client package builders", () => {
  test("builds sample input fixtures with ready, mapping, and blocked examples", () => {
    const result = buildClientSampleInputFixtures();

    expect(result.title).toBe("Client Sample Input Fixtures");
    expect(result.fixtures.length).toBeGreaterThanOrEqual(4);
    expect(result.readyFixtureCount).toBe(
      result.fixtures.filter((fixture) => fixture.status === "ready").length
    );
    expect(result.blockedFixtureCount).toBe(
      result.fixtures.filter((fixture) => fixture.status === "blocked").length
    );
    expect(result.mappingRequiredCount).toBe(
      result.fixtures.filter((fixture) => fixture.status === "needs_mapping").length
    );
    expect(result.fixtures.some((fixture) => fixture.sourceType === "csv")).toBe(true);
  });

  test("sample fixtures describe client-owned input plug-in needs", () => {
    const result = buildClientSampleInputFixtures();

    const bankFixture = result.fixtures.find((fixture) => fixture.id === "fixture-bank-export");
    const paymentFixture = result.fixtures.find((fixture) => fixture.id === "fixture-vendor-payment-profile");

    expect(bankFixture?.status).toBe("needs_mapping");
    expect(bankFixture?.mappingQuestions.length).toBeGreaterThan(0);
    expect(paymentFixture?.status).toBe("blocked");
    expect(paymentFixture?.blockedUntil.length).toBeGreaterThan(0);
  });

  test("builds security boundary with blocked production status", () => {
    const result = buildClientSecurityBoundary();

    expect(result.title).toBe("Client Security Boundary Package");
    expect(result.status).toBe("blocked_for_production");
    expect(result.boundaries.length).toBeGreaterThanOrEqual(6);
    expect(result.readyCount).toBe(
      result.boundaries.filter((boundary) => boundary.status === "ready").length
    );
    expect(result.blockedCount).toBe(
      result.boundaries.filter((boundary) => boundary.status === "blocked").length
    );
    expect(result.clientActionRequiredCount).toBe(
      result.boundaries.filter((boundary) => boundary.status === "client_action_required").length
    );
  });

  test("security boundary blocks money movement without client-owned payment data", () => {
    const result = buildClientSecurityBoundary();

    const paymentBoundary = result.boundaries.find((boundary) => boundary.id === "boundary-payment-approval");

    expect(paymentBoundary?.status).toBe("blocked");
    expect(paymentBoundary?.category).toBe("payments");
    expect(paymentBoundary?.title).toContain("Money movement requires human approval");
    expect(paymentBoundary?.evidence.some((item) => item.includes("human approval"))).toBe(true);
    expect(result.productionRules.some((rule) => rule.includes("Block money movement"))).toBe(true);
  });

  test("builds validation matrix with pass warning and blocked cases", () => {
    const result = buildClientValidationMatrix();

    expect(result.title).toBe("Client Validation Matrix");
    expect(result.status).toBe("blocked_for_production");
    expect(result.cases.length).toBeGreaterThanOrEqual(7);
    expect(result.passCount).toBe(
      result.cases.filter((item) => item.status === "pass").length
    );
    expect(result.warningCount).toBe(
      result.cases.filter((item) => item.status === "warning").length
    );
    expect(result.blockedCount).toBe(
      result.cases.filter((item) => item.status === "blocked").length
    );
  });

  test("validation matrix explains production blocking decision", () => {
    const result = buildClientValidationMatrix();

    expect(result.blockedCount).toBeGreaterThan(0);
    expect(result.productionDecision).toContain("Do not move to production");
    expect(result.nextValidationSteps.length).toBeGreaterThan(0);
    expect(result.cases.some((item) => item.category === "payments" && item.status === "blocked")).toBe(true);
  });
});
