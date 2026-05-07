import { buildClientCommercialPackage } from "./client-commercial-package.js";

export interface ClientCommercialSummary {
  title: string;
  generatedAt: string;
  clientName: string;
  status: "not_ready" | "pilot_sellable" | "production_sellable";
  oneLinePitch: string;
  strongestClaims: string[];
  avoidClaims: string[];
  nextBestAction: string;
}

export function buildClientCommercialSummary(): ClientCommercialSummary {
  const commercialPackage = buildClientCommercialPackage();

  const nextBestAction =
    commercialPackage.status === "production_sellable"
      ? "Move into production implementation sales conversation."
      : commercialPackage.status === "pilot_sellable"
        ? "Pitch a controlled pilot with explicit exclusions and client-owned data requirements."
        : "Use internally until blockers are reduced.";

  return {
    title: "Client Commercial Summary",
    generatedAt: new Date().toISOString(),
    clientName: commercialPackage.clientName,
    status: commercialPackage.status,
    oneLinePitch:
      "A governed FinanceOps agent that turns client finance data into traceable exception queues, CFO briefings, and approval-gated action recommendations.",
    strongestClaims: commercialPackage.readinessScore.salesSafeClaims,
    avoidClaims: commercialPackage.readinessScore.claimsToAvoid,
    nextBestAction
  };
}
