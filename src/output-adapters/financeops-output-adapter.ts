import type { FinanceOpsInputSnapshot } from "../adapters/financeops-input-adapter.js";
import type { generateCFOBriefing } from "../agent/cfo-briefing.js";
import type { buildApprovalQueue } from "../approval/approval-workflow.js";
import type { Project } from "../domain/schemas.js";
import type {
  evaluateExecution,
  RankedAction
} from "../execution/auto-executor.js";
import type { buildExecutionLedger } from "../execution/execution-ledger.js";
import type { buildPaymentRecommendations } from "../payments/payment-recommendation-builder.js";
import type { simulateActionsForException } from "../simulation/action-simulator.js";
import type {
  calculateProjectMargin,
  classifyFinanceExceptions,
  detectOverdueInvoices,
  evaluateBudgetBurn,
  runReconciliation
} from "../tools/index.js";

export interface FinanceOpsPipelineResult {
  mode: string;
  inputSource: Pick<FinanceOpsInputSnapshot, "sourceName" | "loadedAt"> & {
    adapterName: string;
  };
  project: Project;
  margin: ReturnType<typeof calculateProjectMargin>;
  burn: ReturnType<typeof evaluateBudgetBurn>;
  overdue: ReturnType<typeof detectOverdueInvoices>;
  reconciliation: ReturnType<typeof runReconciliation>;
  exceptions: ReturnType<typeof classifyFinanceExceptions>;
  simulations: ReturnType<typeof simulateActionsForException>[];
  selectedActions: RankedAction[];
  decisions: ReturnType<typeof evaluateExecution>;
  paymentRecommendations: ReturnType<typeof buildPaymentRecommendations>;
  ledger: ReturnType<typeof buildExecutionLedger>;
  approvalQueue: ReturnType<typeof buildApprovalQueue>;
  cfoBriefing: Awaited<ReturnType<typeof generateCFOBriefing>>;
  auditTraceId: string;
}

export interface FinanceOpsOutputArtifact {
  adapterName: string;
  generatedAt: string;
  artifactType:
    | "executive_summary"
    | "approval_queue"
    | "payment_review"
    | "client_export"
    | "dashboard_payload";
  payload: unknown;
}

export interface FinanceOpsOutputAdapter {
  adapterName: string;
  buildArtifact(
    result: FinanceOpsPipelineResult
  ): Promise<FinanceOpsOutputArtifact>;
}
