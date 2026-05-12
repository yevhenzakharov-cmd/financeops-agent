import { CFOBriefingSchema } from "./briefing-schema.js";
import type { CFOBriefing } from "./briefing-schema.js";

import { detectOverdueInvoices, evaluateBudgetBurn } from "../tools/index.js";
import { projects } from "../domain/mock-data.js";

export function buildDeterministicCFOBriefing(
  deterministicSummary: string
): CFOBriefing {
  const marginRisks = projects.map((project) => {
    const burn = evaluateBudgetBurn(project);

    return {
      projectId: project.id,
      riskLevel:
        burn.riskLevel === "critical"
          ? "high"
          : burn.riskLevel === "warning"
            ? "medium"
            : "low",
      explanation:
        burn.riskLevel === "normal"
          ? `${project.name} is within expected budget burn for its current stage.`
          : `${project.name} requires finance review because budget burn variance is ${burn.varianceFromExpected} percentage points from the expected ${burn.expectedBurnPercent}% benchmark.`
    };
  });

  const overdueReceivables = detectOverdueInvoices(new Date()).map((invoice) => ({
    invoiceId: invoice.invoiceId,
    daysOverdue: invoice.daysOverdue,
    riskLevel:
      invoice.daysOverdue > 30
        ? "high"
        : invoice.daysOverdue > 0
          ? "medium"
          : "low"
  }));

  return CFOBriefingSchema.parse({
    executiveSummary:
      "FinanceOps Agent completed a deterministic review of the mock finance dataset. The demo identifies project margin and burn signals, overdue receivables, reconciliation exceptions, and approval-gated recommendations from deterministic pipeline outputs. AI explanation is optional; the financial facts come from deterministic logic.",
    projectMarginRisks: marginRisks,
    overdueReceivables,
    confidenceScore: deterministicSummary.length > 0 ? 0.9 : 0.75
  });
}

export async function generateCFOBriefing(
  deterministicSummary: string
): Promise<CFOBriefing> {
  return buildDeterministicCFOBriefing(deterministicSummary);
}
