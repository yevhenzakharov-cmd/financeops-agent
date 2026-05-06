import type {
  FinanceOpsOutputAdapter,
  FinanceOpsOutputArtifact,
  FinanceOpsPipelineResult
} from "./financeops-output-adapter.js";

export class MockClientOutputAdapter implements FinanceOpsOutputAdapter {
  adapterName = "mock_client_output_adapter";

  async buildArtifact(
    result: FinanceOpsPipelineResult
  ): Promise<FinanceOpsOutputArtifact> {
    return {
      adapterName: this.adapterName,
      generatedAt: new Date().toISOString(),
      artifactType: "dashboard_payload",
      payload: {
        mode: result.mode,
        inputSource: result.inputSource,
        project: {
          id: result.project.id,
          name: result.project.name,
          stage: result.project.stage
        },
        financeSummary: {
          marginPercent: result.margin.marginPercent,
          budgetUtilizationPercent: result.burn.burnPercent,
          overdueInvoiceCount: result.overdue.length,
          reconciliationExceptionCount: result.reconciliation.filter(
            (item) => item.status !== "matched"
          ).length
        },
        governance: {
          selectedActionCount: result.selectedActions.length,
          approvalQueueCount: result.approvalQueue.items.length,
          paymentRecommendationCount: result.paymentRecommendations.length
        },
        cfoBriefing: result.cfoBriefing
      }
    };
  }
}
