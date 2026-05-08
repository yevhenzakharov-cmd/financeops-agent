import { describe, expect, test } from "vitest";

import { buildApprovalQueue } from "../../src/approval/approval-workflow.js";
import type { ExecutionDecision } from "../../src/execution/auto-executor.js";

describe("approval workflow", () => {
  const decisions: ExecutionDecision[] = [
    {
      exceptionId: "fx-001",
      actionType: "escalate_collection",
      decision: "simulated",
      reason: "Simulation mode enabled",
      selectedAction: {
        actionType: "escalate_collection",
        projectedCashDelta: 1000,
        projectedMarginDelta: 0,
        projectedRiskDelta: -1,
        explanation: "Escalate collection."
      }
    },
    {
      exceptionId: "fx-002",
      actionType: "execute_payment",
      decision: "requires_approval",
      reason: "Payment requires CFO approval",
      selectedAction: {
        actionType: "execute_payment",
        projectedCashDelta: -500,
        projectedMarginDelta: 0,
        projectedRiskDelta: 2,
        explanation: "Prepare approved payment."
      }
    },
    {
      exceptionId: "fx-003",
      actionType: "blocked_payment",
      decision: "denied",
      reason: "Risk policy denied execution",
      selectedAction: {
        actionType: "blocked_payment",
        projectedCashDelta: -5000,
        projectedMarginDelta: 0,
        projectedRiskDelta: 10,
        explanation: "Blocked by policy."
      }
    }
  ];

  test("creates one approval queue item per execution decision", () => {
    const queue = buildApprovalQueue(decisions);

    expect(queue.items).toHaveLength(3);
    expect(queue.generatedAt).toMatch(/T/);
  });

  test("marks simulated decisions as not required", () => {
    const queue = buildApprovalQueue(decisions);
    const item = queue.items.find((entry) => entry.exceptionId === "fx-001");

    expect(item?.status).toBe("not_required");
    expect(item?.requiredRole).toBe("controller");
  });

  test("marks approval-required decisions as pending for CFO", () => {
    const queue = buildApprovalQueue(decisions);
    const item = queue.items.find((entry) => entry.exceptionId === "fx-002");

    expect(item?.status).toBe("pending");
    expect(item?.requiredRole).toBe("cfo");
  });

  test("marks denied decisions as blocked for auditor review", () => {
    const queue = buildApprovalQueue(decisions);
    const item = queue.items.find((entry) => entry.exceptionId === "fx-003");

    expect(item?.status).toBe("blocked");
    expect(item?.requiredRole).toBe("auditor");
  });

  test("generates stable approval ids in order", () => {
    const queue = buildApprovalQueue(decisions);

    expect(queue.items.map((item) => item.id)).toEqual([
      "approval-001",
      "approval-002",
      "approval-003"
    ]);
  });
});
