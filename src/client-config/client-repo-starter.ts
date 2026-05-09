import { buildClientImplementationManifest } from "./client-implementation-manifest.js";
import { buildClientWorkOrder } from "./client-work-order.js";

export type ClientRepoStarterStatus =
  | "template_ready"
  | "client_customization_required"
  | "blocked_until_client_inputs_arrive";

export type ClientRepoStarterItemStatus =
  | "keep_from_core"
  | "replace_per_client"
  | "configure_per_client"
  | "blocked_until_client_owned";

export interface ClientRepoStarterItem {
  id: string;
  path: string;
  status: ClientRepoStarterItemStatus;
  owner: "builder" | "client" | "shared";
  reason: string;
  action: string;
}

export interface ClientRepoStarterPackage {
  packageVersion: "client-repo-starter-v1";
  status: ClientRepoStarterStatus;
  purpose: string;
  cloneModel: {
    recommendedMode: "github_template_or_repo_clone";
    sourceRepoRole: "reusable_financeops_core";
    targetRepoRole: "client_specific_implementation";
    historyPolicy: string;
  };
  clientContext: {
    clientId: string;
    clientName: string;
    requestedOutcome: string;
    workOrderStatus: string;
    manifestStatus: string;
  };
  starterItems: ClientRepoStarterItem[];
  firstBuildSequence: string[];
  safetyRules: string[];
  blockedUntilClientProvides: string[];
}

export interface ClientRepoStarterValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientRepoStarterPackage(): ClientRepoStarterPackage {
  const workOrder = buildClientWorkOrder();
  const manifest = buildClientImplementationManifest();

  const starterItems: ClientRepoStarterItem[] = [
    {
      id: "starter-client-manifest",
      path: "src/client-config/client-implementation-manifest.ts",
      status: "configure_per_client",
      owner: "builder",
      reason: "Defines the client-specific inputs, outputs, workflows, and approval boundaries.",
      action: "Update manifest values after the client provides task scope, input samples, and desired output format."
    },
    {
      id: "starter-work-order",
      path: "src/client-config/client-work-order.ts",
      status: "replace_per_client",
      owner: "shared",
      reason: "Converts the client request into builder-facing work items.",
      action: "Replace mock request values with the client's real task, inputs, desired outputs, and approval rules."
    },
    {
      id: "starter-mock-data",
      path: "src/domain/mock-data.ts",
      status: "replace_per_client",
      owner: "builder",
      reason: "Public repo must only contain safe mock data, but each client demo should match their workflow shape.",
      action: "Replace generic mock data with client-shaped safe sample data, never production credentials or private records."
    },
    {
      id: "starter-input-adapter",
      path: "src/adapters/mock-financeops-adapter.ts",
      status: "configure_per_client",
      owner: "builder",
      reason: "Input adapter is where client files, APIs, exports, or database shapes enter the normalized core.",
      action: "Implement the client input adapter only after field mappings are confirmed."
    },
    {
      id: "starter-output-artifact",
      path: "outputs/artifacts/latest-output-artifact.json",
      status: "configure_per_client",
      owner: "shared",
      reason: "Output must match what the client agreed to accept: briefing, dashboard JSON, CSV, API response, or Slack payload.",
      action: "Configure output delivery after acceptance criteria are confirmed."
    },
    {
      id: "starter-payment-boundary",
      path: "src/payments",
      status: "blocked_until_client_owned",
      owner: "client",
      reason: "Payment preparation can be modeled, but real payment execution requires client-owned credentials and approval policy.",
      action: "Keep real money movement disabled until authorized approvers, idempotency rules, and client-owned credentials exist."
    },
    {
      id: "starter-demo-auth",
      path: "src/api/demo-auth.ts",
      status: "keep_from_core",
      owner: "builder",
      reason: "Protected action routes should remain gated in demo and replaced with client-owned auth in production.",
      action: "Keep demo API-key protection for public demos; replace with client-owned auth for production."
    },
    {
      id: "starter-audit-layer",
      path: "src/security/audit-log.ts",
      status: "keep_from_core",
      owner: "builder",
      reason: "Auditability is a core differentiator and should remain in every client implementation.",
      action: "Keep audit logging and extend it only when client-specific events require it."
    }
  ];

  const blockedUntilClientProvides = [
    "Representative safe input samples",
    "Confirmed field mappings",
    "Accepted output format",
    "Approval policy and approver roles",
    "Client-owned deployment and credential strategy"
  ];

  const hasBlockedItem = starterItems.some((item) => item.status === "blocked_until_client_owned");

  return {
    packageVersion: "client-repo-starter-v1",
    status: hasBlockedItem ? "client_customization_required" : "template_ready",
    purpose:
      "Guide for turning the reusable FinanceOps Agent core into a client-specific implementation without leaking client data or weakening approval boundaries.",
    cloneModel: {
      recommendedMode: "github_template_or_repo_clone",
      sourceRepoRole: "reusable_financeops_core",
      targetRepoRole: "client_specific_implementation",
      historyPolicy:
        "Use a fresh client repository or template-generated repository when client implementation history should be separated from the public core."
    },
    clientContext: {
      clientId: workOrder.request.clientId,
      clientName: workOrder.request.clientName,
      requestedOutcome: workOrder.request.requestedOutcome,
      workOrderStatus: workOrder.status,
      manifestStatus: manifest.status
    },
    starterItems,
    firstBuildSequence: [
      "Create a client-specific repository from the reusable core.",
      "Replace mock client request with the client's actual task and desired outcome.",
      "Add safe client-shaped sample inputs.",
      "Map client fields into normalized FinanceOps schemas.",
      "Configure accepted output delivery.",
      "Keep sensitive actions approval-gated.",
      "Run validation before demo or deployment."
    ],
    safetyRules: [
      "Do not commit production credentials.",
      "Do not commit private client financial records.",
      "Do not enable money movement without human approval.",
      "Do not treat AI output as the source of financial calculations.",
      "Keep deterministic finance logic and audit evidence visible."
    ],
    blockedUntilClientProvides
  };
}

export function summarizeClientRepoStarterPackage(
  starterPackage: ClientRepoStarterPackage = buildClientRepoStarterPackage()
) {
  return {
    packageVersion: starterPackage.packageVersion,
    status: starterPackage.status,
    clientName: starterPackage.clientContext.clientName,
    starterItemCount: starterPackage.starterItems.length,
    replacePerClientCount: starterPackage.starterItems.filter(
      (item) => item.status === "replace_per_client"
    ).length,
    configurePerClientCount: starterPackage.starterItems.filter(
      (item) => item.status === "configure_per_client"
    ).length,
    blockedUntilClientOwnedCount: starterPackage.starterItems.filter(
      (item) => item.status === "blocked_until_client_owned"
    ).length,
    firstBuildStepCount: starterPackage.firstBuildSequence.length,
    safetyRuleCount: starterPackage.safetyRules.length
  };
}

export function validateClientRepoStarterPackage(
  starterPackage: ClientRepoStarterPackage = buildClientRepoStarterPackage()
): ClientRepoStarterValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (starterPackage.starterItems.length === 0) {
    errors.push("Starter package must define at least one repo item.");
  }

  if (starterPackage.firstBuildSequence.length === 0) {
    errors.push("Starter package must define a first build sequence.");
  }

  if (starterPackage.safetyRules.length === 0) {
    errors.push("Starter package must define safety rules.");
  }

  const hasMockDataReplacement = starterPackage.starterItems.some(
    (item) => item.path === "src/domain/mock-data.ts" && item.status === "replace_per_client"
  );

  if (!hasMockDataReplacement) {
    errors.push("Mock data replacement must be explicit for client-specific implementations.");
  }

  const hasPaymentBlock = starterPackage.starterItems.some(
    (item) => item.path === "src/payments" && item.status === "blocked_until_client_owned"
  );

  if (!hasPaymentBlock) {
    errors.push("Payment boundary must stay blocked until client-owned configuration exists.");
  }

  const mentionsCredentials = starterPackage.safetyRules.some((rule) =>
    rule.toLowerCase().includes("credentials")
  );

  if (!mentionsCredentials) {
    warnings.push("Safety rules should explicitly mention credentials.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
