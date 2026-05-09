import { buildClientAdapterRegistry } from "./client-adapter-registry.js";
import { buildClientDeploymentProfile } from "./client-deployment-profile.js";
import { buildClientImplementationManifest } from "./client-implementation-manifest.js";
import { buildClientImplementationRoadmap } from "./client-implementation-roadmap.js";
import { buildClientRepoStarterPackage } from "./client-repo-starter.js";
import { buildClientWorkOrder } from "./client-work-order.js";

export type ClientAcceptanceGateStatus =
  | "demo_accepted"
  | "pilot_acceptance_required"
  | "blocked_for_production";

export type ClientAcceptanceGateDecision = "pass" | "warning" | "blocked";

export interface ClientAcceptanceGateItem {
  id: string;
  title: string;
  decision: ClientAcceptanceGateDecision;
  owner: "builder" | "client" | "shared";
  evidence: string[];
  requiredBeforeProduction: string[];
}

export interface ClientAcceptanceGate {
  gateVersion: "client-acceptance-gate-v1";
  status: ClientAcceptanceGateStatus;
  purpose: string;
  clientContext: {
    clientId: string;
    clientName: string;
    requestedOutcome: string;
  };
  acceptanceItems: ClientAcceptanceGateItem[];
  demoAcceptanceSummary: string[];
  productionBlockers: string[];
  nextClientQuestions: string[];
}

export interface ClientAcceptanceGateValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientAcceptanceGate(): ClientAcceptanceGate {
  const workOrder = buildClientWorkOrder();
  const manifest = buildClientImplementationManifest();
  const repoStarter = buildClientRepoStarterPackage();
  const adapterRegistry = buildClientAdapterRegistry();
  const roadmap = buildClientImplementationRoadmap();
  const deploymentProfile = buildClientDeploymentProfile();

  const acceptanceItems: ClientAcceptanceGateItem[] = [
    {
      id: "gate-client-scope",
      title: "Client scope and requested outcome",
      decision: "pass",
      owner: "shared",
      evidence: [
        `Work order status: ${workOrder.status}.`,
        `Requested outcome: ${workOrder.request.requestedOutcome}.`
      ],
      requiredBeforeProduction: ["Client signs off on exact workflow scope."]
    },
    {
      id: "gate-input-mapping",
      title: "Input samples and field mapping",
      decision: adapterRegistry.mappingRequiredAdapters.length > 0 ? "warning" : "pass",
      owner: "shared",
      evidence: [
        `Manifest status: ${manifest.status}.`,
        `Mapping-required adapters: ${adapterRegistry.mappingRequiredAdapters.join(", ")}.`
      ],
      requiredBeforeProduction: [
        "Representative safe input samples are provided.",
        "Stable identifiers are confirmed.",
        "Required field mappings are accepted."
      ]
    },
    {
      id: "gate-output-acceptance",
      title: "Output format acceptance",
      decision: "warning",
      owner: "shared",
      evidence: [
        "CFO briefing and exception queue are available in demo.",
        "Client-specific export remains acceptance-gated."
      ],
      requiredBeforeProduction: [
        "Client accepts CFO briefing format.",
        "Client accepts exception queue format.",
        "Client accepts final export or delivery format."
      ]
    },
    {
      id: "gate-demo-safety",
      title: "Public demo safety boundary",
      decision: "pass",
      owner: "builder",
      evidence: [
        `Repo starter status: ${repoStarter.status}.`,
        "Public repo uses mock data, demo-safe planning contracts, and blocked sensitive actions."
      ],
      requiredBeforeProduction: [
        "Keep production credentials outside the public repo.",
        "Keep private client records outside the public repo."
      ]
    },
    {
      id: "gate-production-deployment",
      title: "Client-owned production deployment",
      decision: "blocked",
      owner: "client",
      evidence: [
        `Deployment profile status: ${deploymentProfile.status}.`,
        `Roadmap status: ${roadmap.status}.`
      ],
      requiredBeforeProduction: [
        "Client-owned runtime environment is selected.",
        "Client-owned auth is configured.",
        "Client-owned secrets are configured.",
        "Client-owned monitoring and incident ownership are accepted."
      ]
    },
    {
      id: "gate-sensitive-actions",
      title: "Sensitive action approval policy",
      decision: "blocked",
      owner: "client",
      evidence: [
        "Money movement remains blocked until client-owned payment profiles and approver policy exist.",
        "Accounting postings remain human-approved."
      ],
      requiredBeforeProduction: [
        "Authorized approver roles are defined.",
        "Approval policy is encoded.",
        "Payment and accounting actions remain human-gated."
      ]
    }
  ];

  const productionBlockers = acceptanceItems
    .filter((item) => item.decision === "blocked")
    .flatMap((item) => item.requiredBeforeProduction);

  const warningItems = acceptanceItems.filter((item) => item.decision === "warning");

  return {
    gateVersion: "client-acceptance-gate-v1",
    status:
      productionBlockers.length > 0
        ? "blocked_for_production"
        : warningItems.length > 0
          ? "pilot_acceptance_required"
          : "demo_accepted",
    purpose:
      "Acceptance gate that separates what is demo-ready from what requires client acceptance or client-owned enterprise controls.",
    clientContext: {
      clientId: workOrder.request.clientId,
      clientName: workOrder.request.clientName,
      requestedOutcome: workOrder.request.requestedOutcome
    },
    acceptanceItems,
    demoAcceptanceSummary: [
      "Client work order exists.",
      "Implementation manifest exists.",
      "Repo starter package exists.",
      "Adapter registry exists.",
      "Implementation roadmap exists.",
      "Deployment profile exists.",
      "Sensitive production behavior remains blocked."
    ],
    productionBlockers: [...new Set(productionBlockers)],
    nextClientQuestions: [
      "Can you provide safe representative input samples?",
      "Which output format should be treated as accepted?",
      "Who approves payments and accounting postings?",
      "Which environment will host the production implementation?",
      "Which auth, secrets, monitoring, and audit retention controls should be used?"
    ]
  };
}

export function summarizeClientAcceptanceGate(
  gate: ClientAcceptanceGate = buildClientAcceptanceGate()
) {
  return {
    gateVersion: gate.gateVersion,
    status: gate.status,
    clientName: gate.clientContext.clientName,
    itemCount: gate.acceptanceItems.length,
    passCount: gate.acceptanceItems.filter((item) => item.decision === "pass").length,
    warningCount: gate.acceptanceItems.filter((item) => item.decision === "warning").length,
    blockedCount: gate.acceptanceItems.filter((item) => item.decision === "blocked").length,
    productionBlockerCount: gate.productionBlockers.length,
    nextClientQuestionCount: gate.nextClientQuestions.length
  };
}

export function validateClientAcceptanceGate(
  gate: ClientAcceptanceGate = buildClientAcceptanceGate()
): ClientAcceptanceGateValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (gate.acceptanceItems.length === 0) {
    errors.push("Acceptance gate must include acceptance items.");
  }

  if (gate.demoAcceptanceSummary.length === 0) {
    errors.push("Acceptance gate must include demo acceptance summary.");
  }

  const hasProductionDeploymentGate = gate.acceptanceItems.some(
    (item) => item.id === "gate-production-deployment"
  );

  const hasSensitiveActionGate = gate.acceptanceItems.some(
    (item) => item.id === "gate-sensitive-actions"
  );

  if (!hasProductionDeploymentGate) {
    errors.push("Acceptance gate must include production deployment gate.");
  }

  if (!hasSensitiveActionGate) {
    errors.push("Acceptance gate must include sensitive action approval gate.");
  }

  const productionDeploymentGate = gate.acceptanceItems.find(
    (item) => item.id === "gate-production-deployment"
  );

  const sensitiveActionGate = gate.acceptanceItems.find(
    (item) => item.id === "gate-sensitive-actions"
  );

  if (productionDeploymentGate?.decision !== "blocked") {
    errors.push("Production deployment gate must remain blocked until client-owned controls exist.");
  }

  if (sensitiveActionGate?.decision !== "blocked") {
    errors.push("Sensitive action gate must remain blocked until client approval policy exists.");
  }

  if (gate.productionBlockers.length === 0) {
    warnings.push("No production blockers found. Confirm this is intentional before enterprise rollout.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
