import { describe, expect, test } from "vitest";
import {
  buildClientPilotProposalPackage,
  summarizeClientPilotProposalPackage,
  validateClientPilotProposalPackage
} from "../../src/client-config/client-pilot-proposal-package.js";

describe("client pilot proposal package", () => {
  test("builds a pilot proposal package", () => {
    const proposalPackage = buildClientPilotProposalPackage();

    expect(proposalPackage.packageVersion).toBe("client-pilot-proposal-package-v1");
    expect(proposalPackage.status).toBe("production_blocked");
    expect(proposalPackage.sections.length).toBeGreaterThanOrEqual(8);
  });

  test("covers required proposal categories", () => {
    const proposalPackage = buildClientPilotProposalPackage();
    const categories = proposalPackage.sections.map((section) => section.category);

    expect(categories).toContain("buyer_problem");
    expect(categories).toContain("pilot_offer");
    expect(categories).toContain("value_hypothesis");
    expect(categories).toContain("delivery_plan");
    expect(categories).toContain("commercial_terms");
    expect(categories).toContain("risk_boundary");
    expect(categories).toContain("decision_process");
    expect(categories).toContain("next_step");
  });

  test("keeps risk boundary blocked until client-owned controls exist", () => {
    const proposalPackage = buildClientPilotProposalPackage();

    expect(
      proposalPackage.sections.find((section) => section.id === "proposal-risk-boundary")?.status
    ).toBe("blocked_until_client_owned");
  });

  test("summarizes proposal readiness", () => {
    const summary = summarizeClientPilotProposalPackage();

    expect(summary.packageVersion).toBe("client-pilot-proposal-package-v1");
    expect(summary.sectionCount).toBeGreaterThanOrEqual(8);
    expect(summary.clientDecisionInputCount).toBeGreaterThanOrEqual(6);
    expect(summary.proposalExclusionCount).toBeGreaterThanOrEqual(6);
  });

  test("validates the default pilot proposal package", () => {
    const validation = validateClientPilotProposalPackage();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
