import {
  calculateProjectMargin,
  evaluateBudgetBurn,
  detectOverdueInvoices,
  runReconciliation
} from "./index.js";

import { projects } from "../domain/mock-data.js";
import type { FinanceException } from "../domain/schemas.js";

let exceptionCounter = 0;

function generateId(): string {
  exceptionCounter += 1;
  return `fx-${exceptionCounter.toString().padStart(3, "0")}`;
}

export function classifyFinanceExceptions(): FinanceException[] {
  const exceptions: FinanceException[] = [];

  // 1️⃣ Burn-based exceptions
  for (const project of projects) {
    const burn = evaluateBudgetBurn(project);

    if (burn.riskLevel !== "normal") {
      exceptions.push({
        id: generateId(),
        source: "burn",
        referenceId: project.id,
        category: burn.riskType,
        severity: burn.riskLevel === "critical" ? "high" : "medium",
        recommendedActionType: "warning",
        requiresHumanReview: true
      });
    }
  }

  // 2️⃣ Overdue invoice exceptions
  const overdue = detectOverdueInvoices(new Date("2025-05-01"));

  for (const inv of overdue) {
    exceptions.push({
      id: generateId(),
      source: "receivable",
      referenceId: inv.invoiceId,
      category: "overdue_invoice",
      severity: inv.daysOverdue > 30 ? "high" : "medium",
      recommendedActionType: "warning",
      requiresHumanReview: true
    });
  }

  // 3️⃣ Reconciliation exceptions
  const reconciliation = runReconciliation();

  for (const result of reconciliation) {
    if (result.status !== "matched") {
      exceptions.push({
        id: generateId(),
        source: "reconciliation",
        referenceId: result.invoiceId,
        category: result.status,
        severity:
          result.status === "orphan_bank" ||
          result.status === "amount_mismatch"
            ? "high"
            : "medium",
        recommendedActionType:
          result.status === "orphan_bank"
            ? "blocked"
            : "warning",
        requiresHumanReview: true
      });
    }
  }

  return exceptions;
}
