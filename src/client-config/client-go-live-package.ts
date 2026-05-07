import { buildClientGoLiveDecision } from "./client-go-live-decision.js";
import { buildClientGoLiveRiskReport } from "./client-go-live-risk.js";
import { buildClientGoLiveChecklist } from "./client-go-live-checklist.js";
import { buildClientLaunchBrief } from "./client-launch-brief.js";

export interface ClientGoLivePackage {
  title: string;
  generatedAt: string;
  status: "blocked" | "ready_with_exclusions" | "ready";
  clientName: string;
  summary: string;
  checklist: ReturnType<typeof buildClientGoLiveChecklist>;
  riskReport: ReturnType<typeof buildClientGoLiveRiskReport>;
  decision: ReturnType<typeof buildClientGoLiveDecision>;
  launchBrief: ReturnType<typeof buildClientLaunchBrief>;
}

export function buildClientGoLivePackage(): ClientGoLivePackage {
  const checklist = buildClientGoLiveChecklist();
  const riskReport = buildClientGoLiveRiskReport();
  const decision = buildClientGoLiveDecision();
  const launchBrief = buildClientLaunchBrief();

  return {
    title: "Client Go-Live Package",
    generatedAt: new Date().toISOString(),
    status: decision.status,
    clientName: decision.clientName,
    summary:
      "Final go-live package combining checklist, risk report, launch decision, and executive launch brief.",
    checklist,
    riskReport,
    decision,
    launchBrief
  };
}
