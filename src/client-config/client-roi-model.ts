export interface ClientRoiAssumption {
  id: string;
  label: string;
  value: number;
  unit: string;
  notes: string;
}

export interface ClientRoiScenario {
  id: string;
  title: string;
  monthlyHoursSaved: number;
  estimatedHourlyCost: number;
  estimatedMonthlyValue: number;
  confidence: "low" | "medium" | "high";
  caveat: string;
}

export interface ClientRoiModel {
  title: string;
  summary: string;
  assumptions: ClientRoiAssumption[];
  scenarios: ClientRoiScenario[];
  recommendedPositioning: string;
}

export function buildClientRoiModel(): ClientRoiModel {
  const estimatedHourlyCost = 65;

  const scenarios: ClientRoiScenario[] = [
    {
      id: "roi-conservative",
      title: "Conservative pilot value",
      monthlyHoursSaved: 15,
      estimatedHourlyCost,
      estimatedMonthlyValue: 15 * estimatedHourlyCost,
      confidence: "medium",
      caveat:
        "Assumes only partial time savings from exception review and CFO summary preparation."
    },
    {
      id: "roi-base",
      title: "Base case pilot value",
      monthlyHoursSaved: 35,
      estimatedHourlyCost,
      estimatedMonthlyValue: 35 * estimatedHourlyCost,
      confidence: "medium",
      caveat:
        "Assumes weekly finance review time is reduced by prioritizing exceptions and summaries."
    },
    {
      id: "roi-expanded",
      title: "Expanded workflow value",
      monthlyHoursSaved: 70,
      estimatedHourlyCost,
      estimatedMonthlyValue: 70 * estimatedHourlyCost,
      confidence: "low",
      caveat:
        "Requires broader production data access, accepted mappings, and more workflow coverage."
    }
  ];

  return {
    title: "Client ROI Model",
    summary:
      "Simple, transparent ROI model for discussing potential value without claiming verified production savings.",
    assumptions: [
      {
        id: "assumption-hourly-cost",
        label: "Estimated loaded finance review cost",
        value: estimatedHourlyCost,
        unit: "USD/hour",
        notes:
          "Placeholder assumption for commercial conversation. Client should replace with their real internal cost."
      },
      {
        id: "assumption-payment-exclusion",
        label: "Payment workflow excluded",
        value: 0,
        unit: "production_payment_actions",
        notes:
          "Payment execution and preparation remain excluded until client payment data and approval policy are confirmed."
      }
    ],
    scenarios,
    recommendedPositioning:
      "Position ROI as a discovery estimate, not a guaranteed savings claim."
  };
}
