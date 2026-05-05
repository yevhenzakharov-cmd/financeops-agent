import type { Project } from "../domain/schemas.js";
import { expenses, contractorCosts } from "../domain/mock-data.js";

export type BurnRiskLevel = "normal" | "warning" | "critical";
export type BurnRiskType = "overburn" | "underburn" | "none";

export interface BudgetBurnResult {
  projectId: string;
  stage: string;
  burnPercent: number;
  expectedBurnPercent: number;
  varianceFromExpected: number;
  riskLevel: BurnRiskLevel;
  riskType: BurnRiskType;
}

function expectedBurnByStage(stage: string): number {
  switch (stage) {
    case "preproduction":
      return 10;
    case "production":
      return 50;
    case "alpha":
      return 70;
    case "beta":
      return 85;
    case "release":
      return 95;
    case "post-release":
      return 100;
    default:
      return 0;
  }
}

export function evaluateBudgetBurn(project: Project): BudgetBurnResult {
  const projectExpenses = expenses.filter(
    (exp) => exp.projectId === project.id
  );

  const projectContractorCosts = contractorCosts.filter(
    (cc) => cc.projectId === project.id
  );

  const totalCosts =
    projectExpenses.reduce((sum, exp) => sum + exp.amount.amount, 0) +
    projectContractorCosts.reduce((sum, cc) => sum + cc.amount.amount, 0);

  const budget = project.budget.totalBudget.amount;

  const burnPercent =
    budget === 0 ? 0 : Number(((totalCosts / budget) * 100).toFixed(2));

  const expectedBurnPercent = expectedBurnByStage(project.stage);

  const varianceFromExpected = Number(
    (burnPercent - expectedBurnPercent).toFixed(2)
  );

  let riskLevel: BurnRiskLevel = "normal";
  let riskType: BurnRiskType = "none";

  // Overburn detection
  if (burnPercent > expectedBurnPercent + 15) {
    riskLevel = "critical";
    riskType = "overburn";
  } else if (burnPercent > expectedBurnPercent) {
    riskLevel = "warning";
    riskType = "overburn";
  }

  // Underburn detection (stage-progress mismatch)
  if (burnPercent < expectedBurnPercent - 25) {
    riskLevel = "warning";
    riskType = "underburn";
  }

  return {
    projectId: project.id,
    stage: project.stage,
    burnPercent,
    expectedBurnPercent,
    varianceFromExpected,
    riskLevel,
    riskType
  };
}
