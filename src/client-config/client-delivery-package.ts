import { buildClientAcceptanceGate } from "./client-acceptance-gate.js";
import { buildClientDeploymentProfile } from "./client-deployment-profile.js";
import { buildClientImplementationRoadmap } from "./client-implementation-roadmap.js";
import { buildClientWorkOrder } from "./client-work-order.js";

export type ClientDeliveryPackageStatus =
  | "demo_package_ready"
  | "pilot_package_needs_client_acceptance"
  | "production_package_blocked";

export type ClientDeliveryArtifactStatus =
  | "available_in_demo"
  | "client_acceptance_required"
  | "blocked_until_client_owned";

export interface ClientDeliveryArtifact {
  id: string;
  name: string;
  status: ClientDeliveryArtifactStatus;
  audience: "client_stakeholder" | "technical_reviewer" | "finance_reviewer" | "enterprise_buyer";
  sourceEndpoint: string;
  purpose: string;
  productionNote: string;
}

export interface ClientDeliveryPackage {
  packageVersion: "client-delivery-package-v1";
  status: ClientDeliveryPackageStatus;
  purpose: string;
  clientContext: {
    clientId: string;
    clientName: string;
    requestedOutcome: string;
  };
  artifacts: ClientDeliveryArtifact[];
  suggestedDemoNarrative: string[];
  blockedProductionClaims: string[];
  buyerProofPoints: string[];
}

export interface ClientDeliveryPackageValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientDeliveryPackage(): ClientDeliveryPackage {
  const workOrder = buildClientWorkOrder();
  const roadmap = buildClientImplementationRoadmap();
  const deploymentProfile = buildClientDeploymentProfile();
  const acceptanceGate = buildClientAcceptanceGate();

  const artifacts: ClientDeliveryArtifact[] = [
    {
      id: "delivery-work-order",
      name: "Client work order",
      status: "available_in_demo",
      audience: "client_stakeholder",
      sourceEndpoint: "/client/work-order",
      purpose: "Show the client request translated into implementation work items.",
      productionNote: "Replace mock request with the client's approved task and desired outcome."
    },
    {
      id: "delivery-implementation-manifest",
      name: "Implementation manifest",
      status: "available_in_demo",
      audience: "technical_reviewer",
      sourceEndpoint: "/client/implementation-manifest",
      purpose: "Show inputs, outputs, workflows, approval boundaries, and missing client items.",
      productionNote: "Configure with client-approved field mappings and output acceptance criteria."
    },
    {
      id: "delivery-adapter-registry",
      name: "Adapter registry",
      status: "client_acceptance_required",
      audience: "technical_reviewer",
      sourceEndpoint: "/client/adapter-registry",
      purpose: "Show which input, output, approval, and audit adapters are reusable or client-specific.",
      productionNote: "Client-specific adapters require accepted source systems, mappings, and destinations."
    },
    {
      id: "delivery-implementation-roadmap",
      name: "Implementation roadmap",
      status: "client_acceptance_required",
      audience: "enterprise_buyer",
      sourceEndpoint: "/client/implementation-roadmap",
      purpose: "Show a phased path from discovery to client-owned production boundary.",
      productionNote: "Production path depends on safe samples, accepted outputs, and client-owned controls."
    },
    {
      id: "delivery-deployment-profile",
      name: "Deployment profile",
      status: "blocked_until_client_owned",
      audience: "enterprise_buyer",
      sourceEndpoint: "/client/deployment-profile",
      purpose: "Show what stays demo-safe and what must move into a client-owned enterprise environment.",
      productionNote: "Requires client-owned auth, secrets, monitoring, audit retention, and runtime."
    },
    {
      id: "delivery-acceptance-gate",
      name: "Acceptance gate",
      status: "blocked_until_client_owned",
      audience: "finance_reviewer",
      sourceEndpoint: "/client/acceptance-gate",
      purpose: "Show demo-ready evidence, pilot acceptance needs, and production blockers.",
      productionNote: "Production remains blocked until client-owned controls and human approval rules exist."
    }
  ];

  const hasProductionBlock = artifacts.some((artifact) => artifact.status === "blocked_until_client_owned");

  return {
    packageVersion: "client-delivery-package-v1",
    status: hasProductionBlock ? "production_package_blocked" : "pilot_package_needs_client_acceptance",
    purpose:
      "Package the client-specific implementation planning layers into a buyer/reviewer-facing delivery bundle.",
    clientContext: {
      clientId: workOrder.request.clientId,
      clientName: workOrder.request.clientName,
      requestedOutcome: workOrder.request.requestedOutcome
    },
    artifacts,
    suggestedDemoNarrative: [
      "Start with the work order to show the client's manual finance workflow and desired automation outcome.",
      "Use the implementation manifest to show exact inputs, outputs, workflows, and approval boundaries.",
      "Use the adapter registry to show what can be reused and what must be mapped per client.",
      "Use the roadmap to show the build path from demo to pilot.",
      "Use the deployment profile and acceptance gate to prove production claims are blocked until client-owned controls exist."
    ],
    blockedProductionClaims: [
      `Acceptance gate status: ${acceptanceGate.status}.`,
      `Deployment profile status: ${deploymentProfile.status}.`,
      `Roadmap status: ${roadmap.status}.`,
      "Do not claim production readiness without client-owned auth, secrets, monitoring, data access, and approval policy.",
      "Do not claim autonomous money movement or accounting posting without human approval gates."
    ],
    buyerProofPoints: [
      "Deterministic finance logic remains separate from AI-style explanation.",
      "Client-specific adapter planning is explicit.",
      "Approval boundaries are visible.",
      "Production blockers are named instead of hidden.",
      "Reviewer endpoints expose the implementation plan in structured JSON."
    ]
  };
}

export function summarizeClientDeliveryPackage(
  deliveryPackage: ClientDeliveryPackage = buildClientDeliveryPackage()
) {
  return {
    packageVersion: deliveryPackage.packageVersion,
    status: deliveryPackage.status,
    clientName: deliveryPackage.clientContext.clientName,
    artifactCount: deliveryPackage.artifacts.length,
    demoArtifactCount: deliveryPackage.artifacts.filter(
      (artifact) => artifact.status === "available_in_demo"
    ).length,
    clientAcceptanceRequiredCount: deliveryPackage.artifacts.filter(
      (artifact) => artifact.status === "client_acceptance_required"
    ).length,
    blockedUntilClientOwnedCount: deliveryPackage.artifacts.filter(
      (artifact) => artifact.status === "blocked_until_client_owned"
    ).length,
    buyerProofPointCount: deliveryPackage.buyerProofPoints.length,
    blockedProductionClaimCount: deliveryPackage.blockedProductionClaims.length
  };
}

export function validateClientDeliveryPackage(
  deliveryPackage: ClientDeliveryPackage = buildClientDeliveryPackage()
): ClientDeliveryPackageValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (deliveryPackage.artifacts.length === 0) {
    errors.push("Delivery package must include artifacts.");
  }

  const requiredEndpoints = [
    "/client/work-order",
    "/client/implementation-manifest",
    "/client/adapter-registry",
    "/client/implementation-roadmap",
    "/client/deployment-profile",
    "/client/acceptance-gate"
  ];

  for (const endpoint of requiredEndpoints) {
    if (!deliveryPackage.artifacts.some((artifact) => artifact.sourceEndpoint === endpoint)) {
      errors.push(`Missing delivery artifact for endpoint: ${endpoint}.`);
    }
  }

  const hasBlockedProductionClaim = deliveryPackage.blockedProductionClaims.some((claim) =>
    claim.toLowerCase().includes("do not claim production readiness")
  );

  if (!hasBlockedProductionClaim) {
    errors.push("Delivery package must explicitly block unsupported production-readiness claims.");
  }

  const hasHumanApprovalClaim = deliveryPackage.blockedProductionClaims.some((claim) =>
    claim.toLowerCase().includes("human approval")
  );

  if (!hasHumanApprovalClaim) {
    errors.push("Delivery package must explicitly block sensitive actions without human approval.");
  }

  if (deliveryPackage.buyerProofPoints.length === 0) {
    warnings.push("Buyer proof points are missing.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
