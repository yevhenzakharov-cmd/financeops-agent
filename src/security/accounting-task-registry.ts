import {
  evaluateAccountingTaskControl,
  type AccountingTaskCategory,
  type AccountingTaskRequest,
  type AccountingTaskRiskLevel
} from "./accounting-control-framework.js";

export type AccountingTaskTemplateId =
  | "cfo_exception_briefing"
  | "receivables_aging_review"
  | "bank_reconciliation_review"
  | "budget_variance_review"
  | "project_margin_review"
  | "duplicate_invoice_review"
  | "expense_policy_exception_review"
  | "payment_approval_preparation"
  | "journal_entry_draft_preparation"
  | "tax_calculation_packet"
  | "tax_or_legal_review_packet"
  | "external_writeback_dry_run";

export interface AccountingTaskTemplate {
  id: AccountingTaskTemplateId;
  title: string;
  category: AccountingTaskCategory;
  description: string;
  defaultRiskLevel: AccountingTaskRiskLevel;
  defaultRequestedAutonomy: AccountingTaskRequest["requestedAutonomy"];
  typicalInputs: string[];
  expectedOutputs: string[];
  reviewerRole:
    | "none"
    | "accountant"
    | "controller"
    | "cfo"
    | "tax_professional"
    | "legal_professional";
  clientConfigurationNeeded: string[];
  productionBoundary: string;
}

const accountingTaskCatalog: AccountingTaskTemplate[] = [
  {
    id: "cfo_exception_briefing",
    title: "CFO exception briefing",
    category: "read_only_analysis",
    description: "Summarize deterministic exceptions, risks, and approval queue items for executive review.",
    defaultRiskLevel: "low",
    defaultRequestedAutonomy: "draft_only",
    typicalInputs: ["validated exceptions", "risk classifications", "approval queue"],
    expectedOutputs: ["CFO briefing", "review notes", "audit reference"],
    reviewerRole: "none",
    clientConfigurationNeeded: ["briefing audience", "tone", "report sections"],
    productionBoundary: "Read-only briefing may be generated from deterministic outputs. Final business decisions remain client-owned."
  },
  {
    id: "receivables_aging_review",
    title: "Receivables aging review",
    category: "deterministic_calculation",
    description: "Calculate invoice aging, overdue status, and receivables exceptions using code.",
    defaultRiskLevel: "medium",
    defaultRequestedAutonomy: "none",
    typicalInputs: ["invoice id", "customer", "amount", "due date", "paid date"],
    expectedOutputs: ["aging table", "overdue exceptions", "collection review queue"],
    reviewerRole: "accountant",
    clientConfigurationNeeded: ["aging buckets", "materiality threshold", "collection escalation policy"],
    productionBoundary: "The system may calculate aging, but collection decisions and writebacks remain policy-controlled."
  },
  {
    id: "bank_reconciliation_review",
    title: "Bank reconciliation review",
    category: "deterministic_calculation",
    description: "Match invoices, payments, and bank transactions, then flag unmatched or orphan records.",
    defaultRiskLevel: "medium",
    defaultRequestedAutonomy: "none",
    typicalInputs: ["invoice records", "payment records", "bank transactions"],
    expectedOutputs: ["matched items", "missing payments", "orphan bank transactions"],
    reviewerRole: "accountant",
    clientConfigurationNeeded: ["matching keys", "date tolerance", "amount tolerance", "exception rules"],
    productionBoundary: "The system may propose matches and exceptions. Uncertain items require human review."
  },
  {
    id: "budget_variance_review",
    title: "Budget variance review",
    category: "deterministic_calculation",
    description: "Calculate budget burn, expected burn, and variance from client-defined budget rules.",
    defaultRiskLevel: "medium",
    defaultRequestedAutonomy: "none",
    typicalInputs: ["approved budget", "actual spend", "project stage", "expected burn curve"],
    expectedOutputs: ["variance report", "budget risk flag", "approval queue item"],
    reviewerRole: "controller",
    clientConfigurationNeeded: ["budget owner", "expected burn model", "variance thresholds"],
    productionBoundary: "The system may detect variance. Budget reallocations require client approval policy."
  },
  {
    id: "project_margin_review",
    title: "Project margin review",
    category: "deterministic_calculation",
    description: "Calculate project margin and margin risk using revenue and cost data.",
    defaultRiskLevel: "medium",
    defaultRequestedAutonomy: "none",
    typicalInputs: ["project revenue", "project costs", "approved budget", "project code"],
    expectedOutputs: ["margin result", "margin risk classification", "review recommendation"],
    reviewerRole: "controller",
    clientConfigurationNeeded: ["margin thresholds", "cost mapping", "revenue mapping"],
    productionBoundary: "The system may calculate margin. Pricing, staffing, or budget decisions require client approval."
  },
  {
    id: "duplicate_invoice_review",
    title: "Duplicate invoice review",
    category: "deterministic_calculation",
    description: "Detect likely duplicate invoices using deterministic matching rules.",
    defaultRiskLevel: "medium",
    defaultRequestedAutonomy: "none",
    typicalInputs: ["invoice id", "vendor", "amount", "invoice date", "due date"],
    expectedOutputs: ["duplicate candidates", "confidence indicators", "review queue"],
    reviewerRole: "accountant",
    clientConfigurationNeeded: ["duplicate matching rules", "vendor normalization", "amount tolerance"],
    productionBoundary: "The system may flag duplicate candidates. Final duplicate handling requires human review."
  },
  {
    id: "expense_policy_exception_review",
    title: "Expense policy exception review",
    category: "approval_preparation",
    description: "Classify expenses against client policy and prepare exception review packets.",
    defaultRiskLevel: "medium",
    defaultRequestedAutonomy: "draft_only",
    typicalInputs: ["expense record", "employee", "category", "receipt", "policy rule"],
    expectedOutputs: ["policy exception", "approval packet", "audit evidence"],
    reviewerRole: "accountant",
    clientConfigurationNeeded: ["expense policy", "approval thresholds", "exception categories"],
    productionBoundary: "The system may prepare exceptions. Reimbursement approval remains client-owned."
  },
  {
    id: "payment_approval_preparation",
    title: "Payment approval preparation",
    category: "money_movement",
    description: "Prepare payment approval packages with validation and simulation, without autonomous money movement.",
    defaultRiskLevel: "critical",
    defaultRequestedAutonomy: "simulate",
    typicalInputs: ["vendor", "payment amount", "payment method", "invoice", "approval policy"],
    expectedOutputs: ["payment approval package", "simulation result", "CFO approval queue item"],
    reviewerRole: "cfo",
    clientConfigurationNeeded: ["payment rail owner", "approval thresholds", "authorized approvers"],
    productionBoundary: "Money movement may be prepared and simulated. Final payment approval requires a human finance owner."
  },
  {
    id: "journal_entry_draft_preparation",
    title: "Journal entry draft preparation",
    category: "accounting_posting",
    description: "Prepare journal entry drafts with supporting evidence, without autonomous posting.",
    defaultRiskLevel: "high",
    defaultRequestedAutonomy: "draft_only",
    typicalInputs: ["source transaction", "account mapping", "amount", "period", "supporting evidence"],
    expectedOutputs: ["journal entry draft", "supporting evidence", "controller approval item"],
    reviewerRole: "controller",
    clientConfigurationNeeded: ["chart of accounts", "posting rules", "period close policy"],
    productionBoundary: "The system may draft entries. Posting requires client accounting approval."
  },
  {
    id: "tax_calculation_packet",
    title: "Tax calculation packet",
    category: "tax_calculation",
    description: "Run configured tax calculations and prepare assumptions for professional review.",
    defaultRiskLevel: "high",
    defaultRequestedAutonomy: "draft_only",
    typicalInputs: ["taxable base", "configured rate", "jurisdiction", "period", "supporting data"],
    expectedOutputs: ["calculation packet", "assumption list", "professional review item"],
    reviewerRole: "tax_professional",
    clientConfigurationNeeded: ["jurisdiction", "tax rule source", "rate table", "professional reviewer"],
    productionBoundary: "The system may calculate from configured rules. Tax professional review is required before final use."
  },
  {
    id: "tax_or_legal_review_packet",
    title: "Tax or legal review packet",
    category: "tax_or_legal_advice",
    description: "Prepare evidence for tax or legal review without issuing final advice.",
    defaultRiskLevel: "critical",
    defaultRequestedAutonomy: "draft_only",
    typicalInputs: ["supporting documents", "transaction facts", "policy context", "questions for reviewer"],
    expectedOutputs: ["review packet", "evidence summary", "questions for professional review"],
    reviewerRole: "tax_professional",
    clientConfigurationNeeded: ["review owner", "jurisdiction", "professional signoff path"],
    productionBoundary: "The system may prepare evidence only. Final tax or legal conclusions require professional review."
  },
  {
    id: "external_writeback_dry_run",
    title: "External writeback dry run",
    category: "external_writeback",
    description: "Prepare and validate a typed payload for a future client system writeback in simulation mode.",
    defaultRiskLevel: "high",
    defaultRequestedAutonomy: "simulate",
    typicalInputs: ["target system", "record id", "payload", "approval policy", "adapter contract"],
    expectedOutputs: ["typed payload", "dry-run result", "approval evidence"],
    reviewerRole: "controller",
    clientConfigurationNeeded: ["adapter owner", "writeback permissions", "rollback plan", "approval policy"],
    productionBoundary: "External writes remain simulation-only until a client-owned adapter, approval policy, and rollback path exist."
  }
];

export function listAccountingTaskTemplates(): AccountingTaskTemplate[] {
  return accountingTaskCatalog.map((template) => ({ ...template }));
}

export function getAccountingTaskTemplate(
  templateId: AccountingTaskTemplateId
): AccountingTaskTemplate | undefined {
  const template = accountingTaskCatalog.find((item) => item.id === templateId);
  return template ? { ...template } : undefined;
}

export function buildAccountingTaskRequestFromTemplate(
  templateId: AccountingTaskTemplateId,
  overrides: Partial<Omit<AccountingTaskRequest, "id" | "title" | "category">> = {}
): AccountingTaskRequest {
  const template = getAccountingTaskTemplate(templateId);

  if (!template) {
    throw new Error(`Unknown accounting task template: ${templateId}`);
  }

  return {
    id: template.id,
    title: template.title,
    category: template.category,
    requestedAutonomy: overrides.requestedAutonomy ?? template.defaultRequestedAutonomy,
    riskLevel: overrides.riskLevel ?? template.defaultRiskLevel,
    hasRequiredInputs: overrides.hasRequiredInputs ?? true,
    involvesExternalSystem:
      overrides.involvesExternalSystem ?? template.category === "external_writeback",
    involvesMoneyMovement:
      overrides.involvesMoneyMovement ?? template.category === "money_movement",
    involvesAccountingPosting:
      overrides.involvesAccountingPosting ?? template.category === "accounting_posting",
    involvesTaxOrLegalConclusion:
      overrides.involvesTaxOrLegalConclusion ?? template.category === "tax_or_legal_advice"
  };
}

export function evaluateAccountingTaskTemplate(templateId: AccountingTaskTemplateId) {
  return evaluateAccountingTaskControl(buildAccountingTaskRequestFromTemplate(templateId));
}
