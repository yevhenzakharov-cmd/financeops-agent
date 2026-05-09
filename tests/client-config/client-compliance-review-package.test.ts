import { describe, expect, test } from "vitest";
import {
  buildClientComplianceReviewPackage,
  summarizeClientComplianceReviewPackage,
  validateClientComplianceReviewPackage
} from "../../src/client-config/client-compliance-review-package.js";

describe("client compliance review package", () => {
  test("builds a compliance review package", () => {
    const compliancePackage = buildClientComplianceReviewPackage();

    expect(compliancePackage.packageVersion).toBe("client-compliance-review-package-v1");
    expect(compliancePackage.status).toBe("production_blocked");
    expect(compliancePackage.sections.length).toBeGreaterThanOrEqual(10);
  });

  test("covers required compliance categories", () => {
    const compliancePackage = buildClientComplianceReviewPackage();
    const categories = compliancePackage.sections.map((section) => section.category);

    expect(categories).toContain("data_privacy");
    expect(categories).toContain("financial_controls");
    expect(categories).toContain("ai_governance");
    expect(categories).toContain("auditability");
    expect(categories).toContain("payment_controls");
    expect(categories).toContain("accounting_controls");
    expect(categories).toContain("access_controls");
    expect(categories).toContain("retention_policy");
    expect(categories).toContain("vendor_review");
    expect(categories).toContain("production_approval");
  });

  test("keeps payment, accounting, and production approval blocked until client-owned controls exist", () => {
    const compliancePackage = buildClientComplianceReviewPackage();

    expect(
      compliancePackage.sections.find((section) => section.id === "compliance-payment-controls")?.status
    ).toBe("blocked_until_client_owned");
    expect(
      compliancePackage.sections.find((section) => section.id === "compliance-accounting-controls")?.status
    ).toBe("blocked_until_client_owned");
    expect(
      compliancePackage.sections.find((section) => section.id === "compliance-production-approval")?.status
    ).toBe("blocked_until_client_owned");
  });

  test("summarizes compliance readiness", () => {
    const summary = summarizeClientComplianceReviewPackage();

    expect(summary.packageVersion).toBe("client-compliance-review-package-v1");
    expect(summary.sectionCount).toBeGreaterThanOrEqual(10);
    expect(summary.clientComplianceInputCount).toBeGreaterThanOrEqual(6);
    expect(summary.blockedProductionClaimCount).toBeGreaterThanOrEqual(5);
  });

  test("validates the default compliance review package", () => {
    const validation = validateClientComplianceReviewPackage();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
