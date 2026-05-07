export interface ClientGovernanceRule {
  id: string;
  rule: string;
  enforcement: "suggest_only" | "requires_human_approval" | "blocked";
  reason: string;
}

export interface ClientGovernanceBrief {
  title: string;
  summary: string;
  rules: ClientGovernanceRule[];
  defaultExecutionMode: "simulation_only" | "approval_required" | "client_defined";
  humanReviewRequiredFor: string[];
  blockedActions: string[];
}

const fallbackGovernanceRules: ClientGovernanceRule[] = [
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
];

export function buildClientGovernanceBrief(
  rulesOrClient?: ClientGovernanceRule[] | unknown,
  _requirementsIntake?: unknown
): ClientGovernanceBrief {
  const rules = Array.isArray(rulesOrClient)
    ? rulesOrClient
    : fallbackGovernanceRules;

  return {
    title: "Client Governance Brief",
    summary:
      "Defines what the FinanceOps agent may suggest, what requires review, and what is blocked until the client explicitly approves the workflow.",
    rules,
    defaultExecutionMode: "approval_required",
    humanReviewRequiredFor: rules
      .filter((rule) => rule.enforcement === "requires_human_approval")
      .map((rule) => rule.rule),
    blockedActions: rules
      .filter((rule) => rule.enforcement === "blocked")
      .map((rule) => rule.rule)
  };
}
