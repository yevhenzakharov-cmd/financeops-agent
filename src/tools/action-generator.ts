import type {
  FinanceException,
  AgentAction
} from "../domain/schemas.js";

let actionCounter = 0;

function generateActionId(): string {
  actionCounter += 1;
  return `act-${actionCounter.toString().padStart(3, "0")}`;
}

export function generateAgentActions(
  exceptions: FinanceException[]
): AgentAction[] {
  return exceptions.map((ex) => {
    return {
      id: generateActionId(),
      exceptionId: ex.id,
      actionType: `resolve_${ex.category}`,
      riskLevel: ex.recommendedActionType,
      description: `Proposed action to address ${ex.category} from ${ex.source}.`
    };
  });
}
