import type { RankedAction } from "../execution/auto-executor.js";
import type { PaymentRecommendation } from "./payment-types.js";

function createRecommendationId(index: number): string {
  return `payrec-${String(index + 1).padStart(3, "0")}`;
}

function isPaymentLikeAction(actionType: string): boolean {
  return actionType === "freeze_vendor_payments";
}

export function buildPaymentRecommendations(
  selectedActions: RankedAction[]
): PaymentRecommendation[] {
  return selectedActions
    .filter((action) => isPaymentLikeAction(action.actionType))
    .map((action, index) => ({
      id: createRecommendationId(index),
      exceptionId: action.exceptionId,
      actionType: action.actionType,
      recipient: {
        id: "vendor-001",
        name: "Mock Vendor Services",
        type: "vendor",
        reference: "mock-vendor-bank-profile"
      },
      amount: Math.max(action.projectedCashDelta, 0),
      currency: "USD",
      reason: action.explanation,
      riskNote:
        "Human approval required before any vendor payment action can be executed.",
      requiresHumanApproval: true
    }));
}
