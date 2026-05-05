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

  let actionTypes: SimulatedActionType[] = [];

  switch (exception.category) {
    case "overdue_invoice":
      actionTypes = [
        "escalate_collection",
        "offer_settlement",
        "write_off_invoice"
      ];
      break;

    case "underburn":
      actionTypes = [
        "reallocate_budget"
      ];
      break;

    case "missing_payment":
      actionTypes = [
        "escalate_collection"
      ];
      break;

    case "orphan_bank":
      actionTypes = [
        "freeze_vendor_payments"
      ];
      break;

    default:
      actionTypes = [];
  }

  const proposedActions = actionTypes.map((action) =>
    simulateFinancialImpact(action, baseAmount)
  );

  return {
    exceptionId: exception.id,
    proposedActions
  };
}
