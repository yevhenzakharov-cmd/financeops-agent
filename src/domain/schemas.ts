import { z } from "zod";

/**
 * Core shared primitives
 */

export const CurrencyCodeSchema = z.string().length(3);
export type CurrencyCode = z.infer<typeof CurrencyCodeSchema>;

export const MoneySchema = z.object({
  amount: z.number(),
  currency: CurrencyCodeSchema
});
export type Money = z.infer<typeof MoneySchema>;

/**
 * Client
 */

export const ClientSchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  contactEmail: z.string().email(),
  isActive: z.boolean()
});
export type Client = z.infer<typeof ClientSchema>;

/**
 * Delivery Stage
 */

export const DeliveryStageSchema = z.enum([
  "discovery",
  "pilot",
  "implementation",
  "production"
]);
export type DeliveryStage = z.infer<typeof DeliveryStageSchema>;

/**
 * Project
 */

export const ProjectBudgetSchema = z.object({
  totalBudget: MoneySchema,
  approvedAt: z.string()
});
export type ProjectBudget = z.infer<typeof ProjectBudgetSchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  clientId: z.string(),
  engine: z.enum(["FinanceOpsCore"]),
  platform: z.array(z.enum(["Operations", "PC", "Console"])),
  stage: DeliveryStageSchema,
  budget: ProjectBudgetSchema,
  startDate: z.string(),
  endDate: z.string().optional()
});
export type Project = z.infer<typeof ProjectSchema>;

/**
 * Invoice
 */

export const InvoiceSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  clientId: z.string(),
  issuedDate: z.string(),
  dueDate: z.string(),
  amount: MoneySchema,
  status: z.enum(["draft", "sent", "paid", "overdue"])
});
export type Invoice = z.infer<typeof InvoiceSchema>;

/**
 * Payment
 */

export const PaymentSchema = z.object({
  id: z.string(),
  invoiceId: z.string(),
  receivedDate: z.string(),
  amount: MoneySchema,
  method: z.enum(["wire", "stripe", "wise", "other"])
});
export type Payment = z.infer<typeof PaymentSchema>;

/**
 * Bank Transaction
 */

export const BankTransactionSchema = z.object({
  id: z.string(),
  date: z.string(),
  description: z.string(),
  amount: MoneySchema
});
export type BankTransaction = z.infer<typeof BankTransactionSchema>;

/**
 * Reconciliation Result
 */

export const ReconciliationMatchSchema = z.object({
  invoiceId: z.string(),
  paymentId: z.string().optional(),
  bankTransactionId: z.string().optional(),
  status: z.enum([
    "matched",
    "missing_payment",
    "missing_bank",
    "amount_mismatch",
    "orphan_bank"
  ]),
  variance: z.number().optional()
});
export type ReconciliationMatch = z.infer<typeof ReconciliationMatchSchema>;

/**
 * Expense
 */

export const ExpenseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  category: z.enum(["software", "hardware", "travel", "marketing", "other"]),
  date: z.string(),
  amount: MoneySchema,
  description: z.string()
});
export type Expense = z.infer<typeof ExpenseSchema>;

/**
 * Contractor Cost
 */

export const ContractorCostSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  contractorName: z.string(),
  role: z.string(),
  date: z.string(),
  amount: MoneySchema
});
export type ContractorCost = z.infer<typeof ContractorCostSchema>;

/**
 * Finance Exception
 */

export const FinanceExceptionSchema = z.object({
  id: z.string(),
  source: z.enum([
    "margin",
    "burn",
    "receivable",
    "reconciliation"
  ]),
  referenceId: z.string(),
  category: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  recommendedActionType: z.enum(["safe", "warning", "blocked"]),
  requiresHumanReview: z.boolean()
});
export type FinanceException = z.infer<typeof FinanceExceptionSchema>;

/**
 * Agent Action
 */

export const AgentActionSchema = z.object({
  id: z.string(),
  exceptionId: z.string(),
  actionType: z.string(),
  riskLevel: z.enum(["safe", "warning", "blocked"]),
  description: z.string()
});
export type AgentAction = z.infer<typeof AgentActionSchema>;

/**
 * Action Decision
 */

export const ActionDecisionSchema = z.object({
  actionId: z.string(),
  decision: z.enum(["allowed", "requires_review", "denied"]),
  reason: z.string()
});
export type ActionDecision = z.infer<typeof ActionDecisionSchema>;

/**
 * Audit
 */

export const AuditPhaseSchema = z.enum([
  "initialization",
  "detection",
  "classification",
  "action_generation",
  "policy_enforcement",
  "validation",
  "persistence"
]);
export type AuditPhase = z.infer<typeof AuditPhaseSchema>;

export const AuditEventSchema = z.object({
  id: z.string(),
  traceId: z.string(),
  timestamp: z.string(),
  phase: AuditPhaseSchema,
  type: z.string(),
  metadata: z.record(z.string(), z.any())
});
export type AuditEvent = z.infer<typeof AuditEventSchema>;

export const AuditLogSchema = z.object({
  traceId: z.string(),
  startedAt: z.string(),
  finishedAt: z.string().optional(),
  events: z.array(AuditEventSchema)
});
export type AuditLog = z.infer<typeof AuditLogSchema>;
