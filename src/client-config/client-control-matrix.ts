import { buildClientAcceptanceGate } from "./client-acceptance-gate.js";
import { buildClientDeploymentProfile } from "./client-deployment-profile.js";
import { buildClientDueDiligencePack } from "./client-due-diligence-pack.js";
import { buildClientEnterpriseRedTeamReport } from "./client-enterprise-red-team.js";

export type ClientControlMatrixStatus = "demo_controls_visible" | "pilot_controls_required" | "production_blocked";

export type ClientControlStatus =
  | "available_in_demo"
  | "client_configuration_required"
  | "blocked_until_client_owned";

export type ClientControlCategory =
  | "data"
  | "auth"
  | "secrets"
  | "payments"
  | "accounting"
  | "audit"
  | "monitoring"
  | "ai_boundary";

export interface ClientControlMatrixItem {
  id: string;
  category: ClientControlCategory;
  controlName: string;
  status: ClientControlStatus;
  owner: "builder" | "client" | "shared";
  riskControlled: string;
  demoEvidence: string[];
  productionRequirement: string[];
  reviewerQuestion: string;
}

export interface ClientControlMatrix {
  matrixVersion: "client-control-matrix-v1";
  status: ClientControlMatrixStatus;
  purpose: string;
  items: ClientControlMatrixItem[];
  productionBlockedControls: string[];
  clientOwnedControlsRequired: string[];
  reviewerSummary: string;
}

export interface ClientControlMatrixValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientControlMatrix(): ClientControlMatrix {
  const dueDiligencePack = buildClientDueDiligencePack();
  const acceptanceGate = buildClientAcceptanceGate();
  const deploymentProfile = buildClientDeploymentProfile();
  const redTeamReport = buildClientEnterpriseRedTeamReport();
  const blockedRedTeamFindings = redTeamReport.findings.filter(
    (finding) => finding.severity === "blocked"
  );

  const items: ClientControlMatrixItem[] = [
    {
      id: "control-safe-data-boundary",
      category: "data",
      controlName: "Safe data boundary",
      status: "client_configuration_required",
      owner: "shared",
      riskControlled: "Private financial records entering a public demo repository or unmanaged runtime.",
      demoEvidence: [
        "Public demo uses safe mock data.",
        "Due diligence pack asks where production financial data lives."
      ],
      productionRequirement: [
        "Client-owned data source selected.",
        "Private records stay outside public git history.",
        "Representative safe samples approved before pilot."
      ],
      reviewerQuestion: "Can the client confirm the source system and safe-sample strategy?"
    },
    {
      id: "control-client-owned-auth",
      category: "auth",
      controlName: "Client-owned authentication and authorization",
      status: "blocked_until_client_owned",
      owner: "client",
      riskControlled: "Unauthorized access to finance workflows, approval routes, or sensitive outputs.",
      demoEvidence: [
        "Demo API key protects action-like routes.",
        `Deployment status: ${deploymentProfile.status}.`
      ],
      productionRequirement: [
        "Client identity provider or auth model selected.",
        "Finance reviewer and approver roles mapped.",
        "Sensitive routes role-gated."
      ],
      reviewerQuestion: "Who can view, approve, reject, export, or execute finance actions?"
    },
    {
      id: "control-secret-management",
      category: "secrets",
      controlName: "Client-owned secret management",
      status: "blocked_until_client_owned",
      owner: "client",
      riskControlled: "Production credentials stored locally, committed, or exposed to the builder.",
      demoEvidence: [
        "Red-team report blocks committed production credentials.",
        `Blocked red-team findings: ${blockedRedTeamFindings.length}.`,
        "Deployment profile requires client-owned secrets."
      ],
      productionRequirement: [
        "Secret manager selected by client.",
        "Credential rotation owner assigned.",
        "No production credentials committed."
      ],
      reviewerQuestion: "Where will bank, ERP, payroll, and API credentials be stored?"
    },
    {
      id: "control-payment-human-approval",
      category: "payments",
      controlName: "Human approval for payment-like actions",
      status: "blocked_until_client_owned",
      owner: "client",
      riskControlled: "Agent moving money without authorized finance approval.",
      demoEvidence: [
        `Acceptance gate status: ${acceptanceGate.status}.`,
        "Red-team report blocks autonomous money movement claims."
      ],
      productionRequirement: [
        "Approver roles configured.",
        "Approval threshold policy accepted.",
        "Payment rail integration remains client-owned."
      ],
      reviewerQuestion: "Which payment actions can be prepared, approved, rejected, or executed?"
    },
    {
      id: "control-accounting-posting-gate",
      category: "accounting",
      controlName: "Human approval for accounting postings",
      status: "blocked_until_client_owned",
      owner: "client",
      riskControlled: "Agent posting journal entries or accounting changes without controller review.",
      demoEvidence: [
        "Governance rules keep accounting postings human-approved.",
        "Due diligence pack frames production accounting as client-owned."
      ],
      productionRequirement: [
        "Controller approval role defined.",
        "Posting policy accepted.",
        "Accounting system write permissions are explicitly scoped."
      ],
      reviewerQuestion: "Which accounting actions are suggestion-only versus write-enabled?"
    },
    {
      id: "control-audit-traceability",
      category: "audit",
      controlName: "Audit trail and artifact traceability",
      status: "available_in_demo",
      owner: "shared",
      riskControlled: "Reviewer cannot trace what the system did, why, or what artifact was produced.",
      demoEvidence: [
        "Audit, ledger, approval, payment, and output artifacts are generated.",
        "Artifact registry reports available artifacts."
      ],
      productionRequirement: [
        "Retention period accepted.",
        "Audit access role-gated.",
        "Client compliance reviewer accepts evidence format."
      ],
      reviewerQuestion: "What audit retention, export, and access requirements apply?"
    },
    {
      id: "control-monitoring-incident-ownership",
      category: "monitoring",
      controlName: "Monitoring and incident ownership",
      status: "client_configuration_required",
      owner: "shared",
      riskControlled: "Production failures without alerts, owner, or escalation path.",
      demoEvidence: [
        "Demo exposes request observability endpoints.",
        "Deployment profile lists monitoring and incident ownership as required."
      ],
      productionRequirement: [
        "Monitoring destination selected.",
        "Alert thresholds accepted.",
        "Incident owner and escalation path assigned."
      ],
      reviewerQuestion: "Who gets alerted when a workflow fails, blocks, or needs approval?"
    },
    {
      id: "control-ai-explanation-boundary",
      category: "ai_boundary",
      controlName: "Deterministic finance logic with AI explanation boundary",
      status: "available_in_demo",
      owner: "builder",
      riskControlled: "AI hallucinating financial calculations or inventing finance conclusions.",
      demoEvidence: [
        "Financial calculations are produced by deterministic logic.",
        "AI-style briefing explains already-computed outputs.",
        "Red-team report blocks claims that AI produces the financial calculations."
      ],
      productionRequirement: [
        "Client schemas accepted.",
        "Calculation rules reviewed.",
        "Finance edge cases tested with client-shaped safe data."
      ],
      reviewerQuestion: "Can every number in the output be traced to deterministic input and logic?"
    }
  ];

  const blockedControls = items.filter((item) => item.status === "blocked_until_client_owned");

  return {
    matrixVersion: "client-control-matrix-v1",
    status:
      blockedControls.length > 0
        ? "production_blocked"
        : dueDiligencePack.status === "pilot_review_required"
          ? "pilot_controls_required"
          : "demo_controls_visible",
    purpose:
      "Map enterprise FinanceOps risks to demo evidence, client-owned production requirements, owners, and reviewer questions.",
    items,
    productionBlockedControls: blockedControls.map((item) => item.controlName),
    clientOwnedControlsRequired: [
      ...deploymentProfile.blockedUntilClientProvides,
      "Role-based approval policy",
      "Client-owned payment and accounting permissions"
    ],
    reviewerSummary:
      "The control matrix shows strong demo evidence for auditability and AI boundary controls, while production remains blocked until client-owned auth, secrets, approvals, monitoring, and deployment controls exist.",
  };
}

export function summarizeClientControlMatrix(
  matrix: ClientControlMatrix = buildClientControlMatrix()
) {
  return {
    matrixVersion: matrix.matrixVersion,
    status: matrix.status,
    itemCount: matrix.items.length,
    availableInDemoControls: matrix.items.filter((item) => item.status === "available_in_demo").length,
    clientConfigurationRequiredControls: matrix.items.filter(
      (item) => item.status === "client_configuration_required"
    ).length,
    blockedUntilClientOwnedControls: matrix.items.filter(
      (item) => item.status === "blocked_until_client_owned"
    ).length,
    productionBlockedControlCount: matrix.productionBlockedControls.length
  };
}

export function validateClientControlMatrix(
  matrix: ClientControlMatrix = buildClientControlMatrix()
): ClientControlMatrixValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredCategories: ClientControlCategory[] = [
    "data",
    "auth",
    "secrets",
    "payments",
    "accounting",
    "audit",
    "monitoring",
    "ai_boundary"
  ];

  for (const category of requiredCategories) {
    if (!matrix.items.some((item) => item.category === category)) {
      errors.push(`Missing control category: ${category}.`);
    }
  }

  const paymentControl = matrix.items.find((item) => item.id === "control-payment-human-approval");
  const secretControl = matrix.items.find((item) => item.id === "control-secret-management");
  const authControl = matrix.items.find((item) => item.id === "control-client-owned-auth");

  if (paymentControl?.status !== "blocked_until_client_owned") {
    errors.push("Payment-like actions must remain blocked until client-owned approval controls exist.");
  }

  if (secretControl?.status !== "blocked_until_client_owned") {
    errors.push("Production secret management must remain blocked until client-owned controls exist.");
  }

  if (authControl?.status !== "blocked_until_client_owned") {
    errors.push("Production auth must remain blocked until client-owned controls exist.");
  }

  if (matrix.items.some((item) => item.reviewerQuestion.trim().length === 0)) {
    errors.push("Every control must include a reviewer question.");
  }

  if (matrix.productionBlockedControls.length === 0) {
    warnings.push("No production-blocked controls are listed.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
