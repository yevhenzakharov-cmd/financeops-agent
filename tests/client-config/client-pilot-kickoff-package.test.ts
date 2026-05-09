import { describe, expect, test } from "vitest";
import {
  buildClientPilotKickoffPackage,
  summarizeClientPilotKickoffPackage,
  validateClientPilotKickoffPackage
} from "../../src/client-config/client-pilot-kickoff-package.js";

describe("client pilot kickoff package", () => {
  test("builds a pilot kickoff package", () => {
    const kickoffPackage = buildClientPilotKickoffPackage();

    expect(kickoffPackage.packageVersion).toBe("client-pilot-kickoff-package-v1");
    expect(kickoffPackage.status).toBe("production_blocked");
    expect(kickoffPackage.kickoffSections.length).toBeGreaterThanOrEqual(8);
  });

  test("covers required kickoff categories", () => {
    const kickoffPackage = buildClientPilotKickoffPackage();
    const categories = kickoffPackage.kickoffSections.map((section) => section.category);

    expect(categories).toContain("scope");
    expect(categories).toContain("data");
    expect(categories).toContain("access");
    expect(categories).toContain("approval_policy");
    expect(categories).toContain("evidence");
    expect(categories).toContain("runtime");
    expect(categories).toContain("success_metrics");
    expect(categories).toContain("next_steps");
  });

  test("keeps access and approval policy blocked until client-owned", () => {
    const kickoffPackage = buildClientPilotKickoffPackage();

    expect(kickoffPackage.kickoffSections.find((section) => section.id === "kickoff-access")?.status).toBe(
      "blocked_until_client_owned"
    );
    expect(
      kickoffPackage.kickoffSections.find((section) => section.id === "kickoff-approval-policy")?.status
    ).toBe("blocked_until_client_owned");
  });

  test("summarizes kickoff readiness", () => {
    const summary = summarizeClientPilotKickoffPackage();

    expect(summary.packageVersion).toBe("client-pilot-kickoff-package-v1");
    expect(summary.sectionCount).toBeGreaterThanOrEqual(8);
    expect(summary.preworkItemCount).toBeGreaterThanOrEqual(5);
    expect(summary.successCriteriaCount).toBeGreaterThanOrEqual(4);
  });

  test("validates the default pilot kickoff package", () => {
    const validation = validateClientPilotKickoffPackage();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
