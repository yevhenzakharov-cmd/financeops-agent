import { buildClientEvidenceBinder } from "./client-evidence-binder.js";
import { buildClientPilotDecisionPacket } from "./client-pilot-decision-packet.js";
import { buildClientPilotKickoffPackage } from "./client-pilot-kickoff-package.js";
import { buildClientPilotSowPackage } from "./client-pilot-sow-package.js";

export type ClientPilotProposalStatus =
  | "proposal_draft_ready"
  | "proposal_blocked_waiting_for_client"
  | "production_blocked";

export type ClientPilotProposalSectionStatus =
  | "draft_ready"
  | "client_input_required"
  | "blocked_until_client_owned";

export type ClientPilotProposalSectionCategory =
  | "buyer_problem"
  | "pilot_offer"
  | "value_hypothesis"
  | "delivery_plan"
  | "commercial_terms"
  | "risk_boundary"
  | "decision_process"
  | "next_step";

export interface ClientPilotProposalSection {
  id: string;
  category: ClientPilotProposalSectionCategory;
  title: string;
  status: ClientPilotProposalSectionStatus;
  owner: "builder" | "client" | "shared";
  proposalLanguage: string;
  supportingEvidence: string[];
  clientInputNeeded: string[];
  buyerRiskIfSkipped: string;
  productionBoundary: string;
}

export interface ClientPilotProposalPackage {
  packageVersion: "client-pilot-proposal-package-v1";
  status: ClientPilotProposalStatus;
  purpose: string;
  executiveSummary: string;
  sections: ClientPilotProposalSection[];
  buyerFacingPositioning: string[];
  proposedPilotOffer: string[];
  clientDecisionInputs: string[];
  commercialTermsToConfirm: string[];
  proposalExclusions: string[];
  recommendedProposalDecision: string;
}

export interface ClientPilotProposalPackageValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientPilotProposalPackage(): ClientPilotProposalPackage {
  const decisionPacket = buildClientPilotDecisionPacket();
  const kickoffPackage = buildClientPilotKickoffPackage();
  const sowPackage = buildClientPilotSowPackage();
  const evidenceBinder = buildClientEvidenceBinder();

  const sections: ClientPilotProposalSection[] = [
    {
      id: "proposal-buyer-problem",
      category: "buyer_problem",
      title: "Buyer problem",
      status: "client_input_required",
      owner: "shared",
      proposalLanguage:
        "Finance teams lose time reviewing overdue invoices, reconciliation exceptions, margin risk, approval queues, and audit evidence across disconnected systems.",
      supportingEvidence: [
        "Demo shows overdue invoice review, orphan bank transaction review, margin risk review, and payment approval preparation.",
        `Pilot decision gates: ${decisionPacket.gates.length}.`
      ],
      clientInputNeeded: [
        "Manual process baseline",
        "Current review time",
        "Current error or rework pain",
        "Target workflow owner"
      ],
      buyerRiskIfSkipped:
        "Proposal may sound generic if the exact buyer pain and manual workload baseline are not confirmed.",
      productionBoundary:
        "Do not claim ROI or savings until the client confirms the manual baseline."
    },
    {
      id: "proposal-pilot-offer",
      category: "pilot_offer",
      title: "Pilot offer",
      status: "draft_ready",
      owner: "builder",
      proposalLanguage:
        "The pilot offer is a scoped FinanceOps automation package for one selected workflow, using safe sample data, human-approved sensitive actions, and buyer-reviewable evidence.",
      supportingEvidence: [
        `SOW package status: ${sowPackage.status}.`,
        `Kickoff package sections: ${kickoffPackage.kickoffSections.length}.`
      ],
      clientInputNeeded: [
        "Selected first workflow",
        "Output audience",
        "Safe sample data",
        "Review cadence"
      ],
      buyerRiskIfSkipped:
        "Without a focused pilot offer, the buyer may expect a full production rollout too early.",
      productionBoundary:
        "The pilot offer is not production deployment approval."
    },
    {
      id: "proposal-value-hypothesis",
      category: "value_hypothesis",
      title: "Value hypothesis",
      status: "client_input_required",
      owner: "shared",
      proposalLanguage:
        "The value hypothesis is that the pilot reduces manual finance review time by turning messy finance exceptions into structured, approval-ready, audit-visible outputs.",
      supportingEvidence: [
        "Evidence binder shows audit, controls, red-team boundaries, and deterministic finance logic.",
        `Demo evidence count: ${evidenceBinder.demoEvidenceCount}.`
      ],
      clientInputNeeded: [
        "Baseline review time",
        "Number of monthly records or exceptions",
        "Target time saved",
        "Buyer definition of success"
      ],
      buyerRiskIfSkipped:
        "Without baseline data, the proposal cannot credibly quantify value.",
      productionBoundary:
        "Do not claim fixed cost savings until client data supports the estimate."
    },
    {
      id: "proposal-delivery-plan",
      category: "delivery_plan",
      title: "Delivery plan",
      status: "draft_ready",
      owner: "builder",
      proposalLanguage:
        "Delivery starts with kickoff, safe sample mapping, workflow configuration, validation, evidence walkthrough, and a pilot go/no-go review.",
      supportingEvidence: [
        "Pilot kickoff package provides agenda, prework, success criteria, and boundaries.",
        "Pilot SOW package provides deliverables, responsibilities, exclusions, and acceptance criteria."
      ],
      clientInputNeeded: [
        "Kickoff owner",
        "Technical contact",
        "Safe sample delivery date",
        "Review meeting schedule"
      ],
      buyerRiskIfSkipped:
        "Without delivery ownership and dates, the pilot can stall after verbal approval.",
      productionBoundary:
        "Delivery plan covers pilot execution only, not enterprise rollout."
    },
    {
      id: "proposal-commercial-terms",
      category: "commercial_terms",
      title: "Commercial terms to confirm",
      status: "client_input_required",
      owner: "shared",
      proposalLanguage:
        "Commercial terms should be finalized after scope, success criteria, data readiness, buyer owner, and review cadence are accepted.",
      supportingEvidence: [
        `SOW commercial section exists: ${sowPackage.sections.some((section) => section.category === "commercial_terms")}.`,
        "Pilot decision packet requires manual workload baseline before ROI claims."
      ],
      clientInputNeeded: [
        "Pilot duration",
        "Budget owner",
        "Billing model",
        "Payment timing",
        "Renewal or next-phase decision process"
      ],
      buyerRiskIfSkipped:
        "Without commercial clarity, the buyer may agree conceptually but not move to a paid pilot.",
      productionBoundary:
        "Commercial language must not imply production readiness or autonomous payment execution."
    },
    {
      id: "proposal-risk-boundary",
      category: "risk_boundary",
      title: "Risk and production boundary",
      status: "blocked_until_client_owned",
      owner: "client",
      proposalLanguage:
        "The proposal keeps production use blocked until client-owned auth, secrets, runtime, monitoring, data access, approval policy, and audit controls exist.",
      supportingEvidence: [
        "SOW package explicitly excludes autonomous money movement and production credentials.",
        "Evidence binder keeps production evidence blocked until client-owned controls exist."
      ],
      clientInputNeeded: [
        "Client-owned auth model",
        "Client-owned secrets model",
        "Client-owned approval policy",
        "Client-owned monitoring owner"
      ],
      buyerRiskIfSkipped:
        "Skipping the boundary can create false expectations and enterprise security objections later.",
      productionBoundary:
        "No production claim is allowed until client-owned controls are configured and accepted."
    },
    {
      id: "proposal-decision-process",
      category: "decision_process",
      title: "Buyer decision process",
      status: "client_input_required",
      owner: "shared",
      proposalLanguage:
        "The proposal should define who approves the pilot, who reviews outputs, who signs off on success, and who decides the next phase.",
      supportingEvidence: [
        "Pilot kickoff package requires reviewer and approver lists.",
        "Pilot SOW package requires acceptance criteria and go/no-go decision rule."
      ],
      clientInputNeeded: [
        "Buyer stakeholder",
        "Finance reviewer",
        "Technical reviewer",
        "Security reviewer",
        "Final decision owner"
      ],
      buyerRiskIfSkipped:
        "Without decision ownership, the pilot can become an interesting demo with no buyer conversion path.",
      productionBoundary:
        "Buyer decision process applies to pilot approval, not production approval."
    },
    {
      id: "proposal-next-step",
      category: "next_step",
      title: "Recommended next step",
      status: "draft_ready",
      owner: "builder",
      proposalLanguage:
        "The next step is a pilot scoping call where the client confirms one workflow, safe data, reviewers, approval boundary, runtime expectations, success criteria, and commercial decision owner.",
      supportingEvidence: [
        "Pilot kickoff package is ready for structured buyer conversation.",
        "Pilot SOW package is ready as a draft, not a final agreement."
      ],
      clientInputNeeded: [
        "Meeting date",
        "Attendee list",
        "First workflow preference",
        "Safe sample availability"
      ],
      buyerRiskIfSkipped:
        "Without a concrete next step, the proposal remains theoretical.",
      productionBoundary:
        "Next step is pilot scoping only."
    }
  ];

  const blockedSections = sections.filter(
    (section) => section.status === "blocked_until_client_owned"
  );
  const clientInputSections = sections.filter(
    (section) => section.status === "client_input_required"
  );

  return {
    packageVersion: "client-pilot-proposal-package-v1",
    status:
      blockedSections.length > 0
        ? "production_blocked"
        : clientInputSections.length > 0
          ? "proposal_blocked_waiting_for_client"
          : "proposal_draft_ready",
    purpose:
      "Turn the pilot SOW into a buyer-facing proposal package that connects the business problem, scoped offer, value hypothesis, delivery plan, commercial terms, risk boundaries, and decision process.",
    executiveSummary:
      "A buyer-facing pilot proposal can be drafted now, but it should not be finalized until the client confirms the workflow, manual baseline, safe data, reviewers, approval boundaries, runtime expectations, success criteria, and commercial decision owner.",
    sections,
    buyerFacingPositioning: [
      "Governed FinanceOps automation for one high-friction workflow.",
      "Deterministic finance logic with AI-style explanation.",
      "Human-approved sensitive actions.",
      "Audit-ready reviewer evidence.",
      "Production boundaries clearly blocked until client-owned controls exist."
    ],
    proposedPilotOffer: [
      "One selected FinanceOps workflow",
      "Safe sample mapping",
      "Workflow-specific exception logic",
      "Approval-ready output package",
      "Evidence binder and control walkthrough",
      "Pilot go/no-go summary"
    ],
    clientDecisionInputs: [
      "First workflow",
      "Manual workload baseline",
      "Safe sample data",
      "Reviewer and approver list",
      "Runtime and monitoring expectations",
      "Success criteria",
      "Commercial decision owner"
    ],
    commercialTermsToConfirm: [
      "Pilot duration",
      "Pilot price or pricing model",
      "Payment timing",
      "Review cadence",
      "Next-phase decision criteria"
    ],
    proposalExclusions: [
      "Autonomous money movement",
      "Accounting write-back",
      "Production credentials",
      "Production data committed to git",
      "Legal or tax advice",
      "Enterprise compliance certification",
      "Full production rollout"
    ],
    recommendedProposalDecision:
      "Use this as the buyer-facing proposal draft only after pilot scoping inputs are confirmed; keep production claims blocked until client-owned controls exist."
  };
}

export function summarizeClientPilotProposalPackage(
  proposalPackage: ClientPilotProposalPackage = buildClientPilotProposalPackage()
) {
  return {
    packageVersion: proposalPackage.packageVersion,
    status: proposalPackage.status,
    sectionCount: proposalPackage.sections.length,
    draftReadySections: proposalPackage.sections.filter((section) => section.status === "draft_ready")
      .length,
    clientInputRequiredSections: proposalPackage.sections.filter(
      (section) => section.status === "client_input_required"
    ).length,
    blockedUntilClientOwnedSections: proposalPackage.sections.filter(
      (section) => section.status === "blocked_until_client_owned"
    ).length,
    proposedPilotOfferCount: proposalPackage.proposedPilotOffer.length,
    clientDecisionInputCount: proposalPackage.clientDecisionInputs.length,
    proposalExclusionCount: proposalPackage.proposalExclusions.length
  };
}

export function validateClientPilotProposalPackage(
  proposalPackage: ClientPilotProposalPackage = buildClientPilotProposalPackage()
): ClientPilotProposalPackageValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredCategories: ClientPilotProposalSectionCategory[] = [
    "buyer_problem",
    "pilot_offer",
    "value_hypothesis",
    "delivery_plan",
    "commercial_terms",
    "risk_boundary",
    "decision_process",
    "next_step"
  ];

  for (const category of requiredCategories) {
    if (!proposalPackage.sections.some((section) => section.category === category)) {
      errors.push(`Missing proposal section category: ${category}.`);
    }
  }

  const riskBoundary = proposalPackage.sections.find(
    (section) => section.id === "proposal-risk-boundary"
  );

  if (riskBoundary?.status !== "blocked_until_client_owned") {
    errors.push("Risk boundary must remain blocked until client-owned controls exist.");
  }

  if (proposalPackage.sections.length < 8) {
    errors.push("Pilot proposal package must include at least 8 sections.");
  }

  if (!proposalPackage.proposalExclusions.includes("Autonomous money movement")) {
    errors.push("Pilot proposal package must explicitly exclude autonomous money movement.");
  }

  if (!proposalPackage.proposalExclusions.includes("Enterprise compliance certification")) {
    errors.push("Pilot proposal package must explicitly exclude enterprise compliance certification.");
  }

  if (proposalPackage.clientDecisionInputs.length < 6) {
    errors.push("Pilot proposal package must include client decision inputs.");
  }

  if (proposalPackage.sections.some((section) => section.proposalLanguage.trim().length === 0)) {
    errors.push("Every proposal section must include proposal language.");
  }

  if (proposalPackage.commercialTermsToConfirm.length === 0) {
    warnings.push("Commercial terms to confirm are missing.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
