import { buildClientControlMatrix } from "./client-control-matrix.js";
import { buildClientDueDiligencePack } from "./client-due-diligence-pack.js";
import { buildClientProcurementReviewPackage } from "./client-procurement-review-package.js";
import { buildClientSecurityQuestionnairePackage } from "./client-security-questionnaire-package.js";

export type ClientComplianceReviewStatus =
  | "compliance_review_draft_ready"
  | "compliance_review_blocked_waiting_for_client"
  | "production_blocked";

export type ClientComplianceReviewSectionStatus =
  | "draft_ready"
  | "client_input_required"
  | "blocked_until_client_owned";

export type ClientComplianceReviewCategory =
  | "data_privacy"
  | "financial_controls"
  | "ai_governance"
  | "auditability"
  | "payment_controls"
  | "accounting_controls"
  | "access_controls"
  | "retention_policy"
  | "vendor_review"
  | "production_approval";

export interface ClientComplianceReviewSection {
  id: string;
  category: ClientComplianceReviewCategory;
  title: string;
  status: ClientComplianceReviewSectionStatus;
  owner: "builder" | "client" | "shared";
  complianceQuestion: string;
  demoSafeAnswer: string;
  evidence: string[];
  clientInputNeeded: string[];
  productionBoundary: string;
}

export interface ClientComplianceReviewPackage {
  packageVersion: "client-compliance-review-package-v1";
  status: ClientComplianceReviewStatus;
  purpose: string;
  executiveSummary: string;
  sections: ClientComplianceReviewSection[];
  draftCompliancePositioning: string[];
  clientComplianceInputsNeeded: string[];
  blockedProductionClaims: string[];
  reviewerNotes: string[];
  recommendedComplianceDecision: string;
}

export interface ClientComplianceReviewPackageValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientComplianceReviewPackage(): ClientComplianceReviewPackage {
  const controlMatrix = buildClientControlMatrix();
  const dueDiligencePack = buildClientDueDiligencePack();
  const procurementPackage = buildClientProcurementReviewPackage();
  const securityQuestionnaire = buildClientSecurityQuestionnairePackage();

  const sections: ClientComplianceReviewSection[] = [
    {
      id: "compliance-data-privacy",
      category: "data_privacy",
      title: "Data privacy and production data boundary",
      status: "blocked_until_client_owned",
      owner: "client",
      complianceQuestion:
        "What private finance data can be used, where must it stay, and who owns retention rules?",
      demoSafeAnswer:
        "The public demo uses mock data only. Production client data must remain in client-owned systems and must not be committed to the public repository.",
      evidence: [
        "Security questionnaire includes data handling review.",
        "Procurement review keeps data review blocked until client-owned.",
        `Due diligence required answers: ${dueDiligencePack.requiredClientAnswers.length}.`
      ],
      clientInputNeeded: [
        "Approved safe sample policy",
        "Production data storage location",
        "Data retention policy",
        "Data access owner",
        "Data deletion process"
      ],
      productionBoundary:
        "Production data handling is blocked until the client confirms privacy, retention, access, and deletion requirements."
    },
    {
      id: "compliance-financial-controls",
      category: "financial_controls",
      title: "Finance control ownership",
      status: "client_input_required",
      owner: "client",
      complianceQuestion:
        "Which finance controls must remain human-owned before recommendations can become operational?",
      demoSafeAnswer:
        "The demo keeps sensitive actions approval-gated and separates deterministic finance logic from AI explanation.",
      evidence: [
        "Control matrix tracks production-blocked controls.",
        `Production-blocked controls: ${controlMatrix.productionBlockedControls.length}.`
      ],
      clientInputNeeded: [
        "Finance control owner",
        "Approval thresholds",
        "Reviewer roles",
        "Escalation rules",
        "Blocked finance decisions"
      ],
      productionBoundary:
        "Final finance decisions remain blocked until client-owned finance controls and approval policies exist."
    },
    {
      id: "compliance-ai-governance",
      category: "ai_governance",
      title: "AI governance and deterministic calculation boundary",
      status: "draft_ready",
      owner: "builder",
      complianceQuestion:
        "Can AI perform calculations or make final finance decisions?",
      demoSafeAnswer:
        "No. AI explains already-computed deterministic results. It does not invent numbers, approve payments, post accounting entries, or provide final tax or legal advice.",
      evidence: [
        "README states AI does not perform financial calculations.",
        "Security questionnaire includes AI boundary review.",
        "Finance outputs are generated from deterministic pipeline results."
      ],
      clientInputNeeded: [
        "Accepted AI usage policy",
        "Blocked AI decision types",
        "Reviewer owner for AI-generated explanations"
      ],
      productionBoundary:
        "AI remains an explanation layer and must not replace client-owned finance, legal, tax, or compliance approval."
    },
    {
      id: "compliance-auditability",
      category: "auditability",
      title: "Auditability and traceability",
      status: "draft_ready",
      owner: "builder",
      complianceQuestion:
        "Can reviewers trace recommendations back to deterministic events and artifacts?",
      demoSafeAnswer:
        "Yes. The demo exposes audit visibility, execution ledger, approval queue, artifact registry, and output artifacts for reviewer inspection.",
      evidence: [
        "Audit visibility endpoints exist.",
        "Artifact registry endpoints exist.",
        "Evidence binder includes audit and artifact traceability."
      ],
      clientInputNeeded: [
        "Audit retention policy",
        "Audit reviewer role",
        "Export format",
        "Compliance review owner"
      ],
      productionBoundary:
        "Production audit access, retention, export, and compliance review must be client-owned."
    },
    {
      id: "compliance-payment-controls",
      category: "payment_controls",
      title: "Payment control boundary",
      status: "blocked_until_client_owned",
      owner: "client",
      complianceQuestion:
        "Can the system send money or approve payments autonomously?",
      demoSafeAnswer:
        "No. Payment-like flows are demo-protected, approval-gated, and treated as recommendations or simulations until client-owned controls exist.",
      evidence: [
        "Security questionnaire blocks autonomous money movement.",
        "Procurement review blocks autonomous payment approval.",
        "Control matrix blocks payment execution until client-owned approvals exist."
      ],
      clientInputNeeded: [
        "Payment approval policy",
        "Authorized approver list",
        "Payment rail owner",
        "Approval thresholds",
        "Explicit payment exclusions"
      ],
      productionBoundary:
        "No autonomous money movement is approved."
    },
    {
      id: "compliance-accounting-controls",
      category: "accounting_controls",
      title: "Accounting write-back boundary",
      status: "blocked_until_client_owned",
      owner: "client",
      complianceQuestion:
        "Can the system post accounting entries or write directly into accounting systems?",
      demoSafeAnswer:
        "No. Accounting write-back is blocked unless the client later approves client-owned controls, roles, review rules, and integration boundaries.",
      evidence: [
        "Governance packages block accounting posting without human approval.",
        "README states AI does not post accounting entries.",
        "Security questionnaire keeps production permissions client-owned."
      ],
      clientInputNeeded: [
        "Accounting system owner",
        "Posting approval policy",
        "Journal-entry review owner",
        "Rollback process",
        "Integration permissions"
      ],
      productionBoundary:
        "No accounting write-back is approved until client-owned accounting controls exist."
    },
    {
      id: "compliance-access-controls",
      category: "access_controls",
      title: "Access controls and authorization",
      status: "blocked_until_client_owned",
      owner: "client",
      complianceQuestion:
        "Who can view, approve, export, or execute outputs?",
      demoSafeAnswer:
        "The demo separates read-only reviewer endpoints from protected action-like routes. Production access control must be client-owned.",
      evidence: [
        "Security questionnaire blocks auth and authorization until client-owned controls exist.",
        "Demo auth status explains protected action routes.",
        "Procurement review requires security and decision owners."
      ],
      clientInputNeeded: [
        "Identity provider",
        "Role map",
        "Reviewer list",
        "Approver list",
        "Export permissions"
      ],
      productionBoundary:
        "Production access is blocked until client-owned authentication and authorization are configured."
    },
    {
      id: "compliance-retention-policy",
      category: "retention_policy",
      title: "Data and audit retention policy",
      status: "client_input_required",
      owner: "client",
      complianceQuestion:
        "How long should inputs, outputs, logs, and audit artifacts be retained?",
      demoSafeAnswer:
        "The demo persists local artifacts for review only. Production retention must be defined by the client.",
      evidence: [
        "Artifact registry exposes generated artifacts.",
        "Audit visibility exposes audit summary and recent events.",
        "Security questionnaire requests audit retention policy."
      ],
      clientInputNeeded: [
        "Input retention period",
        "Output retention period",
        "Audit retention period",
        "Deletion process",
        "Export policy"
      ],
      productionBoundary:
        "Production retention is blocked until client-owned retention and deletion rules exist."
    },
    {
      id: "compliance-vendor-review",
      category: "vendor_review",
      title: "Vendor and procurement compliance",
      status: "client_input_required",
      owner: "shared",
      complianceQuestion:
        "Which vendor, procurement, security, legal, and finance reviews are required before a pilot?",
      demoSafeAnswer:
        "The demo provides procurement and security review packages, but client-specific procurement approval still depends on the client's process.",
      evidence: [
        `Procurement sections: ${procurementPackage.sections.length}.`,
        `Security questionnaire items: ${securityQuestionnaire.items.length}.`
      ],
      clientInputNeeded: [
        "Vendor onboarding form",
        "Security reviewer",
        "Legal reviewer",
        "Finance owner",
        "Procurement owner"
      ],
      productionBoundary:
        "Procurement review supports pilot approval only and does not approve production deployment."
    },
    {
      id: "compliance-production-approval",
      category: "production_approval",
      title: "Production approval boundary",
      status: "blocked_until_client_owned",
      owner: "client",
      complianceQuestion:
        "What must be true before the system can be described as production-ready?",
      demoSafeAnswer:
        "Production readiness requires client-owned data handling, auth, authorization, secrets, monitoring, incident response, approval policies, and deployment controls.",
      evidence: [
        "Control matrix keeps production controls blocked.",
        "Security questionnaire blocks production security approval.",
        "Procurement review blocks production deployment approval."
      ],
      clientInputNeeded: [
        "Production auth model",
        "Production secret management",
        "Production monitoring",
        "Incident response owner",
        "Deployment owner",
        "Compliance signoff"
      ],
      productionBoundary:
        "No production readiness claim is allowed until client-owned controls are configured and accepted."
    }
  ];

  const blockedSections = sections.filter(
    (section) => section.status === "blocked_until_client_owned"
  );
  const clientInputSections = sections.filter(
    (section) => section.status === "client_input_required"
  );

  return {
    packageVersion: "client-compliance-review-package-v1",
    status:
      blockedSections.length > 0
        ? "production_blocked"
        : clientInputSections.length > 0
          ? "compliance_review_blocked_waiting_for_client"
          : "compliance_review_draft_ready",
    purpose:
      "Prepare a compliance-review package that explains data privacy, finance controls, AI governance, auditability, payments, accounting, access, retention, vendor review, and production approval boundaries.",
    executiveSummary:
      "The demo is strong enough for compliance discussion because it separates deterministic finance logic from AI explanation, keeps sensitive actions approval-gated, exposes audit evidence, and blocks production claims until client-owned controls exist.",
    sections,
    draftCompliancePositioning: [
      "AI explains deterministic outputs but does not perform finance calculations.",
      "Sensitive actions remain approval-gated.",
      "Production data stays in client-owned systems.",
      "Production credentials stay in client-owned secret management.",
      "Production auth, monitoring, incident response, and approval policies must be client-owned."
    ],
    clientComplianceInputsNeeded: [
      "Data privacy and retention policy",
      "Finance control owner",
      "Payment approval policy",
      "Accounting write-back policy",
      "Authentication and authorization model",
      "Audit retention requirements",
      "Vendor review requirements",
      "Production approval criteria"
    ],
    blockedProductionClaims: [
      "No production data handling approval",
      "No production security approval",
      "No autonomous money movement",
      "No accounting write-back approval",
      "No enterprise compliance certification",
      "No production deployment approval"
    ],
    reviewerNotes: [
      "The public demo should be treated as an architecture and governance proof, not a production compliance certification.",
      "Compliance approval depends on the client's data, hosting, access, approval, monitoring, and retention requirements.",
      "The system is designed for client-specific implementation, not a single shared generic deployment."
    ],
    recommendedComplianceDecision:
      "Use this package for compliance discovery and reviewer discussion, while keeping production approval blocked until client-owned controls are defined and accepted."
  };
}

export function summarizeClientComplianceReviewPackage(
  compliancePackage: ClientComplianceReviewPackage = buildClientComplianceReviewPackage()
) {
  return {
    packageVersion: compliancePackage.packageVersion,
    status: compliancePackage.status,
    sectionCount: compliancePackage.sections.length,
    draftReadySections: compliancePackage.sections.filter((section) => section.status === "draft_ready")
      .length,
    clientInputRequiredSections: compliancePackage.sections.filter(
      (section) => section.status === "client_input_required"
    ).length,
    blockedUntilClientOwnedSections: compliancePackage.sections.filter(
      (section) => section.status === "blocked_until_client_owned"
    ).length,
    clientComplianceInputCount: compliancePackage.clientComplianceInputsNeeded.length,
    blockedProductionClaimCount: compliancePackage.blockedProductionClaims.length,
    reviewerNoteCount: compliancePackage.reviewerNotes.length
  };
}

export function validateClientComplianceReviewPackage(
  compliancePackage: ClientComplianceReviewPackage = buildClientComplianceReviewPackage()
): ClientComplianceReviewPackageValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredCategories: ClientComplianceReviewCategory[] = [
    "data_privacy",
    "financial_controls",
    "ai_governance",
    "auditability",
    "payment_controls",
    "accounting_controls",
    "access_controls",
    "retention_policy",
    "vendor_review",
    "production_approval"
  ];

  for (const category of requiredCategories) {
    if (!compliancePackage.sections.some((section) => section.category === category)) {
      errors.push(`Missing compliance review category: ${category}.`);
    }
  }

  const paymentSection = compliancePackage.sections.find(
    (section) => section.id === "compliance-payment-controls"
  );
  const accountingSection = compliancePackage.sections.find(
    (section) => section.id === "compliance-accounting-controls"
  );
  const productionSection = compliancePackage.sections.find(
    (section) => section.id === "compliance-production-approval"
  );

  if (paymentSection?.status !== "blocked_until_client_owned") {
    errors.push("Payment controls must remain blocked until client-owned controls exist.");
  }

  if (accountingSection?.status !== "blocked_until_client_owned") {
    errors.push("Accounting controls must remain blocked until client-owned controls exist.");
  }

  if (productionSection?.status !== "blocked_until_client_owned") {
    errors.push("Production approval must remain blocked until client-owned controls exist.");
  }

  if (compliancePackage.sections.length < 10) {
    errors.push("Compliance review package must include at least 10 sections.");
  }

  if (!compliancePackage.blockedProductionClaims.includes("No autonomous money movement")) {
    errors.push("Compliance review package must explicitly block autonomous money movement.");
  }

  if (!compliancePackage.blockedProductionClaims.includes("No accounting write-back approval")) {
    errors.push("Compliance review package must explicitly block accounting write-back approval.");
  }

  if (compliancePackage.clientComplianceInputsNeeded.length < 6) {
    errors.push("Compliance review package must include client compliance inputs needed.");
  }

  if (compliancePackage.sections.some((section) => section.complianceQuestion.trim().length === 0)) {
    errors.push("Every compliance section must include a compliance question.");
  }

  if (compliancePackage.reviewerNotes.length === 0) {
    warnings.push("Compliance reviewer notes are missing.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
