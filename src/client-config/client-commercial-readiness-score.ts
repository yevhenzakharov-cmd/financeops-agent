import { buildClientGoLiveDecision } from "./client-go-live-decision.js";
import { buildClientProductionHandoffPackage } from "./client-production-handoff-package.js";

export interface ClientCommercialReadinessScore {
  title: string;
  clientName: string;
  score: number;
  status: "not_ready" | "pilot_sellable" | "production_sellable";
  strengths: string[];
  blockers: string[];
  salesSafeClaims: string[];
  claimsToAvoid: string[];
}

export function buildClientCommercialReadinessScore(): ClientCommercialReadinessScore {
  const goLiveDecision = buildClientGoLiveDecision();
  const productionHandoff = buildClientProductionHandoffPackage();

  const blockers = [
    ...goLiveDecision.checklist.blockedItems,
    ...goLiveDecision.riskReport.openRisks,
    ...productionHandoff.handoffPlan.productionExclusions
  ];

  const uniqueBlockers = Array.from(new Set(blockers));

  const score = Math.max(0, 100 - uniqueBlockers.length * 12);

  const status =
    goLiveDecision.status === "ready"
      ? "production_sellable"
      : score >= 55
        ? "pilot_sellable"
        : "not_ready";

  return {
    title: "Client Commercial Readiness Score",
    clientName: goLiveDecision.clientName,
    score,
    status,
    strengths: [
      "Clear governed workflow from discovery to go-live decision.",
      "Deterministic finance calculations remain separate from AI explanation.",
      "Human approval gates are explicit for payments and accounting postings.",
      "Client-owned credential boundary is documented."
    ],
    blockers: uniqueBlockers,
    salesSafeClaims: [
      "Production-aware public demo.",
      "Controlled pilot scope is documented.",
      "Finance outputs are traceable to deterministic artifacts.",
      "Sensitive actions are blocked or approval-gated."
    ],
    claimsToAvoid: [
      "Do not claim production deployment is ready.",
      "Do not claim payment execution is supported without missing client data.",
      "Do not claim verified ROI before client data and real workflow timing are measured."
    ]
  };
}
