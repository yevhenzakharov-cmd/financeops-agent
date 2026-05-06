import type { ClientRequirementsIntake } from "./client-requirements-intake.js";

export function summarizeClientRequirementsIntake(intake: ClientRequirementsIntake) {
  return {
    clientName: intake.clientName,
    inputTypeCount: intake.inputTypesAvailable.length,
    desiredOutputCount: intake.desiredOutputs.length,
    priorityTaskCount: intake.priorityTasks.length,
    approvalRequirementCount: intake.approvalRequirements.length,
    hasImplementationNotes: intake.implementationNotes.length > 0,
    primaryPain: intake.currentAccountingPain
  };
}
