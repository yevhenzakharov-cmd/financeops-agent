import { mockClientContract } from "./mock-client-contract.js";
import { mockClientRequirementsIntake } from "./mock-client-requirements-intake.js";

export type ClientImplementationManifestStatus =
  | "template_ready"
  | "client_configuration_required"
  | "blocked_until_client_inputs_arrive";

export type ClientImplementationActionMode =
  | "read_only"
  | "approval_required"
  | "blocked_until_configured";

export interface ClientImplementationInputManifest {
  id: string;
  name: string;
  expectedSource: string;
  required: boolean;
  owner: "client" | "builder" | "shared";
  mappingStatus: "ready" | "mapping_required" | "missing";
  normalizedTarget: string;
}

export interface ClientImplementationOutputManifest {
  id: string;
  name: string;
  format: string;
  audience: string;
  status: "available_in_demo" | "client_acceptance_required" | "blocked_until_configured";
}

export interface ClientImplementationWorkflowManifest {
  id: string;
  task: string;
  actionMode: ClientImplementationActionMode;
  requiredInputs: string[];
  expectedOutputs: string[];
  productionBoundary: string;
}

export interface ClientImplementationManifest {
  manifestVersion: "client-implementation-manifest-v1";
  status: ClientImplementationManifestStatus;
  purpose: string;
  clientTemplate: {
    clientId: string;
    clientName: string;
    industry: string;
    baseCurrency: string;
  };
  implementationModel: {
    cloneStrategy: "clone_core_repo_per_client";
    configurationStrategy: "client_specific_inputs_mappings_outputs_and_rules";
    productionDataBoundary: "client_owned_environment_required";
    publicRepoBoundary: "mock_data_and_demo_safe_contracts_only";
  };
  inputs: ClientImplementationInputManifest[];
  outputs: ClientImplementationOutputManifest[];
  workflows: ClientImplementationWorkflowManifest[];
  approvalBoundaries: string[];
  blockedUntilClientProvides: string[];
  builderChecklist: string[];
}

export interface ClientImplementationManifestValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export interface ClientImplementationManifestSummary {
  manifestVersion: ClientImplementationManifest["manifestVersion"];
  status: ClientImplementationManifestStatus;
  inputCount: number;
  outputCount: number;
  workflowCount: number;
  approvalGatedWorkflowCount: number;
  blockedWorkflowCount: number;
  missingClientItems: string[];
}

export function buildClientImplementationManifest(): ClientImplementationManifest {
  return {
    manifestVersion: "client-implementation-manifest-v1",
    status: "client_configuration_required",
    purpose:
      "Single source of truth for cloning the FinanceOps Agent core into a client-specific implementation with client-owned inputs, mappings, outputs, and approval rules.",
    clientTemplate: {
      clientId: mockClientContract.profile.id,
      clientName: mockClientContract.profile.name,
      industry: mockClientContract.profile.industry,
      baseCurrency: mockClientContract.profile.baseCurrency
    },
    implementationModel: {
      cloneStrategy: "clone_core_repo_per_client",
      configurationStrategy: "client_specific_inputs_mappings_outputs_and_rules",
      productionDataBoundary: "client_owned_environment_required",
      publicRepoBoundary: "mock_data_and_demo_safe_contracts_only"
    },
    inputs: [
      {
        id: "manifest-input-invoices",
        name: "Invoice export",
        expectedSource: "CSV, Excel, ERP export, or API",
        required: true,
        owner: "client",
        mappingStatus: "ready",
        normalizedTarget: "normalizedInvoiceRecords"
      },
      {
        id: "manifest-input-bank-transactions",
        name: "Bank transaction export",
        expectedSource: "CSV, Excel, bank export, or bank API",
        required: true,
        owner: "client",
        mappingStatus: "mapping_required",
        normalizedTarget: "normalizedBankTransactions"
      },
      {
        id: "manifest-input-payment-profiles",
        name: "Vendor payment profiles",
        expectedSource: "Client-owned payment processor, ERP vendor profile, or secure manual export",
        required: false,
        owner: "client",
        mappingStatus: "missing",
        normalizedTarget: "normalizedPaymentProfiles"
      }
    ],
    outputs: [
      {
        id: "manifest-output-cfo-briefing",
        name: "CFO briefing",
        format: "structured_json_or_text_briefing",
        audience: "CFO, controller, finance lead, founder, or client stakeholder",
        status: "available_in_demo"
      },
      {
        id: "manifest-output-exception-queue",
        name: "Exception queue",
        format: "approval_queue",
        audience: "Finance operations reviewer",
        status: "available_in_demo"
      },
      {
        id: "manifest-output-client-export",
        name: "Client-specific export",
        format: "csv_json_api_dashboard_or_slack",
        audience: "Client-selected workflow owner",
        status: "client_acceptance_required"
      }
    ],
    workflows: [
      {
        id: "workflow-overdue-invoice-review",
        task: "Detect overdue invoices and prepare receivables exceptions.",
        actionMode: "read_only",
        requiredInputs: ["manifest-input-invoices"],
        expectedOutputs: ["manifest-output-cfo-briefing", "manifest-output-exception-queue"],
        productionBoundary: "Safe to run as read-only analysis after client confirms invoice mapping."
      },
      {
        id: "workflow-bank-reconciliation-review",
        task: "Detect missing payments and orphan bank transactions.",
        actionMode: "approval_required",
        requiredInputs: ["manifest-input-invoices", "manifest-input-bank-transactions"],
        expectedOutputs: ["manifest-output-exception-queue", "manifest-output-client-export"],
        productionBoundary:
          "Requires client-approved bank transaction identifiers before production reconciliation."
      },
      {
        id: "workflow-payment-approval-preparation",
        task: "Prepare payment approval requests after deterministic checks pass.",
        actionMode: "blocked_until_configured",
        requiredInputs: ["manifest-input-payment-profiles"],
        expectedOutputs: ["manifest-output-exception-queue"],
        productionBoundary:
          "Blocked until vendor payment profiles, authorized approvers, idempotency rules, and client-owned credentials exist."
      }
    ],
    approvalBoundaries: [
      "Payments may be prepared by the agent, but money movement requires human approval.",
      "Accounting postings may be suggested, but final posting requires client approval.",
      "Tax, legal, and compliance decisions remain blocked for client professionals."
    ],
    blockedUntilClientProvides: [
      "Representative input samples",
      "Confirmed field mappings",
      "Desired output format",
      "Client-owned credentials in client-owned environment",
      ...mockClientRequirementsIntake.approvalRequirements
    ],
    builderChecklist: [
      "Clone or template the core repo for the client.",
      "Replace mock fixture with client-shaped safe sample data.",
      "Map client source fields into normalized FinanceOps schemas.",
      "Configure desired output adapters.",
      "Keep action-like routes approval-gated.",
      "Run validation before demo or deployment."
    ]
  };
}

export function summarizeClientImplementationManifest(
  manifest: ClientImplementationManifest = buildClientImplementationManifest()
): ClientImplementationManifestSummary {
  const approvalGatedWorkflowCount = manifest.workflows.filter(
    (workflow) => workflow.actionMode === "approval_required"
  ).length;

  const blockedWorkflowCount = manifest.workflows.filter(
    (workflow) => workflow.actionMode === "blocked_until_configured"
  ).length;

  return {
    manifestVersion: manifest.manifestVersion,
    status: manifest.status,
    inputCount: manifest.inputs.length,
    outputCount: manifest.outputs.length,
    workflowCount: manifest.workflows.length,
    approvalGatedWorkflowCount,
    blockedWorkflowCount,
    missingClientItems: manifest.blockedUntilClientProvides
  };
}

export function validateClientImplementationManifest(
  manifest: ClientImplementationManifest = buildClientImplementationManifest()
): ClientImplementationManifestValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (manifest.inputs.length === 0) {
    errors.push("At least one input source must be defined.");
  }

  if (manifest.outputs.length === 0) {
    errors.push("At least one output target must be defined.");
  }

  if (manifest.workflows.length === 0) {
    errors.push("At least one client workflow must be defined.");
  }

  if (manifest.approvalBoundaries.length === 0) {
    errors.push("Approval boundaries must be defined before client implementation.");
  }

  const hasBlockedWorkflow = manifest.workflows.some(
    (workflow) => workflow.actionMode === "blocked_until_configured"
  );

  if (!hasBlockedWorkflow) {
    warnings.push("No blocked workflow is defined. Confirm this is intentional before production use.");
  }

  const hasClientOwnedBoundary =
    manifest.implementationModel.productionDataBoundary === "client_owned_environment_required";

  if (!hasClientOwnedBoundary) {
    errors.push("Production data boundary must require a client-owned environment.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
