import type { ClientFieldRequirement } from "./client-field-coverage.js";
import type { ClientGovernanceRule } from "./client-governance-brief.js";

export interface ClientReadinessFixture {
  clientName: string;
  scenario: string;
  fieldRequirements: ClientFieldRequirement[];
  governanceRules: ClientGovernanceRule[];
}

export const mockGameStudioReadinessFixture: ClientReadinessFixture = {
  clientName: "Mock Game Studio Finance Team",
  scenario:
    "Client wants an agent that reviews overdue invoices, orphan bank transactions, project margin risk, and payment approval recommendations.",
  fieldRequirements: [
    {
      id: "invoice-id",
      label: "Invoice ID",
      requiredFor: ["overdue_invoice_detection", "ar_exception_queue"],
      status: "provided",
      notes: "Available in invoice export."
    },
    {
      id: "invoice-due-date",
      label: "Invoice due date",
      requiredFor: ["overdue_invoice_detection"],
      status: "provided",
      notes: "Required for aging and overdue classification."
    },
    {
      id: "customer-name",
      label: "Customer name",
      requiredFor: ["cfo_briefing", "collection_escalation"],
      status: "provided",
      notes: "Available in invoice export."
    },
    {
      id: "bank-transaction-id",
      label: "Bank transaction ID",
      requiredFor: ["bank_reconciliation", "orphan_transaction_detection"],
      status: "needs_mapping",
      notes: "Client must confirm whether bank export ID is stable across exports."
    },
    {
      id: "vendor-payment-method",
      label: "Vendor payment method",
      requiredFor: ["payment_approval_request"],
      status: "missing",
      notes: "Needed only if the client wants approved payments prepared from the UI."
    },
    {
      id: "project-code",
      label: "Project code",
      requiredFor: ["project_margin_review"],
      status: "provided",
      notes: "Used to connect spend to game/project profitability."
    },
    {
      id: "slack-channel",
      label: "Slack notification channel",
      requiredFor: ["optional_notifications"],
      status: "optional",
      notes: "Only needed if the client asks for Slack delivery."
    }
  ],
  governanceRules: [
    {
      id: "payment-approval",
      rule: "Payments may be prepared by the agent, but sending money requires human approval.",
      enforcement: "requires_human_approval",
      reason: "Money movement must not be executed blindly by AI."
    },
    {
      id: "accounting-posting",
      rule: "Journal entries may be suggested but not posted without client finance team approval.",
      enforcement: "requires_human_approval",
      reason: "Client owns accounting validation and final posting."
    },
    {
      id: "tax-advice",
      rule: "Agent must not provide final tax/legal advice.",
      enforcement: "blocked",
      reason: "Client must validate tax/legal outcomes with their own professionals."
    }
  ]
};

export function getMockClientReadinessFixture(): ClientReadinessFixture {
  return mockGameStudioReadinessFixture;
}
