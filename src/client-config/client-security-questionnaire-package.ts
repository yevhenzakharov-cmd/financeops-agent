import { buildClientControlMatrix } from "./client-control-matrix.js";
import { buildClientDueDiligencePack } from "./client-due-diligence-pack.js";
import { buildClientEnterpriseRedTeamReport } from "./client-enterprise-red-team.js";
import { buildClientProcurementReviewPackage } from "./client-procurement-review-package.js";

export type ClientSecurityQuestionnaireStatus =
  | "security_questionnaire_draft_ready"
  | "security_questionnaire_blocked_waiting_for_client"
  | "production_blocked";

export type ClientSecurityQuestionnaireAnswerStatus =
  | "demo_answer_available"
  | "client_input_required"
  | "blocked_until_client_owned";

export type ClientSecurityQuestionnaireCategory =
  | "data_handling"
  | "authentication"
  | "authorization"
  | "secrets"
  | "audit_logging"
  | "monitoring"
  | "ai_boundary"
  | "payment_boundary"
  | "deployment"
  | "incident_response";

export interface ClientSecurityQuestionnaireItem {
  id: string;
  category: ClientSecurityQuestionnaireCategory;
  question: string;
  status: ClientSecurityQuestionnaireAnswerStatus;
  demoSafeAnswer: string;
  evidence: string[];
  clientInputNeeded: string[];
  productionBoundary: string;
}

export interface ClientSecurityQuestionnairePackage {
  packageVersion: "client-security-questionnaire-package-v1";
  status: ClientSecurityQuestionnaireStatus;
  purpose: string;
  executiveSummary: string;
  items: ClientSecurityQuestionnaireItem[];
  demoAnswerCount: number;
  clientInputRequiredCount: number;
  blockedUntilClientOwnedCount: number;
  securityReviewerNotes: string[];
  blockedProductionClaims: string[];
  recommendedSecurityDecision: string;
}

export interface ClientSecurityQuestionnairePackageValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientSecurityQuestionnairePackage(): ClientSecurityQuestionnairePackage {
  const controlMatrix = buildClientControlMatrix();
  const dueDiligencePack = buildClientDueDiligencePack();
  const redTeamReport = buildClientEnterpriseRedTeamReport();
  const procurementPackage = buildClientProcurementReviewPackage();

  const items: ClientSecurityQuestionnaireItem[] = [
    {
      id: "security-data-handling",
      category: "data_handling",
      question: "What data does the demo use, and will production data be stored in this repository?",
      status: "demo_answer_available",
      demoSafeAnswer:
        "The public demo uses mock data only. Production client data must remain in client-owned systems and must not be committed to the public repository.",
      evidence: [
        "Procurement review package keeps data review blocked until client-owned.",
        "Due diligence pack requires client answers about production financial data."
      ],
      clientInputNeeded: [
        "Client safe sample policy",
        "Production data storage location",
        "Retention expectations",
        "Approved sample fields"
      ],
      productionBoundary:
        "No private production data should enter git history, unmanaged local files, or public demo artifacts."
    },
    {
      id: "security-authentication",
      category: "authentication",
      question: "How is the demo protected, and what authentication is required for production?",
      status: "blocked_until_client_owned",
      demoSafeAnswer:
        "Demo action-like routes are protected by a demo API key. Production authentication must be replaced with client-owned identity and access management.",
      evidence: [
        "Demo auth status explains protected action routes.",
        "Control matrix blocks production authentication until client-owned controls exist."
      ],
      clientInputNeeded: [
        "Client identity provider",
        "Required authentication method",
        "Pilot reviewer identities",
        "Pilot approver identities"
      ],
      productionBoundary:
        "Production authentication is not approved until client-owned identity controls are configured."
    },
    {
      id: "security-authorization",
      category: "authorization",
      question: "Who can view, approve, reject, export, or execute sensitive outputs?",
      status: "blocked_until_client_owned",
      demoSafeAnswer:
        "The demo separates read-only reviewer endpoints from action-like protected routes. Production role-based authorization must be client-owned.",
      evidence: [
        "Procurement review requires security owner and final decision owner.",
        "Control matrix keeps payment-like and accounting write actions blocked."
      ],
      clientInputNeeded: [
        "Viewer role",
        "Approver role",
        "Exporter role",
        "Incident owner",
        "Escalation owner"
      ],
      productionBoundary:
        "No production permissions should be granted without client-approved role mapping."
    },
    {
      id: "security-secrets",
      category: "secrets",
      question: "Where are credentials, API keys, and secrets stored?",
      status: "blocked_until_client_owned",
      demoSafeAnswer:
        "The demo must not expose production secrets. Production secrets must be stored in client-owned secret management infrastructure.",
      evidence: [
        "Control matrix blocks production secrets until client-owned secret management exists.",
        "Red-team report blocks committed production credentials."
      ],
      clientInputNeeded: [
        "Secret manager choice",
        "Secret rotation policy",
        "Runtime secret injection method",
        "Owner for credential lifecycle"
      ],
      productionBoundary:
        "No production credential should be stored in source code, local plaintext files, logs, or public artifacts."
    },
    {
      id: "security-audit-logging",
      category: "audit_logging",
      question: "What audit evidence is available in the demo?",
      status: "demo_answer_available",
      demoSafeAnswer:
        "The demo exposes audit visibility, execution ledger, approval queue, payment execution artifact, and client output artifact for reviewer inspection.",
      evidence: [
        "Audit visibility endpoint exposes traceability.",
        "Artifact registry confirms generated artifacts.",
        "Evidence binder includes audit and artifact traceability."
      ],
      clientInputNeeded: [
        "Audit retention policy",
        "Audit access owner",
        "Export format",
        "Compliance review process"
      ],
      productionBoundary:
        "Production audit access, retention, and export policy must be client-owned."
    },
    {
      id: "security-monitoring",
      category: "monitoring",
      question: "What monitoring exists, and who owns production alerts?",
      status: "client_input_required",
      demoSafeAnswer:
        "The demo exposes request observability and status summaries. Production monitoring and incident ownership must be defined by the client.",
      evidence: [
        "Request observability endpoint exists.",
        "Procurement package requires security, monitoring, and incident ownership inputs."
      ],
      clientInputNeeded: [
        "Monitoring destination",
        "Alert owner",
        "Incident response owner",
        "Escalation path"
      ],
      productionBoundary:
        "Production monitoring is not approved until alert routing and incident ownership are accepted."
    },
    {
      id: "security-ai-boundary",
      category: "ai_boundary",
      question: "Can AI invent financial outputs or make final finance decisions?",
      status: "demo_answer_available",
      demoSafeAnswer:
        "Financial calculations are deterministic, and AI-style wording explains already-computed results. Sensitive actions remain approval-gated.",
      evidence: [
        "Evidence binder includes deterministic finance logic boundary.",
        "Control matrix separates AI explanation from deterministic finance logic.",
        `Red-team findings: ${redTeamReport.findings.length}.`
      ],
      clientInputNeeded: [
        "Accepted finance rules",
        "Accepted tolerances",
        "Accepted reviewer owner",
        "Blocked AI decision types"
      ],
      productionBoundary:
        "AI must not make final finance, legal, tax, payment, or accounting decisions without client-approved controls."
    },
    {
      id: "security-payment-boundary",
      category: "payment_boundary",
      question: "Can the system move money autonomously?",
      status: "blocked_until_client_owned",
      demoSafeAnswer:
        "No. The demo simulates or prepares payment-like actions and keeps money movement human-approved.",
      evidence: [
        "Protected payment-like route is demo API-key gated.",
        "Control matrix blocks payment execution until client-owned approvals exist.",
        "Procurement package blocks autonomous payment approval."
      ],
      clientInputNeeded: [
        "Payment approval policy",
        "Approval thresholds",
        "Payment rail owner",
        "Explicit blocked actions"
      ],
      productionBoundary:
        "No autonomous money movement is approved."
    },
    {
      id: "security-deployment",
      category: "deployment",
      question: "Where will production run?",
      status: "blocked_until_client_owned",
      demoSafeAnswer:
        "The public project is a demo repository. Production runtime must be client-owned or explicitly accepted by the client.",
      evidence: [
        "Due diligence pack requires production runtime answers.",
        "Procurement review blocks production deployment approval."
      ],
      clientInputNeeded: [
        "Pilot runtime",
        "Production runtime",
        "Deployment owner",
        "Environment separation policy"
      ],
      productionBoundary:
        "Production deployment is blocked until runtime, secrets, auth, monitoring, and incident ownership are accepted."
    },
    {
      id: "security-incident-response",
      category: "incident_response",
      question: "Who handles incidents, failures, and escalations?",
      status: "client_input_required",
      demoSafeAnswer:
        "The demo can describe incident ownership requirements, but the client must name production owners and escalation paths.",
      evidence: [
        "Procurement review asks for security owner, legal owner, finance owner, and approval timeline.",
        "Control matrix includes monitoring and incident ownership boundaries."
      ],
      clientInputNeeded: [
        "Incident owner",
        "Escalation owner",
        "Response time expectation",
        "Notification channels"
      ],
      productionBoundary:
        "Production incident response is blocked until client-owned responsibility is assigned."
    }
  ];

  const demoAnswerCount = items.filter((item) => item.status === "demo_answer_available").length;
  const clientInputRequiredCount = items.filter(
    (item) => item.status === "client_input_required"
  ).length;
  const blockedUntilClientOwnedCount = items.filter(
    (item) => item.status === "blocked_until_client_owned"
  ).length;

  return {
    packageVersion: "client-security-questionnaire-package-v1",
    status:
      blockedUntilClientOwnedCount > 0
        ? "production_blocked"
        : clientInputRequiredCount > 0
          ? "security_questionnaire_blocked_waiting_for_client"
          : "security_questionnaire_draft_ready",
    purpose:
      "Prepare an enterprise security questionnaire response package for buyer, security, procurement, and technical review.",
    executiveSummary:
      "The demo can answer several security questions around mock data, auditability, deterministic finance logic, and approval boundaries. Production security remains blocked until the client owns authentication, authorization, secrets, monitoring, runtime, data handling, payment approvals, and incident response.",
    items,
    demoAnswerCount,
    clientInputRequiredCount,
    blockedUntilClientOwnedCount,
    securityReviewerNotes: [
      "Public demo uses mock data only.",
      "Read-only reviewer endpoints are separate from action-like protected routes.",
      "Demo API key is not a production authentication model.",
      "Production auth, secrets, runtime, monitoring, data handling, and payment approvals must be client-owned.",
      `Procurement sections available: ${procurementPackage.sections.length}.`,
      `Due diligence required answers: ${dueDiligencePack.requiredClientAnswers.length}.`,
      `Production-blocked controls: ${controlMatrix.productionBlockedControls.length}.`
    ],
    blockedProductionClaims: [
      "No production security approval",
      "No autonomous money movement",
      "No accounting write-back approval",
      "No production credential handling approval",
      "No enterprise compliance certification",
      "No production deployment approval"
    ],
    recommendedSecurityDecision:
      "Use this as a draft security questionnaire package for enterprise review, but keep production approval blocked until client-owned controls and security answers are accepted."
  };
}

export function summarizeClientSecurityQuestionnairePackage(
  questionnairePackage: ClientSecurityQuestionnairePackage = buildClientSecurityQuestionnairePackage()
) {
  return {
    packageVersion: questionnairePackage.packageVersion,
    status: questionnairePackage.status,
    itemCount: questionnairePackage.items.length,
    demoAnswerCount: questionnairePackage.demoAnswerCount,
    clientInputRequiredCount: questionnairePackage.clientInputRequiredCount,
    blockedUntilClientOwnedCount: questionnairePackage.blockedUntilClientOwnedCount,
    securityReviewerNoteCount: questionnairePackage.securityReviewerNotes.length,
    blockedProductionClaimCount: questionnairePackage.blockedProductionClaims.length
  };
}

export function validateClientSecurityQuestionnairePackage(
  questionnairePackage: ClientSecurityQuestionnairePackage = buildClientSecurityQuestionnairePackage()
): ClientSecurityQuestionnairePackageValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredCategories: ClientSecurityQuestionnaireCategory[] = [
    "data_handling",
    "authentication",
    "authorization",
    "secrets",
    "audit_logging",
    "monitoring",
    "ai_boundary",
    "payment_boundary",
    "deployment",
    "incident_response"
  ];

  for (const category of requiredCategories) {
    if (!questionnairePackage.items.some((item) => item.category === category)) {
      errors.push(`Missing security questionnaire category: ${category}.`);
    }
  }

  const authItem = questionnairePackage.items.find((item) => item.id === "security-authentication");
  const secretsItem = questionnairePackage.items.find((item) => item.id === "security-secrets");
  const paymentItem = questionnairePackage.items.find((item) => item.id === "security-payment-boundary");

  if (authItem?.status !== "blocked_until_client_owned") {
    errors.push("Authentication must remain blocked until client-owned controls exist.");
  }

  if (secretsItem?.status !== "blocked_until_client_owned") {
    errors.push("Secrets must remain blocked until client-owned controls exist.");
  }

  if (paymentItem?.status !== "blocked_until_client_owned") {
    errors.push("Payment boundary must remain blocked until client-owned controls exist.");
  }

  if (questionnairePackage.items.length < 10) {
    errors.push("Security questionnaire package must include at least 10 items.");
  }

  if (!questionnairePackage.blockedProductionClaims.includes("No autonomous money movement")) {
    errors.push("Security questionnaire package must explicitly block autonomous money movement.");
  }

  if (questionnairePackage.demoAnswerCount < 3) {
    errors.push("Security questionnaire package must include at least 3 demo-safe answers.");
  }

  if (questionnairePackage.items.some((item) => item.question.trim().length === 0)) {
    errors.push("Every security questionnaire item must include a question.");
  }

  if (questionnairePackage.securityReviewerNotes.length === 0) {
    warnings.push("Security reviewer notes are missing.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
