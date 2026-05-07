export type ClientTestScenarioStatus = "ready" | "blocked" | "needs_client_data";

export interface ClientTestScenario {
  id: string;
  name: string;
  purpose: string;
  status: ClientTestScenarioStatus;
  inputRequirements: string[];
  expectedOutcome: string;
  failureCondition: string;
}

export interface ClientTestScenarioPack {
  title: string;
  summary: string;
  scenarios: ClientTestScenario[];
  blockedScenarios: string[];
  readyScenarios: string[];
}

export function buildClientTestScenarioPack(): ClientTestScenarioPack {
  const scenarios: ClientTestScenario[] = [
    {
      id: "scenario-overdue-invoice",
      name: "Overdue invoice detection",
      purpose: "Confirm that the agent detects overdue receivables from client invoice exports.",
      status: "ready",
      inputRequirements: ["Invoice ID", "Invoice due date", "Customer name", "Amount"],
      expectedOutcome:
        "Agent flags overdue invoice, assigns severity, and includes it in CFO briefing and exception queue.",
      failureCondition:
        "Invoice is overdue but does not appear in exception queue or CFO briefing."
    },
    {
      id: "scenario-bank-reconciliation",
      name: "Bank reconciliation exception detection",
      purpose: "Confirm that missing payments and orphan bank transactions are detected.",
      status: "needs_client_data",
      inputRequirements: ["Bank transaction ID", "Invoice ID or matching reference"],
      expectedOutcome:
        "Agent identifies missing payment and orphan bank transaction with traceable source references.",
      failureCondition:
        "Bank export cannot be mapped to invoices or transaction identifiers are unstable."
    },
    {
      id: "scenario-margin-risk",
      name: "Project margin risk detection",
      purpose: "Confirm that project profitability and burn risk are calculated correctly.",
      status: "ready",
      inputRequirements: ["Project code", "Revenue", "Costs", "Budget"],
      expectedOutcome:
        "Agent calculates gross margin, budget utilization, and burn variance.",
      failureCondition:
        "Margin or burn output cannot be reconciled back to deterministic project data."
    },
    {
      id: "scenario-payment-approval",
      name: "Payment approval recommendation",
      purpose: "Confirm that payment actions remain approval-gated before execution.",
      status: "blocked",
      inputRequirements: ["Vendor payment method", "Authorized approver", "Idempotency key"],
      expectedOutcome:
        "Agent prepares a payment approval request but does not execute without human approval.",
      failureCondition:
        "Payment recommendation is created without required vendor payment data or approval gate."
    }
  ];

  return {
    title: "Client Test Scenario Pack",
    summary:
      "Scenario-based acceptance tests for validating a client-shaped FinanceOps implementation.",
    scenarios,
    blockedScenarios: scenarios
      .filter((scenario) => scenario.status === "blocked")
      .map((scenario) => scenario.name),
    readyScenarios: scenarios
      .filter((scenario) => scenario.status === "ready")
      .map((scenario) => scenario.name)
  };
}
