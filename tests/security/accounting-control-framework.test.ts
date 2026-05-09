import { describe, expect, test } from "vitest";
import {
  evaluateAccountingTaskControl,
  type AccountingTaskRequest
} from "../../src/security/accounting-control-framework.js";

const baseTask: AccountingTaskRequest = {
  id: "task-001",
  title: "Review overdue invoices",
  category: "read_only_analysis",
  requestedAutonomy: "draft_only",
  riskLevel: "low",
  hasRequiredInputs: true,
  involvesExternalSystem: false,
  involvesMoneyMovement: false,
  involvesAccountingPosting: false,
  involvesTaxOrLegalConclusion: false
};

describe("accounting control framework", () => {
  test("allows low-risk read-only preparation with optional review disabled", () => {
    const decision = evaluateAccountingTaskControl(baseTask);

    expect(decision.decision).toBe("allowed_with_optional_review");
    expect(decision.requiresHumanReview).toBe(false);
    expect(decision.requiredReviewerRole).toBe("none");
  });

  test("blocks tasks with missing required inputs", () => {
    const decision = evaluateAccountingTaskControl({
      ...baseTask,
      hasRequiredInputs: false
    });

    expect(decision.decision).toBe("blocked_missing_data");
    expect(decision.requiresHumanReview).toBe(true);
    expect(decision.blockedSystemWork).toContain("Run final calculations");
  });

  test("requires CFO approval for money movement while allowing preparation", () => {
    const decision = evaluateAccountingTaskControl({
      ...baseTask,
      category: "money_movement",
      title: "Send vendor payment",
      requestedAutonomy: "execute",
      riskLevel: "critical",
      involvesMoneyMovement: true
    });

    expect(decision.decision).toBe("approval_required");
    expect(decision.requiredReviewerRole).toBe("cfo");
    expect(decision.allowedSystemWork).toContain("Prepare payment approval package");
    expect(decision.blockedSystemWork).toContain("Send payment without approval");
  });

  test("requires controller approval for accounting posting drafts", () => {
    const decision = evaluateAccountingTaskControl({
      ...baseTask,
      category: "accounting_posting",
      title: "Post journal entry",
      riskLevel: "high",
      involvesAccountingPosting: true
    });

    expect(decision.decision).toBe("approval_required");
    expect(decision.requiredReviewerRole).toBe("controller");
    expect(decision.allowedSystemWork).toContain("Prepare journal entry draft");
    expect(decision.blockedSystemWork).toContain("Post journal entry autonomously");
  });

  test("requires professional review for tax or legal conclusions", () => {
    const decision = evaluateAccountingTaskControl({
      ...baseTask,
      category: "tax_or_legal_advice",
      title: "Prepare tax conclusion",
      riskLevel: "critical",
      involvesTaxOrLegalConclusion: true
    });

    expect(decision.decision).toBe("professional_review_required");
    expect(decision.requiresHumanReview).toBe(true);
    expect(decision.requiredReviewerRole).toBe("tax_professional");
    expect(decision.blockedSystemWork).toContain("Issue final tax or legal advice");
  });

  test("keeps external writeback in simulation until client controls exist", () => {
    const decision = evaluateAccountingTaskControl({
      ...baseTask,
      category: "external_writeback",
      title: "Update client database",
      riskLevel: "medium",
      involvesExternalSystem: true
    });

    expect(decision.decision).toBe("simulation_only");
    expect(decision.requiredReviewerRole).toBe("controller");
    expect(decision.allowedSystemWork).toContain("Prepare typed writeback payload");
    expect(decision.blockedSystemWork).toContain("Write to external system without approved adapter");
  });

  test("blocks non-low-risk execution autonomy", () => {
    const decision = evaluateAccountingTaskControl({
      ...baseTask,
      category: "approval_preparation",
      requestedAutonomy: "execute",
      riskLevel: "medium"
    });

    expect(decision.decision).toBe("blocked_unsafe_autonomy");
    expect(decision.requiresHumanReview).toBe(true);
  });

  test("allows deterministic calculations while blocking AI invented values", () => {
    const decision = evaluateAccountingTaskControl({
      ...baseTask,
      category: "deterministic_calculation",
      title: "Calculate invoice aging",
      requestedAutonomy: "none",
      riskLevel: "low"
    });

    expect(decision.decision).toBe("allowed");
    expect(decision.allowedSystemWork).toContain("Run deterministic calculation");
    expect(decision.blockedSystemWork).toContain("Let AI invent calculated values");
  });
});
