import { buildClientImplementationReadiness } from "./client-implementation-readiness.js";

export type OutputDeliveryStatus = "available" | "requires_mapping" | "blocked";

export interface ClientOutputDeliveryTarget {
  id: string;
  name: string;
  format: "json" | "csv" | "dashboard_payload" | "briefing" | "approval_queue";
  status: OutputDeliveryStatus;
  audience: string;
  deliveryNotes: string[];
}

export interface ClientOutputDeliveryPlan {
  title: string;
  clientName: string;
  status: OutputDeliveryStatus;
  targets: ClientOutputDeliveryTarget[];
  acceptanceCriteria: string[];
}

export function buildClientOutputDeliveryPlan(): ClientOutputDeliveryPlan {
  const readiness = buildClientImplementationReadiness();

  const status: OutputDeliveryStatus =
    readiness.readinessStatus === "blocked" ? "requires_mapping" : "available";

  return {
    title: "Client Output Delivery Plan",
    clientName: readiness.clientName,
    status,
    targets: [
      {
        id: "output-cfo-briefing",
        name: "CFO Briefing",
        format: "briefing",
        status: "available",
        audience: "CFO, controller, finance lead",
        deliveryNotes: [
          "Summarize risks, exceptions, and recommended next actions.",
          "Keep financial calculations grounded in deterministic outputs.",
          "Use AI only to explain verified data."
        ]
      },
      {
        id: "output-exception-queue",
        name: "Exception Queue",
        format: "approval_queue",
        status: "available",
        audience: "Controller and finance operations reviewer",
        deliveryNotes: [
          "List finance exceptions by severity.",
          "Show recommended action and approval status.",
          "Block execution for high-risk or missing-data cases."
        ]
      },
      {
        id: "output-payment-approval",
        name: "Payment Approval Request",
        format: "json",
        status: readiness.fieldCoverage.missingRequiredFields.includes("Vendor payment method")
          ? "blocked"
          : "available",
        audience: "CFO or authorized payment approver",
        deliveryNotes: [
          "Prepare payment recommendation only after required vendor data is provided.",
          "Never send payment without approval.",
          "Persist approval and execution records."
        ]
      }
    ],
    acceptanceCriteria: [
      "Outputs must be traceable to deterministic pipeline data.",
      "Blocked actions must explain why they are blocked.",
      "Approval-required actions must identify the required human role.",
      "Client must confirm final output format before production build."
    ]
  };
}
