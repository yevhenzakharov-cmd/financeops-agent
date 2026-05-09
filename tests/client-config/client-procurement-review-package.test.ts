import { describe, expect, test } from "vitest";
import {
  buildClientProcurementReviewPackage,
  summarizeClientProcurementReviewPackage,
  validateClientProcurementReviewPackage
} from "../../src/client-config/client-procurement-review-package.js";

describe("client procurement review package", () => {
  test("builds a procurement review package", () => {
    const procurementPackage = buildClientProcurementReviewPackage();

    expect(procurementPackage.packageVersion).toBe("client-procurement-review-package-v1");
    expect(procurementPackage.status).toBe("production_blocked");
    expect(procurementPackage.sections.length).toBeGreaterThanOrEqual(8);
  });

  test("covers required procurement categories", () => {
    const procurementPackage = buildClientProcurementReviewPackage();
    const categories = procurementPackage.sections.map((section) => section.category);

    expect(categories).toContain("vendor_intake");
    expect(categories).toContain("security_review");
    expect(categories).toContain("legal_review");
    expect(categories).toContain("data_review");
    expect(categories).toContain("finance_terms");
    expect(categories).toContain("procurement_workflow");
    expect(categories).toContain("pilot_boundary");
    expect(categories).toContain("decision_owner");
  });

  test("keeps security, data, and pilot boundary blocked until client-owned controls exist", () => {
    const procurementPackage = buildClientProcurementReviewPackage();

    expect(
      procurementPackage.sections.find((section) => section.id === "procurement-security-review")?.status
    ).toBe("blocked_until_client_owned");
    expect(
      procurementPackage.sections.find((section) => section.id === "procurement-data-review")?.status
    ).toBe("blocked_until_client_owned");
    expect(
      procurementPackage.sections.find((section) => section.id === "procurement-pilot-boundary")?.status
    ).toBe("blocked_until_client_owned");
  });

  test("summarizes procurement readiness", () => {
    const summary = summarizeClientProcurementReviewPackage();

    expect(summary.packageVersion).toBe("client-procurement-review-package-v1");
    expect(summary.sectionCount).toBeGreaterThanOrEqual(8);
    expect(summary.vendorReviewChecklistCount).toBeGreaterThanOrEqual(5);
    expect(summary.blockedProductionClaimCount).toBeGreaterThanOrEqual(6);
  });

  test("validates the default procurement review package", () => {
    const validation = validateClientProcurementReviewPackage();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
