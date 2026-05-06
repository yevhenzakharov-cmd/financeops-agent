import type { ClientImplementationContract } from "./client-implementation-contract.js";

export const mockGameStudioClient: ClientImplementationContract = {
  profile: {
    id: "client-game-studio-001",
    name: "Mock Game Studio Finance Team",
    industry: "game_studio",
    accountingDepartmentSize: "small_team",
    baseCurrency: "USD",
    timezone: "UTC"
  },
  inputs: [
    {
      id: "input-invoices",
      name: "Invoice Export",
      type: "csv",
      required: true,
      description: "Client-provided invoice export containing invoice status, customer, amount, due date, and paid date.",
      expectedFields: ["invoiceId", "customerId", "amount", "currency", "status", "issuedAt", "dueAt", "paidAt"]
    },
    {
      id: "input-bank-transactions",
      name: "Bank Transaction Export",
      type: "csv",
      required: true,
      description: "Client-provided bank transaction export used for cash matching and reconciliation review.",
      expectedFields: ["transactionId", "amount", "currency", "postedAt", "counterparty", "reference"]
    }
  ],
  outputs: [
    {
      id: "output-cfo-briefing",
      name: "CFO Briefing",
      type: "cfo_briefing",
      description: "Executive finance summary with risks, recommended actions, and confidence score.",
      requiredFields: ["executiveSummary", "riskFindings", "recommendedActions", "confidenceScore"]
    },
    {
      id: "output-approval-queue",
      name: "Approval Queue",
      type: "approval_queue",
      description: "Human review queue for high-risk exceptions and payment-related recommendations.",
      requiredFields: ["approvalId", "role", "status", "actionType", "reason"]
    }
  ],
  tasks: [
    {
      id: "task-receivables-review",
      task: "receivables_review",
      description: "Find overdue invoices, collection risk, and cash recovery opportunities.",
      requiredInputIds: ["input-invoices", "input-bank-transactions"],
      desiredOutputIds: ["output-cfo-briefing", "output-approval-queue"]
    },
    {
      id: "task-reconciliation-review",
      task: "reconciliation_review",
      description: "Detect missing payments, orphan transactions, and unresolved matching issues.",
      requiredInputIds: ["input-invoices", "input-bank-transactions"],
      desiredOutputIds: ["output-cfo-briefing", "output-approval-queue"]
    }
  ],
  governance: {
    approvalStrictness: "high",
    requireHumanApprovalForPayments: true,
    requireHumanApprovalForHighRiskFindings: true,
    maxAutoApprovalAmount: 0,
    escalationRoles: ["controller", "cfo"]
  }
};
