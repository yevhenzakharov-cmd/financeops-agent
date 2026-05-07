import {
  buildBaseClientQuestionnaire,
  type ClientQuestionnaire
} from "./client-questionnaire.js";

export interface ClientOnboardingQuestionnaire {
  status: "ready_for_discovery";
  questionnaire: ClientQuestionnaire;
  handoffNote: string;
  completionRule: string;
}

export function buildClientOnboardingQuestionnaire(_client?: unknown, _requirementsIntake?: unknown): ClientOnboardingQuestionnaire {
  return {
    status: "ready_for_discovery",
    questionnaire: buildBaseClientQuestionnaire(),
    handoffNote:
      "Use this before quoting a custom FinanceOps agent implementation. The client's answers define the real inputs, outputs, integrations, rules, and acceptance criteria.",
    completionRule:
      "Do not start implementation until required business context, input sources, desired outputs, and governance boundaries are answered."
  };
}
