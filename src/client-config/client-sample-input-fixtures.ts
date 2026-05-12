export type ClientSampleFixtureStatus = "ready" | "needs_mapping" | "missing" | "blocked";

export interface ClientSampleInputField {
  name: string;
  type: "string" | "number" | "date" | "boolean" | "enum";
  required: boolean;
  status: ClientSampleFixtureStatus;
  notes: string;
}

export interface ClientSampleInputFixture {
  id: string;
  name: string;
  sourceType: "csv" | "json" | "manual_export" | "api";
  owner: "client" | "shared" | "builder";
  status: ClientSampleFixtureStatus;
  purpose: string;
  fields: ClientSampleInputField[];
  sampleRows: Record<string, string | number | boolean | null>[];
  mappingQuestions: string[];
  blockedUntil: string[];
}

export interface ClientSampleInputFixturesPackage {
  title: string;
  generatedAt: string;
  clientName: string;
  status: "ready_for_demo" | "requires_mapping" | "blocked";
  summary: string;
  fixtures: ClientSampleInputFixture[];
  readyFixtureCount: number;
  blockedFixtureCount: number;
  mappingRequiredCount: number;
  nextSteps: string[];
}

export function buildClientSampleInputFixtures(): ClientSampleInputFixturesPackage {
  const fixtures: ClientSampleInputFixture[] = [
    {
      id: "fixture-invoice-export",
      name: "Invoice Export Sample",
      sourceType: "csv",
      owner: "client",
      status: "ready",
      purpose: "Demonstrate overdue invoice detection and accounts receivable exception queue creation.",
      fields: [
        { name: "invoiceId", type: "string", required: true, status: "ready", notes: "Stable invoice identifier." },
        { name: "customerName", type: "string", required: true, status: "ready", notes: "Used in CFO briefing and collection context." },
        { name: "amount", type: "number", required: true, status: "ready", notes: "Invoice amount in base currency." },
        { name: "currency", type: "string", required: true, status: "ready", notes: "Demo assumes USD." },
        { name: "status", type: "enum", required: true, status: "ready", notes: "Expected values include open, paid, overdue, disputed." },
        { name: "dueDate", type: "date", required: true, status: "ready", notes: "Used for aging and overdue classification." }
      ],
      sampleRows: [
        { invoiceId: "INV-1001", customerName: "Northstar Services", amount: 42000, currency: "USD", status: "overdue", dueDate: "2026-04-12" },
        { invoiceId: "INV-1002", customerName: "Pixel Forge", amount: 18500, currency: "USD", status: "open", dueDate: "2026-05-20" }
      ],
      mappingQuestions: [],
      blockedUntil: []
    },
    {
      id: "fixture-bank-export",
      name: "Bank Transaction Export Sample",
      sourceType: "csv",
      owner: "client",
      status: "needs_mapping",
      purpose: "Demonstrate reconciliation exception detection and orphan transaction review.",
      fields: [
        { name: "bankTransactionId", type: "string", required: true, status: "needs_mapping", notes: "Client must confirm this identifier remains stable across exports." },
        { name: "postedAt", type: "date", required: true, status: "ready", notes: "Used for matching and timeline context." },
        { name: "counterparty", type: "string", required: true, status: "ready", notes: "Used for invoice matching hints." },
        { name: "amount", type: "number", required: true, status: "ready", notes: "Transaction amount." },
        { name: "reference", type: "string", required: false, status: "needs_mapping", notes: "Client must confirm whether references contain invoice IDs." }
      ],
      sampleRows: [
        { bankTransactionId: "BANK-9001", postedAt: "2026-04-18", counterparty: "Northstar Services", amount: 42000, reference: "INV-1001" },
        { bankTransactionId: "BANK-9002", postedAt: "2026-04-19", counterparty: "Unknown Vendor", amount: -3100, reference: null }
      ],
      mappingQuestions: [
        "Confirm whether bankTransactionId remains stable across exports.",
        "Confirm whether reference can be used for invoice matching."
      ],
      blockedUntil: []
    },
    {
      id: "fixture-project-margin",
      name: "Project Margin Sample",
      sourceType: "json",
      owner: "shared",
      status: "ready",
      purpose: "Demonstrate project profitability, budget burn, and margin risk classification.",
      fields: [
        { name: "projectCode", type: "string", required: true, status: "ready", notes: "Connects spend and revenue to a project." },
        { name: "projectName", type: "string", required: true, status: "ready", notes: "Human readable project label." },
        { name: "recognizedRevenue", type: "number", required: true, status: "ready", notes: "Revenue used for margin calculation." },
        { name: "recognizedCost", type: "number", required: true, status: "ready", notes: "Cost used for margin calculation." },
        { name: "budget", type: "number", required: true, status: "ready", notes: "Budget baseline for burn review." }
      ],
      sampleRows: [
        { projectCode: "GAME-A", projectName: "Arena Forge", recognizedRevenue: 180000, recognizedCost: 142000, budget: 150000 },
        { projectCode: "GAME-B", projectName: "Skyline Quest", recognizedRevenue: 95000, recognizedCost: 104000, budget: 98000 }
      ],
      mappingQuestions: [],
      blockedUntil: []
    },
    {
      id: "fixture-vendor-payment-profile",
      name: "Vendor Payment Profile Sample",
      sourceType: "manual_export",
      owner: "client",
      status: "blocked",
      purpose: "Demonstrate why payment approval preparation remains blocked until vendor payment data exists.",
      fields: [
        { name: "vendorId", type: "string", required: true, status: "ready", notes: "Vendor identifier." },
        { name: "vendorName", type: "string", required: true, status: "ready", notes: "Vendor display name." },
        { name: "paymentMethod", type: "string", required: true, status: "missing", notes: "Required before payment approval preparation." },
        { name: "authorizedApprover", type: "string", required: true, status: "missing", notes: "Required for approval routing." },
        { name: "paymentLimit", type: "number", required: false, status: "missing", notes: "Optional policy limit." }
      ],
      sampleRows: [
        { vendorId: "VEN-301", vendorName: "Vendor Services Provider", paymentMethod: null, authorizedApprover: null, paymentLimit: null }
      ],
      mappingQuestions: [
        "Confirm payment profile source format.",
        "Confirm authorized approver policy."
      ],
      blockedUntil: [
        "Vendor payment method is provided.",
        "Authorized approver policy is confirmed."
      ]
    }
  ];

  return {
    title: "Client Sample Input Fixtures",
    generatedAt: new Date().toISOString(),
    clientName: "Mock Client Finance Team",
    status: "blocked",
    summary: "Typed sample input fixtures for explaining which client data is ready, which fields need mapping, and which payment fields block production scope.",
    fixtures,
    readyFixtureCount: fixtures.filter((fixture) => fixture.status === "ready").length,
    blockedFixtureCount: fixtures.filter((fixture) => fixture.status === "blocked").length,
    mappingRequiredCount: fixtures.filter((fixture) => fixture.status === "needs_mapping").length,
    nextSteps: [
      "Use invoice and project margin fixtures for safe demo flows.",
      "Confirm bank transaction identifier mapping before production reconciliation.",
      "Keep vendor payment profile blocked until payment method and approver data exist.",
      "Use these fixtures as the starter contract for client data requests."
    ]
  };
}
