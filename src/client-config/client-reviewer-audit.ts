import { getClientSalesHandoffPackage } from "./client-sales-handoff-package.js";
import { buildClientCommercialPackage } from "./client-commercial-package.js";
import { buildClientGoLivePackage } from "./client-go-live-package.js";
import { buildClientProductionHandoffPackage } from "./client-production-handoff-package.js";

export type ClientReviewerAudit = {
  title: string;
  generatedAt: string;
  projectName: string;
  reviewerAudience: string[];
  summary: string;
  demonstratedSkills: string[];
  strongestEngineeringSignals: string[];
  strongestProductSignals: string[];
  productionHonesty: string[];
  demoOnlyBoundaries: string[];
  risksOrGaps: string[];
  recommendedNextImprovements: string[];
  proofEndpoints: string[];
};

export function buildClientReviewerAudit(): ClientReviewerAudit {
  const salesHandoff = getClientSalesHandoffPackage();
  const commercialPackage = buildClientCommercialPackage();
  const goLivePackage = buildClientGoLivePackage();
  const productionHandoff = buildClientProductionHandoffPackage();

  return {
    title: "Client Reviewer Audit",
    generatedAt: new Date().toISOString(),
    projectName: "FinanceOps Agent",
    reviewerAudience: [
      "technical reviewer",
      "CFO",
      "founder",
      "operator",
      "potential client",
      "hiring manager"
    ],
    summary:
      "FinanceOps Agent demonstrates a governed finance automation system that separates deterministic finance logic from AI-style explanation, produces traceable artifacts, and frames production readiness honestly instead of pretending the public demo is fully deployable.",
    demonstratedSkills: [
      "TypeScript-first backend architecture",
      "API design for finance operations workflows",
      "deterministic finance workflow modeling",
      "approval-gated automation design",
      "client onboarding and readiness modeling",
      "production handoff and go-live planning",
      "sales and buyer-facing packaging",
      "audit artifact generation",
      "risk-aware product positioning"
    ],
    strongestEngineeringSignals: [
      "Finance outputs are exposed through structured JSON endpoints instead of unstructured text only.",
      "The system models implementation readiness, acceptance criteria, pilot scope, production handoff, go-live decisioning, commercial readiness, and sales handoff as separate reusable layers.",
      "Sensitive finance actions are explicitly blocked or approval-gated rather than hidden behind vague AI automation claims.",
      "The API includes proof endpoints that let a reviewer inspect outputs, readiness, risks, and sales material directly."
    ],
    strongestProductSignals: [
      salesHandoff.narrative.opening,
      commercialPackage.summary,
      "The project has buyer-facing assets: narrative, demo agenda, FAQ, follow-up email, ROI model, objection handling, and commercial readiness score.",
      "The project is positioned as a controlled discovery or pilot system, which is safer and more credible than claiming instant production readiness."
    ],
    productionHonesty: [
      `Go-live package status: ${goLivePackage.status}.`,
      `Production handoff package status: ${productionHandoff.status}.`,
      "The demo states that client data samples, mapping confirmation, output acceptance, and approval policy are required before production.",
      "The public repo uses mock data and keeps production credentials outside the builder environment."
    ],
    demoOnlyBoundaries: [
      "Mock client data is used.",
      "Payment execution is excluded.",
      "Vendor payment method data is missing in the demo fixture.",
      "Bank transaction mapping still requires client confirmation.",
      "Verified ROI cannot be claimed until real client workflow timing and data are measured."
    ],
    risksOrGaps: [
      "No real client data adapter is connected yet.",
      "No authenticated client dashboard is included yet.",
      "No live approval UI is included yet.",
      "No production secrets manager integration is included yet.",
      "No real ERP, bank, payment processor, payroll, or accounting system integration is active yet."
    ],
    recommendedNextImprovements: [
      "Add a reviewer-facing README section explaining the system architecture in one page.",
      "Add a dashboard route that visualizes readiness, blockers, artifacts, and sales handoff outputs.",
      "Add typed sample input fixtures for invoices, bank transactions, project margin, and vendor payment profiles.",
      "Add automated tests for readiness scoring and blocked payment behavior.",
      "Add a lightweight architecture diagram showing deterministic core, AI explanation layer, approval gate, artifact registry, and client handoff outputs."
    ],
    proofEndpoints: [
      "/client/reviewer-audit",
      "/client/sales-handoff-package",
      "/client/commercial-package",
      "/client/go-live-package",
      "/client/production-handoff-package",
      "/artifacts/manifest"
    ]
  };
}
