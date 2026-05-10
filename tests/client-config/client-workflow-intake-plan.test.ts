import { describe, expect, test } from "vitest";
import { buildClientWorkflowIntakePlan } from "../../src/client-config/client-workflow-intake-plan.js";
import type { ClientRequirementsIntake } from "../../src/client-config/client-requirements-intake.js";

const baseIntake: ClientRequirementsIntake = {
  clientName: "Mock Client Finance Team",
  industryNotes: "B2B services company with manual accounting operations.",
  currentAccountingPain: "Manual review of overdue invoices, orphan bank transactions, and payment approvals takes too long.",
  inputTypesAvailable: ["csv", "bank_export"],
  desiredOutputs: ["approval_queue", "cfo_briefing"],
  priorityTasks: ["overdue_invoice_detection", "payment_approval_request", "bank_reconciliation"],
  approvalRequirements: ["CFO approval required before money movement."],
  implementationNotes: ["Start with client-shaped mock data."]
};

describe("client workflow intake plan", () => {
  test("builds workflow intents from client requirements", () => {
    const plan = buildClientWorkflowIntakePlan(baseIntake);

    expect(plan.clientName).toBe("Mock Client Finance Team");
    expect(plan.workflowIntentCount).toBe(3);
    expect(plan.routedWorkflowCount).toBe(3);
    expect(plan.workflowIntents[0]?.title).toBe("overdue invoice detection");
    expect(plan.workflowIntents[1]?.keywords).toContain("vendor payment");
  });

  test("routes payment work into approval or review status", () => {
    const plan = buildClientWorkflowIntakePlan(baseIntake);

    expect(plan.status).toBe("approval_or_review_required");
    expect(plan.routedWorkflows.some((route) => route.routingLane === "approval_queue")).toBe(true);
    expect(
      plan.routedWorkflows.some((route) => route.selectedTemplate.id === "payment_approval_preparation")
    ).toBe(true);
  });

  test("keeps required client questions for implementation discovery", () => {
    const plan = buildClientWorkflowIntakePlan(baseIntake);

    expect(plan.requiredClientQuestions.length).toBeGreaterThan(0);
    expect(
      plan.requiredClientQuestions.some((question) =>
        question.includes("Confirm the real input source")
      )
    ).toBe(true);
  });

  test("blocks incomplete client intake before implementation", () => {
    const incompleteIntake: ClientRequirementsIntake = {
      ...baseIntake,
      inputTypesAvailable: []
    };

    const plan = buildClientWorkflowIntakePlan(incompleteIntake);

    expect(plan.status).toBe("blocked_missing_requirements");
    expect(plan.validation.valid).toBe(false);
    expect(plan.blockers).toContain("At least one input type is required.");
  });

  test("routes external writeback requests to simulation", () => {
    const intake: ClientRequirementsIntake = {
      ...baseIntake,
      priorityTasks: ["approved_status_writeback_to_database"]
    };

    const plan = buildClientWorkflowIntakePlan(intake);

    expect(plan.routedWorkflows[0]?.selectedTemplate.id).toBe("external_writeback_dry_run");
    expect(plan.routedWorkflows[0]?.routingLane).toBe("simulation_dry_run");
  });
});
