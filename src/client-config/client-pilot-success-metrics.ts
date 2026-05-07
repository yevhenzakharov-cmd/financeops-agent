export interface ClientPilotSuccessMetric {
  id: string;
  metric: string;
  target: string;
  measurementMethod: string;
  owner: "client" | "builder" | "shared";
}

export interface ClientPilotSuccessMetrics {
  title: string;
  summary: string;
  metrics: ClientPilotSuccessMetric[];
}

export function buildClientPilotSuccessMetrics(): ClientPilotSuccessMetrics {
  return {
    title: "Client Pilot Success Metrics",
    summary:
      "Defines how the client and builder judge whether the pilot is successful enough to continue into production planning.",
    metrics: [
      {
        id: "metric-exception-detection",
        metric: "Exception detection coverage",
        target: "Agent identifies overdue invoices, orphan transactions, and margin-risk cases present in sample data.",
        measurementMethod:
          "Compare deterministic output against expected scenario results and client-reviewed examples.",
        owner: "shared"
      },
      {
        id: "metric-output-clarity",
        metric: "CFO output clarity",
        target: "Client reviewer can understand what happened, why it matters, and what action is recommended.",
        measurementMethod:
          "Client reviews CFO briefing and marks it accepted, needs edits, or rejected.",
        owner: "client"
      },
      {
        id: "metric-approval-safety",
        metric: "Approval safety",
        target: "No payment or accounting posting can execute without explicit human approval.",
        measurementMethod:
          "Run approval-gate test scenarios and verify blocked/simulated execution decisions.",
        owner: "builder"
      },
      {
        id: "metric-audit-traceability",
        metric: "Audit traceability",
        target: "Every recommendation can be traced to source data, deterministic calculation, and audit artifact.",
        measurementMethod:
          "Review output artifact, execution ledger, approval queue, and audit log samples.",
        owner: "builder"
      }
    ]
  };
}
