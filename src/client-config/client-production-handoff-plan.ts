import { buildClientPilotPlan } from "./client-pilot-plan.js";
import { buildClientProductionHandoffRiskReport } from "./client-production-handoff-risk.js";
import { buildClientProductionPrerequisites } from "./client-production-prerequisites.js";

export interface ClientProductionHandoffPlan {
  title: string;
  generatedAt: string;
  status: "blocked" | "ready_with_exclusions" | "ready";
  clientName: string;
  summary: string;
  prerequisites: ReturnType<typeof buildClientProductionPrerequisites>;
  riskReport: ReturnType<typeof buildClientProductionHandoffRiskReport>;
  pilotPlan: ReturnType<typeof buildClientPilotPlan>;
  productionExclusions: string[];
  handoffDecision: string;
}

export function buildClientProductionHandoffPlan(): ClientProductionHandoffPlan {
  const prerequisites = buildClientProductionPrerequisites();
  const riskReport = buildClientProductionHandoffRiskReport();
  const pilotPlan = buildClientPilotPlan();

  const productionExclusions = [
    ...prerequisites.blockedPrerequisites,
    ...riskReport.openHighRisks
  ];

  const status =
    productionExclusions.length > 0
      ? "blocked"
      : prerequisites.clientActionRequired.length > 0
        ? "ready_with_exclusions"
        : "ready";

  const handoffDecision =
    status === "blocked"
      ? "Production handoff is blocked until required client data and high-risk open items are resolved."
      : status === "ready_with_exclusions"
        ? "Production handoff can proceed only with documented exclusions and client-action items."
        : "Production handoff is ready for implementation planning.";

  return {
    title: "Client Production Handoff Plan",
    generatedAt: new Date().toISOString(),
    status,
    clientName: pilotPlan.clientName,
    summary:
      "Production handoff layer that converts pilot results, prerequisites, and risk posture into a production implementation decision.",
    prerequisites,
    riskReport,
    pilotPlan,
    productionExclusions,
    handoffDecision
  };
}
