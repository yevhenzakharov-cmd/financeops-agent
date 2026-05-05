import type { AgentAction, ActionDecision } from "../domain/schemas.js";

export function evaluateActionPolicy(action: AgentAction): ActionDecision {
  switch (action.riskLevel) {
    case "safe":
      return {
        actionId: action.id,
        decision: "allowed",
        reason: "Action classified as safe."
      };

    case "warning":
      return {
        actionId: action.id,
        decision: "requires_review",
        reason: "Action requires human review due to risk level warning."
      };

    case "blocked":
      return {
        actionId: action.id,
        decision: "denied",
        reason: "Action blocked by policy due to high risk."
      };

    default:
      return {
        actionId: action.id,
        decision: "denied",
        reason: "Unknown risk level. Denied by default."
      };
  }
}
