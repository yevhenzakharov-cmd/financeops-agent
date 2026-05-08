import { describe, expect, test } from "vitest";
import { buildDeterministicCFOBriefing } from "../src/agent/cfo-briefing.js";

describe("CFO briefing fallback", () => {
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
});
