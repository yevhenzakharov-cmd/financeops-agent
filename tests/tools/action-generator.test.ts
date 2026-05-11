import { describe, expect, it } from "vitest";

import { generateAgentActions } from "../../src/tools/action-generator.js";
import type { FinanceException } from "../../src/domain/schemas.js";

describe("generateAgentActions", () => {
  it("turns finance exceptions into reviewer-safe proposed actions", () => {
    const exceptions: FinanceException[] = [
      {
        id: "fx-test-001",
        source: "receivable",
        referenceId: "inv-test-001",
        category: "overdue_invoice",
        severity: "medium",
        recommendedActionType: "warning",
        requiresHumanReview: true
      },
      {
        id: "fx-test-002",
        source: "reconciliation",
        referenceId: "bank-test-001",
        category: "orphan_bank",
        severity: "high",
        recommendedActionType: "blocked",
        requiresHumanReview: true
      }
    ];

    const actions = generateAgentActions(exceptions);

    expect(actions).toHaveLength(2);
    expect(actions[0]).toMatchObject({
      exceptionId: "fx-test-001",
      actionType: "resolve_overdue_invoice",
      riskLevel: "warning",
      description: "Proposed action to address overdue_invoice from receivable."
    });
    expect(actions[1]).toMatchObject({
      exceptionId: "fx-test-002",
      actionType: "resolve_orphan_bank",
      riskLevel: "blocked",
      description: "Proposed action to address orphan_bank from reconciliation."
    });
    expect(actions[0]?.id).toMatch(/^act-\d{3}$/);
    expect(actions[1]?.id).toMatch(/^act-\d{3}$/);
    expect(actions[0]?.id).not.toBe(actions[1]?.id);
  });

  it("returns no actions when there are no exceptions", () => {
    expect(generateAgentActions([])).toEqual([]);
  });
});
