import type { ClientRequirementsIntake } from "./client-requirements-intake.js";

export const mockGameStudioRequirementsIntake: ClientRequirementsIntake = {
  clientName: "Mock Game Studio Finance Team",
  industryNotes: "Game studio with project-based revenue, vendor payments, invoices, and milestone-based production spend.",
  currentAccountingPain: "Manual review of overdue invoices, orphan bank transactions, and project margin risk takes too long.",
  inputTypesAvailable: ["csv", "bank_export", "payment_processor_export"],
  desiredOutputs: ["cfo_briefing", "approval_queue", "dashboard_payload"],
  priorityTasks: ["receivables_review", "reconciliation_review", "payment_approval_review"],
  approvalRequirements: [
    "Human approval required for payment execution.",
    "High-risk findings must be escalated to controller or CFO.",
    "No automatic payment approval in demo mode."
  ],
  implementationNotes: [
    "Start with CSV invoice export and bank transaction export.",
    "Normalize fields into the shared FinanceOps schema.",
    "Deliver first output as dashboard payload and CFO briefing."
  ]
};
