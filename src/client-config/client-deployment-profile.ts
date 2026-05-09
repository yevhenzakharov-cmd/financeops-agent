import { buildClientImplementationRoadmap } from "./client-implementation-roadmap.js";
import { buildClientRepoStarterPackage } from "./client-repo-starter.js";

export type ClientDeploymentProfileStatus =
  | "demo_ready"
  | "client_environment_required"
  | "blocked_until_enterprise_controls_exist";

export type ClientDeploymentControlStatus =
  | "available_in_demo"
  | "client_owned_required"
  | "blocked_until_configured";

export interface ClientDeploymentControl {
  id: string;
  name: string;
  category: "environment" | "secrets" | "auth" | "data" | "monitoring" | "approval" | "audit";
  status: ClientDeploymentControlStatus;
  owner: "builder" | "client" | "shared";
  productionRequirement: string;
  demoBoundary: string;
}

export interface ClientDeploymentProfile {
  profileVersion: "client-deployment-profile-v1";
  status: ClientDeploymentProfileStatus;
  purpose: string;
  deploymentModel: {
    publicDemo: string;
    clientPilot: string;
    production: string;
  };
  controls: ClientDeploymentControl[];
  blockedUntilClientProvides: string[];
  enterpriseReadinessNotes: string[];
}

export interface ClientDeploymentProfileValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientDeploymentProfile(): ClientDeploymentProfile {
  const roadmap = buildClientImplementationRoadmap();
  const repoStarter = buildClientRepoStarterPackage();

  const controls: ClientDeploymentControl[] = [
    {
      id: "deployment-environment",
      name: "Client-owned runtime environment",
      category: "environment",
      status: "client_owned_required",
      owner: "client",
      productionRequirement: "Production implementation must run in a client-approved environment.",
      demoBoundary: "Public repo runs only with mock data and local/demo runtime settings."
    },
    {
      id: "deployment-secrets",
      name: "Client-owned secrets",
      category: "secrets",
      status: "blocked_until_configured",
      owner: "client",
      productionRequirement: "Production credentials must be stored in client-owned secret management.",
      demoBoundary: "Public repo must not contain production credentials."
    },
    {
      id: "deployment-auth",
      name: "Client-owned authentication and authorization",
      category: "auth",
      status: "blocked_until_configured",
      owner: "client",
      productionRequirement: "Production routes must use client-owned identity, roles, and authorization policy.",
      demoBoundary: "Demo API key only protects action-like public demo routes."
    },
    {
      id: "deployment-data-access",
      name: "Client data access boundary",
      category: "data",
      status: "client_owned_required",
      owner: "client",
      productionRequirement: "Client controls access to financial records, APIs, exports, and databases.",
      demoBoundary: "Public repo uses safe mock data only."
    },
    {
      id: "deployment-monitoring",
      name: "Client-owned monitoring",
      category: "monitoring",
      status: "client_owned_required",
      owner: "shared",
      productionRequirement: "Production monitoring, alerts, and incident ownership must be accepted by the client.",
      demoBoundary: "Demo exposes limited read-only observability endpoints."
    },
    {
      id: "deployment-approval-policy",
      name: "Production approval policy",
      category: "approval",
      status: "blocked_until_configured",
      owner: "client",
      productionRequirement: "Money movement and accounting postings require client-approved human review rules.",
      demoBoundary: "Demo simulates approval gates and blocks sensitive production behavior."
    },
    {
      id: "deployment-audit-evidence",
      name: "Audit evidence retention",
      category: "audit",
      status: "available_in_demo",
      owner: "shared",
      productionRequirement: "Client must define retention, access, and audit review expectations.",
      demoBoundary: "Demo persists local audit, approval, ledger, and artifact evidence."
    }
  ];

  const blockedUntilClientProvides = [
    ...repoStarter.blockedUntilClientProvides,
    "Production identity provider or auth model",
    "Secret management approach",
    "Monitoring and incident ownership",
    "Audit retention expectations"
  ];

  const hasBlockedControls = controls.some((control) => control.status === "blocked_until_configured");

  return {
    profileVersion: "client-deployment-profile-v1",
    status: hasBlockedControls ? "blocked_until_enterprise_controls_exist" : "client_environment_required",
    purpose:
      "Define what stays demo-safe versus what must move into client-owned enterprise deployment before production use.",
    deploymentModel: {
      publicDemo: "Mock data, demo auth, simulated actions, local artifacts, and read-only reviewer endpoints.",
      clientPilot:
        "Client-shaped safe sample data, accepted output format, mapped adapters, and human approval gates.",
      production:
        "Client-owned runtime, credentials, auth, monitoring, audit retention, data access, and approval policy."
    },
    controls,
    blockedUntilClientProvides,
    enterpriseReadinessNotes: [
      `Roadmap status: ${roadmap.status}.`,
      "Enterprise deployment is not just code deployment; it requires client-owned operational controls.",
      "Public demo proves architecture and safety boundaries, not production authorization.",
      "Production rollout must keep payment and accounting actions gated behind human approval."
    ]
  };
}

export function summarizeClientDeploymentProfile(
  profile: ClientDeploymentProfile = buildClientDeploymentProfile()
) {
  return {
    profileVersion: profile.profileVersion,
    status: profile.status,
    controlCount: profile.controls.length,
    availableInDemoControls: profile.controls.filter(
      (control) => control.status === "available_in_demo"
    ).length,
    clientOwnedRequiredControls: profile.controls.filter(
      (control) => control.status === "client_owned_required"
    ).length,
    blockedUntilConfiguredControls: profile.controls.filter(
      (control) => control.status === "blocked_until_configured"
    ).length,
    blockedItemCount: profile.blockedUntilClientProvides.length
  };
}

export function validateClientDeploymentProfile(
  profile: ClientDeploymentProfile = buildClientDeploymentProfile()
): ClientDeploymentProfileValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (profile.controls.length === 0) {
    errors.push("Deployment profile must include controls.");
  }

  const requiredCategories = ["environment", "secrets", "auth", "data", "monitoring", "approval", "audit"];

  for (const category of requiredCategories) {
    if (!profile.controls.some((control) => control.category === category)) {
      errors.push(`Missing deployment control category: ${category}.`);
    }
  }

  const secretsControl = profile.controls.find((control) => control.category === "secrets");

  if (secretsControl?.status !== "blocked_until_configured") {
    errors.push("Secrets control must remain blocked until client-owned configuration exists.");
  }

  const approvalControl = profile.controls.find((control) => control.category === "approval");

  if (approvalControl?.status !== "blocked_until_configured") {
    errors.push("Approval control must remain blocked until client-owned approval policy exists.");
  }

  const mentionsPublicRepoCredentialBoundary = profile.controls.some((control) =>
    control.demoBoundary.toLowerCase().includes("production credentials")
  );

  if (!mentionsPublicRepoCredentialBoundary) {
    errors.push("Deployment profile must explicitly block production credentials from the public repo.");
  }

  if (profile.enterpriseReadinessNotes.length === 0) {
    warnings.push("Enterprise readiness notes are missing.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
