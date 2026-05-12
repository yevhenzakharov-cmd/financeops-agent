import { afterEach, describe, expect, test, vi } from "vitest";

import {
  buildDeterministicCFOBriefing,
  generateCFOBriefing
} from "../src/agent/cfo-briefing.js";

describe("CFO briefing", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  test("builds a deterministic CFO briefing when external AI is unavailable", () => {
    const briefing = buildDeterministicCFOBriefing(
      "Project margin is positive. Invoice inv-002 is overdue. Payment actions require approval."
    );

    expect(briefing.executiveSummary).toContain("deterministic review");
    expect(briefing.executiveSummary).toContain("AI explanation is optional");
    expect(briefing.projectMarginRisks).toEqual([
      {
        projectId: "project-001",
        riskLevel: "medium",
        explanation:
          "Project Atlas has positive gross margin, but budget burn and reconciliation exceptions still require finance review before production-style action."
      }
    ]);
    expect(briefing.overdueReceivables).toEqual([
      {
        invoiceId: "inv-002",
        daysOverdue: 402,
        riskLevel: "high"
      }
    ]);
    expect(briefing.confidenceScore).toBe(0.86);
  });

  test("uses a lower deterministic confidence score when summary is empty", () => {
    const briefing = buildDeterministicCFOBriefing("");

    expect(briefing.confidenceScore).toBe(0.75);
    expect(briefing.executiveSummary).toContain("deterministic review");
  });

  test("falls back to deterministic briefing when OpenAI API key is not configured", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");

    const briefing = await generateCFOBriefing("No external model should be called.");

    expect(briefing.executiveSummary).toContain("deterministic review");
    expect(briefing.projectMarginRisks[0]?.riskLevel).toBe("medium");
    expect(briefing.overdueReceivables[0]?.riskLevel).toBe("high");
    expect(briefing.confidenceScore).toBe(0.86);
  });

  test("falls back to deterministic briefing when deterministic summary is empty and API key is not configured", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");

    const briefing = await generateCFOBriefing("");

    expect(briefing.executiveSummary).toContain("deterministic review");
    expect(briefing.confidenceScore).toBe(0.75);
  });
});
