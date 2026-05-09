import { buildClientControlMatrix } from "./client-control-matrix.js";
import { buildClientPilotDecisionPacket } from "./client-pilot-decision-packet.js";
import { buildClientPilotKickoffPackage } from "./client-pilot-kickoff-package.js";

export type ClientPilotSowStatus =
  | "sow_draft_ready"
  | "sow_blocked_waiting_for_client"
  | "production_blocked";

export type ClientPilotSowSectionStatus =
  | "draft_ready"
  | "client_input_required"
  | "blocked_until_client_owned";

export type ClientPilotSowSectionCategory =
  | "scope"
  | "deliverables"
  | "client_responsibilities"
  | "builder_responsibilities"
  | "acceptance_criteria"
  | "out_of_scope"
  | "risk_boundary"
  | "commercial_terms";

export interface ClientPilotSowSection {
  id: string;
  category: ClientPilotSowSectionCategory;
  title: string;
  status: ClientPilotSowSectionStatus;
  owner: "builder" | "client" | "shared";
  sowLanguage: string;
  evidence: string[];
  clientInputNeeded: string[];
  productionBoundary: string;
}

export interface ClientPilotSowPackage {
  packageVersion: "client-pilot-sow-package-v1";
  status: ClientPilotSowStatus;
  purpose: string;
  executiveSummary: string;
  sections: ClientPilotSowSection[];
  proposedPilotScope: string[];
  proposedDeliverables: string[];
  clientDependencies: string[];
  explicitExclusions: string[];
  draftAcceptanceCriteria: string[];
  blockedProductionClaims: string[];
  recommendedSowDecision: string;
}

export interface ClientPilotSowPackageValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientPilotSowPackage(): ClientPilotSowPackage {
  const kickoffPackage = buildClientPilotKickoffPackage();
  const decisionPacket = buildClientPilotDecisionPacket();
  const controlMatrix = buildClientControlMatrix();

  const sections: ClientPilotSowSection[] = [
    {
      id: "sow-scope",
      category: "scope",
      title: "Pilot scope",
      status: "client_input_required",
      owner: "shared",
      sowLanguage:
        "The pilot will focus on one selected FinanceOps workflow using client-approved safe sample data and recommendation-only or approval-preparation-only outputs.",
      evidence: [
        `Kickoff status: ${kickoffPackage.status}.`,
        "Pilot decision packet requires one first workflow before implementation starts."
      ],
      clientInputNeeded: [
        "Selected first workflow",
        "Workflow owner",
        "Target output audience",
        "Manual process baseline"
      ],
      productionBoundary:
        "The pilot scope does not include a full enterprise rollout or production write access."
    },
    {
      id: "sow-deliverables",
      category: "deliverables",
      title: "Pilot deliverables",
      status: "draft_ready",
      owner: "builder",
      sowLanguage:
        "The builder will deliver a pilot-ready FinanceOps workflow configuration, safe-sample mapping, reviewer evidence, validation endpoints, and a demo-safe output package.",
      evidence: [
        "Evidence binder exists.",
        "Control matrix exists.",
        `Client routes currently visible: ${controlMatrix.items.length} control items.`
      ],
      clientInputNeeded: [
        "Client confirms preferred output format.",
        "Client confirms reviewer audience."
      ],
      productionBoundary:
        "Deliverables are pilot artifacts and do not certify production compliance."
    },
    {
      id: "sow-client-responsibilities",
      category: "client_responsibilities",
      title: "Client responsibilities",
      status: "client_input_required",
      owner: "client",
      sowLanguage:
        "The client must provide safe sample data, field definitions, reviewer and approver roles, runtime preferences, monitoring expectations, and success criteria.",
      evidence: [
        `Client prework items: ${kickoffPackage.clientPreworkChecklist.length}.`,
        `Client answers needed: ${decisionPacket.clientAnswersNeeded.length}.`
      ],
      clientInputNeeded: [
        "Safe sample files",
        "Field definitions",
        "Reviewer and approver list",
        "Runtime preference",
        "Success criteria"
      ],
      productionBoundary:
        "Private data, credentials, auth, and production systems remain client-owned."
    },
    {
      id: "sow-builder-responsibilities",
      category: "builder_responsibilities",
      title: "Builder responsibilities",
      status: "draft_ready",
      owner: "builder",
      sowLanguage:
        "The builder will configure the reusable FinanceOps core against client-shaped safe samples, keep sensitive actions gated, preserve auditability, and document pilot limitations.",
      evidence: [
        "Pre-push verification is configured.",
        "CI watches the exact commit after push.",
        "Pilot kickoff package includes production boundaries."
      ],
      clientInputNeeded: [
        "Client confirms scope before configuration begins.",
        "Client confirms pilot review cadence."
      ],
      productionBoundary:
        "Builder does not own client production credentials, production payment rails, or final finance approvals."
    },
    {
      id: "sow-acceptance-criteria",
      category: "acceptance_criteria",
      title: "Draft acceptance criteria",
      status: "client_input_required",
      owner: "shared",
      sowLanguage:
        "The pilot is accepted only if the selected workflow produces understandable exceptions, approval-ready outputs, audit evidence, and a clear next-phase decision.",
      evidence: [
        `Draft success criteria: ${kickoffPackage.pilotSuccessCriteriaDraft.length}.`,
        "Existing validation endpoints return pass for current demo packages."
      ],
      clientInputNeeded: [
        "Accepted success criteria",
        "Accepted output format",
        "Accepted review owner",
        "Accepted go/no-go decision rule"
      ],
      productionBoundary:
        "Acceptance of a pilot does not equal approval for production deployment."
    },
    {
      id: "sow-out-of-scope",
      category: "out_of_scope",
      title: "Explicit out-of-scope items",
      status: "draft_ready",
      owner: "shared",
      sowLanguage:
        "The pilot excludes autonomous money movement, accounting write-back, production credentials, production data storage, legal or tax advice, and enterprise compliance certification.",
      evidence: [
        "Control matrix blocks payment-like and accounting-posting actions.",
        "Pilot decision packet keeps production claims blocked."
      ],
      clientInputNeeded: [
        "Client confirms any additional exclusions.",
        "Client confirms no production data will be supplied to the public repo."
      ],
      productionBoundary:
        "Excluded items must not be implied in sales language or demo walkthroughs."
    },
    {
      id: "sow-risk-boundary",
      category: "risk_boundary",
      title: "Risk and control boundary",
      status: "blocked_until_client_owned",
      owner: "client",
      sowLanguage:
        "Production security, identity, secrets, monitoring, payment permissions, accounting write permissions, and incident response are blocked until client-owned controls exist.",
      evidence: [
        `Production-blocked controls: ${controlMatrix.productionBlockedControls.length}.`,
        "Kickoff package keeps access and approval policy blocked until client-owned."
      ],
      clientInputNeeded: [
        "Client-owned auth model",
        "Client-owned secret management",
        "Client-owned monitoring",
        "Client-owned approval policy"
      ],
      productionBoundary:
        "No production deployment claim is allowed until client-owned controls are configured and accepted."
    },
    {
      id: "sow-commercial-terms",
      category: "commercial_terms",
      title: "Commercial terms placeholder",
      status: "client_input_required",
      owner: "shared",
      sowLanguage:
        "Commercial terms should be finalized only after pilot workflow scope, data readiness, expected outputs, review cadence, and success criteria are accepted.",
      evidence: [
        "Pilot kickoff package requires success metrics.",
        "Pilot decision packet requires manual workload baseline."
      ],
      clientInputNeeded: [
        "Pilot duration",
        "Buyer stakeholder",
        "Budget owner",
        "Review cadence",
        "Success metric baseline"
      ],
      productionBoundary:
        "Do not claim ROI, cost savings, or enterprise readiness until client baseline and acceptance criteria are confirmed."
    }
  ];

  const blockedSections = sections.filter(
    (section) => section.status === "blocked_until_client_owned"
  );
  const clientInputSections = sections.filter(
    (section) => section.status === "client_input_required"
  );

  return {
    packageVersion: "client-pilot-sow-package-v1",
    status:
      blockedSections.length > 0
        ? "production_blocked"
        : clientInputSections.length > 0
          ? "sow_blocked_waiting_for_client"
          : "sow_draft_ready",
    purpose:
      "Convert the pilot kickoff package into a statement-of-work style draft that defines scope, deliverables, responsibilities, exclusions, acceptance criteria, and production boundaries.",
    executiveSummary:
      "A pilot SOW can be drafted now, but it should not be finalized until the client confirms scope, safe sample data, reviewer roles, approval boundaries, runtime expectations, success criteria, and commercial terms.",
    sections,
    proposedPilotScope: [
      "One selected FinanceOps workflow",
      "Safe sample data mapping",
      "Recommendation-only or approval-preparation-only output mode",
      "Audit-ready demo artifacts",
      "Buyer-facing pilot review package"
    ],
    proposedDeliverables: [
      "Pilot workflow configuration",
      "Client-shaped safe sample mapping",
      "Evidence binder walkthrough",
      "Control matrix walkthrough",
      "Pilot acceptance summary",
      "Go/no-go recommendation for next phase"
    ],
    clientDependencies: [
      "Safe sample data",
      "Field definitions",
      "Reviewer and approver list",
      "Runtime and monitoring preference",
      "Success criteria",
      "Commercial decision owner"
    ],
    explicitExclusions: [
      "Autonomous money movement",
      "Accounting write-back",
      "Production credentials",
      "Production data committed to git",
      "Legal or tax advice",
      "Enterprise compliance certification"
    ],
    draftAcceptanceCriteria: [
      "Selected workflow produces structured exceptions.",
      "Outputs are understandable to the target reviewer.",
      "Sensitive actions remain human-approved.",
      "Audit artifacts are generated and reviewable.",
      "Client can make a clear next-phase decision."
    ],
    blockedProductionClaims: [
      ...decisionPacket.productionClaimsStillBlocked,
      "Pilot SOW does not authorize production deployment.",
      "Pilot SOW does not authorize autonomous payments.",
      "Pilot SOW does not certify enterprise compliance."
    ],
    recommendedSowDecision:
      "Use this as a draft SOW package only after kickoff prework is accepted; keep production claims blocked until client-owned controls exist."
  };
}

export function summarizeClientPilotSowPackage(
  sowPackage: ClientPilotSowPackage = buildClientPilotSowPackage()
) {
  return {
    packageVersion: sowPackage.packageVersion,
    status: sowPackage.status,
    sectionCount: sowPackage.sections.length,
    draftReadySections: sowPackage.sections.filter((section) => section.status === "draft_ready")
      .length,
    clientInputRequiredSections: sowPackage.sections.filter(
      (section) => section.status === "client_input_required"
    ).length,
    blockedUntilClientOwnedSections: sowPackage.sections.filter(
      (section) => section.status === "blocked_until_client_owned"
    ).length,
    proposedDeliverableCount: sowPackage.proposedDeliverables.length,
    explicitExclusionCount: sowPackage.explicitExclusions.length,
    acceptanceCriteriaCount: sowPackage.draftAcceptanceCriteria.length,
    blockedProductionClaimCount: sowPackage.blockedProductionClaims.length
  };
}

export function validateClientPilotSowPackage(
  sowPackage: ClientPilotSowPackage = buildClientPilotSowPackage()
): ClientPilotSowPackageValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredCategories: ClientPilotSowSectionCategory[] = [
    "scope",
    "deliverables",
    "client_responsibilities",
    "builder_responsibilities",
    "acceptance_criteria",
    "out_of_scope",
    "risk_boundary",
    "commercial_terms"
  ];

  for (const category of requiredCategories) {
    if (!sowPackage.sections.some((section) => section.category === category)) {
      errors.push(`Missing SOW section category: ${category}.`);
    }
  }

  const riskBoundary = sowPackage.sections.find((section) => section.id === "sow-risk-boundary");

  if (riskBoundary?.status !== "blocked_until_client_owned") {
    errors.push("Risk boundary must remain blocked until client-owned controls exist.");
  }

  if (sowPackage.sections.length < 8) {
    errors.push("Pilot SOW package must include at least 8 sections.");
  }

  if (sowPackage.explicitExclusions.length < 5) {
    errors.push("Pilot SOW package must include explicit exclusions.");
  }

  if (!sowPackage.explicitExclusions.includes("Autonomous money movement")) {
    errors.push("Pilot SOW package must explicitly exclude autonomous money movement.");
  }

  if (sowPackage.draftAcceptanceCriteria.length < 4) {
    errors.push("Pilot SOW package must include at least 4 draft acceptance criteria.");
  }

  if (sowPackage.sections.some((section) => section.sowLanguage.trim().length === 0)) {
    errors.push("Every SOW section must include draft SOW language.");
  }

  if (sowPackage.blockedProductionClaims.length === 0) {
    warnings.push("Blocked production claims are missing.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
