import { describe, expect, test } from "vitest";

import { evaluateBudgetBurn } from "../../src/tools/budget-burn.js";
import type { Project } from "../../src/domain/schemas.js";

function buildProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "project-budget-burn-test",
    name: "Budget Burn Test Project",
    clientId: "client-budget-burn-test",
    engine: "FinanceOpsCore",
    platform: ["Operations"],
    stage: "release",
    budget: {
      totalBudget: {
        amount: 100000,
        currency: "USD"
      },
      approvedAt: "2026-01-01"
    },
    startDate: "2026-01-01",
    ...overrides
  };
}

describe("budget burn evaluation", () => {
  test("returns zero burn and unknown-stage expectation when budget is zero", () => {
    const result = evaluateBudgetBurn(
      buildProject({
        id: "project-zero-budget",
        stage: "unknown-stage",
        budget: {
          totalBudget: {
            amount: 0,
            currency: "USD"
          },
          approvedAt: "2026-01-01"
        }
      })
    );

    expect(result).toEqual({
      projectId: "project-zero-budget",
      stage: "unknown-stage",
      burnPercent: 0,
      expectedBurnPercent: 0,
      varianceFromExpected: 0,
      riskLevel: "normal",
      riskType: "none"
    });
  });

  test.each([
    ["preproduction", 10],
    ["production", 50],
    ["alpha", 70],
    ["beta", 85],
    ["release", 95],
    ["post-release", 100]
  ])("maps %s stage to expected burn percent %i", (stage, expectedBurnPercent) => {
    const result = evaluateBudgetBurn(
      buildProject({
        id: `project-stage-${stage}`,
        stage
      })
    );

    expect(result.stage).toBe(stage);
    expect(result.expectedBurnPercent).toBe(expectedBurnPercent);
  });

  test("keeps release-stage burn normal when variance is not above expected", () => {
    const result = evaluateBudgetBurn(
      buildProject({
        id: "project-normal-release",
        stage: "release"
      })
    );

    expect(result.expectedBurnPercent).toBe(95);
    expect(result.burnPercent).toBe(0);
    expect(result.varianceFromExpected).toBe(-95);
    expect(result.riskLevel).toBe("warning");
    expect(result.riskType).toBe("underburn");
  });

  test("marks unknown stage with mock costs as critical overburn", () => {
    const result = evaluateBudgetBurn(
      buildProject({
        id: "project-001",
        stage: "unknown-stage"
      })
    );

    expect(result.expectedBurnPercent).toBe(0);
    expect(result.burnPercent).toBe(60);
    expect(result.varianceFromExpected).toBe(60);
    expect(result.riskLevel).toBe("critical");
    expect(result.riskType).toBe("overburn");
  });

  test("marks project with high mock costs as critical overburn when budget is small", () => {
    const result = evaluateBudgetBurn(
      buildProject({
        id: "project-001",
        stage: "preproduction",
        budget: {
          totalBudget: {
            amount: 30000,
            currency: "USD"
          },
          approvedAt: "2026-01-01"
        }
      })
    );

    expect(result.expectedBurnPercent).toBe(10);
    expect(result.burnPercent).toBe(200);
    expect(result.varianceFromExpected).toBe(190);
    expect(result.riskLevel).toBe("critical");
    expect(result.riskType).toBe("overburn");
  });
});
