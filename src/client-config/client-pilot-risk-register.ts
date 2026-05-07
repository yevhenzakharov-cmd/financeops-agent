export type PilotRiskSeverity = "low" | "medium" | "high";
export type PilotRiskStatus = "open" | "mitigated" | "accepted";

export interface ClientPilotRisk {
  id: string;
  title: string;
  severity: PilotRiskSeverity;
  status: PilotRiskStatus;
  owner: "client" | "builder" | "shared";
  mitigation: string;
}

export interface ClientPilotRiskRegister {
  title: string;
  summary: string;
  risks: ClientPilotRisk[];
  highRiskOpenCount: number;
  openRisks: string[];
}

export function buildClientPilotRiskRegister(): ClientPilotRiskRegister {
  const risks: ClientPilotRisk[] = [
    {
      id: "risk-missing-payment-method",
      title: "Vendor payment method is missing",
      severity: "high",
      status: "open",
      owner: "client",
      mitigation:
        "Exclude payment approval workflow from pilot until payment method data and approval policy are provided."
    },
    {
      id: "risk-bank-id-mapping",
      title: "Bank transaction ID mapping is not confirmed",
      severity: "medium",
      status: "open",
      owner: "shared",
      mitigation:
        "Use mock reconciliation examples in pilot and require client mapping confirmation before production adapter work."
    },
    {
      id: "risk-production-credentials",
      title: "Production credentials must stay in client-owned environment",
      severity: "high",
      status: "mitigated",
      owner: "client",
      mitigation:
        "Public demo uses mock data only. Production credentials must never be committed or shared with builder."
    },
    {
      id: "risk-output-acceptance",
      title: "Final output format is not yet accepted by client",
      severity: "medium",
      status: "open",
      owner: "client",
      mitigation:
        "Use pilot demo to confirm CFO briefing, exception queue, JSON artifact, and approval queue format."
    }
  ];

  return {
    title: "Client Pilot Risk Register",
    summary:
      "Risk register for deciding what can safely be included in a limited client pilot.",
    risks,
    highRiskOpenCount: risks.filter(
      (risk) => risk.severity === "high" && risk.status === "open"
    ).length,
    openRisks: risks
      .filter((risk) => risk.status === "open")
      .map((risk) => risk.title)
  };
}
