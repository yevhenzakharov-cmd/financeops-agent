import { describe, expect, test } from "vitest";
import {
  buildDemoAccountingWorkflowRoutes,
  routeAccountingWorkflowIntent,
  selectAccountingTaskTemplate
} from "../../src/security/accounting-workflow-router.js";

describe("accounting workflow router", () => {
  test("selects a payment approval template from a client workflow intent", () => {
    const template = selectAccountingTaskTemplate({
      id: "intent-payment",
      title: "Prepare vendor payment approval",
      requestedOutcome: "Validate the invoice and prepare payment approval for the CFO.",
      keywords: ["vendor payment", "approval"]
    });

    expect(template.id).toBe("payment_approval_preparation");
  });

  test("routes payment preparation into the approval queue", () => {
    const route = routeAccountingWorkflowIntent({
      id: "intent-payment",
      title: "Prepare vendor payment approval",
      requestedOutcome: "Prepare payment package before money movement.",
      keywords: ["vendor payment", "money movement"]
    });

    expect(route.selectedTemplate.id).toBe("payment_approval_preparation");
    expect(route.routingLane).toBe("approval_queue");
    expect(route.readiness).toBe("approval_gated");
    expect(route.controlDecision.requiredReviewerRole).toBe("cfo");
    expect(route.blockedWork).toContain("Send payment without approval");
  });

  test("keeps external writeback in dry-run simulation", () => {
    const route = routeAccountingWorkflowIntent({
      id: "intent-writeback",
      title: "Sync approved record to ERP",
      requestedOutcome: "Prepare a writeback payload for a client external system.",
      keywords: ["writeback", "erp", "external system"]
    });

    expect(route.selectedTemplate.id).toBe("external_writeback_dry_run");
    expect(route.routingLane).toBe("simulation_dry_run");
    expect(route.readiness).toBe("simulation_only");
    expect(route.allowedNextSteps).toContain("Prepare typed writeback payload");
  });

  test("blocks workflow routing when client inputs are missing", () => {
    const route = routeAccountingWorkflowIntent({
      id: "intent-missing-fields",
      title: "Calculate receivables aging",
      requestedOutcome: "Calculate invoice aging but required fields are missing.",
      templateId: "receivables_aging_review",
      hasRequiredInputs: false
    });

    expect(route.routingLane).toBe("blocked");
    expect(route.readiness).toBe("blocked_missing_client_inputs");
    expect(route.nextClientQuestions).toContain(
      "Provide missing fields, sample rows, and mapping notes before the workflow can run."
    );
  });

  test("routes journal entry preparation to controller approval", () => {
    const route = routeAccountingWorkflowIntent({
      id: "intent-journal-entry",
      title: "Draft journal entry",
      requestedOutcome: "Prepare a journal entry draft with evidence.",
      keywords: ["journal", "entry", "posting"]
    });

    expect(route.selectedTemplate.id).toBe("journal_entry_draft_preparation");
    expect(route.routingLane).toBe("approval_queue");
    expect(route.controlDecision.requiredReviewerRole).toBe("controller");
  });

  test("routes tax or legal conclusions to professional review", () => {
    const route = routeAccountingWorkflowIntent({
      id: "intent-tax",
      title: "Prepare tax conclusion",
      requestedOutcome: "Prepare a tax advice packet for professional review.",
      keywords: ["tax advice", "professional review"]
    });

    expect(route.selectedTemplate.id).toBe("tax_or_legal_review_packet");
    expect(route.routingLane).toBe("professional_review_packet");
    expect(route.readiness).toBe("requires_professional_review");
  });

  test("falls back to CFO exception briefing for unclear read-only work", () => {
    const route = routeAccountingWorkflowIntent({
      id: "intent-unknown",
      title: "General finance summary",
      requestedOutcome: "Create a high-level executive summary."
    });

    expect(route.selectedTemplate.id).toBe("cfo_exception_briefing");
    expect(route.routingLane).toBe("read_only_review");
  });

  test("builds demo workflow routing examples", () => {
    const routes = buildDemoAccountingWorkflowRoutes();

    expect(routes.length).toBe(3);
    expect(routes.map((route) => route.routingLane)).toContain("approval_queue");
    expect(routes.map((route) => route.routingLane)).toContain("simulation_dry_run");
    expect(routes.map((route) => route.routingLane)).toContain("read_only_review");
  });
});
