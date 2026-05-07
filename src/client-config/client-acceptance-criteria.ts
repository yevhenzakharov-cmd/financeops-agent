export type AcceptanceCriterionStatus = "pass" | "warning" | "blocked";

export interface ClientAcceptanceCriterion {
  id: string;
  title: string;
  category:
    | "data"
    | "governance"
    | "outputs"
    | "audit"
    | "security"
    | "deployment";
  status: AcceptanceCriterionStatus;
  evidence: string[];
  owner: "client" | "builder" | "shared";
}

export interface ClientAcceptanceCriteriaReport {
  title: string;
  summary: string;
  criteria: ClientAcceptanceCriterion[];
  passCount: number;
  warningCount: number;
  blockedCount: number;
  overallStatus: AcceptanceCriterionStatus;
}

export function buildClientAcceptanceCriteriaReport(): ClientAcceptanceCriteriaReport {
  const criteria: ClientAcceptanceCriterion[] = [
    {
      id: "criteria-data-samples",
      title: "Representative client data samples are provided",
      category: "data",
      status: "blocked",
      evidence: [
        "Vendor payment method is still missing.",
        "Bank transaction ID still requires mapping confirmation."
      ],
      owner: "client"
    },
    {
      id: "criteria-governance",
      title: "Governance and approval policy is defined",
      category: "governance",
      status: "pass",
      evidence: [
        "Payments require human approval.",
        "Accounting postings require human approval.",
        "Tax/legal advice is blocked."
      ],
      owner: "shared"
    },
    {
      id: "criteria-output-traceability",
      title: "Outputs are traceable to deterministic pipeline data",
      category: "outputs",
      status: "pass",
      evidence: [
        "CFO briefing is generated from deterministic pipeline output.",
        "Approval queue and execution ledger are persisted as artifacts."
      ],
      owner: "builder"
    },
    {
      id: "criteria-auditability",
      title: "Audit trail is available for generated decisions",
      category: "audit",
      status: "pass",
      evidence: [
        "Audit log is persisted.",
        "Execution ledger stores decision reason and projected impact."
      ],
      owner: "builder"
    },
    {
      id: "criteria-production-credentials",
      title: "Production credentials stay in client-owned environment",
      category: "security",
      status: "warning",
      evidence: [
        "Deployment checklist states builder should not receive production credentials.",
        "Client deployment environment is not configured in the public demo."
      ],
      owner: "client"
    }
  ];

  const passCount = criteria.filter((item) => item.status === "pass").length;
  const warningCount = criteria.filter((item) => item.status === "warning").length;
  const blockedCount = criteria.filter((item) => item.status === "blocked").length;

  const overallStatus =
    blockedCount > 0 ? "blocked" : warningCount > 0 ? "warning" : "pass";

  return {
    title: "Client Acceptance Criteria Report",
    summary:
      "Acceptance criteria for deciding whether a client-specific FinanceOps implementation is ready to move from demo scope into production planning.",
    criteria,
    passCount,
    warningCount,
    blockedCount,
    overallStatus
  };
}
