import { buildClientAcceptanceGate } from "./client-acceptance-gate.js";
import { buildClientAdapterRegistry } from "./client-adapter-registry.js";
import { buildClientDeliveryPackage } from "./client-delivery-package.js";
import { buildClientDeploymentProfile } from "./client-deployment-profile.js";
import { buildClientImplementationManifest } from "./client-implementation-manifest.js";
import { buildClientImplementationRoadmap } from "./client-implementation-roadmap.js";
import { buildClientWorkOrder } from "./client-work-order.js";

export type ClientEnterpriseSalesBriefStatus =
  | "demo_story_ready"
  | "pilot_story_needs_client_inputs"
  | "production_story_blocked";

export type ClientEnterpriseBuyerSignalStrength = "strong" | "medium" | "blocked";

export interface ClientEnterpriseBuyerSignal {
  id: string;
  title: string;
  strength: ClientEnterpriseBuyerSignalStrength;
  buyerValue: string;
  evidence: string[];
  caveat: string;
}

export interface ClientEnterpriseSalesBrief {
  briefVersion: "client-enterprise-sales-brief-v1";
  status: ClientEnterpriseSalesBriefStatus;
  clientContext: {
    clientId: string;
    clientName: string;
    requestedOutcome: string;
  };
  positioning: {
    oneLiner: string;
    targetBuyer: string;
    corePromise: string;
    honestBoundary: string;
  };
  buyerSignals: ClientEnterpriseBuyerSignal[];
  demoTalkTrack: string[];
  enterpriseObjections: string[];
  requiredClientProofBeforeProduction: string[];
}

export interface ClientEnterpriseSalesBriefValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientEnterpriseSalesBrief(): ClientEnterpriseSalesBrief {
  const workOrder = buildClientWorkOrder();
  const manifest = buildClientImplementationManifest();
  const adapterRegistry = buildClientAdapterRegistry();
  const roadmap = buildClientImplementationRoadmap();
  const deploymentProfile = buildClientDeploymentProfile();
  const acceptanceGate = buildClientAcceptanceGate();
  const deliveryPackage = buildClientDeliveryPackage();

  const buyerSignals: ClientEnterpriseBuyerSignal[] = [
    {
      id: "signal-manual-finance-ops",
      title: "Manual finance operations automation",
      strength: "strong",
      buyerValue:
        "Shows a path from spreadsheet-heavy finance review into structured exceptions, approvals, and audit-ready outputs.",
      evidence: [
        `Requested outcome: ${workOrder.request.requestedOutcome}.`,
        `Work order status: ${workOrder.status}.`
      ],
      caveat: "Client must provide representative inputs before production automation is claimed."
    },
    {
      id: "signal-deterministic-finance-core",
      title: "Deterministic finance logic with AI explanation boundary",
      strength: "strong",
      buyerValue:
        "Separates financial calculations from AI-style explanation so reviewers can trust the source of numbers.",
      evidence: [
        `Manifest status: ${manifest.status}.`,
        "Delivery package proof point: deterministic finance logic remains separate from AI-style explanation."
      ],
      caveat: "Production data validation still depends on client-approved schemas and source systems."
    },
    {
      id: "signal-client-specific-adapter-model",
      title: "Client-specific adapter model",
      strength: "strong",
      buyerValue:
        "Supports cloning the reusable core per client and mapping the exact inputs, outputs, and approval rules they need.",
      evidence: [
        `Adapter count: ${adapterRegistry.adapters.length}.`,
        `Mapping-required adapters: ${adapterRegistry.mappingRequiredAdapters.join(", ")}.`
      ],
      caveat: "Adapters are implementation plans until real client systems and field mappings are provided."
    },
    {
      id: "signal-enterprise-safety-boundaries",
      title: "Enterprise safety boundaries",
      strength: "strong",
      buyerValue:
        "Makes production blockers visible instead of pretending the public demo is production-ready.",
      evidence: [
        `Deployment profile status: ${deploymentProfile.status}.`,
        `Acceptance gate status: ${acceptanceGate.status}.`
      ],
      caveat: "Production remains blocked until client-owned auth, secrets, monitoring, and approval policy exist."
    },
    {
      id: "signal-reviewer-facing-delivery",
      title: "Reviewer-facing delivery package",
      strength: "medium",
      buyerValue:
        "Packages the implementation plan into structured endpoints that technical, finance, and buyer reviewers can inspect.",
      evidence: [
        `Delivery package status: ${deliveryPackage.status}.`,
        `Roadmap status: ${roadmap.status}.`
      ],
      caveat: "Buyer story should not claim live enterprise deployment until a real client pilot is implemented."
    },
    {
      id: "signal-production-readiness",
      title: "Production readiness",
      strength: "blocked",
      buyerValue:
        "Shows exactly what must happen before this can become a production implementation for a large enterprise.",
      evidence: [
        `Production blockers: ${acceptanceGate.productionBlockers.length}.`,
        `Blocked production claims: ${deliveryPackage.blockedProductionClaims.length}.`
      ],
      caveat: "Not production-ready until client-owned environment, credentials, auth, monitoring, and approval controls are configured."
    }
  ];

  const blockedSignals = buyerSignals.filter((signal) => signal.strength === "blocked");
  const mediumSignals = buyerSignals.filter((signal) => signal.strength === "medium");

  return {
    briefVersion: "client-enterprise-sales-brief-v1",
    status:
      blockedSignals.length > 0
        ? "production_story_blocked"
        : mediumSignals.length > 0
          ? "pilot_story_needs_client_inputs"
          : "demo_story_ready",
    clientContext: {
      clientId: workOrder.request.clientId,
      clientName: workOrder.request.clientName,
      requestedOutcome: workOrder.request.requestedOutcome
    },
    positioning: {
      oneLiner:
        "FinanceOps Agent is a reusable, client-specific finance operations automation core for turning manual finance review into deterministic exceptions, approvals, and audit-ready outputs.",
      targetBuyer:
        "CFO, controller, finance operations lead, founder, COO, or enterprise automation buyer.",
      corePromise:
        "Reduce manual finance review work while keeping sensitive actions gated behind deterministic checks and human approvals.",
      honestBoundary:
        "The public repo is a demo-safe implementation core, not a live production deployment for a client."
    },
    buyerSignals,
    demoTalkTrack: [
      "Start with the client's manual finance process and requested outcome.",
      "Show the work order and implementation manifest to prove the task is structured.",
      "Show the adapter registry to explain how client inputs and outputs are plugged into the core.",
      "Show the roadmap and deployment profile to separate demo, pilot, and production boundaries.",
      "Show the acceptance gate and delivery package to prove the system does not overclaim production readiness."
    ],
    enterpriseObjections: [
      "Where does our data live?",
      "Who controls credentials and auth?",
      "Can the agent move money automatically?",
      "How do we know the numbers are not hallucinated?",
      "How do we audit decisions and approvals?",
      "How does this adapt to our current finance systems?"
    ],
    requiredClientProofBeforeProduction: [
      "Safe representative input samples",
      "Accepted field mappings",
      "Accepted output format",
      "Client-owned runtime environment",
      "Client-owned authentication and authorization",
      "Client-owned secret management",
      "Client-owned monitoring and incident process",
      "Client approval policy for payments and accounting postings"
    ]
  };
}

export function summarizeClientEnterpriseSalesBrief(
  brief: ClientEnterpriseSalesBrief = buildClientEnterpriseSalesBrief()
) {
  return {
    briefVersion: brief.briefVersion,
    status: brief.status,
    clientName: brief.clientContext.clientName,
    buyerSignalCount: brief.buyerSignals.length,
    strongSignals: brief.buyerSignals.filter((signal) => signal.strength === "strong").length,
    mediumSignals: brief.buyerSignals.filter((signal) => signal.strength === "medium").length,
    blockedSignals: brief.buyerSignals.filter((signal) => signal.strength === "blocked").length,
    demoTalkTrackStepCount: brief.demoTalkTrack.length,
    enterpriseObjectionCount: brief.enterpriseObjections.length,
    requiredClientProofCount: brief.requiredClientProofBeforeProduction.length
  };
}

export function validateClientEnterpriseSalesBrief(
  brief: ClientEnterpriseSalesBrief = buildClientEnterpriseSalesBrief()
): ClientEnterpriseSalesBriefValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (brief.buyerSignals.length === 0) {
    errors.push("Enterprise sales brief must include buyer signals.");
  }

  if (!brief.positioning.oneLiner.trim()) {
    errors.push("Enterprise sales brief must include a one-liner.");
  }

  if (!brief.positioning.honestBoundary.toLowerCase().includes("not a live production deployment")) {
    errors.push("Enterprise sales brief must explicitly avoid claiming live production deployment.");
  }

  const hasDeterministicSignal = brief.buyerSignals.some((signal) =>
    signal.id === "signal-deterministic-finance-core"
  );

  const hasProductionBlockedSignal = brief.buyerSignals.some(
    (signal) => signal.id === "signal-production-readiness" && signal.strength === "blocked"
  );

  if (!hasDeterministicSignal) {
    errors.push("Enterprise sales brief must include deterministic finance core signal.");
  }

  if (!hasProductionBlockedSignal) {
    errors.push("Enterprise sales brief must include blocked production-readiness signal.");
  }

  const mentionsCredentials = brief.requiredClientProofBeforeProduction.some((item) =>
    item.toLowerCase().includes("secret")
  );

  const mentionsApproval = brief.requiredClientProofBeforeProduction.some((item) =>
    item.toLowerCase().includes("approval")
  );

  if (!mentionsCredentials) {
    errors.push("Enterprise sales brief must require client-owned secret management.");
  }

  if (!mentionsApproval) {
    errors.push("Enterprise sales brief must require client approval policy.");
  }

  if (brief.enterpriseObjections.length === 0) {
    warnings.push("Enterprise buyer objections are missing.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
