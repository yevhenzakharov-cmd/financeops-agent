import type { ClientRequirementsIntake } from "./client-requirements-intake.js";

export function buildClientOnboardingChecklist(intake: ClientRequirementsIntake): string[] {
  return [
    `Confirm client name: ${intake.clientName}`,
    "Collect sample input files or API schema.",
    "Confirm required normalized fields.",
    "Confirm desired output audiences and formats.",
    "Confirm approval rules and escalation owners.",
    "Run mock implementation plan before production adapter work."
  ];
}
