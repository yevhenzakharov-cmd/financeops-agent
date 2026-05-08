import { describe, expect, test } from "vitest";

import { evaluateBudgetBurn } from "../../src/tools/budget-burn.js";
import { calculateProjectMargin } from "../../src/tools/project-margin.js";
import { detectOverdueInvoices } from "../../src/tools/overdue-invoices.js";
import { runReconciliation } from "../../src/tools/reconciliation.js";
import { classifyFinanceExceptions } from "../../src/tools/exception-classifier.js";
import { projects } from "../../src/domain/mock-data.js";

describe("deterministic finance tools", () => {
  test("calculates project margin with deterministic totals", () => {
    const project = projects[0];
    expect(project).toBeDefined();

    const result = calculateProjectMargin(project!);

    expect(result.projectId).toBe(project!.id);
    expect(result.revenue).toBeGreaterThanOrEqual(0);
    expect(result.costs).toBeGreaterThanOrEqual(0);
    expect(result.grossMargin).toBe(result.revenue - result.costs);
    expect(Number.isFinite(result.marginPercent)).toBe(true);
    expect(Number.isFinite(result.budgetUtilizationPercent)).toBe(true);
  });

  test("handles zero revenue margin without dividing into Infinity", () => {
    const project = {
      ...projects[0]!,
      id: "project-without-revenue"
    };

    const result = calculateProjectMargin(project);

    expect(result.projectId).toBe("project-without-revenue");
    expect(result.revenue).toBe(0);
    expect(result.marginPercent).toBe(0);
    expect(Number.isFinite(result.marginPercent)).toBe(true);
  });

  test("evaluates budget burn with stable risk fields", () => {
    const project = projects[0];
    expect(project).toBeDefined();

    const result = evaluateBudgetBurn(project!);

    expect(result.projectId).toBe(project!.id);
    expect(result.stage).toBe(project!.stage);
    expect(result.burnPercent).toBeGreaterThanOrEqual(0);
    expect(result.expectedBurnPercent).toBeGreaterThanOrEqual(0);
    expect(["normal", "warning", "critical"]).toContain(result.riskLevel);
    expect(["overburn", "underburn", "none"]).toContain(result.riskType);
  });

  test("detects overdue invoices relative to a fixed date", () => {
    const result = detectOverdueInvoices(new Date("2025-05-01"));

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((invoice) => invoice.daysOverdue >= 0)).toBe(true);
    expect(result.every((invoice) => invoice.amount > 0)).toBe(true);
    expect(result.every((invoice) => invoice.invoiceId.length > 0)).toBe(true);
  });

  test("does not return negative days overdue for future reference date edge cases", () => {
    const result = detectOverdueInvoices(new Date("2020-01-01"));

    expect(result.every((invoice) => invoice.daysOverdue >= 0)).toBe(true);
  });

  test("runs reconciliation and returns known status categories", () => {
    const result = runReconciliation();

    expect(result.length).toBeGreaterThan(0);

    const statuses = new Set(result.map((item) => item.status));
    expect(statuses.size).toBeGreaterThan(0);

    for (const item of result) {
      expect([
        "matched",
        "missing_payment",
        "missing_bank",
        "amount_mismatch",
        "orphan_bank"
      ]).toContain(item.status);
    }
  });

  test("classifies finance exceptions with stable ids and review gates", () => {
    const result = classifyFinanceExceptions();

    expect(result.length).toBeGreaterThan(0);
    expect(result[0]?.id).toBe("fx-001");
    expect(result.every((item) => item.id.startsWith("fx-"))).toBe(true);
    expect(result.every((item) => item.requiresHumanReview)).toBe(true);
    expect(result.every((item) => ["low", "medium", "high"].includes(item.severity))).toBe(true);
  });

  test("resets exception ids on each classifier run", () => {
    const first = classifyFinanceExceptions();
    const second = classifyFinanceExceptions();

    expect(first[0]?.id).toBe("fx-001");
    expect(second[0]?.id).toBe("fx-001");
  });
});
