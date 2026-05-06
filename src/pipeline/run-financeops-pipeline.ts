import { projects } from "../domain/mock-data.js";
import {
  calculateProjectMargin,
  detectOverdueInvoices,
  evaluateBudgetBurn,
  runReconciliation,
  classifyFinanceExceptions
} from "../tools/index.js";

import { generateCFOBriefing } from "../agent/cfo-briefing.js";
import { simulateActionsForException } from "../simulation/action-simulator.js";
import { getExecutionMode } from "../execution/execution-mode.js";
import {
  evaluateExecution,
  type RankedAction
} from "../execution/auto-executor.js";
import {
  buildExecutionLedger,
  persistExecutionLedger
} from "../execution/execution-ledger.js";
import {
  buildApprovalQueue,
  persistApprovalQueue
} from "../approval/approval-workflow.js";
import {
  createAuditLog,
  recordAuditEvent,
  finalizeAuditLog,
  persistAuditLog
} from "../security/audit-log.js";

function scoreAction(action: RankedAction): number {
  return (
    action.projectedCashDelta +
    action.projectedMarginDelta -
    Math.abs(action.projectedRiskDelta * 1000)
  );
}

export async function runFinanceOpsPipeline() {
  const mode = getExecutionMode();
  const audit = createAuditLog();

  const project = projects[0];
  if (!project) throw new Error("No project found");

  const margin = calculateProjectMargin(project);
  const burn = evaluateBudgetBurn(project);
  const overdue = detectOverdueInvoices();
  const reconciliation = runReconciliation();
  const exceptions = classifyFinanceExceptions();

  const simulations = exceptions.map((exception) =>
    simulateActionsForException(exception)
  );

  const selectedActions: RankedAction[] = [];

  for (const sim of simulations) {
    if (!sim.proposedActions.length) continue;

    const ranked = sim.proposedActions
      .map((action) => ({
        exceptionId: sim.exceptionId,
        actionType: action.actionType,
        projectedCashDelta: action.projectedCashDelta,
        projectedMarginDelta: action.projectedMarginDelta,
        projectedRiskDelta: action.projectedRiskDelta,
        explanation: action.explanation
      }))
      .sort((a, b) => scoreAction(b) - scoreAction(a));

    const best = ranked[0];
    if (best) selectedActions.push(best);
  }

  const decisions = evaluateExecution(selectedActions, mode);

  const ledger = buildExecutionLedger(selectedActions, decisions);
  persistExecutionLedger(ledger);

  const approvalQueue = buildApprovalQueue(decisions);
  persistApprovalQueue(approvalQueue);

  recordAuditEvent(audit, "action_generation", "BEST_ACTION_SELECTED", {
    count: selectedActions.length
  });

  recordAuditEvent(audit, "policy_enforcement", "EXECUTION_DECISIONS_MADE", {
    mode,
    decisions
  });

  recordAuditEvent(audit, "persistence", "EXECUTION_LEDGER_PERSISTED", {
    path: "outputs/ledger/latest-execution-ledger.json",
    entryCount: ledger.entries.length
  });

  recordAuditEvent(audit, "persistence", "APPROVAL_QUEUE_PERSISTED", {
    path: "outputs/approvals/latest-approval-queue.json",
    itemCount: approvalQueue.items.length
  });

  const briefingInput = JSON.stringify(
    {
      margin,
      burn,
      overdue,
      reconciliation,
      exceptions,
      selectedActions,
      decisions,
      ledger,
      approvalQueue
    },
    null,
    2
  );

  const cfoBriefing = await generateCFOBriefing(briefingInput);

  recordAuditEvent(audit, "validation", "CFO_BRIEFING_GENERATED", {
    confidenceScore: cfoBriefing.confidenceScore
  });

  finalizeAuditLog(audit);
  persistAuditLog(audit);

  return {
    mode,
    project,
    margin,
    burn,
    overdue,
    reconciliation,
    exceptions,
    simulations,
    selectedActions,
    decisions,
    ledger,
    approvalQueue,
    cfoBriefing,
    auditTraceId: audit.traceId
  };
}
