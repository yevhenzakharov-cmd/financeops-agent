import { describe, expect, test } from "vitest";
import {
  buildAccountingTaskRequestFromTemplate,
  evaluateAccountingTaskTemplate,
  getAccountingTaskTemplate,
  listAccountingTaskTemplates
} from "../../src/security/accounting-task-registry.js";

describe("accounting task registry", () => {
  test("lists reusable accounting department task templates", () => {
    const templates = listAccountingTaskTemplates();

    expect(templates.length).toBeGreaterThanOrEqual(10);
    expect(templates.map((template) => template.id)).toContain("payment_approval_preparation");
    expect(templates.map((template) => template.id)).toContain("journal_entry_draft_preparation");
    expect(templates.map((template) => template.id)).toContain("external_writeback_dry_run");
  });

  test("returns defensive copies of templates", () => {
    const firstRead = listAccountingTaskTemplates();
    firstRead[0].title = "Mutated title";

    const secondRead = listAccountingTaskTemplates();

    expect(secondRead[0].title).not.toBe("Mutated title");
  });

  test("builds a request from a deterministic calculation template", () => {
    const request = buildAccountingTaskRequestFromTemplate("receivables_aging_review");

    expect(request.category).toBe("deterministic_calculation");
    expect(request.hasRequiredInputs).toBe(true);
    expect(request.involvesMoneyMovement).toBe(false);
    expect(request.involvesAccountingPosting).toBe(false);
  });

  test("routes payment preparation through CFO approval", () => {
    const decision = evaluateAccountingTaskTemplate("payment_approval_preparation");

    expect(decision.decision).toBe("approval_required");
    expect(decision.requiredReviewerRole).toBe("cfo");
    expect(decision.blockedSystemWork).toContain("Send payment without approval");
  });

  test("routes journal entry drafts through controller approval", () => {
    const decision = evaluateAccountingTaskTemplate("journal_entry_draft_preparation");

    expect(decision.decision).toBe("approval_required");
    expect(decision.requiredReviewerRole).toBe("controller");
    expect(decision.blockedSystemWork).toContain("Post journal entry autonomously");
  });

  test("routes tax or legal review packets to professional review", () => {
    const decision = evaluateAccountingTaskTemplate("tax_or_legal_review_packet");

    expect(decision.decision).toBe("professional_review_required");
    expect(decision.requiresHumanReview).toBe(true);
    expect(decision.blockedSystemWork).toContain("Issue final tax or legal advice");
  });

  test("keeps external writeback templates in simulation mode", () => {
    const decision = evaluateAccountingTaskTemplate("external_writeback_dry_run");

    expect(decision.decision).toBe("simulation_only");
    expect(decision.allowedSystemWork).toContain("Prepare typed writeback payload");
    expect(decision.blockedSystemWork).toContain("Write to external system without approved adapter");
  });

  test("allows client-specific overrides while keeping control evaluation", () => {
    const request = buildAccountingTaskRequestFromTemplate("cfo_exception_briefing", {
      riskLevel: "medium"
    });

    expect(request.riskLevel).toBe("medium");
    expect(request.category).toBe("read_only_analysis");
  });

  test("returns undefined for unknown template lookup", () => {
    const template = getAccountingTaskTemplate("missing_template" as never);

    expect(template).toBeUndefined();
  });
});
