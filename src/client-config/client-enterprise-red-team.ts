import { buildClientAcceptanceGate } from "./client-acceptance-gate.js";
import { buildClientDeliveryPackage } from "./client-delivery-package.js";
import { buildClientDeploymentProfile } from "./client-deployment-profile.js";
import { buildClientEnterpriseSalesBrief } from "./client-enterprise-sales-brief.js";

export type ClientEnterpriseRedTeamStatus =
  | "demo_claims_safe"
  | "pilot_claims_need_review"
  | "production_claims_blocked";

export type ClientEnterpriseRedTeamSeverity = "low" | "medium" | "high" | "blocked";

export interface ClientEnterpriseRedTeamFinding {
  id: string;
  severity: ClientEnterpriseRedTeamSeverity;
  area: "sales_claim" | "security" | "finance_control" | "deployment" | "data_boundary" | "audit";
  riskyClaimOrAssumption: string;
  safeReplacement: string;
  evidence: string[];
  mustBeTrueBeforeProduction: string[];
}

export interface ClientEnterpriseRedTeamReport {
  reportVersion: "client-enterprise-red-team-v1";
  status: ClientEnterpriseRedTeamStatus;
  purpose: string;
  findings: ClientEnterpriseRedTeamFinding[];
  approvedDemoClaims: string[];
  blockedProductionClaims: string[];
  reviewerGuidance: string[];
}

export interface ClientEnterpriseRedTeamValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientEnterpriseRedTeamReport(): ClientEnterpriseRedTeamReport {
  const acceptanceGate = buildClientAcceptanceGate();
  const deliveryPackage = buildClientDeliveryPackage();
  const deploymentProfile = buildClientDeploymentProfile();
  const salesBrief = buildClientEnterpriseSalesBrief();

  const findings: ClientEnterpriseRedTeamFinding[] = [
    {
      id: "red-team-production-ready-claim",
      severity: "blocked",
      area: "sales_claim",
      riskyClaimOrAssumption: "The public repo is production-ready for an enterprise client.",
      safeReplacement:
        "The public repo is a demo-safe implementation core that can become production-ready only after client-owned controls are configured.",
      evidence: [
        `Sales brief status: ${salesBrief.status}.`,
        `Deployment profile status: ${deploymentProfile.status}.`,
        `Acceptance gate status: ${acceptanceGate.status}.`
      ],
      mustBeTrueBeforeProduction: [
        "Client-owned runtime exists.",
        "Client-owned auth exists.",
        "Client-owned secrets exist.",
        "Client-owned monitoring exists."
      ]
    },
    {
      id: "red-team-autonomous-money-movement",
      severity: "blocked",
      area: "finance_control",
      riskyClaimOrAssumption: "The agent can move money autonomously without human review.",
      safeReplacement:
        "The agent can prepare recommendations and approval requests, but money movement remains human-approved.",
      evidence: [
        "Acceptance gate blocks sensitive actions.",
        "Delivery package blocks autonomous money movement claims."
      ],
      mustBeTrueBeforeProduction: [
        "Authorized approver roles are defined.",
        "Approval policy is encoded.",
        "Idempotency and payment boundaries are accepted."
      ]
    },
    {
      id: "red-team-ai-calculation-claim",
      severity: "high",
      area: "finance_control",
      riskyClaimOrAssumption: "AI produces the financial calculations.",
      safeReplacement:
        "Deterministic FinanceOps logic produces calculations; AI-style output only explains already-computed results.",
      evidence: [
        "Sales brief includes deterministic finance core signal.",
        "Delivery package includes deterministic finance proof point."
      ],
      mustBeTrueBeforeProduction: [
        "Client schemas are accepted.",
        "Calculation rules are reviewed.",
        "Finance edge cases are covered by tests."
      ]
    },
    {
      id: "red-team-client-data-boundary",
      severity: "blocked",
      area: "data_boundary",
      riskyClaimOrAssumption: "Private client financial records can be committed into the repo for convenience.",
      safeReplacement:
        "Only safe mock or sanitized sample data belongs in the repo; private financial records stay in client-owned systems.",
      evidence: [
        "Deployment profile blocks production data in the public repo.",
        "Repo starter requires mock-data replacement with safe client-shaped samples."
      ],
      mustBeTrueBeforeProduction: [
        "Data access policy is accepted.",
        "Sanitized sample strategy is accepted.",
        "Production data stays in client-owned systems."
      ]
    },
    {
      id: "red-team-secret-handling",
      severity: "blocked",
      area: "security",
      riskyClaimOrAssumption: "Production credentials can be stored in local files or committed examples.",
      safeReplacement:
        "Production credentials must use client-owned secret management and never be committed.",
      evidence: [
        "Deployment profile blocks secrets until configured.",
        "Sales brief requires client-owned secret management."
      ],
      mustBeTrueBeforeProduction: [
        "Secret management approach is selected.",
        "Credential rotation owner is assigned.",
        "No production credentials exist in git history."
      ]
    },
    {
      id: "red-team-audit-overclaim",
      severity: "medium",
      area: "audit",
      riskyClaimOrAssumption: "Demo audit evidence equals enterprise audit compliance.",
      safeReplacement:
        "Demo audit evidence proves traceability pattern; enterprise audit retention and access must be accepted by the client.",
      evidence: [
        "Deployment profile requires client audit retention expectations.",
        "Delivery package frames audit as proof point, not compliance certification."
      ],
      mustBeTrueBeforeProduction: [
        "Audit retention period is defined.",
        "Audit access policy is defined.",
        "Client compliance reviewers accept the audit artifact format."
      ]
    }
  ];

  const blockedFindings = findings.filter((finding) => finding.severity === "blocked");
  const highFindings = findings.filter((finding) => finding.severity === "high");

  return {
    reportVersion: "client-enterprise-red-team-v1",
    status:
      blockedFindings.length > 0
        ? "production_claims_blocked"
        : highFindings.length > 0
          ? "pilot_claims_need_review"
          : "demo_claims_safe",
    purpose:
      "Red-team the enterprise buyer story so the repo sells honestly without overclaiming production readiness, autonomous money movement, or compliance.",
    findings,
    approvedDemoClaims: [
      "The repo demonstrates a reusable FinanceOps automation core.",
      "The repo demonstrates deterministic finance logic boundaries.",
      "The repo demonstrates adapter planning for client-specific implementations.",
      "The repo demonstrates approval-gated sensitive actions.",
      "The repo demonstrates structured reviewer endpoints and auditability patterns."
    ],
    blockedProductionClaims: [
      ...deliveryPackage.blockedProductionClaims,
      "Do not claim SOC 2, ISO, or enterprise compliance certification from this public demo alone.",
      "Do not claim live ERP, bank, payroll, or payment processor integration until a client implementation exists."
    ],
    reviewerGuidance: [
      "Use safe replacement language from each finding in pitches and README-style materials.",
      "Keep production blockers visible because enterprise buyers will ask about them.",
      "Treat blocked findings as maturity evidence, not weakness.",
      "Do not remove human approval language from payment or accounting workflows."
    ]
  };
}

export function summarizeClientEnterpriseRedTeamReport(
  report: ClientEnterpriseRedTeamReport = buildClientEnterpriseRedTeamReport()
) {
  return {
    reportVersion: report.reportVersion,
    status: report.status,
    findingCount: report.findings.length,
    blockedFindings: report.findings.filter((finding) => finding.severity === "blocked").length,
    highFindings: report.findings.filter((finding) => finding.severity === "high").length,
    mediumFindings: report.findings.filter((finding) => finding.severity === "medium").length,
    approvedDemoClaimCount: report.approvedDemoClaims.length,
    blockedProductionClaimCount: report.blockedProductionClaims.length,
    reviewerGuidanceCount: report.reviewerGuidance.length
  };
}

export function validateClientEnterpriseRedTeamReport(
  report: ClientEnterpriseRedTeamReport = buildClientEnterpriseRedTeamReport()
): ClientEnterpriseRedTeamValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (report.findings.length === 0) {
    errors.push("Red-team report must include findings.");
  }

  const requiredFindingIds = [
    "red-team-production-ready-claim",
    "red-team-autonomous-money-movement",
    "red-team-ai-calculation-claim",
    "red-team-client-data-boundary",
    "red-team-secret-handling"
  ];

  for (const id of requiredFindingIds) {
    if (!report.findings.some((finding) => finding.id === id)) {
      errors.push(`Missing required red-team finding: ${id}.`);
    }
  }

  const productionFinding = report.findings.find(
    (finding) => finding.id === "red-team-production-ready-claim"
  );

  if (productionFinding?.severity !== "blocked") {
    errors.push("Production-ready claim finding must remain blocked.");
  }

  const moneyMovementFinding = report.findings.find(
    (finding) => finding.id === "red-team-autonomous-money-movement"
  );

  if (moneyMovementFinding?.severity !== "blocked") {
    errors.push("Autonomous money movement finding must remain blocked.");
  }

  const hasSafeReplacementLanguage = report.findings.every((finding) =>
    finding.safeReplacement.trim().length > 0
  );

  if (!hasSafeReplacementLanguage) {
    errors.push("Every red-team finding must include safe replacement language.");
  }

  if (report.blockedProductionClaims.length === 0) {
    warnings.push("Blocked production claims are missing.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
