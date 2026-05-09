export type AccountingTaskCategory =
  | "read_only_analysis"
  | "deterministic_calculation"
  | "approval_preparation"
  | "external_writeback"
  | "money_movement"
  | "accounting_posting"
  | "tax_calculation"
  | "tax_or_legal_advice";

export type AccountingTaskDecision =
  | "allowed"
  | "allowed_with_optional_review"
  | "approval_required"
  | "professional_review_required"
  | "simulation_only"
  | "blocked_missing_data"
  | "blocked_unsafe_autonomy";

export type AccountingTaskRiskLevel = "low" | "medium" | "high" | "critical";

export interface AccountingTaskRequest {
  id: string;
  title: string;
  category: AccountingTaskCategory;
  requestedAutonomy: "none" | "draft_only" | "simulate" | "execute";
  riskLevel: AccountingTaskRiskLevel;
  hasRequiredInputs: boolean;
  involvesExternalSystem: boolean;
  involvesMoneyMovement: boolean;
  involvesAccountingPosting: boolean;
  involvesTaxOrLegalConclusion: boolean;
}

export interface AccountingTaskControlDecision {
  taskId: string;
  decision: AccountingTaskDecision;
  requiresHumanReview: boolean;
  requiredReviewerRole:
    | "none"
    | "accountant"
    | "controller"
    | "cfo"
    | "tax_professional"
    | "legal_professional";
  reason: string;
  allowedSystemWork: string[];
  blockedSystemWork: string[];
}

export function evaluateAccountingTaskControl(
  task: AccountingTaskRequest
): AccountingTaskControlDecision {
  if (!task.hasRequiredInputs) {
    return {
      taskId: task.id,
      decision: "blocked_missing_data",
      requiresHumanReview: true,
      requiredReviewerRole: "accountant",
      reason: "Required inputs are missing. The task must be blocked until the client provides the necessary data.",
      allowedSystemWork: [
        "Prepare a missing-data request",
        "Explain which fields are required",
        "Create a blocked-task audit record"
      ],
      blockedSystemWork: [
        "Run final calculations",
        "Prepare final outputs",
        "Execute or write back results"
      ]
    };
  }

  if (task.involvesTaxOrLegalConclusion || task.category === "tax_or_legal_advice") {
    return {
      taskId: task.id,
      decision: "professional_review_required",
      requiresHumanReview: true,
      requiredReviewerRole: task.category === "tax_or_legal_advice" ? "tax_professional" : "legal_professional",
      reason: "Tax or legal conclusions require professional review. The system may prepare evidence and draft analysis only.",
      allowedSystemWork: [
        "Prepare supporting evidence",
        "Run configured deterministic checks",
        "Draft a review packet"
      ],
      blockedSystemWork: [
        "Issue final tax or legal advice",
        "Submit filings autonomously",
        "Mark professional review as complete"
      ]
    };
  }

  if (task.involvesMoneyMovement || task.category === "money_movement") {
    return {
      taskId: task.id,
      decision: "approval_required",
      requiresHumanReview: true,
      requiredReviewerRole: "cfo",
      reason: "Money movement may be prepared and validated by the system, but final payment approval requires a human finance owner.",
      allowedSystemWork: [
        "Validate payment data",
        "Prepare payment approval package",
        "Simulate the payment outcome",
        "Create an approval queue item"
      ],
      blockedSystemWork: [
        "Send payment without approval",
        "Override approval thresholds",
        "Treat AI output as payment authorization"
      ]
    };
  }

  if (task.involvesAccountingPosting || task.category === "accounting_posting") {
    return {
      taskId: task.id,
      decision: "approval_required",
      requiresHumanReview: true,
      requiredReviewerRole: "controller",
      reason: "Accounting postings may be drafted with supporting evidence, but posting requires human accounting approval.",
      allowedSystemWork: [
        "Prepare journal entry draft",
        "Attach supporting evidence",
        "Run deterministic validation checks",
        "Create an approval queue item"
      ],
      blockedSystemWork: [
        "Post journal entry autonomously",
        "Bypass accounting review",
        "Overwrite accounting records without approval"
      ]
    };
  }

  if (task.involvesExternalSystem || task.category === "external_writeback") {
    return {
      taskId: task.id,
      decision: "simulation_only",
      requiresHumanReview: true,
      requiredReviewerRole: "controller",
      reason: "External system writeback must run in simulation until a client-owned adapter, policy, and approval path exist.",
      allowedSystemWork: [
        "Prepare typed writeback payload",
        "Run dry-run validation",
        "Create approval evidence"
      ],
      blockedSystemWork: [
        "Write to external system without approved adapter",
        "Use AI output as direct database input",
        "Skip dry-run validation"
      ]
    };
  }

  if (task.requestedAutonomy === "execute" && task.riskLevel !== "low") {
    return {
      taskId: task.id,
      decision: "blocked_unsafe_autonomy",
      requiresHumanReview: true,
      requiredReviewerRole: "controller",
      reason: "Execution autonomy is blocked for non-low-risk accounting tasks.",
      allowedSystemWork: [
        "Prepare recommendation",
        "Run deterministic checks",
        "Route to human review"
      ],
      blockedSystemWork: [
        "Execute autonomously",
        "Escalate privileges",
        "Treat recommendation as final approval"
      ]
    };
  }

  if (task.category === "deterministic_calculation") {
    return {
      taskId: task.id,
      decision: task.riskLevel === "low" ? "allowed" : "allowed_with_optional_review",
      requiresHumanReview: task.riskLevel !== "low",
      requiredReviewerRole: task.riskLevel === "low" ? "none" : "accountant",
      reason: "Deterministic calculations may run when required inputs are present. Review depends on configured risk level.",
      allowedSystemWork: [
        "Run deterministic calculation",
        "Return calculated result",
        "Store audit evidence"
      ],
      blockedSystemWork: [
        "Let AI invent calculated values",
        "Skip audit evidence"
      ]
    };
  }

  return {
    taskId: task.id,
    decision: "allowed_with_optional_review",
    requiresHumanReview: task.riskLevel !== "low",
    requiredReviewerRole: task.riskLevel === "low" ? "none" : "accountant",
    reason: "Read-only or preparation tasks may run, with review depending on configured risk level.",
    allowedSystemWork: [
      "Prepare analysis",
      "Explain deterministic outputs",
      "Create review-ready artifact"
    ],
    blockedSystemWork: [
      "Perform uncontrolled external actions",
      "Bypass configured review policy"
    ]
  };
}
