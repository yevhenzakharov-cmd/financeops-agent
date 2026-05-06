export type PaymentCurrency = "USD" | "EUR" | "GBP" | "UAH";

export type PaymentExecutionStatus =
  | "pending_approval"
  | "approved"
  | "simulated_sent"
  | "failed"
  | "blocked";

export interface PaymentRecipient {
  id: string;
  name: string;
  type: "vendor" | "contractor" | "client" | "internal";
  reference?: string;
}

export interface PaymentRecommendation {
  id: string;
  exceptionId: string;
  actionType: string;
  recipient: PaymentRecipient;
  amount: number;
  currency: PaymentCurrency;
  reason: string;
  riskNote: string;
  requiresHumanApproval: true;
}

export interface PaymentApprovalRequest {
  approvalId: string;
  paymentRecommendationId: string;
  approvedBy: string;
  approvedAt: string;
  idempotencyKey: string;
}

export interface PaymentExecutionResult {
  paymentRecommendationId: string;
  status: PaymentExecutionStatus;
  provider: "mock" | "client_bank_api" | "stripe_treasury" | "plaid" | "custom";
  providerPaymentId: string;
  idempotencyKey: string;
  executedAt: string;
  message: string;
}

export interface PaymentAdapter {
  adapterName: string;
  executeApprovedPayment(
    recommendation: PaymentRecommendation,
    approval: PaymentApprovalRequest
  ): Promise<PaymentExecutionResult>;
}
