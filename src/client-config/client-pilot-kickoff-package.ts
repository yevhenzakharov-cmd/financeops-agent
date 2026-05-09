import { buildClientControlMatrix } from "./client-control-matrix.js";
import { buildClientEvidenceBinder } from "./client-evidence-binder.js";
import { buildClientPilotDecisionPacket } from "./client-pilot-decision-packet.js";

export type ClientPilotKickoffStatus =
  | "pilot_kickoff_ready"
  | "pilot_kickoff_blocked_waiting_for_client"
  | "production_blocked";

export type ClientPilotKickoffSectionStatus =
  | "ready_for_review"
  | "client_input_required"
  | "blocked_until_client_owned";

export type ClientPilotKickoffSectionCategory =
  | "scope"
  | "data"
  | "access"
  | "approval_policy"
  | "evidence"
  | "runtime"
  | "success_metrics"
  | "next_steps";

export interface ClientPilotKickoffSection {
  id: string;
  category: ClientPilotKickoffSectionCategory;
  title: string;
  status: ClientPilotKickoffSectionStatus;
  owner: "builder" | "client" | "shared";
  kickoffQuestion: string;
  currentDemoEvidence: string[];
  clientInputNeeded: string[];
  kickoffOutput: string;
  productionBoundary: string;
}

export interface ClientPilotKickoffPackage {
  packageVersion: "client-pilot-kickoff-package-v1";
  status: ClientPilotKickoffStatus;
  purpose: string;
  executiveSummary: string;
  kickoffSections: ClientPilotKickoffSection[];
  clientPreworkChecklist: string[];
  kickoffAgenda: string[];
  pilotSuccessCriteriaDraft: string[];
  blockedProductionBoundaries: string[];
  recommendedKickoffDecision: string;
}

export interface ClientPilotKickoffPackageValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientPilotKickoffPackage(): ClientPilotKickoffPackage {
  const decisionPacket = buildClientPilotDecisionPacket();
  const evidenceBinder = buildClientEvidenceBinder();
  const controlMatrix = buildClientControlMatrix();

  const kickoffSections: ClientPilotKickoffSection[] = [
    {
      id: "kickoff-scope",
      category: "scope",
      title: "Confirm first pilot workflow",
      status: "client_input_required",
      owner: "shared",
      kickoffQuestion: "Which single finance workflow should the pilot automate first?",
      currentDemoEvidence: [
        "Demo supports overdue invoice review, orphan bank transaction review, margin risk review, and payment approval preparation.",
        `Pilot decision status: ${decisionPacket.status}.`
      ],
      clientInputNeeded: [
        "Selected first workflow",
        "Workflow owner",
        "Expected output audience",
        "Current manual process notes"
      ],
      kickoffOutput: "One accepted pilot workflow with owner, audience, and expected output.",
      productionBoundary: "A scoped pilot is not a full enterprise rollout."
    },
    {
      id: "kickoff-data",
      category: "data",
      title: "Confirm safe sample data",
      status: "client_input_required",
      owner: "client",
      kickoffQuestion: "What safe sample files or rows can be used to shape the pilot?",
      currentDemoEvidence: [
        "Public demo uses mock data only.",
        "Client due diligence requires safe data boundary confirmation."
      ],
      clientInputNeeded: [
        "Sanitized invoice sample",
        "Sanitized bank transaction sample",
        "Field definitions",
        "Known edge cases"
      ],
      kickoffOutput: "Safe sample packet approved for pilot mapping.",
      productionBoundary: "Private production records stay in client-owned systems."
    },
    {
      id: "kickoff-access",
      category: "access",
      title: "Confirm reviewer and approver access",
      status: "blocked_until_client_owned",
      owner: "client",
      kickoffQuestion: "Who can view outputs and who can approve sensitive recommendations?",
      currentDemoEvidence: [
        "Demo API key protects action-like routes.",
        "Control matrix blocks production auth until client-owned controls exist."
      ],
      clientInputNeeded: [
        "Pilot viewer list",
        "Pilot approver list",
        "Escalation owner",
        "Access model"
      ],
      kickoffOutput: "Pilot access and approval responsibility map.",
      productionBoundary: "Production identity and authorization must be client-owned."
    },
    {
      id: "kickoff-approval-policy",
      category: "approval_policy",
      title: "Confirm approval and money-movement boundary",
      status: "blocked_until_client_owned",
      owner: "client",
      kickoffQuestion: "Should the pilot be recommendation-only or approval-preparation-only?",
      currentDemoEvidence: [
        "Pilot decision packet keeps money movement blocked.",
        "Control matrix blocks payment-like and accounting-posting actions until client-owned approval controls exist."
      ],
      clientInputNeeded: [
        "Payment approval rule",
        "Accounting posting rule",
        "Thresholds if any",
        "Explicit blocked actions"
      ],
      kickoffOutput: "Pilot approval policy with sensitive actions blocked by default.",
      productionBoundary: "No autonomous money movement or accounting posting is enabled."
    },
    {
      id: "kickoff-evidence",
      category: "evidence",
      title: "Review evidence package",
      status: "ready_for_review",
      owner: "builder",
      kickoffQuestion: "Can buyer and technical reviewers inspect what the demo proves?",
      currentDemoEvidence: [
        `Evidence binder demo evidence count: ${evidenceBinder.demoEvidenceCount}.`,
        `Control matrix item count: ${controlMatrix.items.length}.`
      ],
      clientInputNeeded: [
        "Reviewer list",
        "Questions from security",
        "Questions from finance",
        "Questions from technical owner"
      ],
      kickoffOutput: "Accepted reviewer evidence walkthrough.",
      productionBoundary: "Demo evidence is not enterprise compliance certification."
    },
    {
      id: "kickoff-runtime",
      category: "runtime",
      title: "Confirm pilot runtime and monitoring",
      status: "client_input_required",
      owner: "shared",
      kickoffQuestion: "Where should the pilot run and who receives alerts?",
      currentDemoEvidence: [
        "Local demo exposes request observability and audit visibility.",
        "Pilot decision packet requires runtime and monitoring confirmation."
      ],
      clientInputNeeded: [
        "Pilot runtime preference",
        "Monitoring destination",
        "Incident owner",
        "Escalation path"
      ],
      kickoffOutput: "Pilot runtime and monitoring plan.",
      productionBoundary: "Production deployment remains blocked until runtime, secrets, monitoring, and incident ownership are client-owned."
    },
    {
      id: "kickoff-success-metrics",
      category: "success_metrics",
      title: "Define pilot success metrics",
      status: "client_input_required",
      owner: "shared",
      kickoffQuestion: "What manual finance workload should the pilot reduce first?",
      currentDemoEvidence: [
        "Demo produces structured exceptions, approval queues, audit artifacts, and buyer-facing packages.",
        "Pilot decision packet requires manual workload baseline."
      ],
      clientInputNeeded: [
        "Current review time",
        "Current error or rework pain",
        "Target output format",
        "Success criteria"
      ],
      kickoffOutput: "Pilot success scorecard accepted before implementation starts.",
      productionBoundary: "Do not claim ROI until baseline and success criteria are accepted."
    },
    {
      id: "kickoff-next-steps",
      category: "next_steps",
      title: "Confirm next actions after kickoff",
      status: "ready_for_review",
      owner: "shared",
      kickoffQuestion: "What happens immediately after the kickoff call?",
      currentDemoEvidence: [
        "Repo now includes pilot decision, evidence, control, due diligence, and delivery packages.",
        "Pre-push and CI checks protect future commits."
      ],
      clientInputNeeded: [
        "Call notes owner",
        "Sample data delivery date",
        "Technical contact",
        "Buyer decision date"
      ],
      kickoffOutput: "Clear post-kickoff implementation checklist.",
      productionBoundary: "Implementation starts only after scope, data, access, approval boundary, and success metrics are accepted."
    }
  ];

  const blockedSections = kickoffSections.filter(
    (section) => section.status === "blocked_until_client_owned"
  );
  const inputRequiredSections = kickoffSections.filter(
    (section) => section.status === "client_input_required"
  );

  return {
    packageVersion: "client-pilot-kickoff-package-v1",
    status:
      blockedSections.length > 0
        ? "production_blocked"
        : inputRequiredSections.length > 0
          ? "pilot_kickoff_blocked_waiting_for_client"
          : "pilot_kickoff_ready",
    purpose:
      "Turn the pilot decision packet into a kickoff-ready buyer package with questions, required client inputs, evidence, success criteria, and production boundaries.",
    executiveSummary:
      "The project is ready for a structured pilot kickoff conversation, but implementation remains blocked until the client confirms workflow scope, safe sample data, access model, approval boundary, runtime, monitoring, and success metrics.",
    kickoffSections,
    clientPreworkChecklist: [
      "Choose one first finance workflow for the pilot.",
      "Prepare sanitized sample data.",
      "Identify pilot reviewers and approvers.",
      "Confirm recommendation-only or approval-preparation-only mode.",
      "Name runtime, monitoring, and incident owners.",
      "Define success criteria and current manual workload baseline."
    ],
    kickoffAgenda: [
      "Confirm business problem and pilot workflow.",
      "Review safe data sample requirements.",
      "Review access and approval boundary.",
      "Walk through evidence binder and control matrix.",
      "Confirm runtime and monitoring expectations.",
      "Define pilot success criteria.",
      "Assign post-kickoff owners and dates."
    ],
    pilotSuccessCriteriaDraft: [
      "Reduce manual review time for the selected workflow.",
      "Produce structured exceptions with clear reviewer actions.",
      "Keep sensitive actions human-approved.",
      "Generate audit-ready artifacts for each run.",
      "Create a clear go/no-go decision for the next pilot phase."
    ],
    blockedProductionBoundaries: [
      ...decisionPacket.productionClaimsStillBlocked,
      "No production client data in the public repo.",
      "No production credentials in local files or git history.",
      "No autonomous money movement.",
      "No accounting write-back without client-owned approval policy."
    ],
    recommendedKickoffDecision:
      "Schedule a pilot kickoff only after the client accepts the prework checklist and agrees that the first pilot remains scoped, evidence-led, and production-blocked until client-owned controls exist."
  };
}

export function summarizeClientPilotKickoffPackage(
  kickoffPackage: ClientPilotKickoffPackage = buildClientPilotKickoffPackage()
) {
  return {
    packageVersion: kickoffPackage.packageVersion,
    status: kickoffPackage.status,
    sectionCount: kickoffPackage.kickoffSections.length,
    readyForReviewSections: kickoffPackage.kickoffSections.filter(
      (section) => section.status === "ready_for_review"
    ).length,
    clientInputRequiredSections: kickoffPackage.kickoffSections.filter(
      (section) => section.status === "client_input_required"
    ).length,
    blockedUntilClientOwnedSections: kickoffPackage.kickoffSections.filter(
      (section) => section.status === "blocked_until_client_owned"
    ).length,
    preworkItemCount: kickoffPackage.clientPreworkChecklist.length,
    agendaItemCount: kickoffPackage.kickoffAgenda.length,
    successCriteriaCount: kickoffPackage.pilotSuccessCriteriaDraft.length,
    blockedProductionBoundaryCount: kickoffPackage.blockedProductionBoundaries.length
  };
}

export function validateClientPilotKickoffPackage(
  kickoffPackage: ClientPilotKickoffPackage = buildClientPilotKickoffPackage()
): ClientPilotKickoffPackageValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredCategories: ClientPilotKickoffSectionCategory[] = [
    "scope",
    "data",
    "access",
    "approval_policy",
    "evidence",
    "runtime",
    "success_metrics",
    "next_steps"
  ];

  for (const category of requiredCategories) {
    if (!kickoffPackage.kickoffSections.some((section) => section.category === category)) {
      errors.push(`Missing kickoff section category: ${category}.`);
    }
  }

  const accessSection = kickoffPackage.kickoffSections.find((section) => section.id === "kickoff-access");
  const approvalSection = kickoffPackage.kickoffSections.find(
    (section) => section.id === "kickoff-approval-policy"
  );

  if (accessSection?.status !== "blocked_until_client_owned") {
    errors.push("Access section must remain blocked until client-owned controls exist.");
  }

  if (approvalSection?.status !== "blocked_until_client_owned") {
    errors.push("Approval policy section must remain blocked until client-owned controls exist.");
  }

  if (kickoffPackage.clientPreworkChecklist.length < 5) {
    errors.push("Pilot kickoff package must include at least 5 client prework items.");
  }

  if (kickoffPackage.pilotSuccessCriteriaDraft.length < 4) {
    errors.push("Pilot kickoff package must include at least 4 draft success criteria.");
  }

  if (kickoffPackage.kickoffSections.some((section) => section.kickoffQuestion.trim().length === 0)) {
    errors.push("Every kickoff section must include a kickoff question.");
  }

  if (kickoffPackage.blockedProductionBoundaries.length === 0) {
    warnings.push("Blocked production boundaries are missing.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
