export type ClientValidationMatrixStatus = "pass" | "warning" | "blocked";
export type ClientValidationMatrixCategory = "data" | "mapping" | "governance" | "payments" | "security" | "audit" | "outputs";

export interface ClientValidationMatrixCase {
  id: string;
  title: string;
  category: ClientValidationMatrixCategory;
  status: ClientValidationMatrixStatus;
  owner: "client" | "builder" | "shared";
  validationGoal: string;
  evidence: string[];
  expectedResult: string;
  failureMeaning: string;
  endpointEvidence: string[];
}

export interface ClientValidationMatrixPackage {
  title: string;
  generatedAt: string;
  clientName: string;
  status: "demo_validated" | "blocked_for_production";
  summary: string;
  cases: ClientValidationMatrixCase[];
  passCount: number;
  warningCount: number;
  blockedCount: number;
  productionDecision: string;
  nextValidationSteps: string[];
}

export function buildClientValidationMatrix(): ClientValidationMatrixPackage {
  const cases: ClientValidationMatrixCase[] = [
    {
      id: "validation-invoice-data",
      title: "Invoice data supports overdue receivables detection",
      category: "data",
      status: "pass",
      owner: "builder",
      validationGoal: "Confirm the demo has enough invoice fields to detect overdue invoices and create finance exceptions.",
      evidence: [
        "Invoice ID is provided.",
        "Invoice due date is provided.",
        "Customer name is provided.",
        "Invoice amount and status exist in sample fixtures."
      ],
      expectedResult: "Overdue invoice examples can be processed in demo scope.",
      failureMeaning: "The agent cannot create a reliable AR exception queue without invoice identifiers, due dates, and amounts.",
      endpointEvidence: [
        "/client/sample-input-fixtures",
        "/client/implementation-readiness",
        "/client/test-scenarios"
      ]
    },
    {
      id: "validation-bank-mapping",
      title: "Bank transaction mapping requires client confirmation",
      category: "mapping",
      status: "warning",
      owner: "shared",
      validationGoal: "Confirm bank reconciliation remains limited until stable transaction IDs and matching references are accepted.",
      evidence: [
        "Bank transaction ID is marked needs_mapping.",
        "Bank reference matching strategy requires confirmation.",
        "Bank reconciliation is allowed only as a limited pilot example."
      ],
      expectedResult: "Demo can show mapping questions, but production reconciliation remains gated.",
      failureMeaning: "Bank reconciliation may produce unreliable matches if transaction identifiers are unstable.",
      endpointEvidence: [
        "/client/sample-input-fixtures",
        "/client/field-coverage",
        "/client/pilot-plan"
      ]
    },
    {
      id: "validation-payment-block",
      title: "Payment workflow remains blocked without vendor payment data",
      category: "payments",
      status: "blocked",
      owner: "client",
      validationGoal: "Confirm payment preparation cannot move forward until vendor payment method and authorized approver data exist.",
      evidence: [
        "Vendor payment method is missing.",
        "Authorized approver policy is missing.",
        "Money movement requires human approval."
      ],
      expectedResult: "Payment workflow stays excluded from production and go-live scope.",
      failureMeaning: "Allowing payment preparation without payment profile data would create unsafe money movement risk.",
      endpointEvidence: [
        "/client/security-boundary",
        "/client/implementation-readiness",
        "/client/go-live-decision"
      ]
    },
    {
      id: "validation-ai-boundary",
      title: "AI is limited to explaining verified finance outputs",
      category: "governance",
      status: "pass",
      owner: "builder",
      validationGoal: "Confirm finance calculations and approval rules remain deterministic while AI-style output is explanatory.",
      evidence: [
        "Security boundary states AI explanation must not override deterministic calculations.",
        "Governance brief blocks tax and legal advice.",
        "Approval gates remain explicit."
      ],
      expectedResult: "Reviewer can trust that AI is not inventing financial calculations.",
      failureMeaning: "If AI overrides calculations, the system becomes unsafe for finance operations.",
      endpointEvidence: [
        "/client/security-boundary",
        "/client/governance-brief",
        "/client/reviewer-dashboard"
      ]
    },
    {
      id: "validation-credential-boundary",
      title: "Production credentials remain client-owned",
      category: "security",
      status: "warning",
      owner: "client",
      validationGoal: "Confirm no production credential handling is required by the public demo and client-owned deployment is required later.",
      evidence: [
        "Public demo uses mock data only.",
        "Security boundary requires client-owned credentials.",
        "Production handoff remains blocked without client-owned environment."
      ],
      expectedResult: "Demo is safe to review publicly, while production setup remains gated.",
      failureMeaning: "Sharing production credentials with the builder or public repo would create unacceptable security risk.",
      endpointEvidence: [
        "/client/security-boundary",
        "/client/production-handoff-package",
        "/client/go-live-decision"
      ]
    },
    {
      id: "validation-audit-traceability",
      title: "Recommendations are traceable to persisted artifacts",
      category: "audit",
      status: "pass",
      owner: "builder",
      validationGoal: "Confirm generated recommendations have supporting artifact and ledger evidence.",
      evidence: [
        "Artifact manifest is available.",
        "Execution ledger exists.",
        "Approval queue exists.",
        "Client output artifact exists."
      ],
      expectedResult: "Reviewer can inspect traceable outputs instead of trusting a black-box AI answer.",
      failureMeaning: "Without persisted artifacts, finance recommendations are difficult to review or audit.",
      endpointEvidence: [
        "/artifacts/manifest",
        "/artifacts/status",
        "/artifacts/route-catalog"
      ]
    },
    {
      id: "validation-output-acceptance",
      title: "Final output format still requires client acceptance",
      category: "outputs",
      status: "warning",
      owner: "client",
      validationGoal: "Confirm client must accept CFO briefing, exception queue, dashboard payload, or export format before production.",
      evidence: [
        "Output delivery plan is available.",
        "Go-live decision requires accepted output format.",
        "Production handoff states output acceptance is required."
      ],
      expectedResult: "Output shape is clear enough for demo, but final format remains client-approved.",
      failureMeaning: "Building adapters before output acceptance risks building the wrong production workflow.",
      endpointEvidence: [
        "/client/output-delivery-plan",
        "/client/production-handoff-package",
        "/client/go-live-decision"
      ]
    }
  ];

  const passCount = cases.filter((item) => item.status === "pass").length;
  const warningCount = cases.filter((item) => item.status === "warning").length;
  const blockedCount = cases.filter((item) => item.status === "blocked").length;

  return {
    title: "Client Validation Matrix",
    generatedAt: new Date().toISOString(),
    clientName: "Mock Client Finance Team",
    status: blockedCount > 0 ? "blocked_for_production" : "demo_validated",
    summary: "Reviewer-facing validation matrix that converts sample inputs, security boundaries, governance rules, and artifact traceability into explicit acceptance checks.",
    cases,
    passCount,
    warningCount,
    blockedCount,
    productionDecision: blockedCount > 0
      ? "Do not move to production. Demo and limited pilot remain valid, but payment workflow and production rollout are blocked."
      : "Demo evidence is validated. Continue with client-owned production planning.",
    nextValidationSteps: [
      "Ask client to confirm bank transaction mapping.",
      "Ask client to provide vendor payment method and authorized approver policy if payment workflow is in scope.",
      "Ask client to accept final output format.",
      "Keep production credentials inside client-owned infrastructure.",
      "Use artifact manifest and ledger records as reviewer proof."
    ]
  };
}
