import type { runFinanceOpsPipeline } from "../pipeline/run-financeops-pipeline.js";

export type FinanceOpsPipelineResult = Awaited<
  ReturnType<typeof runFinanceOpsPipeline>
>;

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
