import {
  evaluateClientFieldCoverage,
  type ClientFieldCoverage,
  type ClientFieldRequirement
} from "./client-field-coverage.js";

export interface ClientDataRequestPacket {
  title: string;
  status: "blocked_waiting_for_client_data" | "ready_for_mapping" | "ready_for_build";
  requiredFromClient: string[];
  mappingQuestions: string[];
  optionalEnhancements: string[];
  deliveryInstruction: string;
}

const fallbackDataRequestFields: ClientFieldRequirement[] = [
  {
    id: "invoice-id",
    label: "Invoice ID",
    requiredFor: ["overdue_invoice_detection"],
    status: "provided",
    notes: "Available in invoice export."
  },
  {
    id: "bank-transaction-id",
    label: "Bank transaction ID",
    requiredFor: ["bank_reconciliation"],
    status: "needs_mapping",
    notes: "Client must confirm source field mapping."
  },
  {
    id: "vendor-payment-method",
    label: "Vendor payment method",
    requiredFor: ["payment_approval_request"],
    status: "missing",
    notes: "Required if payment execution or payment preparation is included in scope."
  }
];

function isClientFieldCoverage(value: unknown): value is ClientFieldCoverage {
  return (
    typeof value === "object" &&
    value !== null &&
    "missingRequiredFields" in value &&
    "needsMappingFields" in value &&
    "optionalFields" in value
  );
}

export function buildClientDataRequestPacket(
  coverageOrClient?: ClientFieldCoverage | unknown,
  _requirementsIntake?: unknown
): ClientDataRequestPacket {
  const coverage = isClientFieldCoverage(coverageOrClient)
    ? coverageOrClient
    : evaluateClientFieldCoverage(fallbackDataRequestFields);

  const status =
    coverage.missingRequiredFields.length > 0
      ? "blocked_waiting_for_client_data"
      : coverage.needsMappingFields.length > 0
        ? "ready_for_mapping"
        : "ready_for_build";

  return {
    title: "Client Data Request Packet",
    status,
    requiredFromClient: coverage.missingRequiredFields,
    mappingQuestions: coverage.needsMappingFields.map(
      (field) => `Confirm how the client source field maps to FinanceOps field: ${field}`
    ),
    optionalEnhancements: coverage.optionalFields,
    deliveryInstruction:
      "Client should provide required data samples, schema notes, credentials in their own environment, and desired output examples before build starts."
  };
}
