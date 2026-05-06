export const ARTIFACT_PATHS = {
  executionLedger: "outputs/ledger/latest-execution-ledger.json",
  approvalQueue: "outputs/approvals/latest-approval-queue.json",
  paymentExecution: "outputs/payments/latest-payment-execution.json",
  clientOutputArtifact: "outputs/artifacts/latest-output-artifact.json"
} as const;

export type ArtifactName = keyof typeof ARTIFACT_PATHS;
