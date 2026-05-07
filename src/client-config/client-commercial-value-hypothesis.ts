export interface ClientCommercialValueDriver {
  id: string;
  title: string;
  currentPain: string;
  expectedImprovement: string;
  evidenceSource: string;
}

export interface ClientCommercialValueHypothesis {
  title: string;
  clientName: string;
  summary: string;
  valueDrivers: ClientCommercialValueDriver[];
  strongestValueClaims: string[];
}

export function buildClientCommercialValueHypothesis(): ClientCommercialValueHypothesis {
  const valueDrivers: ClientCommercialValueDriver[] = [
    {
      id: "value-manual-review-time",
      title: "Reduced manual finance review time",
      currentPain:
        "Finance team manually reviews overdue invoices, bank exceptions, and project margin risk.",
      expectedImprovement:
        "Agent prepares exception queues and CFO-style summaries so humans review the important cases first.",
      evidenceSource:
        "Client readiness, acceptance criteria, pilot plan, and go-live package."
    },
    {
      id: "value-faster-exception-escalation",
      title: "Faster exception escalation",
      currentPain:
        "Overdue invoices, orphan transactions, and margin issues can stay hidden until manual review catches them.",
      expectedImprovement:
        "Agent flags issues earlier and groups them into deterministic, auditable outputs.",
      evidenceSource:
        "Exception queue, execution ledger, output artifact, and audit trail."
    },
    {
      id: "value-governed-finance-automation",
      title: "Governed finance automation",
      currentPain:
        "Finance automation is risky if AI can invent calculations or trigger sensitive actions without review.",
      expectedImprovement:
        "Deterministic calculations remain separate from AI explanation, while payments and postings stay approval-gated.",
      evidenceSource:
        "Governance brief, production handoff risk report, and go-live risk report."
    },
    {
      id: "value-client-owned-implementation",
      title: "Client-owned implementation boundary",
      currentPain:
        "Clients may be uncomfortable sharing production credentials, banking access, or payment data with a builder.",
      expectedImprovement:
        "Production credentials remain client-owned, and the public demo uses mock data only.",
      evidenceSource:
        "Deployment checklist, production prerequisites, and go-live checklist."
    }
  ];

  return {
    title: "Client Commercial Value Hypothesis",
    clientName: "Mock Game Studio Finance Team",
    summary:
      "Commercial framing for why the FinanceOps Agent can be valuable to a finance team without pretending the demo is production-ready.",
    valueDrivers,
    strongestValueClaims: valueDrivers.map((driver) => driver.title)
  };
}
