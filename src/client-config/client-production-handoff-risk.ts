export type ProductionHandoffRiskLevel = "low" | "medium" | "high";
export type ProductionHandoffRiskStatus = "open" | "mitigated" | "accepted";

export interface ClientProductionHandoffRisk {
  id: string;
  title: string;
  level: ProductionHandoffRiskLevel;
  status: ProductionHandoffRiskStatus;
  owner: "client" | "builder" | "shared";
  mitigation: string;
}

export interface ClientProductionHandoffRiskReport {
  title: string;
  summary: string;
  risks: ClientProductionHandoffRisk[];
  openHighRisks: string[];
  openRiskCount: number;
}

export function buildClientProductionHandoffRiskReport(): ClientProductionHandoffRiskReport {
  const risks: ClientProductionHandoffRisk[] = [
    {
      id: "risk-production-payment-data",
      title: "Production payment workflow lacks required vendor payment data",
      level: "high",
      status: "open",
      owner: "client",
      mitigation:
        "Keep payment approval workflow out of production scope until vendor payment data, approvers, and execution policy are confirmed."
    },
    {
      id: "risk-bank-reconciliation-confidence",
      title: "Bank reconciliation confidence depends on confirmed mapping",
      level: "medium",
      status: "open",
      owner: "shared",
      mitigation:
        "Run mapping review with client-provided bank samples before production adapter implementation."
    },
    {
      id: "risk-ai-finance-explanation",
      title: "AI explanation must not override deterministic finance calculations",
      level: "medium",
      status: "mitigated",
      owner: "builder",
      mitigation:
        "Keep calculations deterministic and use AI only to explain already-verified outputs."
    },
    {
      id: "risk-secret-handling",
      title: "Production secrets must not enter the public repo or builder machine",
      level: "high",
      status: "mitigated",
      owner: "client",
      mitigation:
        "Deploy in client-owned environment and keep secrets in client-owned secret storage."
    }
  ];

  return {
    title: "Client Production Handoff Risk Report",
    summary:
      "Production handoff risks that must be resolved, mitigated, or explicitly accepted before production implementation.",
    risks,
    openHighRisks: risks
      .filter((risk) => risk.level === "high" && risk.status === "open")
      .map((risk) => risk.title),
    openRiskCount: risks.filter((risk) => risk.status === "open").length
  };
}
