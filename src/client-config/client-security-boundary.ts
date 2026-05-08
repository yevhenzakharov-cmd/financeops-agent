export type ClientSecurityBoundaryStatus = "ready" | "client_action_required" | "blocked" | "not_applicable";

export interface ClientSecurityBoundaryItem {
  id: string;
  title: string;
  category: "data" | "credentials" | "payments" | "ai" | "audit" | "deployment";
  status: ClientSecurityBoundaryStatus;
  owner: "client" | "builder" | "shared";
  rule: string;
  evidence: string[];
  implementationNote: string;
}

export interface ClientSecurityBoundaryPackage {
  title: string;
  generatedAt: string;
  clientName: string;
  status: "safe_for_demo" | "blocked_for_production";
  summary: string;
  boundaries: ClientSecurityBoundaryItem[];
  readyCount: number;
  blockedCount: number;
  clientActionRequiredCount: number;
  productionRules: string[];
  reviewerTalkTrack: string[];
}

export function buildClientSecurityBoundary(): ClientSecurityBoundaryPackage {
  const boundaries: ClientSecurityBoundaryItem[] = [
    {
      id: "boundary-mock-data-only",
      title: "Public demo uses mock data only",
      category: "data",
      status: "ready",
      owner: "builder",
      rule: "The public repository and demo must not contain real client financial records.",
      evidence: [
        "Sample input fixtures are mock-shaped examples.",
        "Current pipeline uses deterministic mock data.",
        "No production bank, ERP, payroll, or payment credentials are required for demo."
      ],
      implementationNote: "Keep public examples synthetic and require client-approved samples only inside client-owned environments."
    },
    {
      id: "boundary-client-owned-credentials",
      title: "Production credentials stay client-owned",
      category: "credentials",
      status: "client_action_required",
      owner: "client",
      rule: "Builder should not receive production credentials for banks, ERP, payroll, payment processors, or accounting systems.",
      evidence: [
        "Production handoff docs already state client-owned deployment boundary.",
        "Credential handling is not configured in the public demo."
      ],
      implementationNote: "Use client-owned secret storage and environment variables during production implementation."
    },
    {
      id: "boundary-payment-approval",
      title: "Money movement requires human approval",
      category: "payments",
      status: "blocked",
      owner: "shared",
      rule: "The agent may prepare payment recommendations, but payment execution remains blocked until vendor payment data and authorized approver policy exist.",
      evidence: [
        "Vendor payment method is missing in readiness reports.",
        "Payment workflow is marked blocked in sample input fixtures.",
        "Approval rules require human approval for money movement."
      ],
      implementationNote: "Do not enable payment execution without approver identity, idempotency strategy, and client-owned payment rails."
    },
    {
      id: "boundary-ai-explanation-only",
      title: "AI explains verified finance outputs only",
      category: "ai",
      status: "ready",
      owner: "builder",
      rule: "AI-style explanations must not override deterministic finance calculations.",
      evidence: [
        "Finance calculations are generated through deterministic workflow outputs.",
        "CFO briefing is framed as explanation of already-verified data."
      ],
      implementationNote: "Keep calculations, classifications, and approval gates typed and deterministic."
    },
    {
      id: "boundary-audit-traceability",
      title: "Recommendations must be auditable",
      category: "audit",
      status: "ready",
      owner: "builder",
      rule: "Every recommendation should be traceable to source data, deterministic calculation, approval state, and persisted artifact.",
      evidence: [
        "Artifact manifest is available.",
        "Execution ledger is persisted.",
        "Approval queue is persisted."
      ],
      implementationNote: "Treat artifact generation and ledger persistence as mandatory acceptance criteria."
    },
    {
      id: "boundary-client-deployment",
      title: "Production deployment must be client owned",
      category: "deployment",
      status: "client_action_required",
      owner: "client",
      rule: "Production integrations should run inside the client environment or infrastructure approved by the client.",
      evidence: [
        "Public repo is a portfolio and demo implementation.",
        "Production handoff remains blocked until client data, mappings, credentials, and output acceptance are confirmed."
      ],
      implementationNote: "Use the public repo as implementation proof, then deploy client-specific adapters separately."
    }
  ];

  return {
    title: "Client Security Boundary Package",
    generatedAt: new Date().toISOString(),
    clientName: "Mock Game Studio Finance Team",
    status: "blocked_for_production",
    summary: "Security and trust boundary package for explaining what is safe in the public demo, what must remain client-owned, and what blocks production execution.",
    boundaries,
    readyCount: boundaries.filter((boundary) => boundary.status === "ready").length,
    blockedCount: boundaries.filter((boundary) => boundary.status === "blocked").length,
    clientActionRequiredCount: boundaries.filter((boundary) => boundary.status === "client_action_required").length,
    productionRules: [
      "Use mock data in public demo.",
      "Keep production credentials in client-owned infrastructure.",
      "Block money movement until payment data and human approval policy exist.",
      "Use deterministic calculations for finance logic.",
      "Use AI only to explain verified outputs.",
      "Persist artifacts and audit records for traceability."
    ],
    reviewerTalkTrack: [
      "This repo demonstrates the FinanceOps workflow without exposing real client data.",
      "The production boundary is intentionally strict: credentials, payment rails, and production data remain client-owned.",
      "The agent can prepare recommendations, but money movement and accounting postings remain approval-gated.",
      "This makes the project safer to show to technical reviewers and more credible to buyers."
    ]
  };
}
