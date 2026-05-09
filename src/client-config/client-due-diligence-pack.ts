import { buildClientAcceptanceGate } from "./client-acceptance-gate.js";
import { buildClientDeploymentProfile } from "./client-deployment-profile.js";
import { buildClientEnterpriseRedTeamReport } from "./client-enterprise-red-team.js";
import { buildClientEnterpriseSalesBrief } from "./client-enterprise-sales-brief.js";

export type ClientDueDiligenceStatus =
  | "demo_review_ready"
  | "pilot_review_required"
  | "production_blocked";

export type ClientDueDiligenceOwner = "builder" | "client" | "shared";

export type ClientDueDiligenceArea =
  | "data"
  | "security"
  | "controls"
  | "finance"
  | "audit"
  | "deployment"
  | "commercial";

export interface ClientDueDiligenceItem {
  id: string;
  area: ClientDueDiligenceArea;
  title: string;
  status: "available_in_demo" | "client_answer_required" | "blocked_until_client_owned";
  owner: ClientDueDiligenceOwner;
  reviewerQuestion: string;
  demoEvidence: string[];
  productionRequirement: string[];
}

export interface ClientDueDiligencePack {
  packVersion: "client-due-diligence-pack-v1";
  status: ClientDueDiligenceStatus;
  purpose: string;
  buyerSummary: string;
  items: ClientDueDiligenceItem[];
  requiredClientAnswers: string[];
  blockedProductionClaims: string[];
  recommendedReviewerFlow: string[];
}

export interface ClientDueDiligencePackValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientDueDiligencePack(): ClientDueDiligencePack {
  const deploymentProfile = buildClientDeploymentProfile();
  const acceptanceGate = buildClientAcceptanceGate();
  const redTeamReport = buildClientEnterpriseRedTeamReport();
  const salesBrief = buildClientEnterpriseSalesBrief();

  const items: ClientDueDiligenceItem[] = [
    {
      id: "dd-client-data-boundary",
      area: "data",
      title: "Client data boundary",
      status: "client_answer_required",
      owner: "shared",
      reviewerQuestion: "Where will production financial data live and who controls access?",
      demoEvidence: [
        "Public demo uses safe mock data only.",
        `Deployment profile status: ${deploymentProfile.status}.`
      ],
      productionRequirement: [
        "Client-owned data source is selected.",
        "Private records stay outside the public repo.",
        "Access policy is accepted by client finance and security owners."
      ]
    },
    {
      id: "dd-auth-and-authorization",
      area: "security",
      title: "Authentication and authorization",
      status: "blocked_until_client_owned",
      owner: "client",
      reviewerQuestion: "How will user identity, roles, and route permissions be enforced?",
      demoEvidence: [
        "Demo API key protects action-like routes.",
        "Read-only reviewer endpoints stay public in demo scope."
      ],
      productionRequirement: [
        "Client-owned identity provider or auth model is selected.",
        "Approver roles are mapped.",
        "Sensitive routes are role-gated."
      ]
    },
    {
      id: "dd-money-movement-control",
      area: "finance",
      title: "Money movement and payment approval",
      status: "blocked_until_client_owned",
      owner: "client",
      reviewerQuestion: "Can the agent move money or post accounting entries automatically?",
      demoEvidence: [
        "Money movement remains human-approved.",
        `Acceptance gate status: ${acceptanceGate.status}.`,
        "Red-team report blocks autonomous money movement claims."
      ],
      productionRequirement: [
        "Payment rails are client-owned.",
        "Approval policy is accepted.",
        "Payments and postings remain human-gated unless the client explicitly approves a narrower rule."
      ]
    },
    {
      id: "dd-deterministic-finance-logic",
      area: "controls",
      title: "Deterministic finance logic boundary",
      status: "available_in_demo",
      owner: "builder",
      reviewerQuestion: "How do reviewers know the numbers are not AI hallucinations?",
      demoEvidence: [
        "Finance calculations are produced by deterministic logic.",
        "AI-style wording explains already-computed outputs.",
        `Sales brief status: ${salesBrief.status}.`
      ],
      productionRequirement: [
        "Client schemas are accepted.",
        "Finance rules are reviewed.",
        "Edge cases are covered by tests using client-shaped safe data."
      ]
    },
    {
      id: "dd-audit-evidence",
      area: "audit",
      title: "Audit evidence and traceability",
      status: "available_in_demo",
      owner: "shared",
      reviewerQuestion: "What evidence exists for decisions, approvals, and generated outputs?",
      demoEvidence: [
        "Demo persists local audit, ledger, approval, payment, and output artifacts.",
        "Audit endpoints expose traceability without requiring raw file inspection."
      ],
      productionRequirement: [
        "Audit retention period is defined.",
        "Audit access is role-gated.",
        "Client compliance reviewers accept the evidence format."
      ]
    },
    {
      id: "dd-production-runtime",
      area: "deployment",
      title: "Production runtime and operations",
      status: "blocked_until_client_owned",
      owner: "client",
      reviewerQuestion: "Where will the production implementation run and who owns operations?",
      demoEvidence: [
        "Public repo demonstrates architecture and safety boundaries.",
        `Deployment profile requires: ${deploymentProfile.blockedUntilClientProvides.join(", ")}.`
      ],
      productionRequirement: [
        "Client-owned runtime is selected.",
        "Monitoring and incident ownership are accepted.",
        "Secrets and credentials use client-owned secret management."
      ]
    },
    {
      id: "dd-commercial-readiness",
      area: "commercial",
      title: "Commercial buyer readiness",
      status: "client_answer_required",
      owner: "shared",
      reviewerQuestion: "What business outcome does the client want this agent to automate first?",
      demoEvidence: [
        "Current buyer story targets manual finance review automation.",
        "Sales brief separates demo-safe proof from production claims."
      ],
      productionRequirement: [
        "Client signs off on first workflow scope.",
        "Client provides representative input samples.",
        "Client accepts the target output format."
      ]
    }
  ];

  const blockedItems = items.filter((item) => item.status === "blocked_until_client_owned");
  const answerRequiredItems = items.filter((item) => item.status === "client_answer_required");

  return {
    packVersion: "client-due-diligence-pack-v1",
    status:
      blockedItems.length > 0
        ? "production_blocked"
        : answerRequiredItems.length > 0
          ? "pilot_review_required"
          : "demo_review_ready",
    purpose:
      "Package enterprise due diligence questions, demo evidence, production requirements, and blocked claims for client-facing review.",
    buyerSummary:
      "The repo is demo-review-ready as a reusable FinanceOps automation core, but production remains blocked until client-owned data, auth, secrets, runtime, monitoring, and approval controls are accepted.",
    items,
    requiredClientAnswers: [
      "Which source systems provide the first production input?",
      "Which users can approve payments or accounting actions?",
      "Where should outputs be delivered?",
      "What audit retention period is required?",
      "Which identity provider, runtime, and secret-management model will be used?"
    ],
    blockedProductionClaims: [
      ...redTeamReport.blockedProductionClaims,
      "Do not claim enterprise security approval until client security review is complete.",
      "Do not claim production deployment until client-owned runtime and monitoring exist."
    ],
    recommendedReviewerFlow: [
      "Start with buyer summary.",
      "Review data boundary and auth requirements.",
      "Review payment and accounting approval controls.",
      "Review audit evidence and deterministic finance logic.",
      "Confirm blocked production claims before discussing pilot scope."
    ]
  };
}

export function summarizeClientDueDiligencePack(
  pack: ClientDueDiligencePack = buildClientDueDiligencePack()
) {
  return {
    packVersion: pack.packVersion,
    status: pack.status,
    itemCount: pack.items.length,
    blockedItems: pack.items.filter((item) => item.status === "blocked_until_client_owned").length,
    clientAnswerRequiredItems: pack.items.filter(
      (item) => item.status === "client_answer_required"
    ).length,
    availableInDemoItems: pack.items.filter((item) => item.status === "available_in_demo").length,
    requiredClientAnswerCount: pack.requiredClientAnswers.length,
    blockedProductionClaimCount: pack.blockedProductionClaims.length
  };
}

export function validateClientDueDiligencePack(
  pack: ClientDueDiligencePack = buildClientDueDiligencePack()
): ClientDueDiligencePackValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (pack.items.length < 6) {
    errors.push("Due diligence pack must include at least 6 review items.");
  }

  const requiredAreas: ClientDueDiligenceArea[] = [
    "data",
    "security",
    "controls",
    "finance",
    "audit",
    "deployment"
  ];

  for (const area of requiredAreas) {
    if (!pack.items.some((item) => item.area === area)) {
      errors.push(`Missing due diligence area: ${area}.`);
    }
  }

  const moneyMovementItem = pack.items.find((item) => item.id === "dd-money-movement-control");

  if (moneyMovementItem?.status !== "blocked_until_client_owned") {
    errors.push("Money movement control must remain blocked until client-owned controls exist.");
  }

  const authItem = pack.items.find((item) => item.id === "dd-auth-and-authorization");

  if (authItem?.status !== "blocked_until_client_owned") {
    errors.push("Authentication and authorization must remain blocked until client-owned controls exist.");
  }

  const allItemsHaveQuestions = pack.items.every(
    (item) => item.reviewerQuestion.trim().length > 0
  );

  if (!allItemsHaveQuestions) {
    errors.push("Every due diligence item must include a reviewer question.");
  }

  if (pack.requiredClientAnswers.length === 0) {
    warnings.push("Required client answers are missing.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
