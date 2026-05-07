export type GoLiveRiskSeverity = "low" | "medium" | "high";
export type GoLiveRiskDisposition = "accepted" | "mitigated" | "open";

export interface ClientGoLiveRisk {
  id: string;
  title: string;
  severity: GoLiveRiskSeverity;
  disposition: GoLiveRiskDisposition;
  owner: "client" | "builder" | "shared";
  mitigation: string;
}

export interface ClientGoLiveRiskReport {
  title: string;
  summary: string;
  risks: ClientGoLiveRisk[];
  openHighRiskCount: number;
  openRisks: string[];
  mitigatedRisks: string[];
}

export function buildClientGoLiveRiskReport(): ClientGoLiveRiskReport {
  const risks: ClientGoLiveRisk[] = [
    {
      id: "go-live-risk-payment-scope",
      title: "Payment workflow lacks required production data",
      severity: "high",
      disposition: "open",
      owner: "client",
      mitigation:
        "Exclude payment workflow from go-live until payment data, approvers, and execution policy are confirmed."
    },
    {
      id: "go-live-risk-bank-mapping",
      title: "Bank mapping still requires client evidence",
      severity: "medium",
      disposition: "open",
      owner: "shared",
      mitigation:
        "Run a client mapping review using approved bank samples before go-live."
    },
    {
      id: "go-live-risk-secret-boundary",
      title: "Credential boundary must remain client-owned",
      severity: "high",
      disposition: "mitigated",
      owner: "client",
      mitigation:
        "Use client-owned environment and secret storage. Do not commit or transmit secrets."
    },
    {
      id: "go-live-risk-ai-determinism",
      title: "AI must not invent finance calculations",
      severity: "medium",
      disposition: "mitigated",
      owner: "builder",
      mitigation:
        "Keep calculations deterministic and use AI only to explain verified pipeline outputs."
    }
  ];

  return {
    title: "Client Go-Live Risk Report",
    summary:
      "Risk report for deciding whether launch planning can proceed safely.",
    risks,
    openHighRiskCount: risks.filter(
      (risk) => risk.severity === "high" && risk.disposition === "open"
    ).length,
    openRisks: risks
      .filter((risk) => risk.disposition === "open")
      .map((risk) => risk.title),
    mitigatedRisks: risks
      .filter((risk) => risk.disposition === "mitigated")
      .map((risk) => risk.title)
  };
}
