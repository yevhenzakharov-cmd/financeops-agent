import fs from "fs";
import path from "path";
import { afterEach, describe, expect, it } from "vitest";

import {
  getLatestOutputArtifactPath,
  persistOutputArtifact
} from "../../src/output-adapters/output-artifact-store.js";
import type { FinanceOpsOutputArtifact } from "../../src/output-adapters/financeops-output-adapter.js";

describe("output artifact store", () => {
  const artifactPath = getLatestOutputArtifactPath();

  afterEach(() => {
    if (fs.existsSync(artifactPath)) {
      fs.rmSync(artifactPath, { force: true });
    }
  });

  it("returns the latest output artifact path inside the outputs artifact folder", () => {
    expect(artifactPath).toBe(
      path.join(process.cwd(), "outputs", "artifacts", "latest-output-artifact.json")
    );
  });

  it("persists the latest output artifact as formatted JSON", () => {
    const artifact: FinanceOpsOutputArtifact = {
      generatedAt: "2026-05-12T12:00:00.000Z",
      adapterName: "mock_client_output_adapter",
      artifactType: "financeops_summary",
      summary: {
        projectName: "Project Atlas",
        exceptionCount: 2,
        approvalRequiredCount: 1,
        blockedCount: 1
      },
      sections: [
        {
          title: "Executive Summary",
          body: "Mock summary for reviewer-safe output artifact testing."
        }
      ]
    };

    persistOutputArtifact(artifact);

    expect(fs.existsSync(artifactPath)).toBe(true);

    const saved = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
    expect(saved).toEqual(artifact);

    const raw = fs.readFileSync(artifactPath, "utf-8");
    expect(raw).toContain('\n  "adapterName": "mock_client_output_adapter"');
  });
});
