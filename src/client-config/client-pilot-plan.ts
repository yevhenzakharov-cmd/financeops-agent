import { buildClientAcceptancePackage } from "./client-acceptance-package.js";
import { buildClientPilotRiskRegister } from "./client-pilot-risk-register.js";
import { buildClientPilotScope } from "./client-pilot-scope.js";
import { buildClientPilotSuccessMetrics } from "./client-pilot-success-metrics.js";

export interface ClientPilotPlan {
  title: string;
  generatedAt: string;
  status: "ready_for_limited_pilot" | "blocked";
  clientName: string;
  summary: string;
  scope: ReturnType<typeof buildClientPilotScope>;
  riskRegister: ReturnType<typeof buildClientPilotRiskRegister>;
  successMetrics: ReturnType<typeof buildClientPilotSuccessMetrics>;
  acceptancePackage: ReturnType<typeof buildClientAcceptancePackage>;
  pilotDecision: string;
}

export function buildClientPilotPlan(): ClientPilotPlan {
  const scope = buildClientPilotScope();
  const riskRegister = buildClientPilotRiskRegister();
  const successMetrics = buildClientPilotSuccessMetrics();
  const acceptancePackage = buildClientAcceptancePackage();

  const status =
    riskRegister.highRiskOpenCount > 0 || acceptancePackage.status === "blocked"
      ? "blocked"
      : "ready_for_limited_pilot";

  const pilotDecision =
    status === "blocked"
      ? "Pilot can be demonstrated with mock data, but client-specific production planning remains blocked until open high-risk items are resolved."
      : "Ready to run a limited pilot using client-shaped mock data and approved workflows.";

  return {
    title: "Client Pilot Plan",
    generatedAt: new Date().toISOString(),
    status,
    clientName: acceptancePackage.clientName,
    summary:
      "Pilot planning layer that turns acceptance results into pilot scope, risk register, success metrics, and decision status.",
    scope,
    riskRegister,
    successMetrics,
    acceptancePackage,
    pilotDecision
  };
}
