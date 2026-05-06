import "dotenv/config";
import express from "express";

import { getExecutionMode } from "../execution/execution-mode.js";
import { runFinanceOpsPipeline } from "../pipeline/run-financeops-pipeline.js";
import { persistApiResponse } from "./api-output-writer.js";

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
