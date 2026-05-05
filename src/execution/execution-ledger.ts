import path from "path";
import { safeWriteJson } from "../security/safe-output-policy.js";
import type { ExecutionDecision, RankedAction } from "./auto-executor.js";

export interface ExecutionLedgerEntry {
  id: string;
  timestamp: string;
  exceptionId: string;
  actionType: string;
  decision: ExecutionDecision["decision"];
  reason: string;
  projectedCashDelta: number;
  projectedMarginDelta: number;
  projectedRiskDelta: number;
  explanation: string;
}

export interface ExecutionLedger {
  generatedAt: string;
  entries: ExecutionLedgerEntry[];
}

function createLedgerEntryId(index: number): string {
  return `ledger-${String(index + 1).padStart(3, "0")}`;
}

export function buildExecutionLedger(
  selectedActions: RankedAction[],
  decisions: ExecutionDecision[]
): ExecutionLedger {
  const entries: ExecutionLedgerEntry[] = selectedActions.map((action, index) => {
    const decision = decisions.find(
      (item) =>
        item.exceptionId === action.exceptionId &&
        item.actionType === action.actionType
    );

    return {
      id: createLedgerEntryId(index),
      timestamp: new Date().toISOString(),
      exceptionId: action.exceptionId,
      actionType: action.actionType,
      decision: decision?.decision ?? "denied",
      reason: decision?.reason ?? "No matching governance decision found.",
      projectedCashDelta: action.projectedCashDelta,
      projectedMarginDelta: action.projectedMarginDelta,
      projectedRiskDelta: action.projectedRiskDelta,
      explanation: action.explanation
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    entries
  };
}

export function persistExecutionLedger(ledger: ExecutionLedger): void {
  const outputPath = path.resolve("outputs/ledger/latest-execution-ledger.json");
  safeWriteJson(outputPath, ledger);
}
