import { describe, expect, test } from "vitest";
import {
  buildClientSecurityQuestionnairePackage,
  summarizeClientSecurityQuestionnairePackage,
  validateClientSecurityQuestionnairePackage
} from "../../src/client-config/client-security-questionnaire-package.js";

describe("client security questionnaire package", () => {
  test("builds a security questionnaire package", () => {
    const questionnairePackage = buildClientSecurityQuestionnairePackage();

    expect(questionnairePackage.packageVersion).toBe("client-security-questionnaire-package-v1");
    expect(questionnairePackage.status).toBe("production_blocked");
    expect(questionnairePackage.items.length).toBeGreaterThanOrEqual(10);
  });

  test("covers required security categories", () => {
    const questionnairePackage = buildClientSecurityQuestionnairePackage();
    const categories = questionnairePackage.items.map((item) => item.category);

    expect(categories).toContain("data_handling");
    expect(categories).toContain("authentication");
    expect(categories).toContain("authorization");
    expect(categories).toContain("secrets");
    expect(categories).toContain("audit_logging");
    expect(categories).toContain("monitoring");
    expect(categories).toContain("ai_boundary");
    expect(categories).toContain("payment_boundary");
    expect(categories).toContain("deployment");
    expect(categories).toContain("incident_response");
  });

  test("keeps auth, secrets, and payment boundary blocked until client-owned controls exist", () => {
    const questionnairePackage = buildClientSecurityQuestionnairePackage();

    expect(questionnairePackage.items.find((item) => item.id === "security-authentication")?.status).toBe(
      "blocked_until_client_owned"
    );
    expect(questionnairePackage.items.find((item) => item.id === "security-secrets")?.status).toBe(
      "blocked_until_client_owned"
    );
    expect(questionnairePackage.items.find((item) => item.id === "security-payment-boundary")?.status).toBe(
      "blocked_until_client_owned"
    );
  });

  test("summarizes security questionnaire readiness", () => {
    const summary = summarizeClientSecurityQuestionnairePackage();

    expect(summary.packageVersion).toBe("client-security-questionnaire-package-v1");
    expect(summary.itemCount).toBeGreaterThanOrEqual(10);
    expect(summary.demoAnswerCount).toBeGreaterThanOrEqual(3);
    expect(summary.blockedProductionClaimCount).toBeGreaterThanOrEqual(5);
  });

  test("validates the default security questionnaire package", () => {
    const validation = validateClientSecurityQuestionnairePackage();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
