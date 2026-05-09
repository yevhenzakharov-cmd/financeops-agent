import { describe, expect, test } from "vitest";
import {
  buildClientEnterpriseRedTeamReport,
  summarizeClientEnterpriseRedTeamReport,
  validateClientEnterpriseRedTeamReport
} from "../../src/client-config/client-enterprise-red-team.js";

describe("client enterprise red-team report", () => {
  test("builds an enterprise red-team report for buyer claims", () => {
    const report = buildClientEnterpriseRedTeamReport();

    expect(report.reportVersion).toBe("client-enterprise-red-team-v1");
    expect(report.findings.length).toBeGreaterThanOrEqual(6);
    expect(report.approvedDemoClaims).toContain(
      "The repo demonstrates a reusable FinanceOps automation core."
    );
  });

  test("blocks production-ready and autonomous money movement claims", () => {
    const report = buildClientEnterpriseRedTeamReport();

    const productionFinding = report.findings.find(
      (finding) => finding.id === "red-team-production-ready-claim"
    );

    const moneyMovementFinding = report.findings.find(
      (finding) => finding.id === "red-team-autonomous-money-movement"
    );

    expect(productionFinding?.severity).toBe("blocked");
    expect(moneyMovementFinding?.severity).toBe("blocked");
  });

  test("requires safe replacement language for every finding", () => {
    const report = buildClientEnterpriseRedTeamReport();

    expect(report.findings.every((finding) => finding.safeReplacement.length > 0)).toBe(true);
  });

  test("summarizes red-team report counts", () => {
    const summary = summarizeClientEnterpriseRedTeamReport();

    expect(summary.reportVersion).toBe("client-enterprise-red-team-v1");
    expect(summary.findingCount).toBeGreaterThanOrEqual(6);
    expect(summary.blockedFindings).toBeGreaterThanOrEqual(3);
    expect(summary.blockedProductionClaimCount).toBeGreaterThanOrEqual(1);
  });

  test("validates the default red-team report", () => {
    const validation = validateClientEnterpriseRedTeamReport();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
