import fs from "fs";
import "dotenv/config";
import express from "express";

import { getExecutionMode } from "../execution/execution-mode.js";
import { runFinanceOpsPipeline } from "../pipeline/run-financeops-pipeline.js";
import { executeApprovedPayment } from "../payments/payment-execution-service.js";
import { getLatestOutputArtifactPath } from "../output-adapters/output-artifact-store.js";
import { ARTIFACT_PATHS } from "./artifact-paths.js";
import { getAvailableArtifactNames, getMissingArtifactNames, isArtifactName, listArtifactMetadata, readArtifactByName, summarizeAllArtifacts, summarizeArtifact } from "./artifact-read-service.js";
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
      "client_output_artifact_persistence",
      "artifact_status_endpoint",
      "compact_dashboard_artifact_endpoint",
      "demo_verification_artifact_status_check",
      "artifact_metadata_utility_endpoints",
      "artifact_health_summary_endpoint",
      "artifact_name_discovery_endpoints"
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







app.get("/artifacts", (_req, res) => {
  res.json({
    status: "success",
    artifacts: Object.entries(ARTIFACT_PATHS).map(([name, artifactPath]) => ({
      name,
      path: artifactPath
    }))
  });
});










app.get("/artifacts/missing-names", (_req, res) => {
  res.json({
    status: "success",
    artifacts: getMissingArtifactNames()
  });
});

app.get("/artifacts/available-names", (_req, res) => {
  res.json({
    status: "success",
    artifacts: getAvailableArtifactNames()
  });
});

app.get("/artifacts/names", (_req, res) => {
  res.json({
    status: "success",
    artifacts: Object.keys(ARTIFACT_PATHS)
  });
});

app.get("/artifacts/health", (_req, res) => {
  const summaries = summarizeAllArtifacts();
  const missing = summaries.filter((artifact) => !artifact.exists);

  res.json({
    status: missing.length === 0 ? "healthy" : "degraded",
    totalArtifacts: summaries.length,
    availableArtifacts: summaries.length - missing.length,
    missingArtifacts: missing.length
  });
});

app.get("/artifacts/summaries", (_req, res) => {
  res.json({
    status: "success",
    artifacts: summarizeAllArtifacts()
  });
});

app.get("/artifacts/missing", (_req, res) => {
  const missingArtifacts = listArtifactMetadata().filter((artifact) => !artifact.exists);

  res.json({
    status: "success",
    count: missingArtifacts.length,
    artifacts: missingArtifacts
  });
});

app.get("/artifacts/available", (_req, res) => {
  const availableArtifacts = listArtifactMetadata().filter((artifact) => artifact.exists);

  res.json({
    status: "success",
    count: availableArtifacts.length,
    artifacts: availableArtifacts
  });
});

app.get("/artifacts/count", (_req, res) => {
  res.json({
    status: "success",
    count: Object.keys(ARTIFACT_PATHS).length
  });
});

app.get("/artifacts/metadata", (_req, res) => {
  res.json({
    status: "success",
    artifacts: listArtifactMetadata()
  });
});

app.get("/artifacts/status", (_req, res) => {
  const artifacts = Object.fromEntries(
    Object.entries(ARTIFACT_PATHS).map(([name, artifactPath]) => [
      name,
      {
        path: artifactPath,
        exists: fs.existsSync(artifactPath)
      }
    ])
  );

  res.json({
    status: "success",
    artifacts
  });
});

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




app.get("/artifacts/:artifactName/metadata", (req, res) => {
  const artifactName = req.params.artifactName;

  if (!isArtifactName(artifactName)) {
    res.status(404).json({
      status: "error",
      message: `Unknown artifact: ${artifactName}`
    });
    return;
  }

  const artifact = readArtifactByName(artifactName);

  res.json({
    status: "success",
    metadata: {
      name: artifact.name,
      path: artifact.path,
      exists: artifact.exists
    }
  });
});

app.get("/artifacts/:artifactName", (req, res) => {
  const artifactName = req.params.artifactName;

  if (!isArtifactName(artifactName)) {
    res.status(404).json({
      status: "error",
      message: `Unknown artifact: ${artifactName}`
    });
    return;
  }

  const artifact = readArtifactByName(artifactName);

  if (!artifact.exists) {
    res.status(404).json({
      status: "error",
      artifact
    });
    return;
  }

  res.json({
    status: "success",
    artifact
  });
});

app.listen(port, () => {
  console.log(`FinanceOps Agent API running on http://localhost:${port}`);
});
