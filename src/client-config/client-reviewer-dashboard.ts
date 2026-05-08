export interface ClientReviewerDashboardCard {
  id: string;
  label: string;
  value: string | number;
  status: "pass" | "warning" | "blocked" | "info";
  explanation: string;
}

export interface ClientReviewerDashboardSection {
  id: string;
  title: string;
  status: "pass" | "warning" | "blocked" | "info";
  bullets: string[];
}

export interface ClientReviewerDashboard {
  title: string;
  generatedAt: string;
  projectName: string;
  status: "demo_ready" | "blocked_for_production";
  audience: string[];
  executiveSummary: string;
  cards: ClientReviewerDashboardCard[];
  sections: ClientReviewerDashboardSection[];
  proofEndpoints: string[];
  suggestedDemoOrder: string[];
  nextBestActions: string[];
}

export function buildClientReviewerDashboard(): ClientReviewerDashboard {
  return {
    title: "Client Reviewer Dashboard",
    generatedAt: new Date().toISOString(),
    projectName: "FinanceOps Agent",
    status: "blocked_for_production",
    audience: [
      "technical reviewer",
      "CFO",
      "founder",
      "operator",
      "potential client",
      "hiring manager"
    ],
    executiveSummary:
      "Reviewer-facing dashboard summary for quickly explaining what the FinanceOps Agent proves, what is demo-ready, what remains blocked, and which endpoints demonstrate the strongest parts of the system.",
    cards: [
      {
        id: "deterministic-core",
        label: "Deterministic finance core",
        value: "ready",
        status: "pass",
        explanation:
          "Margin, burn, overdue receivables, reconciliation, simulation, approval routing, and artifact persistence are handled as structured workflow outputs."
      },
      {
        id: "artifact-proof",
        label: "Artifact proof",
        value: "4 expected artifacts",
        status: "pass",
        explanation:
          "Execution ledger, approval queue, payment execution, and client output artifact are exposed through artifact endpoints."
      },
      {
        id: "approval-safety",
        label: "Sensitive action safety",
        value: "approval-gated",
        status: "pass",
        explanation:
          "Payment and accounting-style actions are framed as recommendations or approval-gated actions rather than blind AI execution."
      },
      {
        id: "commercial-readiness",
        label: "Commercial readiness",
        value: "discovery/pilot ready",
        status: "warning",
        explanation:
          "The demo is strong for discovery and pilot conversations, but real client data, mapping, output acceptance, and approval policies are still required."
      },
      {
        id: "payment-scope",
        label: "Payment workflow",
        value: "blocked without client data",
        status: "blocked",
        explanation:
          "Vendor payment method data, approver policy, and client-owned payment rails are required before production payment execution can be included."
      }
    ],
    sections: [
      {
        id: "demo-order",
        title: "What to show first",
        status: "pass",
        bullets: [
          "Start with /client/reviewer-dashboard for the high-level proof view.",
          "Then show /client/reviewer-audit for skills and architecture evidence.",
          "Then show /client/commercial-package for buyer-facing positioning.",
          "Then show /artifacts/manifest for traceability proof."
        ]
      },
      {
        id: "trust-signals",
        title: "Buyer trust signals",
        status: "pass",
        bullets: [
          "Production limitations are stated clearly instead of hidden.",
          "The system separates deterministic finance calculations from AI-style explanation.",
          "Sensitive actions are blocked or approval-gated.",
          "Client-owned credentials and client-provided data are treated as production prerequisites."
        ]
      },
      {
        id: "production-blockers",
        title: "Current production blockers",
        status: "blocked",
        bullets: [
          "No real client data adapter is connected yet.",
          "Bank transaction mapping still requires client confirmation.",
          "Vendor payment method data is missing in the demo fixture.",
          "Final output format and acceptance criteria must be confirmed by each client."
        ]
      },
      {
        id: "sellable-angle",
        title: "Sellable custom-build angle",
        status: "info",
        bullets: [
          "Position this as a reusable FinanceOps implementation core, not a generic SaaS.",
          "Use discovery to define client inputs, output format, approval policy, and deployment boundary.",
          "Charge for client-specific adapters, mappings, workflows, dashboards, and payment rails only after scope is known."
        ]
      }
    ],
    proofEndpoints: [
      "/client/reviewer-dashboard",
      "/client/reviewer-audit",
      "/client/commercial-package",
      "/client/sales-handoff-package",
      "/client/go-live-package",
      "/client/production-handoff-package",
      "/artifacts/manifest",
      "/artifacts/route-catalog"
    ],
    suggestedDemoOrder: [
      "Open reviewer dashboard",
      "Show reviewer audit",
      "Show artifact manifest",
      "Show commercial package",
      "Show go-live package",
      "Explain blocked production items honestly"
    ],
    nextBestActions: [
      "Add a lightweight architecture diagram to docs.",
      "Add typed sample input fixtures for invoice, bank, margin, and vendor payment profile examples.",
      "Readiness scoring and blocked payment behavior are covered by deterministic regression tests."
    ]
  };
}
