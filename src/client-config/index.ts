export type { ClientImplementationContract } from "./client-implementation-contract.js";
export type { ClientGovernanceContract } from "./client-governance-contract.js";
export type { ClientInputContract, ClientInputType } from "./client-input-contract.js";
export type { ClientOutputContract, ClientOutputType } from "./client-output-contract.js";
export type { ClientProfile, ClientIndustry, AccountingDepartmentSize } from "./client-profile.js";
export type { ClientTaskContract, ClientFinanceTask } from "./client-task-contract.js";

export { mockGameStudioClient } from "./mock-game-studio-client.js";
export { summarizeClientImplementationContract } from "./client-contract-summary.js";
export { validateClientImplementationContract } from "./client-contract-validator.js";

export type { ClientDesiredOutputSpec, ClientOutputFormat } from "./client-output-format.js";
export type { ClientInputFieldMapping, ClientInputMapping } from "./client-input-mapping.js";
export type { ClientAdapterPlan } from "./client-adapter-plan.js";
export { buildClientAdapterPlan } from "./client-input-mapping-service.js";
export { buildClientOutputPlan } from "./client-output-plan-service.js";
export { buildClientImplementationPlan } from "./client-implementation-plan.js";
export { getMockClientContractFixture } from "./client-contract-fixture.js";

export type { ClientRequirementsIntake } from "./client-requirements-intake.js";
export { mockGameStudioRequirementsIntake } from "./mock-client-requirements-intake.js";
export { summarizeClientRequirementsIntake } from "./client-requirements-summary.js";
export { validateClientRequirementsIntake } from "./client-requirements-validator.js";
export { buildClientRequirementsPlan } from "./client-requirements-plan.js";
export { buildClientOnboardingChecklist } from "./client-onboarding-checklist.js";

export type { ClientOnboardingQuestion, ClientQuestionCategory } from "./client-questionnaire.js";
export type { ClientInputFieldCoverage } from "./client-field-coverage.js";
export { buildClientOnboardingQuestionnaire } from "./client-onboarding-questionnaire.js";
export { analyzeClientInputFieldCoverage } from "./client-field-coverage.js";
export { buildClientDataRequestPacket } from "./client-data-request-packet.js";
export { buildClientGovernanceBrief } from "./client-governance-brief.js";
export { evaluateClientImplementationReadiness } from "./client-implementation-readiness.js";
export { getMockClientReadinessFixture } from "./client-readiness-fixture.js";

export * from "./client-questionnaire.js";
export * from "./client-onboarding-questionnaire.js";
export * from "./client-field-coverage.js";
export * from "./client-data-request-packet.js";
export * from "./client-governance-brief.js";
export * from "./client-readiness-fixture.js";
export * from "./client-implementation-readiness.js";

export * from "./client-adapter-blueprint.js";
export * from "./client-output-delivery-plan.js";
export * from "./client-deployment-checklist.js";
export * from "./client-build-package.js";

export * from "./client-acceptance-criteria.js";
export * from "./client-test-scenarios.js";
export * from "./client-demo-script.js";
export * from "./client-acceptance-package.js";

export * from "./client-pilot-scope.js";
export * from "./client-pilot-risk-register.js";
export * from "./client-pilot-success-metrics.js";
export * from "./client-pilot-plan.js";

export * from "./client-production-prerequisites.js";
export * from "./client-production-handoff-risk.js";
export * from "./client-production-handoff-plan.js";
export * from "./client-production-demo-script.js";
export * from "./client-production-handoff-package.js";

export * from "./client-go-live-checklist.js";
export * from "./client-go-live-risk.js";
export * from "./client-go-live-decision.js";
export * from "./client-launch-brief.js";
export * from "./client-go-live-package.js";

export * from "./client-commercial-value-hypothesis.js";
export * from "./client-roi-model.js";
export * from "./client-commercial-readiness-score.js";
export * from "./client-buyer-brief.js";
export * from "./client-objection-handling.js";
export * from "./client-commercial-package.js";

export * from "./client-commercial-summary.js";
export * from "./client-sales-narrative.js";
export * from "./client-demo-agenda.js";
export * from "./client-follow-up-email.js";
export * from "./client-buyer-faq.js";
export * from "./client-sales-handoff-package.js";
export * from "./client-reviewer-audit.js";
export * from "./client-reviewer-dashboard.js";
