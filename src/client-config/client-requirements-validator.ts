import type { ClientRequirementsIntake } from "./client-requirements-intake.js";

export interface ClientRequirementsValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateClientRequirementsIntake(
  intake: ClientRequirementsIntake
): ClientRequirementsValidationResult {
  const errors: string[] = [];

  if (intake.clientName.trim().length === 0) {
    errors.push("Client name is required.");
  }

  if (intake.inputTypesAvailable.length === 0) {
    errors.push("At least one input type is required.");
  }

  if (intake.desiredOutputs.length === 0) {
    errors.push("At least one desired output is required.");
  }

  if (intake.priorityTasks.length === 0) {
    errors.push("At least one priority finance task is required.");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
