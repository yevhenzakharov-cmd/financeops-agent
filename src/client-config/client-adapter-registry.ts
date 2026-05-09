import { buildClientImplementationManifest } from "./client-implementation-manifest.js";
import { buildClientWorkOrder } from "./client-work-order.js";

export type ClientAdapterRegistryStatus =
  | "ready_for_demo"
  | "mapping_required"
  | "blocked_until_client_owned";

export type ClientAdapterKind = "input" | "output" | "approval" | "audit";

export type ClientAdapterBuildStatus =
  | "available_in_core"
  | "configure_per_client"
  | "blocked_until_client_owned";

export interface ClientAdapterRegistryEntry {
  id: string;
  kind: ClientAdapterKind;
  name: string;
  sourceOrTarget: string;
  normalizedContract: string;
  status: ClientAdapterBuildStatus;
  owner: "builder" | "client" | "shared";
  requiredFor: string[];
  implementationNotes: string[];
}

export interface ClientAdapterRegistry {
  registryVersion: "client-adapter-registry-v1";
  status: ClientAdapterRegistryStatus;
  purpose: string;
  clientContext: {
    clientId: string;
    clientName: string;
    requestedOutcome: string;
  };
  adapters: ClientAdapterRegistryEntry[];
  missingClientOwnedAdapters: string[];
  mappingRequiredAdapters: string[];
  reusableCoreAdapters: string[];
}

export interface ClientAdapterRegistryValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientAdapterRegistry(): ClientAdapterRegistry {
  const manifest = buildClientImplementationManifest();
  const workOrder = buildClientWorkOrder();

  const adapters: ClientAdapterRegistryEntry[] = [
    {
      id: "adapter-input-invoices",
      kind: "input",
      name: "Invoice input adapter",
      sourceOrTarget: "CSV, Excel, ERP export, or API",
      normalizedContract: "normalizedInvoiceRecords",
      status: "configure_per_client",
      owner: "shared",
      requiredFor: ["overdue_invoice_detection", "receivables_exception_queue", "cfo_briefing"],
      implementationNotes: [
        "Map invoice IDs, customer references, due dates, payment status, amount, and currency.",
        "Use safe client-shaped sample data before production connection."
      ]
    },
    {
      id: "adapter-input-bank-transactions",
      kind: "input",
      name: "Bank transaction input adapter",
      sourceOrTarget: "CSV, Excel, bank export, or bank API",
      normalizedContract: "normalizedBankTransactions",
      status: "configure_per_client",
      owner: "shared",
      requiredFor: ["bank_reconciliation", "orphan_transaction_detection"],
      implementationNotes: [
        "Confirm stable transaction identifiers before production reconciliation.",
        "Map references that can connect bank records to invoices or customers."
      ]
    },
    {
      id: "adapter-input-payment-profiles",
      kind: "input",
      name: "Vendor payment profile adapter",
      sourceOrTarget: "Client-owned payment processor, ERP vendor profile, or secure manual export",
      normalizedContract: "normalizedPaymentProfiles",
      status: "blocked_until_client_owned",
      owner: "client",
      requiredFor: ["payment_approval_preparation"],
      implementationNotes: [
        "Do not enable payment preparation until vendor payment data is provided by the client.",
        "Never store production payment credentials in the public repo."
      ]
    },
    {
      id: "adapter-output-cfo-briefing",
      kind: "output",
      name: "CFO briefing output adapter",
      sourceOrTarget: "Structured JSON or text briefing",
      normalizedContract: "cfoBriefing",
      status: "available_in_core",
      owner: "builder",
      requiredFor: ["executive_summary", "finance_risk_review"],
      implementationNotes: [
        "Use deterministic FinanceOps results as the source of truth.",
        "Use AI-style text only to explain already-calculated values."
      ]
    },
    {
      id: "adapter-output-exception-queue",
      kind: "output",
      name: "Exception queue output adapter",
      sourceOrTarget: "Approval queue, dashboard payload, or API response",
      normalizedContract: "approvalQueue",
      status: "available_in_core",
      owner: "builder",
      requiredFor: ["human_review", "blocked_action_visibility"],
      implementationNotes: [
        "Show severity, source evidence, recommended action, and approval requirement.",
        "Keep blocked actions visible and explain why they are blocked."
      ]
    },
    {
      id: "adapter-output-client-export",
      kind: "output",
      name: "Client-specific export adapter",
      sourceOrTarget: "CSV, JSON, dashboard, Slack, API, or client-owned destination",
      normalizedContract: "clientOutputArtifact",
      status: "configure_per_client",
      owner: "shared",
      requiredFor: ["client_acceptance"],
      implementationNotes: [
        "Configure only after the client accepts the target output shape.",
        "Keep output traceable to deterministic pipeline artifacts."
      ]
    },
    {
      id: "adapter-approval-policy",
      kind: "approval",
      name: "Approval policy adapter",
      sourceOrTarget: "Client approval rules and approver roles",
      normalizedContract: "approvalPolicy",
      status: "configure_per_client",
      owner: "client",
      requiredFor: ["money_movement", "accounting_posting", "high_risk_exception_review"],
      implementationNotes: [
        "Encode human approval rules before any action-like workflow is enabled.",
        "Payments and accounting postings remain gated."
      ]
    },
    {
      id: "adapter-audit-log",
      kind: "audit",
      name: "Audit evidence adapter",
      sourceOrTarget: "Execution ledger, approval records, and output artifacts",
      normalizedContract: "auditTrail",
      status: "available_in_core",
      owner: "builder",
      requiredFor: ["reviewer_trust", "traceability", "production_handoff"],
      implementationNotes: [
        "Keep audit events for input loading, action selection, policy enforcement, persistence, and output creation.",
        "Do not log production secrets or raw sensitive client data."
      ]
    }
  ];

  const missingClientOwnedAdapters = adapters
    .filter((adapter) => adapter.status === "blocked_until_client_owned")
    .map((adapter) => adapter.name);

  const mappingRequiredAdapters = adapters
    .filter((adapter) => adapter.status === "configure_per_client")
    .map((adapter) => adapter.name);

  const reusableCoreAdapters = adapters
    .filter((adapter) => adapter.status === "available_in_core")
    .map((adapter) => adapter.name);

  return {
    registryVersion: "client-adapter-registry-v1",
    status: missingClientOwnedAdapters.length > 0 ? "blocked_until_client_owned" : "mapping_required",
    purpose:
      "Registry of input, output, approval, and audit adapters needed to turn the reusable FinanceOps core into a client-specific implementation.",
    clientContext: {
      clientId: workOrder.request.clientId,
      clientName: workOrder.request.clientName,
      requestedOutcome: workOrder.request.requestedOutcome
    },
    adapters,
    missingClientOwnedAdapters,
    mappingRequiredAdapters: [
      ...new Set([
        ...mappingRequiredAdapters,
        ...manifest.inputs
          .filter((input) => input.mappingStatus === "mapping_required")
          .map((input) => input.name)
      ])
    ],
    reusableCoreAdapters
  };
}

export function summarizeClientAdapterRegistry(
  registry: ClientAdapterRegistry = buildClientAdapterRegistry()
) {
  return {
    registryVersion: registry.registryVersion,
    status: registry.status,
    clientName: registry.clientContext.clientName,
    adapterCount: registry.adapters.length,
    inputAdapterCount: registry.adapters.filter((adapter) => adapter.kind === "input").length,
    outputAdapterCount: registry.adapters.filter((adapter) => adapter.kind === "output").length,
    approvalAdapterCount: registry.adapters.filter((adapter) => adapter.kind === "approval").length,
    auditAdapterCount: registry.adapters.filter((adapter) => adapter.kind === "audit").length,
    reusableCoreAdapterCount: registry.reusableCoreAdapters.length,
    mappingRequiredAdapterCount: registry.mappingRequiredAdapters.length,
    missingClientOwnedAdapterCount: registry.missingClientOwnedAdapters.length
  };
}

export function validateClientAdapterRegistry(
  registry: ClientAdapterRegistry = buildClientAdapterRegistry()
): ClientAdapterRegistryValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (registry.adapters.length === 0) {
    errors.push("Adapter registry must include at least one adapter.");
  }

  const hasInputAdapter = registry.adapters.some((adapter) => adapter.kind === "input");
  const hasOutputAdapter = registry.adapters.some((adapter) => adapter.kind === "output");
  const hasApprovalAdapter = registry.adapters.some((adapter) => adapter.kind === "approval");
  const hasAuditAdapter = registry.adapters.some((adapter) => adapter.kind === "audit");

  if (!hasInputAdapter) {
    errors.push("Adapter registry must include at least one input adapter.");
  }

  if (!hasOutputAdapter) {
    errors.push("Adapter registry must include at least one output adapter.");
  }

  if (!hasApprovalAdapter) {
    errors.push("Adapter registry must include an approval adapter.");
  }

  if (!hasAuditAdapter) {
    errors.push("Adapter registry must include an audit adapter.");
  }

  const paymentAdapter = registry.adapters.find(
    (adapter) => adapter.id === "adapter-input-payment-profiles"
  );

  if (paymentAdapter?.status !== "blocked_until_client_owned") {
    errors.push("Payment profile adapter must remain blocked until client-owned setup exists.");
  }

  if (registry.mappingRequiredAdapters.length === 0) {
    warnings.push("No mapping-required adapters found. Confirm this is intentional.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
