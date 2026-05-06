import fs from "fs";
import "dotenv/config";
import express from "express";

import { getExecutionMode } from "../execution/execution-mode.js";
import { runFinanceOpsPipeline } from "../pipeline/run-financeops-pipeline.js";
import { executeApprovedPayment } from "../payments/payment-execution-service.js";
import { getLatestOutputArtifactPath } from "../output-adapters/output-artifact-store.js";
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
      "api_response_persistence",
      "payment_recommendation_generation",
      "human_approved_mock_payment_execution",
      "payment_execution_audit_record_persistence",
      "client_output_artifact_generation",
      "client_output_artifact_persistence"
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

app.post("/payments/:paymentRecommendationId/approve-and-send", async (req, res) => {
  try {
    const result = await runFinanceOpsPipeline();
    const paymentRecommendation = result.paymentRecommendations.find(
      (recommendation) =>
        recommendation.id === req.params.paymentRecommendationId
    );

    if (!paymentRecommendation) {
      return res.status(404).json({
        status: "error",
        message: "Payment recommendation not found"
      });
    }

    const approvedBy =
      typeof req.body?.approvedBy === "string"
        ? req.body.approvedBy
        : "demo-controller";

    const idempotencyKey =
      typeof req.body?.idempotencyKey === "string"
        ? req.body.idempotencyKey
        : undefined;

    const executionResult = await executeApprovedPayment({
      recommendation: paymentRecommendation,
      approvedBy,
      approvalId: `approval-for-${paymentRecommendation.id}`,
      idempotencyKey
    });

    const responseBody = {
      status: "success",
      paymentRecommendation,
      executionResult
    };

    persistApiResponse(responseBody);

    return res.json(responseBody);
  } catch (error) {
    const responseBody = {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error"
    };

    persistApiResponse(responseBody);

    return res.status(500).json(responseBody);
  }
});

const port = Number(process.env.PORT ?? 3001);




app.get("/artifacts/latest-dashboard", (_req, res) => {
  try {
    const artifactPath = getLatestOutputArtifactPath();

    if (!fs.existsSync(artifactPath)) {
      res.status(404).json({
        status: "error",
        message:
          "No output artifact found. Run the FinanceOps agent before requesting the latest dashboard artifact."
      });
      return;
    }

    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
    const payload = artifact.payload ?? {};

    res.json({
      status: "success",
      dashboard: {
        generatedAt: artifact.generatedAt,
        artifactType: artifact.artifactType,
        mode: payload.mode,
        project: payload.project,
        financeSummary: payload.financeSummary,
        governance: payload.governance,
        cfoBriefing: payload.cfoBriefing
          ? {
              executiveSummary: payload.cfoBriefing.executiveSummary,
              confidenceScore: payload.cfoBriefing.confidenceScore
            }
          : null
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

app.get("/artifacts/latest-output", (_req, res) => {
  try {
    const artifactPath = getLatestOutputArtifactPath();

    if (!fs.existsSync(artifactPath)) {
      res.status(404).json({
        status: "error",
        message:
          "No output artifact found. Run the FinanceOps agent before requesting the latest output artifact."
      });
      return;
    }

    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

    res.json({
      status: "success",
      artifact
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});


app.listen(port, () => {
  console.log(`FinanceOps Agent API running on http://localhost:${port}`);
});
