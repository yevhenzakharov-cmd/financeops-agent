import {
  buildAccountingTaskRequestFromTemplate,
  getAccountingTaskTemplate,
  listAccountingTaskTemplates,
  type AccountingTaskTemplate,
  type AccountingTaskTemplateId
} from "./accounting-task-registry.js";
import {
  evaluateAccountingTaskControl,
  type AccountingTaskControlDecision,
  type AccountingTaskRequest,
  type AccountingTaskRiskLevel
} from "./accounting-control-framework.js";

export type AccountingWorkflowRoutingLane =
  | "read_only_review"
  | "deterministic_finance_core"
  | "approval_queue"
  | "professional_review_packet"
  | "simulation_dry_run"
  | "blocked";

export type AccountingWorkflowReadiness =
  | "ready_for_demo"
  | "needs_client_mapping"
  | "blocked_missing_client_inputs"
  | "requires_professional_review"
  | "approval_gated"
  | "simulation_only";

export interface AccountingWorkflowIntent {
  id: string;
  title: string;
  requestedOutcome: string;
  templateId?: AccountingTaskTemplateId;
  keywords?: string[];
  hasRequiredInputs?: boolean;
  requestedAutonomy?: AccountingTaskRequest["requestedAutonomy"];
  riskLevel?: AccountingTaskRiskLevel;
  involvesExternalSystem?: boolean;
  involvesMoneyMovement?: boolean;
  involvesAccountingPosting?: boolean;
  involvesTaxOrLegalConclusion?: boolean;
  clientOutputDestination?: string;
}

export interface AccountingWorkflowRoute {
  intentId: string;
  selectedTemplate: AccountingTaskTemplate;
  taskRequest: AccountingTaskRequest;
  controlDecision: AccountingTaskControlDecision;
  routingLane: AccountingWorkflowRoutingLane;
  readiness: AccountingWorkflowReadiness;
  humanReviewRequired: boolean;
  requiredClientConfiguration: string[];
  nextClientQuestions: string[];
  allowedNextSteps: string[];
  blockedWork: string[];
}

const templateKeywordMap: Record<AccountingTaskTemplateId, string[]> = {
  cfo_exception_briefing: ["cfo", "briefing", "summary", "exception", "executive"],
  receivables_aging_review: ["receivable", "receivables", "aging", "overdue", "invoice"],
  bank_reconciliation_review: ["bank", "reconciliation", "orphan", "matched", "payment"],
  budget_variance_review: ["budget", "variance", "burn", "spend"],
  project_margin_review: ["margin", "profitability", "project", "cost"],
  duplicate_invoice_review: ["duplicate", "invoice", "vendor duplicate"],
  expense_policy_exception_review: ["expense", "policy", "reimbursement", "receipt"],
  payment_approval_preparation: ["payment", "pay vendor", "vendor payment", "money movement"],
  journal_entry_draft_preparation: ["journal", "entry", "posting", "ledger"],
  tax_calculation_packet: ["tax calculation", "vat", "sales tax", "tax rate"],
  tax_or_legal_review_packet: ["legal", "tax advice", "tax conclusion", "professional review"],
  external_writeback_dry_run: ["writeback", "database", "erp", "external system", "sync"]
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/[_-]/g, " ");
}

function buildSearchText(intent: AccountingWorkflowIntent): string {
  return normalize([intent.title, intent.requestedOutcome, ...(intent.keywords ?? [])].join(" "));
}

function scoreTemplate(template: AccountingTaskTemplate, searchText: string): number {
  const configuredKeywords = templateKeywordMap[template.id];
  const templateText = normalize(
    [
      template.id,
      template.title,
      template.category,
      template.description,
      ...template.typicalInputs,
      ...template.expectedOutputs
    ].join(" ")
  );

  const keywordScore = configuredKeywords.reduce(
    (score, keyword) => score + (searchText.includes(normalize(keyword)) ? 3 : 0),
    0
  );

  const tokenScore = searchText
    .split(/\s+/)
    .filter((token) => token.length > 3)
    .reduce((score, token) => score + (templateText.includes(token) ? 1 : 0), 0);

  return keywordScore + tokenScore;
}

export function selectAccountingTaskTemplate(intent: AccountingWorkflowIntent): AccountingTaskTemplate {
  if (intent.templateId) {
    const template = getAccountingTaskTemplate(intent.templateId);

    if (!template) {
      throw new Error(`Unknown accounting task template: ${intent.templateId}`);
    }

    return template;
  }

  const searchText = buildSearchText(intent);
  const [bestMatch] = listAccountingTaskTemplates()
    .map((template) => ({ template, score: scoreTemplate(template, searchText) }))
    .sort((left, right) => right.score - left.score);

  if (!bestMatch || bestMatch.score === 0) {
    const fallback = getAccountingTaskTemplate("cfo_exception_briefing");

    if (!fallback) {
      throw new Error("Fallback accounting task template is missing.");
    }

    return fallback;
  }

  return bestMatch.template;
}

function buildRoutingLane(
  template: AccountingTaskTemplate,
  decision: AccountingTaskControlDecision
): AccountingWorkflowRoutingLane {
  if (decision.decision === "blocked_missing_data" || decision.decision === "blocked_unsafe_autonomy") {
    return "blocked";
  }

  if (decision.decision === "approval_required") {
    return "approval_queue";
  }

  if (decision.decision === "professional_review_required") {
    return "professional_review_packet";
  }

  if (decision.decision === "simulation_only") {
    return "simulation_dry_run";
  }

  if (template.category === "deterministic_calculation") {
    return "deterministic_finance_core";
  }

  return "read_only_review";
}

function buildReadiness(decision: AccountingTaskControlDecision): AccountingWorkflowReadiness {
  if (decision.decision === "blocked_missing_data" || decision.decision === "blocked_unsafe_autonomy") {
    return "blocked_missing_client_inputs";
  }

  if (decision.decision === "professional_review_required") {
    return "requires_professional_review";
  }

  if (decision.decision === "approval_required") {
    return "approval_gated";
  }

  if (decision.decision === "simulation_only") {
    return "simulation_only";
  }

  if (decision.requiresHumanReview) {
    return "needs_client_mapping";
  }

  return "ready_for_demo";
}

function buildNextClientQuestions(
  intent: AccountingWorkflowIntent,
  template: AccountingTaskTemplate,
  decision: AccountingTaskControlDecision
): string[] {
  const questions = [
    `Confirm the real input source for: ${template.typicalInputs.join(", ")}.`,
    `Confirm the expected output format for: ${template.expectedOutputs.join(", ")}.`
  ];

  if (!intent.clientOutputDestination) {
    questions.push("Confirm where the final output should be delivered or written.");
  }

  if (template.reviewerRole !== "none" || decision.requiresHumanReview) {
    questions.push(`Confirm the reviewer or approver for role: ${decision.requiredReviewerRole}.`);
  }

  if (decision.decision === "approval_required") {
    questions.push("Confirm approval thresholds, escalation owner, and audit evidence requirements.");
  }

  if (decision.decision === "simulation_only") {
    questions.push("Confirm the client-owned adapter, dry-run rules, and rollback path before writeback.");
  }

  if (decision.decision === "professional_review_required") {
    questions.push("Confirm the tax or legal professional who owns final signoff.");
  }

  if (decision.decision === "blocked_missing_data") {
    questions.push("Provide missing fields, sample rows, and mapping notes before the workflow can run.");
  }

  return questions;
}

export function routeAccountingWorkflowIntent(intent: AccountingWorkflowIntent): AccountingWorkflowRoute {
  const selectedTemplate = selectAccountingTaskTemplate(intent);
  const taskOverrides: Partial<Omit<AccountingTaskRequest, "id" | "title" | "category">> = {
    hasRequiredInputs: intent.hasRequiredInputs ?? true
  };

  if (intent.requestedAutonomy !== undefined) {
    taskOverrides.requestedAutonomy = intent.requestedAutonomy;
  }

  if (intent.riskLevel !== undefined) {
    taskOverrides.riskLevel = intent.riskLevel;
  }

  if (intent.involvesExternalSystem !== undefined) {
    taskOverrides.involvesExternalSystem = intent.involvesExternalSystem;
  }

  if (intent.involvesMoneyMovement !== undefined) {
    taskOverrides.involvesMoneyMovement = intent.involvesMoneyMovement;
  }

  if (intent.involvesAccountingPosting !== undefined) {
    taskOverrides.involvesAccountingPosting = intent.involvesAccountingPosting;
  }

  if (intent.involvesTaxOrLegalConclusion !== undefined) {
    taskOverrides.involvesTaxOrLegalConclusion = intent.involvesTaxOrLegalConclusion;
  }

  const taskRequest = buildAccountingTaskRequestFromTemplate(selectedTemplate.id, taskOverrides);

  const controlDecision = evaluateAccountingTaskControl(taskRequest);

  return {
    intentId: intent.id,
    selectedTemplate,
    taskRequest,
    controlDecision,
    routingLane: buildRoutingLane(selectedTemplate, controlDecision),
    readiness: buildReadiness(controlDecision),
    humanReviewRequired: controlDecision.requiresHumanReview,
    requiredClientConfiguration: selectedTemplate.clientConfigurationNeeded,
    nextClientQuestions: buildNextClientQuestions(intent, selectedTemplate, controlDecision),
    allowedNextSteps: controlDecision.allowedSystemWork,
    blockedWork: controlDecision.blockedSystemWork
  };
}

export function buildDemoAccountingWorkflowRoutes(): AccountingWorkflowRoute[] {
  return [
    routeAccountingWorkflowIntent({
      id: "demo-route-payment-approval",
      title: "Prepare vendor payment approval",
      requestedOutcome: "Validate invoice data and prepare a CFO approval package before money movement.",
      keywords: ["vendor payment", "approval", "money movement"],
      clientOutputDestination: "approval queue"
    }),
    routeAccountingWorkflowIntent({
      id: "demo-route-external-writeback",
      title: "Write approved exception status to client ERP",
      requestedOutcome: "Prepare a dry-run payload for an external system writeback.",
      keywords: ["erp", "writeback", "external system"],
      clientOutputDestination: "client ERP"
    }),
    routeAccountingWorkflowIntent({
      id: "demo-route-cfo-briefing",
      title: "Summarize finance exceptions for CFO",
      requestedOutcome: "Create a read-only executive briefing from deterministic finance outputs.",
      keywords: ["cfo", "briefing", "exceptions"],
      clientOutputDestination: "reviewer dashboard"
    })
  ];
}
