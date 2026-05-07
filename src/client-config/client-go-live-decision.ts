import { buildClientGoLiveChecklist } from "./client-go-live-checklist.js";
import { buildClientGoLiveRiskReport } from "./client-go-live-risk.js";
import { buildClientProductionHandoffPackage } from "./client-production-handoff-package.js";

export interface ClientGoLiveDecision {
  title: string;
  generatedAt: string;
  clientName: string;
  status: "blocked" | "ready_with_exclusions" | "ready";
  summary: string;
  checklist: ReturnType<typeof buildClientGoLiveChecklist>;
  riskReport: ReturnType<typeof buildClientGoLiveRiskReport>;
  productionHandoffPackage: ReturnType<typeof buildClientProductionHandoffPackage>;
  allowedLaunchScope: string[];
  excludedLaunchScope: string[];
  decision: string;
}

export function buildClientGoLiveDecision(): ClientGoLiveDecision {
  const checklist = buildClientGoLiveChecklist();
  const riskReport = buildClientGoLiveRiskReport();
  const productionHandoffPackage = buildClientProductionHandoffPackage();

  const allowedLaunchScope = [
    "Overdue invoice detection",
    "Project margin risk review",
    "CFO briefing generation",
    "Exception queue generation",
    "Audit artifact generation"
  ];

  const excludedLaunchScope = [
    ...checklist.blockedItems,
    ...riskReport.openRisks,
    "Payment execution",
    "Accounting posting",
    "Final tax/legal advice"
  ];

  const status =
    checklist.blockedItems.length > 0 || riskReport.openHighRiskCount > 0
      ? "blocked"
      : checklist.clientActionItems.length > 0
        ? "ready_with_exclusions"
        : "ready";

  const decision =
    status === "blocked"
      ? "Go-live is blocked. Continue as controlled demo or limited pilot until blocked items are resolved."
      : status === "ready_with_exclusions"
        ? "Go-live planning can continue only for explicitly allowed workflows with documented exclusions."
        : "Go-live planning is ready.";

  return {
    title: "Client Go-Live Decision",
    generatedAt: new Date().toISOString(),
    clientName: productionHandoffPackage.clientName,
    status,
    summary:
      "Launch decision layer that combines checklist, go-live risk, and production handoff package into one go/no-go decision.",
    checklist,
    riskReport,
    productionHandoffPackage,
    allowedLaunchScope,
    excludedLaunchScope,
    decision
  };
}
