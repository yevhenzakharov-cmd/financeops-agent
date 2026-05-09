import { describe, expect, test } from "vitest";

import { buildClientCommercialPackage } from "../../src/client-config/client-commercial-package.js";
import { buildClientCommercialReadinessScore } from "../../src/client-config/client-commercial-readiness-score.js";
import { buildClientCommercialSummary } from "../../src/client-config/client-commercial-summary.js";
import { buildClientCommercialValueHypothesis } from "../../src/client-config/client-commercial-value-hypothesis.js";
import { buildClientReviewerAudit } from "../../src/client-config/client-reviewer-audit.js";
import { buildClientReviewerDashboard } from "../../src/client-config/client-reviewer-dashboard.js";
import { buildClientRoiModel } from "../../src/client-config/client-roi-model.js";

function hasNonEmptyStringValue(value: unknown): boolean {
  if (typeof value === "string") {
    return value.length > 0;
  }

  if (Array.isArray(value)) {
    return value.some(hasNonEmptyStringValue);
  }

  if (value && typeof value === "object") {
    return Object.values(value).some(hasNonEmptyStringValue);
  }

  return false;
}

describe("commercial and reviewer packages", () => {
  test("builds commercial value hypothesis with buyer-facing drivers", () => {
    const result = buildClientCommercialValueHypothesis();

    expect(result.title).toContain("Commercial");
    expect(result.valueDrivers.length).toBeGreaterThan(0);
    expect(result.valueDrivers.every((driver) => driver.id.length > 0)).toBe(true);
    expect(result.valueDrivers.every((driver) => driver.title.length > 0)).toBe(true);
  });

  test("builds ROI model with scenarios and assumptions", () => {
    const result = buildClientRoiModel();

    expect(result.title).toContain("ROI");
    expect(result.assumptions.length).toBeGreaterThan(0);
    expect(result.scenarios.length).toBeGreaterThan(0);
    expect(result.scenarios.every((scenario) => hasNonEmptyStringValue(scenario))).toBe(true);
  });

  test("builds commercial readiness score with score and blockers", () => {
    const result = buildClientCommercialReadinessScore();

    expect(result.title).toContain("Commercial");
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(["ready", "warning", "blocked", "not_ready"]).toContain(result.status);
    expect(Array.isArray(result.blockers)).toBe(true);
  });

  test("builds commercial summary with buyer-facing content", () => {
    const result = buildClientCommercialSummary();

    expect(result.title).toContain("Commercial");
    expect(hasNonEmptyStringValue(result)).toBe(true);
    expect(Object.keys(result).length).toBeGreaterThan(0);
  });

  test("builds consolidated commercial package", () => {
    const result = buildClientCommercialPackage();

    expect(result.title).toContain("Commercial");
    expect(result.status).toBeDefined();
    expect(result.clientName).toBe("Mock Client Finance Team");
    expect(result.valueHypothesis).toBeDefined();
    expect(result.roiModel).toBeDefined();
    expect(result.readinessScore).toBeDefined();
    expect(result.buyerBrief).toBeDefined();
  });

  test("builds reviewer dashboard with pass warning and blocked cards", () => {
    const result = buildClientReviewerDashboard();

    expect(result.title).toBe("Client Reviewer Dashboard");
    expect(result.projectName).toBe("FinanceOps Agent");
    expect(result.cards.length).toBeGreaterThanOrEqual(5);
    expect(result.cards.some((card) => card.status === "pass")).toBe(true);
    expect(result.cards.some((card) => card.status === "warning")).toBe(true);
    expect(result.cards.some((card) => card.status === "blocked")).toBe(true);
  });

  test("reviewer dashboard provides demo order and endpoint evidence", () => {
    const result = buildClientReviewerDashboard();

    const demoSection = result.sections.find((section) => section.id === "demo-order");
    const allBullets = result.sections.flatMap((section) => section.bullets);

    expect(demoSection).toBeDefined();
    expect(demoSection?.bullets.length).toBeGreaterThan(0);
    expect(allBullets.some((bullet) => bullet.includes("/client/"))).toBe(true);
  });

  test("builds reviewer audit with repository-oriented evaluation", () => {
    const result = buildClientReviewerAudit();

    expect(result.title).toContain("Reviewer");
    expect(hasNonEmptyStringValue(result)).toBe(true);
    expect(Object.keys(result).length).toBeGreaterThan(0);
  });
});
