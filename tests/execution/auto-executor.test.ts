import { afterEach, describe, expect, test } from "vitest";

import {
  evaluateExecution,
  type RankedAction
} from "../../src/execution/auto-executor.js";

const originalEnv = {
  MAX_ALLOWED_RISK_INCREASE: process.env.MAX_ALLOWED_RISK_INCREASE,
  MIN_REQUIRED_CASH_DELTA: process.env.MIN_REQUIRED_CASH_DELTA,
  MIN_REQUIRED_MARGIN_DELTA: process.env.MIN_REQUIRED_MARGIN_DELTA,
  ALLOW_NEGATIVE_MARGIN_ACTIONS: process.env.ALLOW_NEGATIVE_MARGIN_ACTIONS
};

afterEach(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

function buildAction(overrides: Partial<RankedAction> = {}): RankedAction {
  return {
    exceptionId: "fx-test",
    actionType: "test_action",
    projectedCashDelta: 100,
    projectedMarginDelta: 100,
    projectedRiskDelta: 0,
    explanation: "Test action.",
    ...overrides
  };
}

describe("evaluateExecution", () => {
  test("simulates every action when simulation mode is enabled", () => {
    const decisions = evaluateExecution([buildAction()], "simulation");

    expect(decisions).toEqual([
      {
        exceptionId: "fx-test",
        actionType: "test_action",
        decision: "simulated",
        reason: "Simulation mode enabled"
      }
    ]);
  });

  test("denies actions that exceed configured risk appetite", () => {
    process.env.MAX_ALLOWED_RISK_INCREASE = "2";

    const decisions = evaluateExecution(
      [buildAction({ projectedRiskDelta: 3 })],
      "auto_execute_safe"
    );

    expect(decisions[0]).toMatchObject({
      decision: "denied",
      reason: "Risk increase exceeds configured appetite"
    });
  });

  test("requires approval when cash impact is below configured minimum", () => {
    process.env.MIN_REQUIRED_CASH_DELTA = "50";

    const decisions = evaluateExecution(
      [buildAction({ projectedCashDelta: 10 })],
      "auto_execute_safe"
    );

    expect(decisions[0]).toMatchObject({
      decision: "requires_approval",
      reason: "Cash impact below configured minimum"
    });
  });

  test("denies negative margin actions when policy does not allow them", () => {
    process.env.MIN_REQUIRED_MARGIN_DELTA = "0";
    process.env.ALLOW_NEGATIVE_MARGIN_ACTIONS = "false";

    const decisions = evaluateExecution(
      [buildAction({ projectedMarginDelta: -1 })],
      "auto_execute_safe"
    );

    expect(decisions[0]).toMatchObject({
      decision: "denied",
      reason: "Negative margin impact not allowed by policy"
    });
  });

  test("requires approval when approval mode is enabled", () => {
    const decisions = evaluateExecution([buildAction()], "approval_required");

    expect(decisions[0]).toMatchObject({
      decision: "requires_approval",
      reason: "Approval mode enabled"
    });
  });

  test("executes safe actions when execution mode allows it", () => {
    const decisions = evaluateExecution([buildAction()], "auto_execute_safe");

    expect(decisions[0]).toMatchObject({
      decision: "executed",
      reason: "Meets configured risk appetite and execution mode"
    });
  });

  test("approval-gates payment-like actions even when safe auto-execution mode is enabled", () => {
    const decisions = evaluateExecution(
      [buildAction({ actionType: "freeze_vendor_payments" })],
      "auto_execute_safe"
    );

    expect(decisions[0]).toMatchObject({
      decision: "requires_approval",
      reason: "Sensitive finance action requires human approval"
    });
  });

  test("approval-gates accounting write actions even when safe auto-execution mode is enabled", () => {
    const decisions = evaluateExecution(
      [buildAction({ actionType: "post_journal_entry" })],
      "auto_execute_safe"
    );

    expect(decisions[0]).toMatchObject({
      decision: "requires_approval",
      reason: "Sensitive finance action requires human approval"
    });
  });

  test("allows negative margin actions when explicitly configured", () => {
    process.env.MIN_REQUIRED_MARGIN_DELTA = "0";
    process.env.ALLOW_NEGATIVE_MARGIN_ACTIONS = "true";

    const decisions = evaluateExecution(
      [buildAction({ projectedMarginDelta: -1 })],
      "auto_execute_safe"
    );

    expect(decisions[0]?.decision).toBe("executed");
  });
});
