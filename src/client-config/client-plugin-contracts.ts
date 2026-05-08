import { z } from "zod";

export const ClientPluginFieldTypeSchema = z.enum([
  "string",
  "number",
  "boolean",
  "date",
  "enum",
  "money",
  "id",
  "json"
]);

export const ClientPluginOwnerSchema = z.enum([
  "client",
  "builder",
  "shared"
]);

export const ClientPluginStatusSchema = z.enum([
  "ready",
  "needs_mapping",
  "client_action_required",
  "blocked"
]);

export type ClientPluginStatus = z.infer<typeof ClientPluginStatusSchema>;

export const ClientInputSourceKindSchema = z.enum([
  "csv",
  "json",
  "excel",
  "google_sheet",
  "erp_export",
  "bank_export",
  "payroll_export",
  "payment_processor_export",
  "internal_api",
  "manual_export",
  "email_inbox"
]);

export const ClientOutputDeliveryTargetSchema = z.enum([
  "api",
  "file",
  "dashboard",
  "slack",
  "email_draft",
  "approval_queue",
  "webhook"
]);

export const ClientOutputFormatSchema = z.enum([
  "json",
  "csv",
  "markdown",
  "plain_text",
  "dashboard_payload",
  "slack_blocks",
  "approval_queue"
]);

export const ClientPluginFieldSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: ClientPluginFieldTypeSchema,
  required: z.boolean(),
  status: ClientPluginStatusSchema,
  mapsTo: z.string().min(1).optional(),
  description: z.string().min(1),
  examples: z.array(z.union([z.string(), z.number(), z.boolean()])).default([])
});

export const ClientInputPluginContractSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  sourceKind: ClientInputSourceKindSchema,
  owner: ClientPluginOwnerSchema,
  required: z.boolean(),
  status: ClientPluginStatusSchema,
  purpose: z.string().min(1),
  fields: z.array(ClientPluginFieldSchema).min(1),
  mappingQuestions: z.array(z.string().min(1)),
  blockedUntil: z.array(z.string().min(1)),
  implementationNotes: z.array(z.string().min(1))
});

export const ClientOutputPluginContractSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  format: ClientOutputFormatSchema,
  deliveryTarget: ClientOutputDeliveryTargetSchema,
  owner: ClientPluginOwnerSchema,
  status: ClientPluginStatusSchema,
  audience: z.string().min(1),
  purpose: z.string().min(1),
  requiredNormalizedFields: z.array(z.string().min(1)),
  approvalRequired: z.boolean(),
  blockedUntil: z.array(z.string().min(1)),
  acceptanceCriteria: z.array(z.string().min(1))
});

export const ClientPluginContractsPackageSchema = z.object({
  title: z.string().min(1),
  generatedAt: z.string().min(1),
  clientModel: z.literal("client_specific_plugins"),
  status: ClientPluginStatusSchema,
  summary: z.string().min(1),
  inputPlugins: z.array(ClientInputPluginContractSchema).min(1),
  outputPlugins: z.array(ClientOutputPluginContractSchema).min(1),
  integrationRules: z.array(z.string().min(1)),
  clientImplementationPath: z.array(z.string().min(1)),
  blockedItems: z.array(z.string().min(1)),
  mappingRequiredItems: z.array(z.string().min(1)),
  readyItems: z.array(z.string().min(1))
});

export type ClientPluginField = z.infer<typeof ClientPluginFieldSchema>;
export type ClientInputPluginContract = z.infer<typeof ClientInputPluginContractSchema>;
export type ClientOutputPluginContract = z.infer<typeof ClientOutputPluginContractSchema>;
export type ClientPluginContractsPackage = z.infer<typeof ClientPluginContractsPackageSchema>;

export interface ClientPluginContractsValidationResult {
  valid: boolean;
  errors: string[];
}

function collectInputStatus(inputPlugins: ClientInputPluginContract[], status: ClientPluginStatus): string[] {
  return inputPlugins
    .filter((plugin) => plugin.status === status)
    .map((plugin) => plugin.name);
}

function collectOutputStatus(outputPlugins: ClientOutputPluginContract[], status: ClientPluginStatus): string[] {
  return outputPlugins
    .filter((plugin) => plugin.status === status)
    .map((plugin) => plugin.name);
}

export function buildClientPluginContractsPackage(): ClientPluginContractsPackage {
  const inputPlugins: ClientInputPluginContract[] = [
    {
      id: "input-plugin-invoice-export",
      name: "Client Invoice Export Plug-in",
      sourceKind: "csv",
      owner: "shared",
      required: true,
      status: "ready",
      purpose: "Accept each client's invoice export and map it into the normalized receivables model.",
      fields: [
        {
          key: "invoice_id",
          label: "Invoice identifier",
          type: "id",
          required: true,
          status: "ready",
          mapsTo: "invoice.id",
          description: "Stable invoice identifier from the client source system.",
          examples: ["INV-1001"]
        },
        {
          key: "due_date",
          label: "Invoice due date",
          type: "date",
          required: true,
          status: "ready",
          mapsTo: "invoice.dueDate",
          description: "Due date used for aging and overdue detection.",
          examples: ["2026-04-12"]
        },
        {
          key: "amount",
          label: "Invoice amount",
          type: "money",
          required: true,
          status: "ready",
          mapsTo: "invoice.amount",
          description: "Amount used for receivables exposure and CFO briefing.",
          examples: [42000]
        }
      ],
      mappingQuestions: [],
      blockedUntil: [],
      implementationNotes: [
        "Client can rename fields as long as mapping is confirmed.",
        "Adapter should normalize dates, money values, invoice status, and customer references before FinanceOps processing."
      ]
    },
    {
      id: "input-plugin-bank-export",
      name: "Client Bank Export Plug-in",
      sourceKind: "bank_export",
      owner: "shared",
      required: true,
      status: "needs_mapping",
      purpose: "Accept bank exports or bank API payloads and map them into reconciliation inputs.",
      fields: [
        {
          key: "transaction_id",
          label: "Bank transaction identifier",
          type: "id",
          required: true,
          status: "needs_mapping",
          mapsTo: "bankTransaction.id",
          description: "Client must confirm this identifier is stable across exports.",
          examples: ["BANK-9001"]
        },
        {
          key: "reference",
          label: "Bank reference",
          type: "string",
          required: false,
          status: "needs_mapping",
          mapsTo: "bankTransaction.description",
          description: "Used for matching invoice IDs, customer names, or payment references.",
          examples: ["INV-1001"]
        }
      ],
      mappingQuestions: [
        "Which source field is the stable bank transaction identifier?",
        "Can bank references be matched to invoice IDs or customer names?"
      ],
      blockedUntil: [
        "Client confirms stable transaction identifier.",
        "Client confirms matching reference strategy."
      ],
      implementationNotes: [
        "Do not treat bank reconciliation as production-ready until mapping stability is confirmed.",
        "Adapter should preserve raw reference fields for audit review."
      ]
    },
    {
      id: "input-plugin-payment-profile",
      name: "Client Payment Profile Plug-in",
      sourceKind: "manual_export",
      owner: "client",
      required: false,
      status: "blocked",
      purpose: "Accept vendor payment method and approval policy data only when the client wants payment preparation.",
      fields: [
        {
          key: "vendor_payment_method",
          label: "Vendor payment method",
          type: "string",
          required: true,
          status: "blocked",
          mapsTo: "paymentRecommendation.paymentMethod",
          description: "Required before payment preparation can be included.",
          examples: []
        },
        {
          key: "authorized_approver",
          label: "Authorized approver",
          type: "string",
          required: true,
          status: "blocked",
          mapsTo: "approvalQueue.requiredApprover",
          description: "Required for human approval routing.",
          examples: []
        }
      ],
      mappingQuestions: [
        "Will vendor payment profile data come from a file, API, or accounting system?",
        "Who is allowed to approve payment preparation?"
      ],
      blockedUntil: [
        "Vendor payment method data is provided.",
        "Authorized approver policy is confirmed.",
        "Client-owned payment rails are defined."
      ],
      implementationNotes: [
        "Payment execution remains excluded until client-owned payment data and approval rules exist.",
        "The public repo must never store production payment credentials."
      ]
    }
  ];

  const outputPlugins: ClientOutputPluginContract[] = [
    {
      id: "output-plugin-cfo-briefing",
      name: "CFO Briefing Output Plug-in",
      format: "markdown",
      deliveryTarget: "file",
      owner: "shared",
      status: "ready",
      audience: "CFO, founder, controller, or finance lead",
      purpose: "Generate a client-specific finance briefing from deterministic pipeline outputs.",
      requiredNormalizedFields: [
        "exceptions",
        "marginResults",
        "budgetBurnResults",
        "reconciliationResults"
      ],
      approvalRequired: false,
      blockedUntil: [],
      acceptanceCriteria: [
        "Briefing must explain only verified deterministic outputs.",
        "Briefing must separate facts, risks, and recommended next actions."
      ]
    },
    {
      id: "output-plugin-dashboard-payload",
      name: "Dashboard Payload Output Plug-in",
      format: "dashboard_payload",
      deliveryTarget: "api",
      owner: "shared",
      status: "ready",
      audience: "Operator, controller, or technical reviewer",
      purpose: "Expose normalized results in a structured shape suitable for a client dashboard.",
      requiredNormalizedFields: [
        "summaryCards",
        "exceptionQueue",
        "approvalQueue",
        "artifactStatus"
      ],
      approvalRequired: false,
      blockedUntil: [],
      acceptanceCriteria: [
        "Payload must be JSON serializable.",
        "Payload must expose blocked and approval-required items clearly."
      ]
    },
    {
      id: "output-plugin-payment-approval",
      name: "Payment Approval Output Plug-in",
      format: "approval_queue",
      deliveryTarget: "approval_queue",
      owner: "client",
      status: "blocked",
      audience: "CFO or authorized approver",
      purpose: "Prepare payment approval requests when client data and approval policy allow it.",
      requiredNormalizedFields: [
        "vendorPaymentMethod",
        "authorizedApprover",
        "paymentAmount",
        "idempotencyKey"
      ],
      approvalRequired: true,
      blockedUntil: [
        "Vendor payment method data exists.",
        "Authorized approver policy is accepted.",
        "Client-owned payment rails are configured."
      ],
      acceptanceCriteria: [
        "Money movement must not execute without human approval.",
        "Payment requests must include idempotency and audit references.",
        "Production credentials must remain client-owned."
      ]
    }
  ];

  const blockedItems = [
    ...collectInputStatus(inputPlugins, "blocked"),
    ...collectOutputStatus(outputPlugins, "blocked")
  ];

  const mappingRequiredItems = [
    ...collectInputStatus(inputPlugins, "needs_mapping"),
    ...collectOutputStatus(outputPlugins, "needs_mapping")
  ];

  const readyItems = [
    ...collectInputStatus(inputPlugins, "ready"),
    ...collectOutputStatus(outputPlugins, "ready")
  ];

  return {
    title: "Client Plug-in Contracts Package",
    generatedAt: new Date().toISOString(),
    clientModel: "client_specific_plugins",
    status: blockedItems.length > 0
      ? "blocked"
      : mappingRequiredItems.length > 0
        ? "needs_mapping"
        : "ready",
    summary:
      "Reusable contract layer showing how each client can plug in their own inputs and desired outputs without rewriting the deterministic FinanceOps core.",
    inputPlugins,
    outputPlugins,
    integrationRules: [
      "Client inputs must be mapped into normalized FinanceOps fields before deterministic processing.",
      "Client outputs must be configured from normalized pipeline results, not raw unverified AI text.",
      "Missing fields should block only the workflows that depend on them.",
      "Payment preparation and money movement stay blocked until client-owned payment data and approval policy exist.",
      "Production credentials remain outside the public repo and inside the client-owned environment."
    ],
    clientImplementationPath: [
      "Collect client source samples and desired output examples.",
      "Register input plug-ins for each source system or export file.",
      "Map client fields into normalized FinanceOps fields.",
      "Select output plug-ins matching the client's preferred delivery targets.",
      "Run validation before enabling pilot or production workflows.",
      "Keep blocked workflows excluded until required client data is provided."
    ],
    blockedItems,
    mappingRequiredItems,
    readyItems
  };
}

export function validateClientPluginContractsPackage(
  value: unknown
): ClientPluginContractsValidationResult {
  const result = ClientPluginContractsPackageSchema.safeParse(value);

  if (result.success) {
    return {
      valid: true,
      errors: []
    };
  }

  return {
    valid: false,
    errors: result.error.issues.map((issue) =>
      `${issue.path.join(".") || "root"}: ${issue.message}`
    )
  };
}
