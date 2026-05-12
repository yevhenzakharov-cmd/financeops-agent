import { afterEach, describe, expect, test, vi } from "vitest";

import {
  buildDeterministicCFOBriefing,
  generateCFOBriefing
} from "../src/agent/cfo-briefing.js";

describe("CFO briefing fallback", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("builds a deterministic CFO briefing when external AI is unavailable", () => {
    const briefing = buildDeterministicCFOBriefing(
      "Project margin is positive. Invoice inv-002 is overdue. Payment actions require approval."
    );

    expect(briefing.executiveSummary).toContain("deterministic review");
    expect(briefing.projectMarginRisks[0]?.projectId).toBe("project-001");
    expect(briefing.overdueReceivables[0]?.invoiceId).toBe("inv-002");
    expect(briefing.confidenceScore).toBeGreaterThan(0);
    expect(briefing.confidenceScore).toBeLessThanOrEqual(1);
  });

  test("uses a lower deterministic confidence score when summary is empty", () => {
    const briefing = buildDeterministicCFOBriefing("");

    expect(briefing.confidenceScore).toBe(0.75);
    expect(briefing.executiveSummary).toContain("deterministic review");
  });

  test("uses a higher deterministic confidence score when summary is provided", () => {
    const briefing = buildDeterministicCFOBriefing("Verified deterministic finance summary.");

    expect(briefing.confidenceScore).toBe(0.86);
  });

  test("falls back to deterministic briefing when OpenAI API key is not configured", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");

    const briefing = await generateCFOBriefing("No external model should be called.");

    expect(briefing.executiveSummary).toContain("deterministic review");
    expect(briefing.projectMarginRisks[0]?.riskLevel).toBe("medium");
    expect(briefing.overdueReceivables[0]?.riskLevel).toBe("high");
  });
});
