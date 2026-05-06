import type { ClientRequirementsIntake } from "./client-requirements-intake.js";
import { summarizeClientRequirementsIntake } from "./client-requirements-summary.js";
import { validateClientRequirementsIntake } from "./client-requirements-validator.js";

export function buildClientRequirementsPlan(intake: ClientRequirementsIntake) {
  return {
    summary: summarizeClientRequirementsIntake(intake),
    validation: validateClientRequirementsIntake(intake),
    recommendedNextSteps: [
      "Confirm exact input files and sample rows.",
      "Map client fields into normalized FinanceOps schema.",
      "Confirm desired output format and audience.",
      "Configure governance and approval policy.",
      "Run demo pipeline with client-shaped mock data."
    ]
  };
}
