import { describe, expect, test } from "vitest";
import {
  buildClientImplementationManifest,
  summarizeClientImplementationManifest,
  validateClientImplementationManifest
} from "../../src/client-config/client-implementation-manifest.js";

describe("client implementation manifest", () => {
  test("describes the clone-per-client implementation model", () => {
    const manifest = buildClientImplementationManifest();

    expect(manifest.manifestVersion).toBe("client-implementation-manifest-v1");
    expect(manifest.implementationModel.cloneStrategy).toBe("clone_core_repo_per_client");
    expect(manifest.implementationModel.productionDataBoundary).toBe(
      "client_owned_environment_required"
    );
    expect(manifest.implementationModel.publicRepoBoundary).toBe(
      "mock_data_and_demo_safe_contracts_only"
    );
  });

  test("tracks inputs, outputs, workflows, and approval boundaries", () => {
    const manifest = buildClientImplementationManifest();

    expect(manifest.inputs.length).toBeGreaterThanOrEqual(3);
    expect(manifest.outputs.length).toBeGreaterThanOrEqual(3);
    expect(manifest.workflows.length).toBeGreaterThanOrEqual(3);
    expect(manifest.approvalBoundaries).toContain(
      "Payments may be prepared by the agent, but money movement requires human approval."
    );
  });

  test("keeps payment preparation blocked until client configuration exists", () => {
    const manifest = buildClientImplementationManifest();

    const paymentWorkflow = manifest.workflows.find(
      (workflow) => workflow.id === "workflow-payment-approval-preparation"
    );

    expect(paymentWorkflow).toBeDefined();
    expect(paymentWorkflow?.actionMode).toBe("blocked_until_configured");
    expect(paymentWorkflow?.productionBoundary).toContain("authorized approvers");
  });

  test("summarizes manifest readiness for reviewers and builders", () => {
    const manifest = buildClientImplementationManifest();
    const summary = summarizeClientImplementationManifest(manifest);

    expect(summary.workflowCount).toBe(manifest.workflows.length);
    expect(summary.blockedWorkflowCount).toBeGreaterThanOrEqual(1);
    expect(summary.missingClientItems).toContain("Representative input samples");
  });

  test("validates the default manifest", () => {
    const validation = validateClientImplementationManifest();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
