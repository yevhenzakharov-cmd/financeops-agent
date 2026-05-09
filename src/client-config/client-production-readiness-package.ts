import { buildClientComplianceReviewPackage } from "./client-compliance-review-package.js";
import { buildClientControlMatrix } from "./client-control-matrix.js";
import { buildClientRiskAcceptancePackage } from "./client-risk-acceptance-package.js";
import { buildClientSecurityQuestionnairePackage } from "./client-security-questionnaire-package.js";

export type ClientProductionReadinessStatus =
  | "production_readiness_draft_ready"
  | "production_readiness_blocked_waiting_for_client"
  | "production_blocked";

export type ClientProductionReadinessGateStatus =
  | "demo_ready"
  | "pilot_ready_with_controls"
  | "client_input_required"
  | "blocked_until_client_owned";

export type ClientProductionReadinessCategory =
  | "data"
  | "authentication"
  | "authorization"
  | "secrets"
  | "finance_controls"
  | "payment_controls"
  | "accounting_controls"
  | "audit_logging"
  | "monitoring"
  | "deployment"
  | "incident_response"
  | "compliance";

export interface ClientProductionReadinessGate {
  id: string;
  category: ClientProductionReadinessCategory;
  title: string;
  status: ClientProductionReadinessGateStatus;
  owner: "builder" | "client" | "shared";
  productionRequirement: string;
  currentDemoPosition: string;
  evidence: string[];
  clientInputNeeded: string[];
  productionBlocker: string;
}

export interface ClientProductionReadinessPackage {
  packageVersion: "client-production-readiness-package-v1";
  status: ClientProductionReadinessStatus;
  purpose: string;
  executiveSummary: string;
  gates: ClientProductionReadinessGate[];
  demoReadyGateCount: number;
  pilotReadyWithControlsGateCount: number;
  clientInputRequiredGateCount: number;
  blockedUntilClientOwnedGateCount: number;
  productionBlockers: string[];
  clientProductionInputsNeeded: string[];
  recommendedProductionDecision: string;
}

export interface ClientProductionReadinessPackageValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientProductionReadinessPackage(): ClientProductionReadinessPackage {
  const compliancePackage = buildClientComplianceReviewPackage();
  const securityQuestionnaire = buildClientSecurityQuestionnairePackage();
  const riskPackage = buildClientRiskAcceptancePackage();
  const controlMatrix = buildClientControlMatrix();

  const gates: ClientProductionReadinessGate[] = [
    {
      id: "production-data-handling",
      category: "data",
      title: "Production data handling",
      status: "blocked_until_client_owned",
      owner: "client",
      productionRequirement:
        "Client must define where production finance data lives, which fields are allowed, how data is retained, and how private data is deleted.",
      currentDemoPosition:
        "The public demo uses mock data only and does not store production client records.",
      evidence: [
        "Security questionnaire covers data handling.",
        "Compliance review blocks production data handling.",
        "Risk acceptance package blocks production data handling approval."
      ],
      clientInputNeeded: [
        "Approved production data source",
        "Safe sample policy",
        "Retention policy",
        "Deletion process",
        "Data access owner"
      ],
      productionBlocker:
        "Production data cannot be used until privacy, retention, access, and deletion requirements are client-owned."
    },
    {
      id: "production-authentication",
      category: "authentication",
      title: "Client-owned authentication",
      status: "blocked_until_client_owned",
      owner: "client",
      productionRequirement:
        "Production must use client-owned authentication rather than the demo API key.",
      currentDemoPosition:
        "The demo uses x-demo-api-key gating for action-like routes only.",
      evidence: [
        "Demo auth status explains protected routes.",
        "Security questionnaire blocks production authentication.",
        "Control matrix blocks production auth until client-owned controls exist."
      ],
      clientInputNeeded: [
        "Identity provider",
        "Authentication method",
        "Session policy",
        "Pilot reviewer identities",
        "Production user list"
      ],
      productionBlocker:
        "Production authentication is blocked until the client provides and owns the identity layer."
    },
    {
      id: "production-authorization",
      category: "authorization",
      title: "Role-based authorization",
      status: "blocked_until_client_owned",
      owner: "client",
      productionRequirement:
        "Production must define who can view, approve, export, configure, and execute workflows.",
      currentDemoPosition:
        "The demo separates public reviewer endpoints from protected action-like routes, but does not implement client RBAC.",
      evidence: [
        "Security questionnaire blocks authorization until client-owned controls exist.",
        "Compliance review blocks production access controls.",
        "Risk acceptance package requires reviewer and approver ownership."
      ],
      clientInputNeeded: [
        "Viewer role",
        "Reviewer role",
        "Approver role",
        "Exporter role",
        "Admin role",
        "Escalation owner"
      ],
      productionBlocker:
        "Production permissions are blocked until client-owned role mapping is accepted."
    },
    {
      id: "production-secrets",
      category: "secrets",
      title: "Client-owned secret management",
      status: "blocked_until_client_owned",
      owner: "client",
      productionRequirement:
        "Production credentials, tokens, API keys, and integration secrets must live in client-owned secret management.",
      currentDemoPosition:
        "The public repo must not contain production credentials.",
      evidence: [
        "Security questionnaire blocks production secrets.",
        "Red-team report blocks committed production credentials.",
        "Control matrix blocks production secrets until client-owned management exists."
      ],
      clientInputNeeded: [
        "Secret manager",
        "Runtime injection method",
        "Rotation policy",
        "Credential owner",
        "Revocation process"
      ],
      productionBlocker:
        "Production integrations are blocked until client-owned secret handling exists."
    },
    {
      id: "production-finance-controls",
      category: "finance_controls",
      title: "Finance control ownership",
      status: "client_input_required",
      owner: "client",
      productionRequirement:
        "Client must approve finance rules, tolerances, review logic, exception thresholds, and escalation paths.",
      currentDemoPosition:
        "The demo uses deterministic finance logic and approval-gated outputs.",
      evidence: [
        "Compliance review covers financial controls.",
        "Risk acceptance package requires accepted pilot scope and approval thresholds.",
        `Production-blocked controls: ${controlMatrix.productionBlockedControls.length}.`
      ],
      clientInputNeeded: [
        "Finance owner",
        "Exception thresholds",
        "Approval thresholds",
        "Escalation policy",
        "Blocked decision list"
      ],
      productionBlocker:
        "Production finance decisions are blocked until client-owned finance controls are approved."
    },
    {
      id: "production-payment-controls",
      category: "payment_controls",
      title: "Payment execution boundary",
      status: "blocked_until_client_owned",
      owner: "client",
      productionRequirement:
        "Client must define whether payment outputs are recommendations only, approval drafts, or integrated with payment rails under human approval.",
      currentDemoPosition:
        "The demo treats payment-like actions as protected and approval-gated.",
      evidence: [
        "Security questionnaire blocks autonomous money movement.",
        "Compliance review blocks payment controls.",
        "Risk acceptance package blocks autonomous money movement."
      ],
      clientInputNeeded: [
        "Payment rail owner",
        "Authorized approvers",
        "Payment approval policy",
        "Payment thresholds",
        "Explicit exclusions"
      ],
      productionBlocker:
        "No autonomous money movement is approved."
    },
    {
      id: "production-accounting-controls",
      category: "accounting_controls",
      title: "Accounting write-back boundary",
      status: "blocked_until_client_owned",
      owner: "client",
      productionRequirement:
        "Client must define whether accounting outputs are read-only, draft-only, or write-back capable under approval.",
      currentDemoPosition:
        "The demo does not post accounting entries.",
      evidence: [
        "README states AI does not post accounting entries.",
        "Compliance review blocks accounting write-back.",
        "Risk acceptance package blocks accounting write-back approval."
      ],
      clientInputNeeded: [
        "Accounting system owner",
        "Posting approval policy",
        "Draft-entry policy",
        "Rollback process",
        "Integration permissions"
      ],
      productionBlocker:
        "No accounting write-back is approved until client-owned accounting controls exist."
    },
    {
      id: "production-audit-logging",
      category: "audit_logging",
      title: "Production audit logging and retention",
      status: "pilot_ready_with_controls",
      owner: "shared",
      productionRequirement:
        "Production must retain traceable audit evidence for inputs, decisions, approvals, generated outputs, and sensitive workflow steps.",
      currentDemoPosition:
        "The demo exposes audit visibility, execution ledger, approval queue, artifact registry, and output artifacts.",
      evidence: [
        "Audit visibility endpoints exist.",
        "Artifact registry endpoints exist.",
        "Evidence binder includes audit traceability."
      ],
      clientInputNeeded: [
        "Audit retention period",
        "Audit access role",
        "Audit export format",
        "Compliance reviewer"
      ],
      productionBlocker:
        "Production audit policy must be accepted by the client before production use."
    },
    {
      id: "production-monitoring",
      category: "monitoring",
      title: "Monitoring and alerting",
      status: "client_input_required",
      owner: "client",
      productionRequirement:
        "Production must define request monitoring, workflow failure alerts, exception alerts, and operational owners.",
      currentDemoPosition:
        "The demo exposes request observability and validation output, but production monitoring must be client-owned.",
      evidence: [
        "Request observability endpoint exists.",
        "Security questionnaire requests monitoring destination and alert owner.",
        "Risk acceptance package requires operational owner."
      ],
      clientInputNeeded: [
        "Monitoring destination",
        "Alert owner",
        "Notification channels",
        "Failure thresholds",
        "Escalation path"
      ],
      productionBlocker:
        "Production monitoring is blocked until alert routing and operational ownership are defined."
    },
    {
      id: "production-deployment",
      category: "deployment",
      title: "Client-approved deployment environment",
      status: "blocked_until_client_owned",
      owner: "client",
      productionRequirement:
        "Production must run in a client-approved runtime with environment separation, secret handling, monitoring, and rollback process.",
      currentDemoPosition:
        "The public repository is a demo and portfolio project, not a production deployment.",
      evidence: [
        "Compliance review blocks production deployment approval.",
        "Risk acceptance package blocks deployment risk for production.",
        "Security questionnaire blocks production deployment approval."
      ],
      clientInputNeeded: [
        "Hosting model",
        "Runtime owner",
        "Environment separation policy",
        "Deployment owner",
        "Rollback process"
      ],
      productionBlocker:
        "Production deployment is blocked until the client approves runtime, secrets, monitoring, and ownership."
    },
    {
      id: "production-incident-response",
      category: "incident_response",
      title: "Incident response ownership",
      status: "client_input_required",
      owner: "client",
      productionRequirement:
        "Production must define who responds to failures, incorrect outputs, security issues, and integration outages.",
      currentDemoPosition:
        "The demo documents incident ownership requirements but does not define a client-specific incident process.",
      evidence: [
        "Security questionnaire requests incident owner.",
        "Risk acceptance package requires escalation owner.",
        "Compliance review blocks production approval until incident ownership exists."
      ],
      clientInputNeeded: [
        "Incident owner",
        "Escalation owner",
        "Response time expectations",
        "Notification channels",
        "Post-incident review process"
      ],
      productionBlocker:
        "Production incident response is blocked until client-owned ownership and escalation paths exist."
    },
    {
      id: "production-compliance",
      category: "compliance",
      title: "Final compliance and production signoff",
      status: "blocked_until_client_owned",
      owner: "client",
      productionRequirement:
        "Client must review and approve compliance, security, legal, finance, procurement, and production readiness before production claims are made.",
      currentDemoPosition:
        "The demo provides compliance, procurement, security, risk, and control packages for review but does not certify production readiness.",
      evidence: [
        `Compliance sections: ${compliancePackage.sections.length}.`,
        `Security questionnaire items: ${securityQuestionnaire.items.length}.`,
        `Risk acceptance items: ${riskPackage.items.length}.`
      ],
      clientInputNeeded: [
        "Security signoff",
        "Compliance signoff",
        "Legal signoff",
        "Finance signoff",
        "Procurement signoff",
        "Production go-live owner"
      ],
      productionBlocker:
        "No production readiness claim is allowed until client-owned signoff is complete."
    }
  ];

  const demoReadyGateCount = gates.filter((gate) => gate.status === "demo_ready").length;
  const pilotReadyWithControlsGateCount = gates.filter(
    (gate) => gate.status === "pilot_ready_with_controls"
  ).length;
  const clientInputRequiredGateCount = gates.filter(
    (gate) => gate.status === "client_input_required"
  ).length;
  const blockedUntilClientOwnedGateCount = gates.filter(
    (gate) => gate.status === "blocked_until_client_owned"
  ).length;

  return {
    packageVersion: "client-production-readiness-package-v1",
    status:
      blockedUntilClientOwnedGateCount > 0
        ? "production_blocked"
        : clientInputRequiredGateCount > 0
          ? "production_readiness_blocked_waiting_for_client"
          : "production_readiness_draft_ready",
    purpose:
      "Define the final production-readiness gates that must be satisfied before a client-specific FinanceOps implementation can move from demo or pilot into production.",
    executiveSummary:
      "The project is strong for demo and pilot discovery, but production remains blocked until client-owned controls exist for data, auth, authorization, secrets, finance rules, payment controls, accounting controls, audit retention, monitoring, deployment, incident response, and compliance signoff.",
    gates,
    demoReadyGateCount,
    pilotReadyWithControlsGateCount,
    clientInputRequiredGateCount,
    blockedUntilClientOwnedGateCount,
    productionBlockers: [
      "Production data handling is not approved.",
      "Production authentication is not configured.",
      "Production authorization and roles are not configured.",
      "Production secrets are not client-owned.",
      "Autonomous money movement is not approved.",
      "Accounting write-back is not approved.",
      "Production monitoring and incident response are not configured.",
      "Production deployment is not approved.",
      "Compliance signoff is not complete."
    ],
    clientProductionInputsNeeded: [
      "Production data source and safe sample policy",
      "Identity provider and role map",
      "Secret management model",
      "Finance approval thresholds",
      "Payment approval policy",
      "Accounting write-back policy",
      "Audit retention policy",
      "Monitoring and alert routing",
      "Deployment runtime",
      "Incident response owner",
      "Security and compliance signoff"
    ],
    recommendedProductionDecision:
      "Approve the project for demo and pilot discovery only. Keep production blocked until client-owned controls, deployment, monitoring, and compliance signoff are complete."
  };
}

export function summarizeClientProductionReadinessPackage(
  readinessPackage: ClientProductionReadinessPackage = buildClientProductionReadinessPackage()
) {
  return {
    packageVersion: readinessPackage.packageVersion,
    status: readinessPackage.status,
    gateCount: readinessPackage.gates.length,
    demoReadyGateCount: readinessPackage.demoReadyGateCount,
    pilotReadyWithControlsGateCount: readinessPackage.pilotReadyWithControlsGateCount,
    clientInputRequiredGateCount: readinessPackage.clientInputRequiredGateCount,
    blockedUntilClientOwnedGateCount: readinessPackage.blockedUntilClientOwnedGateCount,
    productionBlockerCount: readinessPackage.productionBlockers.length,
    clientProductionInputCount: readinessPackage.clientProductionInputsNeeded.length
  };
}

export function validateClientProductionReadinessPackage(
  readinessPackage: ClientProductionReadinessPackage = buildClientProductionReadinessPackage()
): ClientProductionReadinessPackageValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredCategories: ClientProductionReadinessCategory[] = [
    "data",
    "authentication",
    "authorization",
    "secrets",
    "finance_controls",
    "payment_controls",
    "accounting_controls",
    "audit_logging",
    "monitoring",
    "deployment",
    "incident_response",
    "compliance"
  ];

  for (const category of requiredCategories) {
    if (!readinessPackage.gates.some((gate) => gate.category === category)) {
      errors.push(`Missing production readiness category: ${category}.`);
    }
  }

  const paymentGate = readinessPackage.gates.find((gate) => gate.id === "production-payment-controls");
  const accountingGate = readinessPackage.gates.find(
    (gate) => gate.id === "production-accounting-controls"
  );
  const deploymentGate = readinessPackage.gates.find((gate) => gate.id === "production-deployment");
  const complianceGate = readinessPackage.gates.find((gate) => gate.id === "production-compliance");

  if (paymentGate?.status !== "blocked_until_client_owned") {
    errors.push("Payment controls must remain blocked until client-owned controls exist.");
  }

  if (accountingGate?.status !== "blocked_until_client_owned") {
    errors.push("Accounting controls must remain blocked until client-owned controls exist.");
  }

  if (deploymentGate?.status !== "blocked_until_client_owned") {
    errors.push("Deployment must remain blocked until client-owned controls exist.");
  }

  if (complianceGate?.status !== "blocked_until_client_owned") {
    errors.push("Compliance signoff must remain blocked until client-owned controls exist.");
  }

  if (readinessPackage.gates.length < 12) {
    errors.push("Production readiness package must include at least 12 gates.");
  }

  if (!readinessPackage.productionBlockers.includes("Autonomous money movement is not approved.")) {
    errors.push("Production readiness package must explicitly block autonomous money movement.");
  }

  if (!readinessPackage.productionBlockers.includes("Accounting write-back is not approved.")) {
    errors.push("Production readiness package must explicitly block accounting write-back.");
  }

  if (readinessPackage.clientProductionInputsNeeded.length < 8) {
    errors.push("Production readiness package must include client production inputs needed.");
  }

  if (readinessPackage.gates.some((gate) => gate.productionRequirement.trim().length === 0)) {
    errors.push("Every production readiness gate must include a production requirement.");
  }

  if (readinessPackage.pilotReadyWithControlsGateCount === 0) {
    warnings.push("No gates are marked pilot-ready with controls.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
