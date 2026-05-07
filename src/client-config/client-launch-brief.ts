import { buildClientGoLiveDecision } from "./client-go-live-decision.js";

export interface ClientLaunchBrief {
  title: string;
  generatedAt: string;
  clientName: string;
  launchStatus: "blocked" | "ready_with_exclusions" | "ready";
  executiveSummary: string;
  allowedScope: string[];
  excludedScope: string[];
  clientActionRequired: string[];
  finalMessage: string;
}

export function buildClientLaunchBrief(): ClientLaunchBrief {
  const decision = buildClientGoLiveDecision();

  const finalMessage =
    decision.status === "blocked"
      ? "This is a strong production-aware demo, but launch should remain blocked until required client-owned data and open high-risk items are resolved."
      : decision.status === "ready_with_exclusions"
        ? "Launch planning can proceed with exclusions clearly documented and accepted by the client."
        : "Launch planning can proceed.";

  return {
    title: "Client Launch Brief",
    generatedAt: new Date().toISOString(),
    clientName: decision.clientName,
    launchStatus: decision.status,
    executiveSummary:
      "Executive launch brief summarizing what can go live, what must stay excluded, and what the client must still provide.",
    allowedScope: decision.allowedLaunchScope,
    excludedScope: decision.excludedLaunchScope,
    clientActionRequired: decision.checklist.clientActionItems,
    finalMessage
  };
}
