import { buildClientAdapterBlueprint } from "./client-adapter-blueprint.js";
import { buildClientDeploymentChecklist } from "./client-deployment-checklist.js";
import { buildClientImplementationReadiness } from "./client-implementation-readiness.js";
import { buildClientOutputDeliveryPlan } from "./client-output-delivery-plan.js";

export interface ClientBuildPackage {
  title: string;
  generatedAt: string;
  status: "blocked" | "ready_for_mapping" | "ready_for_build";
  clientName: string;
  executiveSummary: string;
  readiness: ReturnType<typeof buildClientImplementationReadiness>;
  adapterBlueprint: ReturnType<typeof buildClientAdapterBlueprint>;
  outputDeliveryPlan: ReturnType<typeof buildClientOutputDeliveryPlan>;
  deploymentChecklist: ReturnType<typeof buildClientDeploymentChecklist>;
  builderNextActions: string[];
}

export function buildClientBuildPackage(): ClientBuildPackage {
  const readiness = buildClientImplementationReadiness();
  const adapterBlueprint = buildClientAdapterBlueprint();
  const outputDeliveryPlan = buildClientOutputDeliveryPlan();
  const deploymentChecklist = buildClientDeploymentChecklist();

  const status =
    readiness.readinessStatus === "blocked"
      ? "blocked"
      : readiness.readinessStatus === "mapping_required"
        ? "ready_for_mapping"
        : "ready_for_build";

  const builderNextActions =
    status === "blocked"
      ? [
          "Send client the data request packet.",
          "Do not build payment preparation until vendor payment method data exists.",
          "Confirm bank transaction ID mapping before reconciliation adapter work."
        ]
      : status === "ready_for_mapping"
        ? [
            "Create client-specific input adapter map.",
            "Validate sample data against normalized FinanceOps schema.",
            "Confirm output delivery format."
          ]
        : [
            "Build client-specific adapters.",
            "Connect outputs to requested delivery target.",
            "Run acceptance demo with client-shaped fixtures."
          ];

  return {
    title: "Client Build Package",
    generatedAt: new Date().toISOString(),
    status,
    clientName: readiness.clientName,
    executiveSummary:
      "Builder-facing package that combines readiness, adapter blueprint, output delivery, and deployment checklist into one implementation handoff.",
    readiness,
    adapterBlueprint,
    outputDeliveryPlan,
    deploymentChecklist,
    builderNextActions
  };
}
