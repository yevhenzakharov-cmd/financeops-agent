import { buildClientControlMatrix } from "./client-control-matrix.js";
import { buildClientDeliveryPackage } from "./client-delivery-package.js";
import { buildClientDueDiligencePack } from "./client-due-diligence-pack.js";
import { buildClientEnterpriseRedTeamReport } from "./client-enterprise-red-team.js";

export type ClientEvidenceBinderStatus =
  | "demo_evidence_ready"
  | "pilot_evidence_required"
  | "production_evidence_blocked";

export type ClientEvidenceCategory =
  | "architecture"
  | "controls"
  | "audit"
  | "security"
  | "finance"
  | "delivery"
  | "production_boundary";

export type ClientEvidenceAudience =
  | "technical_reviewer"
  | "finance_reviewer"
  | "security_reviewer"
  | "enterprise_buyer";

export interface ClientEvidenceBinderItem {
  id: string;
  category: ClientEvidenceCategory;
  title: string;
  audience: ClientEvidenceAudience;
  status: "available_in_demo" | "client_review_required" | "blocked_until_client_owned";
  evidenceSource: string;
  evidenceSummary: string;
  reviewerUse: string;
  productionGap: string;
}

export interface ClientEvidenceBinder {
  binderVersion: "client-evidence-binder-v1";
  status: ClientEvidenceBinderStatus;
  purpose: string;
  reviewerSummary: string;
  items: ClientEvidenceBinderItem[];
  demoEvidenceCount: number;
  clientReviewRequiredCount: number;
  productionBlockedEvidenceCount: number;
  reviewerWalkthrough: string[];
  productionEvidenceStillNeeded: string[];
}

export interface ClientEvidenceBinderValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientEvidenceBinder(): ClientEvidenceBinder {
  const controlMatrix = buildClientControlMatrix();
  const dueDiligencePack = buildClientDueDiligencePack();
  const deliveryPackage = buildClientDeliveryPackage();
  const redTeamReport = buildClientEnterpriseRedTeamReport();

  const items: ClientEvidenceBinderItem[] = [
    {
      id: "evidence-system-boundary",
      category: "architecture",
      title: "Reusable FinanceOps automation core boundary",
      audience: "technical_reviewer",
      status: "available_in_demo",
      evidenceSource: "/system-summary",
      evidenceSummary:
        "Shows the repo as a reusable FinanceOps automation core with mock data, deterministic logic, protected action routes, and reviewer-safe endpoints.",
      reviewerUse:
        "Use this to understand what the public demo proves before discussing client-specific implementation.",
      productionGap:
        "Production architecture still requires client-owned runtime, auth, secrets, monitoring, and source-system access."
    },
    {
      id: "evidence-control-matrix",
      category: "controls",
      title: "Enterprise control matrix",
      audience: "security_reviewer",
      status: "available_in_demo",
      evidenceSource: "/client/control-matrix",
      evidenceSummary: `Maps ${controlMatrix.items.length} control areas across data, auth, secrets, payments, accounting, audit, monitoring, and AI boundaries.`,
      reviewerUse:
        "Use this to review which controls are demo-visible, which need configuration, and which remain blocked until client-owned.",
      productionGap:
        "Blocked controls must be implemented in the client's environment before production use."
    },
    {
      id: "evidence-due-diligence-pack",
      category: "production_boundary",
      title: "Enterprise due diligence package",
      audience: "enterprise_buyer",
      status: "client_review_required",
      evidenceSource: "/client/due-diligence-pack",
      evidenceSummary: `Packages ${dueDiligencePack.items.length} due diligence questions, production requirements, and blocked claims for buyer review.`,
      reviewerUse:
        "Use this to guide enterprise discovery and avoid overclaiming readiness.",
      productionGap:
        "Client must answer data, auth, runtime, monitoring, approval, and audit questions."
    },
    {
      id: "evidence-audit-traceability",
      category: "audit",
      title: "Audit and artifact traceability",
      audience: "finance_reviewer",
      status: "available_in_demo",
      evidenceSource: "/audit/visibility and /artifacts/status",
      evidenceSummary:
        "Shows traceability through generated audit logs, execution ledger, approval queue, payment execution artifact, and client output artifact.",
      reviewerUse:
        "Use this to verify that demo actions produce inspectable evidence.",
      productionGap:
        "Client must define audit retention, access control, export format, and compliance review process."
    },
    {
      id: "evidence-red-team-boundary",
      category: "security",
      title: "Red-team production claim boundary",
      audience: "security_reviewer",
      status: "available_in_demo",
      evidenceSource: "/client/enterprise-red-team",
      evidenceSummary: `Blocks unsafe claims across ${redTeamReport.findings.length} red-team findings, including autonomous money movement and production-readiness overclaims.`,
      reviewerUse:
        "Use this to separate honest demo claims from production claims that require client-owned controls.",
      productionGap:
        "Client security and finance owners must approve production controls before any production-readiness claim."
    },
    {
      id: "evidence-finance-logic-boundary",
      category: "finance",
      title: "Deterministic finance logic boundary",
      audience: "finance_reviewer",
      status: "available_in_demo",
      evidenceSource: "/run-financeops-agent and /client/enterprise-sales-brief",
      evidenceSummary:
        "Shows that finance calculations are deterministic and AI-style wording explains already-computed outputs.",
      reviewerUse:
        "Use this to answer whether numbers are hallucinated or traceable to deterministic logic.",
      productionGap:
        "Client schemas, calculation rules, tolerances, and edge cases must be reviewed before production."
    },
    {
      id: "evidence-delivery-package",
      category: "delivery",
      title: "Reviewer-facing delivery package",
      audience: "enterprise_buyer",
      status: "client_review_required",
      evidenceSource: "/client/delivery-package",
      evidenceSummary: `Packages ${deliveryPackage.artifacts.length} delivery artifacts for stakeholder, technical, buyer, and finance review.`,
      reviewerUse:
        "Use this to walk a buyer through what exists in the demo and what must be accepted for pilot.",
      productionGap:
        "Delivery package remains blocked for production until client-owned controls and accepted outputs exist."
    },
    {
      id: "evidence-production-readiness-gap",
      category: "production_boundary",
      title: "Production evidence still needed",
      audience: "enterprise_buyer",
      status: "blocked_until_client_owned",
      evidenceSource: "/client/deployment-profile and /client/acceptance-gate",
      evidenceSummary:
        "Shows that production remains blocked until enterprise runtime, identity, secrets, monitoring, audit, data access, and approval policy are client-owned.",
      reviewerUse:
        "Use this as the final checkpoint before discussing paid pilot or production rollout.",
      productionGap:
        "Client-owned deployment evidence must exist before production approval."
    }
  ];

  const demoEvidenceCount = items.filter((item) => item.status === "available_in_demo").length;
  const clientReviewRequiredCount = items.filter(
    (item) => item.status === "client_review_required"
  ).length;
  const productionBlockedEvidenceCount = items.filter(
    (item) => item.status === "blocked_until_client_owned"
  ).length;

  return {
    binderVersion: "client-evidence-binder-v1",
    status:
      productionBlockedEvidenceCount > 0
        ? "production_evidence_blocked"
        : clientReviewRequiredCount > 0
          ? "pilot_evidence_required"
          : "demo_evidence_ready",
    purpose:
      "Collect reviewer-facing evidence across architecture, controls, auditability, finance logic, delivery, and production-readiness boundaries.",
    reviewerSummary:
      "The evidence binder is demo-ready for technical and buyer review, but production evidence remains blocked until client-owned controls, runtime, data access, monitoring, audit retention, and approval policy are provided.",
    items,
    demoEvidenceCount,
    clientReviewRequiredCount,
    productionBlockedEvidenceCount,
    reviewerWalkthrough: [
      "Start with system boundary evidence.",
      "Review the control matrix.",
      "Review due diligence questions.",
      "Review audit and artifact traceability.",
      "Review red-team blocked claims.",
      "Review deterministic finance logic boundary.",
      "End with production evidence still needed."
    ],
    productionEvidenceStillNeeded: [
      "Client-owned runtime evidence",
      "Client-owned identity and authorization evidence",
      "Client-owned secret management evidence",
      "Accepted approval policy",
      "Accepted audit retention policy",
      "Accepted monitoring and incident ownership",
      "Accepted source-system and output mappings"
    ]
  };
}

export function summarizeClientEvidenceBinder(
  binder: ClientEvidenceBinder = buildClientEvidenceBinder()
) {
  return {
    binderVersion: binder.binderVersion,
    status: binder.status,
    itemCount: binder.items.length,
    demoEvidenceCount: binder.demoEvidenceCount,
    clientReviewRequiredCount: binder.clientReviewRequiredCount,
    productionBlockedEvidenceCount: binder.productionBlockedEvidenceCount,
    productionEvidenceStillNeededCount: binder.productionEvidenceStillNeeded.length
  };
}

export function validateClientEvidenceBinder(
  binder: ClientEvidenceBinder = buildClientEvidenceBinder()
): ClientEvidenceBinderValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredCategories: ClientEvidenceCategory[] = [
    "architecture",
    "controls",
    "audit",
    "security",
    "finance",
    "delivery",
    "production_boundary"
  ];

  for (const category of requiredCategories) {
    if (!binder.items.some((item) => item.category === category)) {
      errors.push(`Missing evidence category: ${category}.`);
    }
  }

  if (binder.items.length < 7) {
    errors.push("Evidence binder must include at least 7 reviewer evidence items.");
  }

  if (binder.demoEvidenceCount < 4) {
    errors.push("Evidence binder must include at least 4 demo-available evidence items.");
  }

  if (binder.productionBlockedEvidenceCount < 1) {
    errors.push("Evidence binder must keep production evidence blocked until client-owned controls exist.");
  }

  if (!binder.items.some((item) => item.evidenceSource.includes("/client/control-matrix"))) {
    errors.push("Evidence binder must reference the client control matrix.");
  }

  if (!binder.items.some((item) => item.evidenceSource.includes("/client/enterprise-red-team"))) {
    errors.push("Evidence binder must reference the enterprise red-team report.");
  }

  if (binder.items.some((item) => item.reviewerUse.trim().length === 0)) {
    errors.push("Every evidence item must include reviewer use guidance.");
  }

  if (binder.productionEvidenceStillNeeded.length === 0) {
    warnings.push("Production evidence still needed list is empty.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
