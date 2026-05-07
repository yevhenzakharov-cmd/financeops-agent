import { buildClientBuyerBrief } from "./client-buyer-brief.js";
import { buildClientCommercialReadinessScore } from "./client-commercial-readiness-score.js";
import { buildClientCommercialValueHypothesis } from "./client-commercial-value-hypothesis.js";
import { buildClientObjectionHandlingGuide } from "./client-objection-handling.js";
import { buildClientRoiModel } from "./client-roi-model.js";

export interface ClientCommercialPackage {
  title: string;
  generatedAt: string;
  clientName: string;
  status: "not_ready" | "pilot_sellable" | "production_sellable";
  summary: string;
  valueHypothesis: ReturnType<typeof buildClientCommercialValueHypothesis>;
  roiModel: ReturnType<typeof buildClientRoiModel>;
  readinessScore: ReturnType<typeof buildClientCommercialReadinessScore>;
  buyerBrief: ReturnType<typeof buildClientBuyerBrief>;
  objectionHandling: ReturnType<typeof buildClientObjectionHandlingGuide>;
  commercialRecommendation: string;
}

export function buildClientCommercialPackage(): ClientCommercialPackage {
  const valueHypothesis = buildClientCommercialValueHypothesis();
  const roiModel = buildClientRoiModel();
  const readinessScore = buildClientCommercialReadinessScore();
  const buyerBrief = buildClientBuyerBrief();
  const objectionHandling = buildClientObjectionHandlingGuide();

  const commercialRecommendation =
    readinessScore.status === "production_sellable"
      ? "Ready for production implementation sales conversation."
      : readinessScore.status === "pilot_sellable"
        ? "Sell as a controlled pilot or production-aware demo with explicit exclusions."
        : "Do not sell as ready. Use only as internal demo until blockers are reduced.";

  return {
    title: "Client Commercial Package",
    generatedAt: new Date().toISOString(),
    clientName: readinessScore.clientName,
    status: readinessScore.status,
    summary:
      "Commercial readiness package combining value hypothesis, ROI model, buyer brief, objection handling, and safe sales claims.",
    valueHypothesis,
    roiModel,
    readinessScore,
    buyerBrief,
    objectionHandling,
    commercialRecommendation
  };
}
