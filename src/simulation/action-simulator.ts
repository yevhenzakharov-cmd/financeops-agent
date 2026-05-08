import { FinanceException } from "../domain/schemas.js";
import {
  simulateFinancialImpact,
  SimulatedActionType,
  FinancialImpactResult
} from "./financial-impact-engine.js";

export interface ActionSimulationResult {
  exceptionId: string;
  proposedActions: FinancialImpactResult[];
}

/**
 * Based on exception type, propose and simulate possible actions.
 */
export function simulateActionsForException(
  exception: FinanceException
): ActionSimulationResult {

  const baseAmount = 50000; // Demo assumption — later replaced with real amount

  const actionTypes: SimulatedActionType[] = (() => {
    switch (exception.category) {
      case "overdue_invoice":
        return [
          "escalate_collection",
          "offer_settlement",
          "write_off_invoice"
        ];

      case "underburn":
        return [
          "reallocate_budget"
        ];

      case "missing_payment":
        return [
          "escalate_collection"
        ];

      case "orphan_bank":
        return [
          "freeze_vendor_payments"
        ];

      default:
        return [];
    }
  })();

  const proposedActions = actionTypes.map((action) =>
    simulateFinancialImpact(action, baseAmount)
  );

  return {
    exceptionId: exception.id,
    proposedActions
  };
}
