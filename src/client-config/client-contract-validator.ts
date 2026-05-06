import type { ClientImplementationContract } from "./client-implementation-contract.js";

export interface ClientContractValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateClientImplementationContract(
  contract: ClientImplementationContract
): ClientContractValidationResult {
  const errors: string[] = [];

  const inputIds = new Set(contract.inputs.map((input) => input.id));
  const outputIds = new Set(contract.outputs.map((output) => output.id));

  for (const task of contract.tasks) {
    for (const inputId of task.requiredInputIds) {
      if (!inputIds.has(inputId)) {
        errors.push(`Task ${task.id} references missing input ${inputId}.`);
      }
    }

    for (const outputId of task.desiredOutputIds) {
      if (!outputIds.has(outputId)) {
        errors.push(`Task ${task.id} references missing output ${outputId}.`);
      }
    }
  }

  if (contract.governance.requireHumanApprovalForPayments && contract.governance.escalationRoles.length === 0) {
    errors.push("Payment approval is required, but no escalation roles are configured.");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
