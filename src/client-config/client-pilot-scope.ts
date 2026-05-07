export type PilotScopeStatus = "ready" | "limited" | "blocked";

export interface ClientPilotScopeItem {
  id: string;
  workflow: string;
  status: PilotScopeStatus;
  includedInPilot: boolean;
  reason: string;
  requiredBeforeProduction: string[];
}

export interface ClientPilotScope {
  title: string;
  clientName: string;
  status: PilotScopeStatus;
  summary: string;
  scopeItems: ClientPilotScopeItem[];
  includedWorkflows: string[];
  excludedWorkflows: string[];
}

export function buildClientPilotScope(): ClientPilotScope {
  const scopeItems: ClientPilotScopeItem[] = [
    {
      id: "pilot-overdue-invoices",
      workflow: "Overdue invoice detection",
      status: "ready",
      includedInPilot: true,
      reason: "Required invoice fields are available in the mock client fixture.",
      requiredBeforeProduction: [
        "Client must provide representative invoice export samples.",
        "Client must confirm invoice aging rules."
      ]
    },
    {
      id: "pilot-margin-risk",
      workflow: "Project margin risk review",
      status: "ready",
      includedInPilot: true,
      reason: "Project code exists and margin-risk logic can be demonstrated safely.",
      requiredBeforeProduction: [
        "Client must confirm project revenue and cost source of truth.",
        "Client must confirm margin threshold policy."
      ]
    },
    {
      id: "pilot-bank-reconciliation",
      workflow: "Bank reconciliation exception detection",
      status: "limited",
      includedInPilot: true,
      reason: "Workflow can be piloted with mock data, but bank transaction ID mapping still requires client confirmation.",
      requiredBeforeProduction: [
        "Client must confirm stable bank transaction identifier.",
        "Client must confirm matching reference strategy."
      ]
    },
    {
      id: "pilot-payment-approval",
      workflow: "Payment approval recommendation",
      status: "blocked",
      includedInPilot: false,
      reason: "Vendor payment method is missing and money movement must remain approval-gated.",
      requiredBeforeProduction: [
        "Client must provide vendor payment method data.",
        "Client must confirm authorized approvers.",
        "Client must confirm idempotency and execution policy."
      ]
    }
  ];

  const blockedItems = scopeItems.filter((item) => item.status === "blocked");
  const limitedItems = scopeItems.filter((item) => item.status === "limited");

  const status: PilotScopeStatus =
    blockedItems.length > 0 ? "limited" : limitedItems.length > 0 ? "limited" : "ready";

  return {
    title: "Client Pilot Scope",
    clientName: "Mock Game Studio Finance Team",
    status,
    summary:
      "Defines which client workflows are safe to include in a limited pilot before production credentials, mappings, and payment data are finalized.",
    scopeItems,
    includedWorkflows: scopeItems
      .filter((item) => item.includedInPilot)
      .map((item) => item.workflow),
    excludedWorkflows: scopeItems
      .filter((item) => !item.includedInPilot)
      .map((item) => item.workflow)
  };
}
