import { MockFinanceOpsAdapter } from "../adapters/mock-financeops-adapter.js";
import type { FinanceOpsInputAdapter } from "../adapters/financeops-input-adapter.js";
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
import { buildPaymentRecommendations } from "../payments/payment-recommendation-builder.js";
import { MockClientOutputAdapter } from "../output-adapters/mock-client-output-adapter.js";
import type { FinanceOpsOutputAdapter } from "../output-adapters/financeops-output-adapter.js";
import { persistOutputArtifact } from "../output-adapters/output-artifact-store.js";

function scoreAction(action: RankedAction): number {
  return (
    action.projectedCashDelta +
    action.projectedMarginDelta -
    Math.abs(action.projectedRiskDelta * 1000)
  );
}

export interface RunFinanceOpsPipelineOptions {
  inputAdapter?: FinanceOpsInputAdapter;
  outputAdapter?: FinanceOpsOutputAdapter;
}

export async function runFinanceOpsPipeline(
  options: RunFinanceOpsPipelineOptions = {}
) {
  const mode = getExecutionMode();
  const audit = createAuditLog();

  const inputAdapter = options.inputAdapter ?? new MockFinanceOpsAdapter();
  const inputSnapshot = await inputAdapter.loadSnapshot();

  recordAuditEvent(audit, "initialization", "INPUT_SNAPSHOT_LOADED", {
    adapterName: inputAdapter.adapterName,
    sourceName: inputSnapshot.sourceName,
    projectCount: inputSnapshot.projects.length,
    invoiceCount: inputSnapshot.invoices.length,
    paymentCount: inputSnapshot.payments.length,
    bankTransactionCount: inputSnapshot.bankTransactions.length
  });

  const project = inputSnapshot.projects[0];
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
  const paymentRecommendations = buildPaymentRecommendations(selectedActions);

  const ledger = buildExecutionLedger(selectedActions, decisions);
  persistExecutionLedger(ledger);

  const approvalQueue = buildApprovalQueue(decisions);
  persistApprovalQueue(approvalQueue);

  recordAuditEvent(audit, "action_generation", "BEST_ACTION_SELECTED", {
    count: selectedActions.length
  });

  recordAuditEvent(audit, "action_generation", "PAYMENT_RECOMMENDATIONS_BUILT", {
    count: paymentRecommendations.length
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
      inputSnapshot,
      margin,
      burn,
      overdue,
      reconciliation,
      exceptions,
      selectedActions,
      decisions,
      paymentRecommendations,
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

  const outputAdapter = options.outputAdapter ?? new MockClientOutputAdapter();
  const outputArtifact = await outputAdapter.buildArtifact({
    mode,
    inputSource: {
      adapterName: inputAdapter.adapterName,
      sourceName: inputSnapshot.sourceName,
      loadedAt: inputSnapshot.loadedAt
    },
    project,
    margin,
    burn,
    overdue,
    reconciliation,
    exceptions,
    simulations,
    selectedActions,
    decisions,
    paymentRecommendations,
    ledger,
    approvalQueue,
    cfoBriefing,
    auditTraceId: audit.traceId
  });

  recordAuditEvent(audit, "persistence", "OUTPUT_ADAPTER_ARTIFACT_BUILT", {
    adapterName: outputAdapter.adapterName,
    artifactType: outputArtifact.artifactType
  });

  persistOutputArtifact(outputArtifact);

  recordAuditEvent(audit, "persistence", "OUTPUT_ADAPTER_ARTIFACT_PERSISTED", {
    artifactType: outputArtifact.artifactType
  });

  finalizeAuditLog(audit);
  persistAuditLog(audit);

  return {
    mode,
    inputSource: {
      adapterName: inputAdapter.adapterName,
      sourceName: inputSnapshot.sourceName,
      loadedAt: inputSnapshot.loadedAt
    },
    project,
    margin,
    burn,
    overdue,
    reconciliation,
    exceptions,
    simulations,
    selectedActions,
    decisions,
    paymentRecommendations,
    ledger,
    approvalQueue,
    outputArtifact,
    cfoBriefing,
    auditTraceId: audit.traceId
  };
}
