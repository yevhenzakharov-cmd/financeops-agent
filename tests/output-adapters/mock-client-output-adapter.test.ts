import { describe, expect, test } from "vitest";

import { MockClientOutputAdapter } from "../../src/output-adapters/mock-client-output-adapter.js";
import type { FinanceOpsPipelineResult } from "../../src/output-adapters/financeops-output-adapter.js";

const basePipelineResult = {
  mode: "simulation",
  inputSource: {
    adapterName: "mock_financeops_adapter",
    sourceName: "public_mock_client_dataset",
    loadedAt: "2026-01-01T00:00:00.000Z"
  },
  project: {
    id: "project-001",
    name: "Project Atlas",
    clientId: "client-001",
    engine: "FinanceOpsCore",
    platform: ["Operations"],
    stage: "pilot",
    budget: {
      totalBudget: {
        amount: 500000,
        currency: "USD"
      },
      approvedAt: "2025-01-10"
    },
    startDate: "2025-01-15"
  },
  margin: {
    projectId: "project-001",
    revenue: 150000,
    costs: 60000,
    grossMargin: 90000,
    marginPercent: 60,
    budgetUtilizationPercent: 12
  },
  burn: {
    projectId: "project-001",
    stage: "pilot",
    burnPercent: 12,
    expectedBurnPercent: 85,
    varianceFromExpected: -73,
    riskLevel: "warning",
    riskType: "underburn"
  },
  overdue: [
    {
      invoiceId: "inv-002",
      projectId: "project-001",
      clientId: "client-001",
      daysOverdue: 405,
      amount: 50000
    }
  ],
  reconciliation: [
    {
      invoiceId: "inv-001",
      paymentId: "pay-001",
      bankTransactionId: "bank-001",
      status: "matched"
    },
    {
      invoiceId: "inv-002",
      status: "missing_payment"
    },
    {
      invoiceId: "N/A",
      bankTransactionId: "bank-002",
      status: "orphan_bank"
    }
  ],
  exceptions: [],
  simulations: [],
  selectedActions: [
    {
      exceptionId: "fx-001",
      actionType: "reallocate_budget",
      projectedCashDelta: 0,
      projectedMarginDelta: 5000,
      projectedRiskDelta: -3,
      explanation: "Budget reallocation improves margin efficiency slightly."
    }
  ],
  decisions: [],
  paymentRecommendations: [
    {
      id: "payrec-001",
      exceptionId: "fx-004",
      actionType: "freeze_vendor_payments",
      recipient: {
        id: "vendor-001",
        name: "Mock Vendor Services",
        type: "vendor",
        reference: "mock-vendor-bank-profile"
      },
      amount: 25000,
      currency: "USD",
      reason: "Freezing payments temporarily preserves cash but increases operational risk.",
      riskNote: "Human approval required before any vendor payment action can be executed.",
      requiresHumanApproval: true
    }
  ],
  ledger: {
    generatedAt: "2026-01-01T00:00:00.000Z",
    entries: []
  },
  approvalQueue: {
    generatedAt: "2026-01-01T00:00:00.000Z",
    items: [
      {
        id: "approval-001",
        exceptionId: "fx-004",
        actionType: "freeze_vendor_payments",
        status: "pending",
        reason: "High-risk finance action requires review."
      }
    ]
  },
  cfoBriefing: {
    executiveSummary: "Deterministic CFO briefing.",
    projectMarginRisks: [
      {
        projectId: "project-001",
        riskLevel: "medium",
        explanation: "Margin is positive but requires review."
      }
    ],
    overdueReceivables: [
      {
        invoiceId: "inv-002",
        daysOverdue: 405,
        riskLevel: "high"
      }
    ],
    confidenceScore: 0.9
  },
  auditTraceId: "trace-test"
} satisfies FinanceOpsPipelineResult;

describe("MockClientOutputAdapter", () => {
  test("builds a dashboard payload from deterministic pipeline output", async () => {
    const adapter = new MockClientOutputAdapter();

    const artifact = await adapter.buildArtifact(basePipelineResult);

    expect(artifact.adapterName).toBe("mock_client_output_adapter");
    expect(artifact.artifactType).toBe("dashboard_payload");
    expect(Date.parse(artifact.generatedAt)).not.toBeNaN();

    expect(artifact.payload).toMatchObject({
      mode: "simulation",
      inputSource: basePipelineResult.inputSource,
      project: {
        id: "project-001",
        name: "Project Atlas",
        stage: "pilot"
      },
      financeSummary: {
        marginPercent: 60,
        budgetUtilizationPercent: 12,
        overdueInvoiceCount: 1,
        reconciliationExceptionCount: 2
      },
      governance: {
        selectedActionCount: 1,
        approvalQueueCount: 1,
        paymentRecommendationCount: 1
      },
      cfoBriefing: basePipelineResult.cfoBriefing
    });
  });
});
