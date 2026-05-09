import { describe, expect, test } from "vitest";
import {
  buildClientPilotSowPackage,
  summarizeClientPilotSowPackage,
  validateClientPilotSowPackage
} from "../../src/client-config/client-pilot-sow-package.js";

describe("client pilot SOW package", () => {
  test("builds a pilot SOW package", () => {
    const sowPackage = buildClientPilotSowPackage();

    expect(sowPackage.packageVersion).toBe("client-pilot-sow-package-v1");
    expect(sowPackage.status).toBe("production_blocked");
    expect(sowPackage.sections.length).toBeGreaterThanOrEqual(8);
  });

  test("covers required SOW categories", () => {
    const sowPackage = buildClientPilotSowPackage();
    const categories = sowPackage.sections.map((section) => section.category);

    expect(categories).toContain("scope");
    expect(categories).toContain("deliverables");
    expect(categories).toContain("client_responsibilities");
    expect(categories).toContain("builder_responsibilities");
    expect(categories).toContain("acceptance_criteria");
    expect(categories).toContain("out_of_scope");
    expect(categories).toContain("risk_boundary");
    expect(categories).toContain("commercial_terms");
  });

  test("keeps production risk boundary blocked until client-owned", () => {
    const sowPackage = buildClientPilotSowPackage();

    expect(sowPackage.sections.find((section) => section.id === "sow-risk-boundary")?.status).toBe(
      "blocked_until_client_owned"
    );
  });

  test("summarizes SOW readiness", () => {
    const summary = summarizeClientPilotSowPackage();

    expect(summary.packageVersion).toBe("client-pilot-sow-package-v1");
    expect(summary.sectionCount).toBeGreaterThanOrEqual(8);
    expect(summary.explicitExclusionCount).toBeGreaterThanOrEqual(5);
    expect(summary.acceptanceCriteriaCount).toBeGreaterThanOrEqual(4);
  });

  test("validates the default pilot SOW package", () => {
    const validation = validateClientPilotSowPackage();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
