import "dotenv/config";

import { projects } from "./domain/mock-data.js";
import {
  calculateProjectMargin,
  detectOverdueInvoices,
  evaluateBudgetBurn,
  runReconciliation,
  classifyFinanceExceptions
} from "./tools/index.js";

import { generateCFOBriefing } from "./agent/cfo-briefing.js";
import {
  createAuditLog,
  recordAuditEvent,
  finalizeAuditLog,
  persistAuditLog
} from "./security/audit-log.js";

import { simulateActionsForException } from "./simulation/action-simulator.js";
import { getExecutionMode } from "./execution/execution-mode.js";
import { evaluateExecution } from "./execution/auto-executor.js";
import {
  buildExecutionLedger,
  persistExecutionLedger
} from "./execution/execution-ledger.js";
import {
  buildApprovalQueue,
  persistApprovalQueue
} from "./approval/approval-workflow.js";

interface RankedAction {
  exceptionId: string;
  actionType: string;
  projectedCashDelta: number;
  projectedMarginDelta: number;
  projectedRiskDelta: number;
  explanation: string;
}

function scoreAction(action: RankedAction): number {
  return (
    action.projectedCashDelta +
    action.projectedMarginDelta -
    Math.abs(action.projectedRiskDelta * 1000)
  );
}

(async () => {
  console.log("FinanceOps Agent — Governed FinanceOps Platform\n");

  const mode = getExecutionMode();
  console.log(`Execution Mode: ${mode}\n`);

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

  const summaryInput = JSON.stringify(
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

  const briefing = await generateCFOBriefing(summaryInput);

  finalizeAuditLog(audit);
  persistAuditLog(audit);

  console.log("Execution Complete.\n");

  console.log("=== CFO Summary ===");
  console.log(briefing.executiveSummary);
  console.log(`Confidence Score: ${briefing.confidenceScore}\n`);

  console.log("=== Selected Strategies ===");
  selectedActions.forEach((action) => {
    console.log(
      `Exception: ${action.exceptionId} | Selected Action: ${action.actionType}`
    );
  });

  console.log("\n=== Governance Decisions ===");
  decisions.forEach((d) => {
    console.log(
      `Exception: ${d.exceptionId} | Action: ${d.actionType} | Decision: ${d.decision} | Reason: ${d.reason}`
    );
  });

  console.log("\n=== Approval Queue ===");
  approvalQueue.items.forEach((item) => {
    console.log(
      `Approval: ${item.id} | Role: ${item.requiredRole} | Status: ${item.status} | Action: ${item.actionType}`
    );
  });

  console.log("\nExecution ledger written to outputs/ledger/latest-execution-ledger.json");
  console.log("Approval queue written to outputs/approvals/latest-approval-queue.json");
})();
