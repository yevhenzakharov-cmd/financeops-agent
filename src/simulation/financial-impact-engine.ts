export type SimulatedActionType =
  | "escalate_collection"
  | "offer_settlement"
  | "write_off_invoice"
  | "freeze_vendor_payments"
  | "reallocate_budget";

export interface FinancialImpactResult {
  actionType: SimulatedActionType;
  projectedCashDelta: number;
  projectedMarginDelta: number;
  projectedRiskDelta: number;
  explanation: string;
}

/**
 * Simulate financial impact of a proposed action.
 * This does NOT execute real actions — only simulates.
 */
export function simulateFinancialImpact(
  actionType: SimulatedActionType,
  baseAmount: number
): FinancialImpactResult {

  switch (actionType) {
    case "escalate_collection":
      return {
        actionType,
        projectedCashDelta: baseAmount * 0.8,
        projectedMarginDelta: 0,
        projectedRiskDelta: -10,
        explanation:
          "Escalation expected to recover ~80% of receivable and reduce collection risk."
      };

    case "offer_settlement":
      return {
        actionType,
        projectedCashDelta: baseAmount * 0.6,
        projectedMarginDelta: -baseAmount * 0.4,
        projectedRiskDelta: -15,
        explanation:
          "Settlement reduces outstanding risk but impacts margin."
      };

    case "write_off_invoice":
      return {
        actionType,
        projectedCashDelta: 0,
        projectedMarginDelta: -baseAmount,
        projectedRiskDelta: -5,
        explanation:
          "Write-off eliminates receivable risk but fully impacts margin."
      };

    case "freeze_vendor_payments":
      return {
        actionType,
        projectedCashDelta: baseAmount * 0.5,
        projectedMarginDelta: 0,
        projectedRiskDelta: +5,
        explanation:
          "Freezing payments temporarily preserves cash but increases operational risk."
      };

    case "reallocate_budget":
      return {
        actionType,
        projectedCashDelta: 0,
        projectedMarginDelta: baseAmount * 0.1,
        projectedRiskDelta: -3,
        explanation:
          "Budget reallocation improves margin efficiency slightly."
      };

    default:
      return {
        actionType,
        projectedCashDelta: 0,
        projectedMarginDelta: 0,
        projectedRiskDelta: 0,
        explanation: "No financial impact simulated."
      };
  }
}
