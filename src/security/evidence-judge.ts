import type {
  FinanceException,
  AgentAction,
  ActionDecision
} from "../domain/schemas.js";

export type JudgeStatus = "pass" | "warning" | "blocked";

export interface JudgeReport {
  status: JudgeStatus;
  reasons: string[];
  failedChecks: string[];
  evidenceRefs: string[];
  confidence: number;
}

interface JudgeInput {
  exceptions: FinanceException[];
  actions: AgentAction[];
  decisions: ActionDecision[];
}

function containsInjectionPatterns(text: string): boolean {
  const patterns = [
    /ignore previous instructions/i,
    /approve payment/i,
    /send transfer/i,
    /disable security/i,
    /reveal secret/i
  ];

  return patterns.some((pattern) => pattern.test(text));
}

export function runEvidenceJudge(input: JudgeInput): JudgeReport {
  const reasons: string[] = [];
  const failedChecks: string[] = [];
  const evidenceRefs: string[] = [];

  let status: JudgeStatus = "pass";

  /**
   * 1️⃣ Ensure every action has a policy decision
   */
  for (const action of input.actions) {
    const decision = input.decisions.find(
      (d) => d.actionId === action.id
    );

    if (!decision) {
      failedChecks.push(`Missing policy decision for action ${action.id}`);
      status = "blocked";
    }
  }

  /**
   * 2️⃣ Ensure no blocked action is allowed
   */
  for (const decision of input.decisions) {
    if (decision.decision === "allowed") {
      const action = input.actions.find(
        (a) => a.id === decision.actionId
      );

      if (action?.riskLevel === "blocked") {
        failedChecks.push(
          `Blocked action ${action.id} was allowed by policy.`
        );
        status = "blocked";
      }
    }
  }

  /**
   * 3️⃣ Basic injection scan on action descriptions
   */
  for (const action of input.actions) {
    if (containsInjectionPatterns(action.description)) {
      failedChecks.push(
        `Injection pattern detected in action ${action.id}`
      );
      status = "blocked";
    }
  }

  /**
   * 4️⃣ High severity exceptions must not be auto-allowed
   */
  for (const ex of input.exceptions) {
    if (ex.severity === "high") {
      const action = input.actions.find(
        (a) => a.exceptionId === ex.id
      );
      const decision = input.decisions.find(
        (d) => d.actionId === action?.id
      );

      if (decision?.decision === "allowed") {
        failedChecks.push(
          `High severity exception ${ex.id} was auto-allowed.`
        );
        status = "blocked";
      }
    }
  }

  if (failedChecks.length > 0 && status !== "blocked") {
    status = "warning";
  }

  if (status === "pass") {
    reasons.push("All checks passed.");
  } else {
    reasons.push("One or more safety checks failed.");
  }

  return {
    status,
    reasons,
    failedChecks,
    evidenceRefs,
    confidence: status === "pass" ? 0.98 : 0.75
  };
}
