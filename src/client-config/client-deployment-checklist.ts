export type DeploymentChecklistStatus = "not_started" | "client_action_required" | "ready";

export interface ClientDeploymentChecklistItem {
  id: string;
  title: string;
  owner: "client" | "builder" | "shared";
  status: DeploymentChecklistStatus;
  notes: string;
}

export interface ClientDeploymentChecklist {
  title: string;
  summary: string;
  items: ClientDeploymentChecklistItem[];
  blockedItems: string[];
  readyItems: string[];
}

export function buildClientDeploymentChecklist(): ClientDeploymentChecklist {
  const items: ClientDeploymentChecklistItem[] = [
    {
      id: "client-data-samples",
      title: "Provide representative client data samples",
      owner: "client",
      status: "client_action_required",
      notes: "Client must provide safe sample exports or mock-shaped production schemas."
    },
    {
      id: "field-mapping",
      title: "Confirm field mapping",
      owner: "shared",
      status: "client_action_required",
      notes: "Client and builder must confirm how source fields map into the FinanceOps core schema."
    },
    {
      id: "governance-rules",
      title: "Confirm governance and approval rules",
      owner: "client",
      status: "ready",
      notes: "Base demo rules already require human approval for payments and accounting postings."
    },
    {
      id: "output-format",
      title: "Confirm output delivery format",
      owner: "client",
      status: "client_action_required",
      notes: "Client must confirm whether outputs go to API, dashboard, CSV, briefing, or approval queue."
    },
    {
      id: "production-credentials",
      title: "Keep credentials inside client-owned environment",
      owner: "client",
      status: "not_started",
      notes: "Builder should not receive production bank, ERP, payroll, or payment credentials."
    }
  ];

  return {
    title: "Client Deployment Checklist",
    summary:
      "Pre-production checklist for adapting the reusable FinanceOps core to a client-owned environment.",
    items,
    blockedItems: items
      .filter((item) => item.status !== "ready")
      .map((item) => item.title),
    readyItems: items
      .filter((item) => item.status === "ready")
      .map((item) => item.title)
  };
}
