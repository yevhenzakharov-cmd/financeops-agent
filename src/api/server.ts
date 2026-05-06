import "dotenv/config";
import express from "express";

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
import { evaluateExecution } from "../execution/auto-executor.js";
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
import { persistApiResponse } from "./api-output-writer.js";

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

async function runFinanceOpsPipeline() {
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

  recordAuditEvent(audit, "action_generation", "API_PIPELINE_EXECUTED", {
    mode,
    selectedActionCount: selectedActions.length,
    decisionCount: decisions.length
  });

  recordAuditEvent(audit, "validation", "API_CFO_BRIEFING_GENERATED", {
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
    selectedActions,
    decisions,
    ledger,
    approvalQueue,
    cfoBriefing,
    auditTraceId: audit.traceId
  };
}

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "financeops-agent",
    mode: getExecutionMode()
  });
});

app.get("/system-summary", (_req, res) => {
  res.json({
    service: "FinanceOps Agent",
    description:
      "Governed autonomous FinanceOps agent for deterministic analysis, risk classification, action simulation, policy decisions, approval routing, ledger persistence, audit tracing, and AI CFO briefing.",
    capabilities: [
      "deterministic_margin_analysis",
      "budget_burn_risk_detection",
      "overdue_receivables_detection",
      "reconciliation_exception_detection",
      "finance_exception_classification",
      "financial_intervention_simulation",
      "intelligent_strategy_selection",
      "risk_appetite_governance",
      "approval_workflow_routing",
      "execution_ledger_persistence",
      "audit_log_persistence",
      "ai_cfo_briefing",
      "api_response_persistence"
    ],
    executionMode: getExecutionMode()
  });
});

app.post("/run-financeops-agent", async (_req, res) => {
  try {
    const result = await runFinanceOpsPipeline();

    const responseBody = {
      status: "success",
      result
    };

    persistApiResponse(responseBody);

    res.json(responseBody);
  } catch (error) {
    const responseBody = {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error"
    };

    persistApiResponse(responseBody);

    res.status(500).json(responseBody);
  }
});

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  console.log(`FinanceOps Agent API running on http://localhost:${port}`);
});
