import { buildClientProductionDemoScript } from "./client-production-demo-script.js";
import { buildClientProductionHandoffPlan } from "./client-production-handoff-plan.js";

export interface ClientProductionHandoffPackage {
  title: string;
  generatedAt: string;
  status: "blocked" | "ready_with_exclusions" | "ready";
  clientName: string;
  summary: string;
  handoffPlan: ReturnType<typeof buildClientProductionHandoffPlan>;
  demoScript: ReturnType<typeof buildClientProductionDemoScript>;
  finalRecommendation: string;
}

export function buildClientProductionHandoffPackage(): ClientProductionHandoffPackage {
  const handoffPlan = buildClientProductionHandoffPlan();
  const demoScript = buildClientProductionDemoScript();

  const finalRecommendation =
    handoffPlan.status === "blocked"
      ? "Keep this as a controlled demo or limited pilot until client-owned prerequisites and open high risks are resolved."
      : handoffPlan.status === "ready_with_exclusions"
        ? "Proceed with production planning only for approved workflows and document excluded workflows."
        : "Proceed to production implementation planning.";

  return {
    title: "Client Production Handoff Package",
    generatedAt: new Date().toISOString(),
    status: handoffPlan.status,
    clientName: handoffPlan.clientName,
    summary:
      "Final production handoff package combining prerequisites, risk report, pilot context, production decision, and demo script.",
    handoffPlan,
    demoScript,
    finalRecommendation
  };
}
