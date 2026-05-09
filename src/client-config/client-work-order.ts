import {
  buildClientImplementationManifest,
  summarizeClientImplementationManifest
} from "./client-implementation-manifest.js";

export type ClientWorkOrderStatus =
  | "ready_for_scoping"
  | "blocked_waiting_for_client_data"
  | "ready_for_build";

export type ClientWorkOrderPriority = "high" | "medium" | "low";

export interface ClientWorkOrderRequest {
  clientId: string;
  clientName: string;
  requestedOutcome: string;
  manualProcessToday: string;
  availableInputs: string[];
  desiredOutputs: string[];
  approvalRules: string[];
  deliveryPreference: string;
}

export interface ClientWorkOrderBuildItem {
  id: string;
  title: string;
  priority: ClientWorkOrderPriority;
  owner: "builder" | "client" | "shared";
  status: "ready" | "client_action_required" | "blocked";
  notes: string[];
}

export interface ClientWorkOrder {
  workOrderVersion: "client-work-order-v1";
  status: ClientWorkOrderStatus;
  request: ClientWorkOrderRequest;
  implementationSummary: {
    cloneStrategy: string;
    manifestStatus: string;
    workflowCount: number;
    blockedWorkflowCount: number;
    approvalGatedWorkflowCount: number;
  };
  buildItems: ClientWorkOrderBuildItem[];
  clientQuestions: string[];
  acceptanceCriteria: string[];
  productionBoundaries: string[];
}

export interface ClientWorkOrderValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export const mockClientWorkOrderRequest: ClientWorkOrderRequest = {
  clientId: "client-template-001",
  clientName: "Mock Client Finance Team",
  requestedOutcome:
    "Automate review of overdue invoices, orphan bank transactions, margin risk, and payment approval preparation.",
  manualProcessToday:
    "Finance team manually exports spreadsheets, compares records, prepares exception notes, and asks leadership for approvals.",
  availableInputs: ["Invoice export", "Bank transaction export"],
  desiredOutputs: ["CFO briefing", "Exception queue", "Client-specific export"],
  approvalRules: [
    "Payments require human approval.",
    "Accounting postings require client finance approval.",
    "Missing mapping blocks production automation."
  ],
  deliveryPreference: "API response and dashboard-ready JSON artifact"
};

export function buildClientWorkOrder(
  request: ClientWorkOrderRequest = mockClientWorkOrderRequest
): ClientWorkOrder {
  const manifest = buildClientImplementationManifest();
  const manifestSummary = summarizeClientImplementationManifest(manifest);

  const hasInvoiceInput = request.availableInputs.some((input) =>
    input.toLowerCase().includes("invoice")
  );

  const hasBankInput = request.availableInputs.some((input) =>
    input.toLowerCase().includes("bank")
  );

  const wantsPaymentPreparation = request.requestedOutcome
    .toLowerCase()
    .includes("payment");

  const buildItems: ClientWorkOrderBuildItem[] = [
    {
      id: "work-item-input-mapping",
      title: "Map client inputs into FinanceOps normalized schemas",
      priority: "high",
      owner: "shared",
      status: hasInvoiceInput && hasBankInput ? "ready" : "client_action_required",
      notes: [
        "Confirm source columns for invoice and bank transaction exports.",
        "Do not assume field names before seeing representative client samples."
      ]
    },
    {
      id: "work-item-output-adapter",
      title: "Configure accepted output delivery format",
      priority: "high",
      owner: "shared",
      status: request.desiredOutputs.length > 0 ? "ready" : "client_action_required",
      notes: [
        `Client delivery preference: ${request.deliveryPreference}.`,
        "Outputs must remain traceable to deterministic FinanceOps pipeline results."
      ]
    },
    {
      id: "work-item-approval-policy",
      title: "Encode client approval policy",
      priority: "high",
      owner: "client",
      status: request.approvalRules.length > 0 ? "ready" : "blocked",
      notes: [
        "Money movement and accounting postings remain approval-gated.",
        "Approval rules must be explicit before production deployment."
      ]
    },
    {
      id: "work-item-payment-preparation",
      title: "Keep payment preparation blocked until payment profiles exist",
      priority: wantsPaymentPreparation ? "high" : "medium",
      owner: "client",
      status: wantsPaymentPreparation ? "blocked" : "client_action_required",
      notes: [
        "Vendor payment profiles and authorized approvers are required before enabling payment preparation.",
        "The public demo must not contain production payment credentials."
      ]
    }
  ];

  const blockedItems = buildItems.filter((item) => item.status === "blocked");
  const clientActionItems = buildItems.filter(
    (item) => item.status === "client_action_required"
  );

  const status: ClientWorkOrderStatus =
    blockedItems.length > 0
      ? "blocked_waiting_for_client_data"
      : clientActionItems.length > 0
        ? "ready_for_scoping"
        : "ready_for_build";

  return {
    workOrderVersion: "client-work-order-v1",
    status,
    request,
    implementationSummary: {
      cloneStrategy: manifest.implementationModel.cloneStrategy,
      manifestStatus: manifestSummary.status,
      workflowCount: manifestSummary.workflowCount,
      blockedWorkflowCount: manifestSummary.blockedWorkflowCount,
      approvalGatedWorkflowCount: manifestSummary.approvalGatedWorkflowCount
    },
    buildItems,
    clientQuestions: [
      "Can you provide representative input samples with safe data?",
      "Which fields are stable identifiers across exports?",
      "Which output format should be considered the accepted final deliverable?",
      "Who is allowed to approve payments or accounting postings?",
      "Where should this run in your client-owned environment?"
    ],
    acceptanceCriteria: [
      "Client input fields are mapped into normalized FinanceOps schemas.",
      "Outputs match the client-approved format.",
      "Blocked workflows explain missing client data.",
      "Approval-gated workflows identify the required human reviewer.",
      "No production credentials are stored in the public repo."
    ],
    productionBoundaries: [
      "Client owns production credentials and deployment environment.",
      "Agent may prepare recommendations, but sensitive actions require human approval.",
      "Public repo remains a mock-data implementation template."
    ]
  };
}

export function validateClientWorkOrder(
  workOrder: ClientWorkOrder = buildClientWorkOrder()
): ClientWorkOrderValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!workOrder.request.requestedOutcome.trim()) {
    errors.push("Requested outcome is required.");
  }

  if (workOrder.request.availableInputs.length === 0) {
    errors.push("At least one available input must be provided.");
  }

  if (workOrder.request.desiredOutputs.length === 0) {
    errors.push("At least one desired output must be provided.");
  }

  if (workOrder.request.approvalRules.length === 0) {
    warnings.push("No approval rules were provided. Confirm this before build.");
  }

  const hasBlockedPaymentItem = workOrder.buildItems.some(
    (item) => item.id === "work-item-payment-preparation" && item.status === "blocked"
  );

  if (!hasBlockedPaymentItem) {
    warnings.push("Payment preparation is not blocked. Confirm that this is intentional.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}

export function summarizeClientWorkOrder(workOrder: ClientWorkOrder = buildClientWorkOrder()) {
  return {
    workOrderVersion: workOrder.workOrderVersion,
    status: workOrder.status,
    clientId: workOrder.request.clientId,
    clientName: workOrder.request.clientName,
    buildItemCount: workOrder.buildItems.length,
    readyItems: workOrder.buildItems.filter((item) => item.status === "ready").length,
    blockedItems: workOrder.buildItems.filter((item) => item.status === "blocked").length,
    clientActionRequiredItems: workOrder.buildItems.filter(
      (item) => item.status === "client_action_required"
    ).length,
    acceptanceCriteriaCount: workOrder.acceptanceCriteria.length
  };
}
