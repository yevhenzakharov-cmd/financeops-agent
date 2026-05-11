import { buildClientReviewerAudit } from "./client-reviewer-audit.js";
import { buildClientReviewerDashboard } from "./client-reviewer-dashboard.js";
import { buildClientCommercialPackage } from "./client-commercial-package.js";
import { buildClientEvidenceBinder } from "./client-evidence-binder.js";
import { buildClientControlMatrix } from "./client-control-matrix.js";
import { buildClientProductionReadinessPackage } from "./client-production-readiness-package.js";

export interface ClientReviewerDashboardPackage {
  packageVersion: "client-reviewer-dashboard-package-v1";
  status: "demo_ready_production_blocked";
  purpose: string;
  executiveSummary: string;
  reviewerPath: string[];
  reviewerDecision: {
    demoReady: boolean;
    pilotDiscussionReady: boolean;
    productionReady: boolean;
    reason: string;
  };
  dashboard: ReturnType<typeof buildClientReviewerDashboard>;
  audit: ReturnType<typeof buildClientReviewerAudit>;
  commercialPackage: ReturnType<typeof buildClientCommercialPackage>;
  evidenceBinder: ReturnType<typeof buildClientEvidenceBinder>;
  controlMatrix: ReturnType<typeof buildClientControlMatrix>;
  productionReadiness: ReturnType<typeof buildClientProductionReadinessPackage>;
  strongestProofPoints: string[];
  productionBoundaries: string[];
  recommendedNextActions: string[];
}

export function buildClientReviewerDashboardPackage(): ClientReviewerDashboardPackage {
  const dashboard = buildClientReviewerDashboard();
  const audit = buildClientReviewerAudit();
  const commercialPackage = buildClientCommercialPackage();
  const evidenceBinder = buildClientEvidenceBinder();
  const controlMatrix = buildClientControlMatrix();
  const productionReadiness = buildClientProductionReadinessPackage();

  return {
    packageVersion: "client-reviewer-dashboard-package-v1",
    status: "demo_ready_production_blocked",
    purpose:
      "Give technical reviewers, CFO-style buyers, founders, hiring managers, and potential clients one consolidated package for reviewing what the FinanceOps Agent proves.",
    executiveSummary:
      "FinanceOps Agent is ready for demo, portfolio review, and pilot discussion because it exposes deterministic finance logic, approval boundaries, audit artifacts, client handoff packages, and commercial positioning. It remains blocked for production until client-owned data, auth, secrets, monitoring, mappings, approval policies, and deployment controls exist.",
    reviewerPath: [
      "Open /client/reviewer-dashboard-package for the consolidated review package.",
      "Review /client/reviewer-dashboard for the fast executive overview.",
      "Review /client/reviewer-audit for engineering and product signals.",
      "Review /client/evidence-binder for proof points and traceability.",
      "Review /client/control-matrix and /client/production-readiness-package for production blockers."
    ],
    reviewerDecision: {
      demoReady: true,
      pilotDiscussionReady: true,
      productionReady: false,
      reason:
        "The public repo is strong enough to demonstrate architecture, safety boundaries, and commercial potential, but production use requires client-owned controls and real mapped data."
    },
    dashboard,
    audit,
    commercialPackage,
    evidenceBinder,
    controlMatrix,
    productionReadiness,
    strongestProofPoints: [
      "Deterministic finance logic is separated from AI-style explanation.",
      "Sensitive finance actions are blocked or approval-gated.",
      "Audit, ledger, approval, payment, and output artifacts are inspectable.",
      "Client implementation planning is modeled from discovery through production readiness.",
      "Buyer-facing sales, FAQ, ROI, objection handling, and pilot packaging are included."
    ],
    productionBoundaries: [
      "No private client financial data belongs in the public repo.",
      "No production credentials should be stored locally or committed.",
      "No autonomous money movement is allowed.",
      "No accounting posting is enabled without client approval.",
      "No production-readiness claim should be made until client-owned controls exist."
    ],
    recommendedNextActions: [
      "Use this package as the first reviewer entry point in the README.",
      "Show the architecture diagram after the reviewer package.",
      "Keep the public demo positioned as production-aware but not production-ready.",
      "Use client-safe sample data before building real adapters.",
      "Convert the strongest package outputs into a lightweight UI later."
    ]
  };
}

export function validateClientReviewerDashboardPackage(
  packageResult: ClientReviewerDashboardPackage
): { valid: boolean; status: "pass" | "fail"; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (packageResult.packageVersion !== "client-reviewer-dashboard-package-v1") {
    errors.push("Unexpected reviewer dashboard package version.");
  }

  if (!packageResult.reviewerDecision.demoReady) {
    errors.push("Reviewer package should mark the demo as ready for review.");
  }

  if (packageResult.reviewerDecision.productionReady) {
    errors.push("Reviewer package must not claim production readiness.");
  }

  if (packageResult.strongestProofPoints.length < 5) {
    warnings.push("Reviewer package should include at least five proof points.");
  }

  if (packageResult.productionBoundaries.length < 5) {
    warnings.push("Reviewer package should include explicit production boundaries.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "fail",
    errors,
    warnings
  };
}
