import { describe, expect, it } from "vitest";
import type { FinanceOpsInputAdapter } from "../../src/adapters/financeops-input-adapter.js";
import type {
  FinanceOpsOutputAdapter,
  FinanceOpsOutputArtifact,
  FinanceOpsPipelineResult
} from "../../src/output-adapters/financeops-output-adapter.js";
import { runFinanceOpsPipeline } from "../../src/pipeline/run-financeops-pipeline.js";

const customInputAdapter: FinanceOpsInputAdapter = {
  adapterName: "custom_test_input_adapter",
  async loadSnapshot() {
    return {
      sourceName: "custom_test_source",
      loadedAt: "2026-01-01T00:00:00.000Z",
      projects: [
        {
          id: "project-custom-001",
          name: "Custom Adapter Project",
          clientId: "client-custom-001",
          engine: "FinanceOpsCore",
          platform: ["Operations"],
          stage: "pilot",
          budget: {
            totalBudget: {
              amount: 100000,
              currency: "USD"
            },
            approvedAt: "2026-01-01"
          },
          startDate: "2026-01-01"
        }
      ],
      invoices: [],
      payments: [],
      bankTransactions: []
    };
  }
};

const customOutputAdapter: FinanceOpsOutputAdapter = {
  adapterName: "custom_test_output_adapter",
  async buildArtifact(
    result: FinanceOpsPipelineResult
  ): Promise<FinanceOpsOutputArtifact> {
    return {
      adapterName: this.adapterName,
      generatedAt: "2026-01-01T00:00:01.000Z",
      artifactType: "client_export",
      payload: {
        projectId: result.project.id,
        sourceName: result.inputSource.sourceName,
        selectedActionCount: result.selectedActions.length
      }
    };
  }
};

describe("runFinanceOpsPipeline", () => {
  it("uses injected input and output adapters when provided", async () => {
    const result = await runFinanceOpsPipeline({
      inputAdapter: customInputAdapter,
      outputAdapter: customOutputAdapter
    });

    expect(result.inputSource).toEqual({
      adapterName: "custom_test_input_adapter",
      sourceName: "custom_test_source",
      loadedAt: "2026-01-01T00:00:00.000Z"
    });
    expect(result.project.id).toBe("project-custom-001");
    expect(result.outputArtifact.adapterName).toBe(
      "custom_test_output_adapter"
    );
    expect(result.outputArtifact.artifactType).toBe("client_export");
    expect(result.outputArtifact.payload).toMatchObject({
      projectId: "project-custom-001",
      sourceName: "custom_test_source"
    });
  });
});
