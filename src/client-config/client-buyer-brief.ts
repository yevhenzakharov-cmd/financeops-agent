import { buildClientCommercialValueHypothesis } from "./client-commercial-value-hypothesis.js";
import { buildClientRoiModel } from "./client-roi-model.js";

export interface ClientBuyerBrief {
  title: string;
  audience: string[];
  summary: string;
  buyerPain: string[];
  valueNarrative: string[];
  discoveryQuestions: string[];
  roiModel: ReturnType<typeof buildClientRoiModel>;
}

export function buildClientBuyerBrief(): ClientBuyerBrief {
  const valueHypothesis = buildClientCommercialValueHypothesis();
  const roiModel = buildClientRoiModel();

  return {
    title: "Client Buyer Brief",
    audience: ["CFO", "Controller", "Finance Operations Lead", "Founder"],
    summary:
      "Buyer-facing explanation of what the FinanceOps Agent does, why it matters, and what still needs to be validated before production.",
    buyerPain: valueHypothesis.valueDrivers.map((driver) => driver.currentPain),
    valueNarrative: valueHypothesis.valueDrivers.map(
      (driver) => `${driver.title}: ${driver.expectedImprovement}`
    ),
    discoveryQuestions: [
      "How many hours per week are spent reviewing finance exceptions?",
      "Which reports are prepared manually for CFO or controller review?",
      "Which systems export invoice, bank, project, and payment data?",
      "Which actions must always require human approval?",
      "Which output format would be accepted by the finance team?"
    ],
    roiModel
  };
}
