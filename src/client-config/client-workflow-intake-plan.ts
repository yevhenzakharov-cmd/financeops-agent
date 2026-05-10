import type { ClientRequirementsIntake } from "./client-requirements-intake.js";
import type { AccountingTaskTemplateId } from "../security/accounting-task-registry.js";
import { validateClientRequirementsIntake } from "./client-requirements-validator.js";
import {
  routeAccountingWorkflowIntent,
  type AccountingWorkflowIntent,
  type AccountingWorkflowRoute
} from "../security/accounting-workflow-router.js";

export type ClientWorkflowIntakeStatus =
  | "blocked_missing_requirements"
  | "ready_for_client_mapping"
  | "approval_or_review_required"
  | "ready_for_demo_routing";

export interface ClientWorkflowIntakePlan {
  clientName: string;
  status: ClientWorkflowIntakeStatus;
  validation: ReturnType<typeof validateClientRequirementsIntake>;
  workflowIntentCount: number;
  routedWorkflowCount: number;
  workflowIntents: AccountingWorkflowIntent[];
  routedWorkflows: AccountingWorkflowRoute[];
  blockers: string[];
  requiredClientQuestions: string[];
  recommendedImplementationSteps: string[];
}

function humanizeTask(task: string): string {
  return task.replace(/[_-]/g, " ");
}

function inferTaskKeywords(task: string, intake: ClientRequirementsIntake): string[] {
  const taskText = humanizeTask(task);
  const keywords = [taskText, intake.currentAccountingPain, intake.industryNotes];

  if (taskText.includes("payment") || taskText.includes("payable")) {
    keywords.push("payment", "vendor payment", "approval", "money movement");
  }

  if (taskText.includes("journal") || taskText.includes("ledger") || taskText.includes("posting")) {
    keywords.push("journal", "entry", "posting", "ledger");
  }

  if (taskText.includes("tax") || taskText.includes("vat") || taskText.includes("sales tax")) {
    keywords.push("tax calculation", "tax rate", "professional review");
  }

  if (taskText.includes("bank") || taskText.includes("reconciliation")) {
    keywords.push("bank", "reconciliation", "orphan", "matched");
  }

  if (taskText.includes("receivable") || taskText.includes("invoice") || taskText.includes("overdue")) {
    keywords.push("receivable", "invoice", "aging", "overdue");
  }

  if (taskText.includes("margin") || taskText.includes("profit")) {
    keywords.push("margin", "project", "profitability");
  }

  if (taskText.includes("budget") || taskText.includes("variance") || taskText.includes("burn")) {
    keywords.push("budget", "variance", "burn", "spend");
  }

  return Array.from(new Set(keywords.filter((keyword) => keyword.trim().length > 0)));
}

function inferTemplateId(taskText: string): AccountingTaskTemplateId | undefined {
  if (taskText.includes("writeback") || taskText.includes("sync") || taskText.includes("database")) {
    return "external_writeback_dry_run";
  }

  if (taskText.includes("payment") || taskText.includes("payable")) {
    return "payment_approval_preparation";
  }

  if (taskText.includes("journal") || taskText.includes("ledger") || taskText.includes("posting")) {
    return "journal_entry_draft_preparation";
  }

  if (taskText.includes("tax advice") || taskText.includes("legal")) {
    return "tax_or_legal_review_packet";
  }

  if (taskText.includes("tax") || taskText.includes("vat") || taskText.includes("sales tax")) {
    return "tax_calculation_packet";
  }

  if (taskText.includes("bank") || taskText.includes("reconciliation")) {
    return "bank_reconciliation_review";
  }

  if (taskText.includes("receivable") || taskText.includes("invoice") || taskText.includes("overdue")) {
    return "receivables_aging_review";
  }

  if (taskText.includes("margin") || taskText.includes("profit")) {
    return "project_margin_review";
  }

  if (taskText.includes("budget") || taskText.includes("variance") || taskText.includes("burn")) {
    return "budget_variance_review";
  }

  return undefined;
}

function inferOutputDestination(intake: ClientRequirementsIntake): string {
  if (intake.desiredOutputs.length === 0) {
    return "client-defined output destination";
  }

  return intake.desiredOutputs.map((output) => String(output).replace(/[_-]/g, " ")).join(", ");
}

function buildWorkflowIntentFromTask(
  task: string,
  intake: ClientRequirementsIntake,
  index: number
): AccountingWorkflowIntent {
  const taskText = humanizeTask(task);
  const hasRequiredInputs = intake.inputTypesAvailable.length > 0;
  const requestedOutcome = [
    `Route the client priority task "${taskText}" into a controlled FinanceOps workflow.`,
    `Current pain: ${intake.currentAccountingPain}`,
    `Desired outputs: ${inferOutputDestination(intake)}`
  ].join(" ");

  const intent: AccountingWorkflowIntent = {
    id: `client-workflow-${index + 1}`,
    title: taskText,
    requestedOutcome,
    keywords: inferTaskKeywords(task, intake),
    hasRequiredInputs,
    clientOutputDestination: inferOutputDestination(intake)
  };

  const templateId = inferTemplateId(taskText);

  if (templateId !== undefined) {
    intent.templateId = templateId;
  }

  if (taskText.includes("payment") || taskText.includes("payable")) {
    intent.involvesMoneyMovement = true;
    intent.requestedAutonomy = "draft_only";
  }

  if (taskText.includes("journal") || taskText.includes("ledger") || taskText.includes("posting")) {
    intent.involvesAccountingPosting = true;
    intent.requestedAutonomy = "draft_only";
  }

  if (taskText.includes("tax advice") || taskText.includes("legal")) {
    intent.involvesTaxOrLegalConclusion = true;
    intent.requestedAutonomy = "draft_only";
  }

  if (taskText.includes("writeback") || taskText.includes("sync") || taskText.includes("database")) {
    intent.involvesExternalSystem = true;
    intent.requestedAutonomy = "simulate";
  }

  return intent;
}

function buildPlanStatus(
  validation: ReturnType<typeof validateClientRequirementsIntake>,
  routedWorkflows: AccountingWorkflowRoute[]
): ClientWorkflowIntakeStatus {
  if (!validation.valid) {
    return "blocked_missing_requirements";
  }

  if (routedWorkflows.some((route) => route.routingLane === "blocked")) {
    return "blocked_missing_requirements";
  }

  if (routedWorkflows.some((route) => route.humanReviewRequired)) {
    return "approval_or_review_required";
  }

  if (routedWorkflows.some((route) => route.readiness === "needs_client_mapping")) {
    return "ready_for_client_mapping";
  }

  return "ready_for_demo_routing";
}

function buildBlockers(
  validation: ReturnType<typeof validateClientRequirementsIntake>,
  routedWorkflows: AccountingWorkflowRoute[]
): string[] {
  return [
    ...validation.errors,
    ...routedWorkflows.flatMap((route) =>
      route.routingLane === "blocked"
        ? [`Workflow ${route.intentId} is blocked: ${route.controlDecision.reason}`]
        : []
    )
  ];
}

export function buildClientWorkflowIntakePlan(intake: ClientRequirementsIntake): ClientWorkflowIntakePlan {
  const validation = validateClientRequirementsIntake(intake);
  const workflowIntents = intake.priorityTasks.map((task, index) =>
    buildWorkflowIntentFromTask(String(task), intake, index)
  );
  const routedWorkflows = workflowIntents.map((intent) => routeAccountingWorkflowIntent(intent));

  return {
    clientName: intake.clientName,
    status: buildPlanStatus(validation, routedWorkflows),
    validation,
    workflowIntentCount: workflowIntents.length,
    routedWorkflowCount: routedWorkflows.length,
    workflowIntents,
    routedWorkflows,
    blockers: buildBlockers(validation, routedWorkflows),
    requiredClientQuestions: Array.from(
      new Set(routedWorkflows.flatMap((route) => route.nextClientQuestions))
    ),
    recommendedImplementationSteps: [
      "Confirm client input sources and sample rows for every routed workflow.",
      "Map client fields into the normalized FinanceOps schema.",
      "Confirm desired output destinations and owner for each workflow.",
      "Configure approval thresholds, reviewer roles, and blocked autonomy rules.",
      "Run the workflow router against client-shaped mock data before building production adapters."
    ]
  };
}
