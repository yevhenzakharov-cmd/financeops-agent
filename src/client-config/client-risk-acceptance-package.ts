import { buildClientComplianceReviewPackage } from "./client-compliance-review-package.js";
import { buildClientControlMatrix } from "./client-control-matrix.js";
import { buildClientProcurementReviewPackage } from "./client-procurement-review-package.js";
import { buildClientSecurityQuestionnairePackage } from "./client-security-questionnaire-package.js";

export type ClientRiskAcceptanceStatus =
  | "risk_acceptance_draft_ready"
  | "risk_acceptance_blocked_waiting_for_client"
  | "production_blocked";

export type ClientRiskAcceptanceDecision =
  | "accepted_for_demo"
  | "accepted_for_pilot_with_controls"
  | "client_input_required"
  | "blocked_for_production";

export type ClientRiskAcceptanceCategory =
  | "data"
  | "security"
  | "payments"
  | "accounting"
  | "ai_governance"
  | "auditability"
  | "deployment"
  | "compliance"
  | "procurement"
  | "operations";

export interface ClientRiskAcceptanceItem {
  id: string;
  category: ClientRiskAcceptanceCategory;
  title: string;
  decision: ClientRiskAcceptanceDecision;
  owner: "builder" | "client" | "shared";
  riskStatement: string;
  acceptanceRationale: string;
  evidence: string[];
  clientInputNeeded: string[];
  productionBoundary: string;
}

export interface ClientRiskAcceptancePackage {
  packageVersion: "client-risk-acceptance-package-v1";
  status: ClientRiskAcceptanceStatus;
  purpose: string;
  executiveSummary: string;
  items: ClientRiskAcceptanceItem[];
  acceptedForDemoCount: number;
  acceptedForPilotWithControlsCount: number;
  clientInputRequiredCount: number;
  blockedForProductionCount: number;
  residualRisks: string[];
  clientAcceptanceInputsNeeded: string[];
  blockedProductionClaims: string[];
  recommendedRiskDecision: string;
}

export interface ClientRiskAcceptancePackageValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientRiskAcceptancePackage(): ClientRiskAcceptancePackage {
  const compliancePackage = buildClientComplianceReviewPackage();
  const securityQuestionnaire = buildClientSecurityQuestionnairePackage();
  const procurementPackage = buildClientProcurementReviewPackage();
  const controlMatrix = buildClientControlMatrix();

  const items: ClientRiskAcceptanceItem[] = [
    {
      id: "risk-demo-data",
      category: "data",
      title: "Mock data is acceptable for public demo review",
      decision: "accepted_for_demo",
      owner: "builder",
      riskStatement:
        "A public demo can be misleading if reviewers think mock data represents production integration.",
      acceptanceRationale:
        "The repository clearly positions the current dataset as demo-safe mock data and blocks production data until client-owned controls exist.",
      evidence: [
        "README states the public demo uses mock data.",
        "Compliance package blocks production data handling until client-owned controls exist.",
        "Security questionnaire explains that production client data must remain client-owned."
      ],
      clientInputNeeded: [
        "Client safe sample policy",
        "Production data storage location",
        "Data retention policy"
      ],
      productionBoundary:
        "Production data is not accepted until the client confirms privacy, retention, access, and storage requirements."
    },
    {
      id: "risk-demo-auth",
      category: "security",
      title: "Demo API key is acceptable for demo-only protected routes",
      decision: "accepted_for_demo",
      owner: "builder",
      riskStatement:
        "Demo API-key protection is not a production authentication or authorization model.",
      acceptanceRationale:
        "The demo API key is acceptable for protecting action-like demo routes while keeping reviewer endpoints public.",
      evidence: [
        "Demo auth status explains protected action routes.",
        "Security questionnaire blocks production authentication until client-owned identity exists.",
        "Control matrix keeps production auth client-owned."
      ],
      clientInputNeeded: [
        "Client identity provider",
        "Role map",
        "Approver list"
      ],
      productionBoundary:
        "Production auth remains blocked until client-owned identity and authorization controls exist."
    },
    {
      id: "risk-payment-boundary",
      category: "payments",
      title: "Payment-like actions are blocked for production",
      decision: "blocked_for_production",
      owner: "client",
      riskStatement:
        "Money movement is high-risk and must not be executed autonomously by AI or demo logic.",
      acceptanceRationale:
        "Payment-like flows can be reviewed as approval-gated simulations or recommendations, but production execution is blocked.",
      evidence: [
        "Security questionnaire explicitly blocks autonomous money movement.",
        "Compliance package blocks payment controls until client-owned controls exist.",
        "Procurement package blocks autonomous payment approval."
      ],
      clientInputNeeded: [
        "Payment approval policy",
        "Authorized approver list",
        "Payment rail owner",
        "Approval thresholds"
      ],
      productionBoundary:
        "No autonomous money movement is accepted."
    },
    {
      id: "risk-accounting-writeback",
      category: "accounting",
      title: "Accounting write-back is blocked for production",
      decision: "blocked_for_production",
      owner: "client",
      riskStatement:
        "Posting accounting entries without client-owned approval could create financial reporting errors.",
      acceptanceRationale:
        "The current system can discuss accounting draft outputs, but production write-back must remain blocked.",
      evidence: [
        "Compliance package blocks accounting write-back approval.",
        "README states AI does not post accounting entries.",
        "Governance packages require human approval for accounting postings."
      ],
      clientInputNeeded: [
        "Accounting system owner",
        "Posting approval policy",
        "Journal-entry review owner",
        "Rollback process"
      ],
      productionBoundary:
        "No accounting write-back is accepted until client-owned accounting controls exist."
    },
    {
      id: "risk-ai-explanation",
      category: "ai_governance",
      title: "AI explanation is acceptable when grounded in deterministic outputs",
      decision: "accepted_for_pilot_with_controls",
      owner: "shared",
      riskStatement:
        "AI-generated explanations can be risky if reviewers treat them as the source of financial truth.",
      acceptanceRationale:
        "AI is acceptable as a communication layer only when calculations and classifications come from deterministic logic.",
      evidence: [
        "README states AI does not perform financial calculations.",
        "Compliance package defines AI governance boundaries.",
        "Security questionnaire includes AI boundary review."
      ],
      clientInputNeeded: [
        "Accepted AI usage policy",
        "Blocked AI decision types",
        "Reviewer owner for AI-generated explanations"
      ],
      productionBoundary:
        "AI must not replace client-owned finance, legal, tax, compliance, or payment approval."
    },
    {
      id: "risk-audit-visibility",
      category: "auditability",
      title: "Audit visibility is acceptable for demo and pilot review",
      decision: "accepted_for_pilot_with_controls",
      owner: "shared",
      riskStatement:
        "Audit evidence must be traceable enough for reviewers to understand what happened and why.",
      acceptanceRationale:
        "The demo exposes audit visibility, execution ledger, approval queue, artifact registry, and output artifacts.",
      evidence: [
        "Audit visibility endpoints exist.",
        "Artifact registry endpoints exist.",
        "Compliance package confirms auditability and traceability."
      ],
      clientInputNeeded: [
        "Audit retention policy",
        "Audit reviewer role",
        "Export format",
        "Compliance review owner"
      ],
      productionBoundary:
        "Production audit access, retention, and export rules must be client-owned."
    },
    {
      id: "risk-deployment",
      category: "deployment",
      title: "Production deployment is blocked until client-owned controls exist",
      decision: "blocked_for_production",
      owner: "client",
      riskStatement:
        "A public demo repository must not be treated as an approved production deployment.",
      acceptanceRationale:
        "Production readiness depends on client-owned hosting, auth, secrets, monitoring, data handling, and incident response.",
      evidence: [
        "Compliance package blocks production approval.",
        "Security questionnaire blocks production deployment approval.",
        "Procurement package blocks production deployment approval."
      ],
      clientInputNeeded: [
        "Production runtime",
        "Secret management model",
        "Monitoring owner",
        "Incident response owner",
        "Deployment owner"
      ],
      productionBoundary:
        "No production readiness claim is accepted until client-owned controls are configured and approved."
    },
    {
      id: "risk-compliance-review",
      category: "compliance",
      title: "Compliance review is ready for discovery but not certification",
      decision: "client_input_required",
      owner: "shared",
      riskStatement:
        "A demo compliance package can support discussion but cannot certify enterprise compliance.",
      acceptanceRationale:
        "The package is useful for discovery because it lists boundaries, questions, client inputs, and blocked production claims.",
      evidence: [
        `Compliance sections: ${compliancePackage.sections.length}.`,
        `Compliance blocked claims: ${compliancePackage.blockedProductionClaims.length}.`
      ],
      clientInputNeeded: [
        "Compliance reviewer",
        "Data retention policy",
        "Approval policy",
        "Production approval criteria"
      ],
      productionBoundary:
        "Enterprise compliance certification remains blocked until client review and controls exist."
    },
    {
      id: "risk-procurement-review",
      category: "procurement",
      title: "Procurement review is ready for buyer discussion",
      decision: "client_input_required",
      owner: "shared",
      riskStatement:
        "A buyer may approve the idea but procurement can still block the pilot without required vendor, legal, security, and finance inputs.",
      acceptanceRationale:
        "The procurement package maps the required enterprise review path and identifies client-owned blockers.",
      evidence: [
        `Procurement sections: ${procurementPackage.sections.length}.`,
        "Procurement package covers vendor intake, security, legal, data, finance terms, workflow, pilot boundary, and decision owner."
      ],
      clientInputNeeded: [
        "Vendor onboarding form",
        "Security reviewer",
        "Legal reviewer",
        "Finance owner",
        "Procurement owner"
      ],
      productionBoundary:
        "Procurement discussion supports pilot approval only, not production deployment."
    },
    {
      id: "risk-operations",
      category: "operations",
      title: "Operations ownership must be confirmed before pilot",
      decision: "client_input_required",
      owner: "client",
      riskStatement:
        "A pilot can stall or become unsafe if no one owns monitoring, review cadence, escalation, and incident response.",
      acceptanceRationale:
        "The repo now exposes enough packages for operational planning, but client ownership must be named.",
      evidence: [
        `Security questionnaire items: ${securityQuestionnaire.items.length}.`,
        `Control matrix items: ${controlMatrix.items.length}.`
      ],
      clientInputNeeded: [
        "Operational owner",
        "Review cadence",
        "Monitoring destination",
        "Escalation owner",
        "Incident response owner"
      ],
      productionBoundary:
        "Production operations remain blocked until ownership, monitoring, and escalation paths are accepted."
    }
  ];

  const acceptedForDemoCount = items.filter((item) => item.decision === "accepted_for_demo").length;
  const acceptedForPilotWithControlsCount = items.filter(
    (item) => item.decision === "accepted_for_pilot_with_controls"
  ).length;
  const clientInputRequiredCount = items.filter(
    (item) => item.decision === "client_input_required"
  ).length;
  const blockedForProductionCount = items.filter(
    (item) => item.decision === "blocked_for_production"
  ).length;

  return {
    packageVersion: "client-risk-acceptance-package-v1",
    status:
      blockedForProductionCount > 0
        ? "production_blocked"
        : clientInputRequiredCount > 0
          ? "risk_acceptance_blocked_waiting_for_client"
          : "risk_acceptance_draft_ready",
    purpose:
      "Convert security, procurement, compliance, and control findings into a clear risk acceptance package for demo, pilot, and production-readiness review.",
    executiveSummary:
      "The demo is acceptable for technical and buyer review, and selected pilot risks can be accepted with controls. Production remains blocked for money movement, accounting write-back, production data, auth, secrets, monitoring, deployment, and compliance certification until client-owned controls exist.",
    items,
    acceptedForDemoCount,
    acceptedForPilotWithControlsCount,
    clientInputRequiredCount,
    blockedForProductionCount,
    residualRisks: [
      "Client must confirm real input sources and safe sample policy.",
      "Client must confirm reviewers, approvers, and escalation owners.",
      "Client must define production auth, authorization, secrets, monitoring, and incident response.",
      "Client must approve payment and accounting write-back boundaries before any production integration.",
      "Client must validate compliance requirements before production claims."
    ],
    clientAcceptanceInputsNeeded: [
      "Risk owner list",
      "Accepted pilot scope",
      "Safe sample policy",
      "Approval thresholds",
      "Blocked action list",
      "Production control checklist",
      "Compliance reviewer signoff path"
    ],
    blockedProductionClaims: [
      "No autonomous money movement",
      "No accounting write-back approval",
      "No production data handling approval",
      "No production security approval",
      "No enterprise compliance certification",
      "No production deployment approval"
    ],
    recommendedRiskDecision:
      "Accept the current repository for demo and technical review, use it for pilot discovery, and keep production blocked until client-owned controls and risk owners are confirmed."
  };
}

export function summarizeClientRiskAcceptancePackage(
  riskPackage: ClientRiskAcceptancePackage = buildClientRiskAcceptancePackage()
) {
  return {
    packageVersion: riskPackage.packageVersion,
    status: riskPackage.status,
    itemCount: riskPackage.items.length,
    acceptedForDemoCount: riskPackage.acceptedForDemoCount,
    acceptedForPilotWithControlsCount: riskPackage.acceptedForPilotWithControlsCount,
    clientInputRequiredCount: riskPackage.clientInputRequiredCount,
    blockedForProductionCount: riskPackage.blockedForProductionCount,
    residualRiskCount: riskPackage.residualRisks.length,
    clientAcceptanceInputCount: riskPackage.clientAcceptanceInputsNeeded.length,
    blockedProductionClaimCount: riskPackage.blockedProductionClaims.length
  };
}

export function validateClientRiskAcceptancePackage(
  riskPackage: ClientRiskAcceptancePackage = buildClientRiskAcceptancePackage()
): ClientRiskAcceptancePackageValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredCategories: ClientRiskAcceptanceCategory[] = [
    "data",
    "security",
    "payments",
    "accounting",
    "ai_governance",
    "auditability",
    "deployment",
    "compliance",
    "procurement",
    "operations"
  ];

  for (const category of requiredCategories) {
    if (!riskPackage.items.some((item) => item.category === category)) {
      errors.push(`Missing risk acceptance category: ${category}.`);
    }
  }

  const paymentRisk = riskPackage.items.find((item) => item.id === "risk-payment-boundary");
  const accountingRisk = riskPackage.items.find((item) => item.id === "risk-accounting-writeback");
  const deploymentRisk = riskPackage.items.find((item) => item.id === "risk-deployment");

  if (paymentRisk?.decision !== "blocked_for_production") {
    errors.push("Payment risk must remain blocked for production.");
  }

  if (accountingRisk?.decision !== "blocked_for_production") {
    errors.push("Accounting write-back risk must remain blocked for production.");
  }

  if (deploymentRisk?.decision !== "blocked_for_production") {
    errors.push("Deployment risk must remain blocked for production.");
  }

  if (riskPackage.items.length < 10) {
    errors.push("Risk acceptance package must include at least 10 items.");
  }

  if (!riskPackage.blockedProductionClaims.includes("No autonomous money movement")) {
    errors.push("Risk acceptance package must explicitly block autonomous money movement.");
  }

  if (!riskPackage.blockedProductionClaims.includes("No accounting write-back approval")) {
    errors.push("Risk acceptance package must explicitly block accounting write-back approval.");
  }

  if (riskPackage.residualRisks.length < 4) {
    errors.push("Risk acceptance package must include residual risks.");
  }

  if (riskPackage.items.some((item) => item.riskStatement.trim().length === 0)) {
    errors.push("Every risk acceptance item must include a risk statement.");
  }

  if (riskPackage.acceptedForDemoCount === 0) {
    warnings.push("No risks are marked accepted for demo.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
