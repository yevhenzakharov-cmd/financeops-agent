import type { ExecutionMode } from "./execution-mode.js";
import { getRiskAppetite } from "../config/risk-appetite.js";

const APPROVAL_REQUIRED_ACTION_KEYWORDS = [
  "payment",
  "pay",
  "vendor",
  "transfer",
  "bank",
  "journal",
  "ledger_post",
  "accounting",
  "payroll",
  "tax",
  "legal"
] as const;

function isApprovalRequiredFinanceAction(actionType: string): boolean {
  const normalizedActionType = actionType.toLowerCase();

  return APPROVAL_REQUIRED_ACTION_KEYWORDS.some((keyword) =>
    normalizedActionType.includes(keyword)
  );
}

export interface RankedAction {
  exceptionId: string;
  actionType: string;
  projectedCashDelta: number;
  projectedMarginDelta: number;
  projectedRiskDelta: number;
  explanation: string;
}

export interface ExecutionDecision {
  exceptionId: string;
  actionType: string;
  decision: "executed" | "requires_approval" | "denied" | "simulated";
  reason: string;
}

export function evaluateExecution(
  actions: RankedAction[],
  mode: ExecutionMode
): ExecutionDecision[] {
  const config = getRiskAppetite();

  return actions.map((action) => {
    if (mode === "simulation") {
      return {
        exceptionId: action.exceptionId,
        actionType: action.actionType,
        decision: "simulated",
        reason: "Simulation mode enabled"
      };
    }

    if (action.projectedRiskDelta > config.maxAllowedRiskIncrease) {
      return {
        exceptionId: action.exceptionId,
        actionType: action.actionType,
        decision: "denied",
        reason: "Risk increase exceeds configured appetite"
      };
    }

    if (action.projectedCashDelta < config.minRequiredCashDelta) {
      return {
        exceptionId: action.exceptionId,
        actionType: action.actionType,
        decision: "requires_approval",
        reason: "Cash impact below configured minimum"
      };
    }

    if (
      !config.allowNegativeMarginActions &&
      action.projectedMarginDelta < config.minRequiredMarginDelta
    ) {
      return {
        exceptionId: action.exceptionId,
        actionType: action.actionType,
        decision: "denied",
        reason: "Negative margin impact not allowed by policy"
      };
    }

    if (mode === "approval_required") {
      return {
        exceptionId: action.exceptionId,
        actionType: action.actionType,
        decision: "requires_approval",
        reason: "Approval mode enabled"
      };
    }

    if (isApprovalRequiredFinanceAction(action.actionType)) {
      return {
        exceptionId: action.exceptionId,
        actionType: action.actionType,
        decision: "requires_approval",
        reason: "Sensitive finance action requires human approval"
      };
    }

    return {
      exceptionId: action.exceptionId,
      actionType: action.actionType,
      decision: "executed",
      reason: "Meets configured risk appetite and execution mode"
    };
  });
}
