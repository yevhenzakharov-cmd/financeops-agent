export type ClientFieldStatus = "provided" | "missing" | "needs_mapping" | "optional";

export interface ClientFieldRequirement {
  id: string;
  label: string;
  requiredFor: string[];
  status: ClientFieldStatus;
  notes: string;
}

export interface ClientFieldCoverage {
  totalFields: number;
  requiredFields: number;
  providedRequiredFields: number;
  missingRequiredFields: string[];
  needsMappingFields: string[];
  optionalFields: string[];
  coverageScore: number;
  readinessLevel: "blocked" | "partial" | "ready_for_mapping" | "ready_for_build";
  fields: ClientFieldRequirement[];
}

export function evaluateClientFieldCoverage(fields: ClientFieldRequirement[]): ClientFieldCoverage {
  const required = fields.filter((field) => field.status !== "optional");
  const providedRequired = required.filter((field) => field.status === "provided");
  const missingRequired = required.filter((field) => field.status === "missing");
  const needsMapping = required.filter((field) => field.status === "needs_mapping");
  const optional = fields.filter((field) => field.status === "optional");

  const coverageScore =
    required.length === 0 ? 100 : Math.round((providedRequired.length / required.length) * 100);

  const readinessLevel =
    missingRequired.length > 0
      ? "blocked"
      : needsMapping.length > 0
        ? "ready_for_mapping"
        : coverageScore >= 90
          ? "ready_for_build"
          : "partial";

  return {
    totalFields: fields.length,
    requiredFields: required.length,
    providedRequiredFields: providedRequired.length,
    missingRequiredFields: missingRequired.map((field) => field.label),
    needsMappingFields: needsMapping.map((field) => field.label),
    optionalFields: optional.map((field) => field.label),
    coverageScore,
    readinessLevel,
    fields
  };
}

export type ClientInputFieldCoverage = ClientFieldCoverage;

const fallbackClientFieldRequirements: ClientFieldRequirement[] = [
  {
    id: "invoice-id",
    label: "Invoice ID",
    requiredFor: ["overdue_invoice_detection", "ar_exception_queue"],
    status: "provided",
    notes: "Fallback demo field used when older readiness routes call the coverage analyzer without a field array."
  },
  {
    id: "bank-transaction-id",
    label: "Bank transaction ID",
    requiredFor: ["bank_reconciliation", "orphan_transaction_detection"],
    status: "needs_mapping",
    notes: "Client must confirm the stable transaction identifier from their bank export or API."
  },
  {
    id: "vendor-payment-method",
    label: "Vendor payment method",
    requiredFor: ["payment_approval_request"],
    status: "missing",
    notes: "Needed only if the client wants payment preparation or payment approval actions."
  }
];

export function analyzeClientInputFieldCoverage(
  fieldsOrClient?: ClientFieldRequirement[] | unknown,
  _requirementsIntake?: unknown
): ClientFieldCoverage {
  const fields = Array.isArray(fieldsOrClient)
    ? fieldsOrClient
    : fallbackClientFieldRequirements;

  return evaluateClientFieldCoverage(fields);
}
