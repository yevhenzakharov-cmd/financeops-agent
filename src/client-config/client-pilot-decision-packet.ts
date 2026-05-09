import { buildClientAcceptanceGate } from "./client-acceptance-gate.js";
import { buildClientControlMatrix } from "./client-control-matrix.js";
import { buildClientDueDiligencePack } from "./client-due-diligence-pack.js";
import { buildClientEvidenceBinder } from "./client-evidence-binder.js";

export type ClientPilotDecisionPacketStatus =
  | "pilot_review_ready"
  | "pilot_blocked_waiting_for_client"
  | "production_blocked";

export type ClientPilotDecisionGateStatus =
  | "pass"
  | "needs_client_answer"
  | "blocked_until_client_owned";

export type ClientPilotDecisionGateCategory =
  | "scope"
  | "data"
  | "security"
  | "finance_control"
  | "evidence"
  | "deployment"
  | "commercial";

export interface ClientPilotDecisionGate {
  id: string;
  category: ClientPilotDecisionGateCategory;
  title: string;
  status: ClientPilotDecisionGateStatus;
  owner: "builder" | "client" | "shared";
  decisionQuestion: string;
  currentEvidence: string[];
  requiredBeforePilot: string[];
  blockedProductionBoundary: string;
}

export interface ClientPilotDecisionPacket {
  packetVersion: "client-pilot-decision-packet-v1";
  status: ClientPilotDecisionPacketStatus;
  purpose: string;
  executiveSummary: string;
  readinessScore: number;
  gates: ClientPilotDecisionGate[];
  recommendedPilotDecision: string;
  clientAnswersNeeded: string[];
  productionClaimsStillBlocked: string[];
  reviewerFlow: string[];
}

export interface ClientPilotDecisionPacketValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientPilotDecisionPacket(): ClientPilotDecisionPacket {
  const acceptanceGate = buildClientAcceptanceGate();
  const controlMatrix = buildClientControlMatrix();
  const dueDiligencePack = buildClientDueDiligencePack();
  const evidenceBinder = buildClientEvidenceBinder();

  const gates: ClientPilotDecisionGate[] = [
    {
      id: "pilot-gate-scope",
      category: "scope",
      title: "Pilot workflow scope",
      status: "needs_client_answer",
      owner: "shared",
      decisionQuestion: "Which one finance workflow should the first pilot automate?",
      currentEvidence: [
        "Demo supports overdue invoice review, orphan bank transaction review, margin risk review, and payment approval preparation.",
        "Evidence binder shows reviewer-facing proof points."
      ],
      requiredBeforePilot: [
        "Client selects one first workflow.",
        "Client names the workflow owner.",
        "Client accepts expected output format."
      ],
      blockedProductionBoundary:
        "Do not describe the pilot as a full enterprise rollout until the first workflow is accepted and tested."
    },
    {
      id: "pilot-gate-data",
      category: "data",
      title: "Representative safe data sample",
      status: "needs_client_answer",
      owner: "client",
      decisionQuestion: "Can the client provide safe sample inputs that match the real finance process?",
      currentEvidence: [
        "Public demo uses mock data only.",
        `${dueDiligencePack.requiredClientAnswers.length} client answers are still required.`
      ],
      requiredBeforePilot: [
        "Client provides sanitized sample rows.",
        "Client confirms source-system field meanings.",
        "Client confirms where private production data will stay."
      ],
      blockedProductionBoundary:
        "Private client records must not be committed to the public repo or unmanaged local files."
    },
    {
      id: "pilot-gate-auth",
      category: "security",
      title: "Pilot authentication and role boundary",
      status: "blocked_until_client_owned",
      owner: "client",
      decisionQuestion: "Who can view, approve, reject, export, or execute pilot outputs?",
      currentEvidence: [
        "Demo API key protects action-like routes.",
        "Control matrix keeps production auth blocked until client-owned controls exist."
      ],
      requiredBeforePilot: [
        "Client identifies pilot reviewers.",
        "Client identifies pilot approvers.",
        "Client accepts a temporary pilot access model."
      ],
      blockedProductionBoundary:
        "Production auth remains blocked until client-owned identity and role-based authorization are configured."
    },
    {
      id: "pilot-gate-money-movement",
      category: "finance_control",
      title: "Money movement and accounting write boundary",
      status: "blocked_until_client_owned",
      owner: "client",
      decisionQuestion: "Will pilot outputs be suggestion-only, approval requests, or connected to action systems?",
      currentEvidence: [
        `Acceptance gate status: ${acceptanceGate.status}.`,
        "Control matrix blocks payment-like and accounting-posting actions until client-owned approvals exist."
      ],
      requiredBeforePilot: [
        "Pilot starts as recommendation-only or approval-preparation-only.",
        "Client signs off on human approval requirement.",
        "No autonomous money movement is enabled."
      ],
      blockedProductionBoundary:
        "Do not enable payment execution or accounting postings without client-owned approval policy and permissions."
    },
    {
      id: "pilot-gate-evidence",
      category: "evidence",
      title: "Reviewer evidence package",
      status: "pass",
      owner: "builder",
      decisionQuestion: "Can a buyer review what the demo proves without reading raw code?",
      currentEvidence: [
        `Evidence binder status: ${evidenceBinder.status}.`,
        `Demo evidence items: ${evidenceBinder.demoEvidenceCount}.`
      ],
      requiredBeforePilot: [
        "Share evidence binder.",
        "Share control matrix.",
        "Share due diligence pack."
      ],
      blockedProductionBoundary:
        "Demo evidence proves the pattern, not enterprise compliance certification."
    },
    {
      id: "pilot-gate-deployment",
      category: "deployment",
      title: "Pilot runtime and monitoring boundary",
      status: "needs_client_answer",
      owner: "shared",
      decisionQuestion: "Where will the pilot run, and who receives alerts?",
      currentEvidence: [
        "Local demo has request observability and audit visibility.",
        `Production-blocked controls: ${controlMatrix.productionBlockedControls.length}.`
      ],
      requiredBeforePilot: [
        "Client chooses pilot runtime.",
        "Client accepts monitoring destination.",
        "Client assigns incident owner."
      ],
      blockedProductionBoundary:
        "Production rollout remains blocked until runtime, monitoring, secrets, and incident ownership are client-owned."
    },
    {
      id: "pilot-gate-commercial",
      category: "commercial",
      title: "Paid pilot value hypothesis",
      status: "needs_client_answer",
      owner: "shared",
      decisionQuestion: "What manual finance workload should the pilot reduce first?",
      currentEvidence: [
        "Demo shows structured exceptions, approvals, audit evidence, and reviewer-facing packages.",
        "Due diligence and evidence layers separate buyer proof from production claims."
      ],
      requiredBeforePilot: [
        "Client names the manual workflow.",
        "Client estimates current review time.",
        "Client defines pilot success criteria."
      ],
      blockedProductionBoundary:
        "Do not claim ROI until client baseline, scope, and success metrics are accepted."
    }
  ];

  const blockedGateCount = gates.filter((gate) => gate.status === "blocked_until_client_owned").length;
  const answerGateCount = gates.filter((gate) => gate.status === "needs_client_answer").length;
  const passGateCount = gates.filter((gate) => gate.status === "pass").length;
  const readinessScore = Math.round((passGateCount / gates.length) * 100);

  return {
    packetVersion: "client-pilot-decision-packet-v1",
    status:
      blockedGateCount > 0
        ? "production_blocked"
        : answerGateCount > 0
          ? "pilot_blocked_waiting_for_client"
          : "pilot_review_ready",
    purpose:
      "Help a buyer decide whether the demo is ready for a scoped paid pilot while keeping production claims blocked until client-owned controls exist.",
    executiveSummary:
      "The project is strong enough for pilot discussion because reviewer evidence, controls, due diligence, and auditability are visible. A real pilot still needs client answers about scope, safe data, access, runtime, approvals, monitoring, and success criteria.",
    readinessScore,
    gates,
    recommendedPilotDecision:
      "Proceed to pilot scoping only after the client confirms one first workflow, safe sample data, reviewer roles, approval boundaries, runtime expectations, and success criteria.",
    clientAnswersNeeded: [
      "Which first workflow should be piloted?",
      "Which safe sample files or rows can be provided?",
      "Who reviews and approves outputs?",
      "Where should pilot outputs be delivered?",
      "Where will the pilot run?",
      "What manual workload or cost should the pilot reduce?"
    ],
    productionClaimsStillBlocked: [
      ...dueDiligencePack.blockedProductionClaims,
      "Do not claim production security approval before client-owned auth, secrets, runtime, and monitoring exist.",
      "Do not claim autonomous payment execution."
    ],
    reviewerFlow: [
      "Review executive summary.",
      "Confirm the selected pilot workflow.",
      "Confirm data sample and mapping readiness.",
      "Confirm approval and money movement boundaries.",
      "Review evidence binder and control matrix.",
      "Confirm pilot runtime, monitoring, and success criteria.",
      "Decide whether to start a scoped pilot."
    ]
  };
}

export function summarizeClientPilotDecisionPacket(
  packet: ClientPilotDecisionPacket = buildClientPilotDecisionPacket()
) {
  return {
    packetVersion: packet.packetVersion,
    status: packet.status,
    readinessScore: packet.readinessScore,
    gateCount: packet.gates.length,
    passingGates: packet.gates.filter((gate) => gate.status === "pass").length,
    clientAnswerRequiredGates: packet.gates.filter((gate) => gate.status === "needs_client_answer").length,
    blockedUntilClientOwnedGates: packet.gates.filter(
      (gate) => gate.status === "blocked_until_client_owned"
    ).length,
    clientAnswersNeededCount: packet.clientAnswersNeeded.length,
    productionClaimsStillBlockedCount: packet.productionClaimsStillBlocked.length
  };
}

export function validateClientPilotDecisionPacket(
  packet: ClientPilotDecisionPacket = buildClientPilotDecisionPacket()
): ClientPilotDecisionPacketValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredCategories: ClientPilotDecisionGateCategory[] = [
    "scope",
    "data",
    "security",
    "finance_control",
    "evidence",
    "deployment",
    "commercial"
  ];

  for (const category of requiredCategories) {
    if (!packet.gates.some((gate) => gate.category === category)) {
      errors.push(`Missing pilot decision gate category: ${category}.`);
    }
  }

  const moneyGate = packet.gates.find((gate) => gate.id === "pilot-gate-money-movement");
  const authGate = packet.gates.find((gate) => gate.id === "pilot-gate-auth");

  if (moneyGate?.status !== "blocked_until_client_owned") {
    errors.push("Money movement gate must remain blocked until client-owned controls exist.");
  }

  if (authGate?.status !== "blocked_until_client_owned") {
    errors.push("Auth gate must remain blocked until client-owned controls exist.");
  }

  if (packet.gates.length < 7) {
    errors.push("Pilot decision packet must include at least 7 gates.");
  }

  if (packet.clientAnswersNeeded.length === 0) {
    errors.push("Pilot decision packet must list client answers needed.");
  }

  if (packet.productionClaimsStillBlocked.length === 0) {
    warnings.push("Production claims still blocked list is empty.");
  }

  if (packet.gates.some((gate) => gate.decisionQuestion.trim().length === 0)) {
    errors.push("Every pilot gate must include a decision question.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
