import { buildClientControlMatrix } from "./client-control-matrix.js";
import { buildClientDueDiligencePack } from "./client-due-diligence-pack.js";
import { buildClientPilotProposalPackage } from "./client-pilot-proposal-package.js";
import { buildClientPilotSowPackage } from "./client-pilot-sow-package.js";

export type ClientProcurementReviewStatus =
  | "procurement_draft_ready"
  | "procurement_blocked_waiting_for_client"
  | "production_blocked";

export type ClientProcurementReviewSectionStatus =
  | "draft_ready"
  | "client_input_required"
  | "blocked_until_client_owned";

export type ClientProcurementReviewCategory =
  | "vendor_intake"
  | "security_review"
  | "legal_review"
  | "data_review"
  | "finance_terms"
  | "procurement_workflow"
  | "pilot_boundary"
  | "decision_owner";

export interface ClientProcurementReviewSection {
  id: string;
  category: ClientProcurementReviewCategory;
  title: string;
  status: ClientProcurementReviewSectionStatus;
  owner: "builder" | "client" | "shared";
  procurementQuestion: string;
  currentEvidence: string[];
  clientInputNeeded: string[];
  buyerRiskIfMissing: string;
  productionBoundary: string;
}

export interface ClientProcurementReviewPackage {
  packageVersion: "client-procurement-review-package-v1";
  status: ClientProcurementReviewStatus;
  purpose: string;
  executiveSummary: string;
  sections: ClientProcurementReviewSection[];
  vendorReviewChecklist: string[];
  securityReviewQuestions: string[];
  legalAndComplianceQuestions: string[];
  commercialTermsToConfirm: string[];
  blockedProductionClaims: string[];
  recommendedProcurementDecision: string;
}

export interface ClientProcurementReviewPackageValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientProcurementReviewPackage(): ClientProcurementReviewPackage {
  const proposalPackage = buildClientPilotProposalPackage();
  const sowPackage = buildClientPilotSowPackage();
  const dueDiligencePack = buildClientDueDiligencePack();
  const controlMatrix = buildClientControlMatrix();

  const sections: ClientProcurementReviewSection[] = [
    {
      id: "procurement-vendor-intake",
      category: "vendor_intake",
      title: "Vendor intake readiness",
      status: "client_input_required",
      owner: "shared",
      procurementQuestion: "What information does the client's vendor onboarding process require before a paid pilot?",
      currentEvidence: [
        "Pilot proposal package exists.",
        "Pilot SOW draft exists.",
        `Proposal sections: ${proposalPackage.sections.length}.`
      ],
      clientInputNeeded: [
        "Vendor onboarding form",
        "Required company details",
        "Procurement contact",
        "Required tax or payment details"
      ],
      buyerRiskIfMissing:
        "The buyer may like the pilot but procurement cannot approve vendor setup.",
      productionBoundary:
        "Vendor intake supports pilot procurement only and does not approve production deployment."
    },
    {
      id: "procurement-security-review",
      category: "security_review",
      title: "Security review readiness",
      status: "blocked_until_client_owned",
      owner: "client",
      procurementQuestion: "Which security review questions must be answered before pilot approval?",
      currentEvidence: [
        "Control matrix keeps auth, secrets, payments, and accounting write actions blocked until client-owned controls exist.",
        `Production-blocked controls: ${controlMatrix.productionBlockedControls.length}.`
      ],
      clientInputNeeded: [
        "Security questionnaire",
        "Required security reviewer",
        "Authentication expectation",
        "Secret management expectation",
        "Monitoring expectation"
      ],
      buyerRiskIfMissing:
        "Security can block the pilot if production boundaries, auth, secrets, and data handling are unclear.",
      productionBoundary:
        "Production security approval remains blocked until client-owned controls exist."
    },
    {
      id: "procurement-legal-review",
      category: "legal_review",
      title: "Legal and contract review readiness",
      status: "client_input_required",
      owner: "shared",
      procurementQuestion: "Which legal terms must be reviewed before a pilot agreement can be signed?",
      currentEvidence: [
        "Pilot SOW package defines explicit exclusions.",
        `SOW explicit exclusions: ${sowPackage.explicitExclusions.length}.`
      ],
      clientInputNeeded: [
        "Preferred agreement type",
        "Legal reviewer",
        "Liability expectations",
        "Data-processing terms if required"
      ],
      buyerRiskIfMissing:
        "Legal review can delay the pilot if exclusions and responsibilities are not clearly separated.",
      productionBoundary:
        "The pilot package is not legal advice and does not create a final agreement."
    },
    {
      id: "procurement-data-review",
      category: "data_review",
      title: "Data handling review",
      status: "blocked_until_client_owned",
      owner: "client",
      procurementQuestion: "What data can be used in the pilot, and where must private data stay?",
      currentEvidence: [
        "Public demo uses mock data only.",
        "Due diligence pack asks where production financial data lives.",
        `Due diligence required answers: ${dueDiligencePack.requiredClientAnswers.length}.`
      ],
      clientInputNeeded: [
        "Safe sample data policy",
        "Approved sample fields",
        "Private data storage rule",
        "Data retention expectation"
      ],
      buyerRiskIfMissing:
        "Data review can block the pilot if private data, retention, and safe sample rules are unclear.",
      productionBoundary:
        "No private production records should enter the public repo or unmanaged local files."
    },
    {
      id: "procurement-finance-terms",
      category: "finance_terms",
      title: "Finance and payment terms",
      status: "client_input_required",
      owner: "shared",
      procurementQuestion: "What pilot price, billing model, payment timing, and budget owner must be confirmed?",
      currentEvidence: [
        "Pilot proposal package lists commercial terms to confirm.",
        `Commercial terms to confirm: ${proposalPackage.commercialTermsToConfirm.length}.`
      ],
      clientInputNeeded: [
        "Budget owner",
        "Pilot price or pricing model",
        "Payment timing",
        "Invoice requirements",
        "Renewal or next-phase decision process"
      ],
      buyerRiskIfMissing:
        "The pilot can stall after technical approval if finance terms are not clear.",
      productionBoundary:
        "Do not claim ROI or cost savings until client baseline and success criteria are accepted."
    },
    {
      id: "procurement-workflow",
      category: "procurement_workflow",
      title: "Procurement workflow and timeline",
      status: "client_input_required",
      owner: "client",
      procurementQuestion: "Who signs off on procurement, and what steps must happen before pilot start?",
      currentEvidence: [
        "Proposal package defines buyer decision process.",
        "SOW package defines client dependencies and acceptance criteria."
      ],
      clientInputNeeded: [
        "Procurement owner",
        "Security owner",
        "Legal owner",
        "Finance owner",
        "Approval timeline"
      ],
      buyerRiskIfMissing:
        "Without ownership and timeline, the pilot can remain approved in principle but not actually start.",
      productionBoundary:
        "Procurement approval covers pilot start only unless production controls are separately approved."
    },
    {
      id: "procurement-pilot-boundary",
      category: "pilot_boundary",
      title: "Pilot and production boundary",
      status: "blocked_until_client_owned",
      owner: "client",
      procurementQuestion: "Which production claims must remain blocked in procurement and sales language?",
      currentEvidence: [
        "Proposal package excludes autonomous money movement, production credentials, and enterprise compliance certification.",
        "Control matrix keeps production security and payment controls blocked."
      ],
      clientInputNeeded: [
        "Accepted pilot exclusions",
        "Accepted blocked production claims",
        "Accepted approval-only mode",
        "Accepted no-production-data rule"
      ],
      buyerRiskIfMissing:
        "Enterprise stakeholders may reject the project if the proposal sounds like production use before controls exist.",
      productionBoundary:
        "No production use, autonomous payments, accounting write-back, or compliance certification is included."
    },
    {
      id: "procurement-decision-owner",
      category: "decision_owner",
      title: "Final buyer and procurement decision owner",
      status: "client_input_required",
      owner: "client",
      procurementQuestion: "Who can approve the paid pilot and who can approve the next phase?",
      currentEvidence: [
        "Pilot proposal package asks for buyer stakeholder, finance reviewer, technical reviewer, security reviewer, and final decision owner.",
        "Pilot SOW package requires go/no-go criteria."
      ],
      clientInputNeeded: [
        "Pilot buyer",
        "Procurement approver",
        "Security approver",
        "Finance approver",
        "Next-phase decision owner"
      ],
      buyerRiskIfMissing:
        "The project can become a successful demo without a conversion path to paid pilot or next phase.",
      productionBoundary:
        "Pilot decision ownership does not replace production approval ownership."
    }
  ];

  const blockedSections = sections.filter(
    (section) => section.status === "blocked_until_client_owned"
  );
  const clientInputSections = sections.filter(
    (section) => section.status === "client_input_required"
  );

  return {
    packageVersion: "client-procurement-review-package-v1",
    status:
      blockedSections.length > 0
        ? "production_blocked"
        : clientInputSections.length > 0
          ? "procurement_blocked_waiting_for_client"
          : "procurement_draft_ready",
    purpose:
      "Prepare the buyer-facing pilot proposal for enterprise procurement review by mapping vendor intake, security, legal, data, finance, procurement workflow, pilot boundary, and decision ownership questions.",
    executiveSummary:
      "The pilot can move into procurement discussion, but approval remains blocked until the client confirms vendor intake requirements, security review expectations, legal review path, data handling, finance terms, procurement owners, pilot exclusions, and final decision ownership.",
    sections,
    vendorReviewChecklist: [
      "Vendor onboarding form",
      "Procurement owner",
      "Security reviewer",
      "Legal reviewer",
      "Finance/budget owner",
      "Pilot agreement path",
      "Invoice and payment requirements"
    ],
    securityReviewQuestions: [
      "Will the pilot use only safe sample data?",
      "Where will private production data stay?",
      "What authentication model is required?",
      "Where are secrets stored?",
      "Who receives alerts and incidents?",
      "Which sensitive actions stay blocked?"
    ],
    legalAndComplianceQuestions: [
      "What agreement type is required for a pilot?",
      "Are data-processing terms required?",
      "Which liability terms apply?",
      "Which exclusions must be written into the pilot scope?",
      "Who signs off on legal review?"
    ],
    commercialTermsToConfirm: [
      "Pilot price or pricing model",
      "Pilot duration",
      "Payment timing",
      "Invoice requirements",
      "Renewal or next-phase decision criteria"
    ],
    blockedProductionClaims: [
      ...proposalPackage.proposalExclusions,
      "No production deployment approval",
      "No autonomous payment approval",
      "No accounting write-back approval",
      "No enterprise compliance certification"
    ],
    recommendedProcurementDecision:
      "Proceed to procurement review only after the buyer confirms vendor intake requirements, security/legal reviewers, data handling, commercial terms, procurement owner, and pilot-only boundaries."
  };
}

export function summarizeClientProcurementReviewPackage(
  procurementPackage: ClientProcurementReviewPackage = buildClientProcurementReviewPackage()
) {
  return {
    packageVersion: procurementPackage.packageVersion,
    status: procurementPackage.status,
    sectionCount: procurementPackage.sections.length,
    draftReadySections: procurementPackage.sections.filter((section) => section.status === "draft_ready")
      .length,
    clientInputRequiredSections: procurementPackage.sections.filter(
      (section) => section.status === "client_input_required"
    ).length,
    blockedUntilClientOwnedSections: procurementPackage.sections.filter(
      (section) => section.status === "blocked_until_client_owned"
    ).length,
    vendorReviewChecklistCount: procurementPackage.vendorReviewChecklist.length,
    securityReviewQuestionCount: procurementPackage.securityReviewQuestions.length,
    legalAndComplianceQuestionCount: procurementPackage.legalAndComplianceQuestions.length,
    blockedProductionClaimCount: procurementPackage.blockedProductionClaims.length
  };
}

export function validateClientProcurementReviewPackage(
  procurementPackage: ClientProcurementReviewPackage = buildClientProcurementReviewPackage()
): ClientProcurementReviewPackageValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredCategories: ClientProcurementReviewCategory[] = [
    "vendor_intake",
    "security_review",
    "legal_review",
    "data_review",
    "finance_terms",
    "procurement_workflow",
    "pilot_boundary",
    "decision_owner"
  ];

  for (const category of requiredCategories) {
    if (!procurementPackage.sections.some((section) => section.category === category)) {
      errors.push(`Missing procurement review category: ${category}.`);
    }
  }

  const securityReview = procurementPackage.sections.find(
    (section) => section.id === "procurement-security-review"
  );
  const dataReview = procurementPackage.sections.find(
    (section) => section.id === "procurement-data-review"
  );
  const pilotBoundary = procurementPackage.sections.find(
    (section) => section.id === "procurement-pilot-boundary"
  );

  if (securityReview?.status !== "blocked_until_client_owned") {
    errors.push("Security review must remain blocked until client-owned controls exist.");
  }

  if (dataReview?.status !== "blocked_until_client_owned") {
    errors.push("Data review must remain blocked until client-owned controls exist.");
  }

  if (pilotBoundary?.status !== "blocked_until_client_owned") {
    errors.push("Pilot boundary must remain blocked until client-owned controls exist.");
  }

  if (procurementPackage.sections.length < 8) {
    errors.push("Procurement review package must include at least 8 sections.");
  }

  if (!procurementPackage.blockedProductionClaims.includes("Autonomous money movement")) {
    errors.push("Procurement review package must explicitly block autonomous money movement.");
  }

  if (procurementPackage.vendorReviewChecklist.length < 5) {
    errors.push("Procurement review package must include a vendor review checklist.");
  }

  if (procurementPackage.sections.some((section) => section.procurementQuestion.trim().length === 0)) {
    errors.push("Every procurement section must include a procurement question.");
  }

  if (procurementPackage.commercialTermsToConfirm.length === 0) {
    warnings.push("Commercial terms to confirm are missing.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
