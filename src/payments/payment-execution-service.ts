import { randomUUID } from "crypto";

import { MockPaymentAdapter } from "./mock-payment-adapter.js";
import type {
  PaymentApprovalRequest,
  PaymentExecutionResult,
  PaymentRecommendation
} from "./payment-types.js";

export interface ExecutePaymentInput {
  recommendation: PaymentRecommendation;
  approvedBy: string;
  approvalId: string;
  idempotencyKey?: string;
}

const executedIdempotencyKeys = new Map<string, PaymentExecutionResult>();

export async function executeApprovedPayment(
  input: ExecutePaymentInput
): Promise<PaymentExecutionResult> {
  const idempotencyKey =
    input.idempotencyKey ??
    `mock-idempotency-${input.recommendation.id}-${randomUUID()}`;

  const existingResult = executedIdempotencyKeys.get(idempotencyKey);
  if (existingResult) {
    return existingResult;
  }

  const approval: PaymentApprovalRequest = {
    approvalId: input.approvalId,
    paymentRecommendationId: input.recommendation.id,
    approvedBy: input.approvedBy,
    approvedAt: new Date().toISOString(),
    idempotencyKey
  };

  const adapter = new MockPaymentAdapter();
  const result = await adapter.executeApprovedPayment(
    input.recommendation,
    approval
  );

  executedIdempotencyKeys.set(idempotencyKey, result);

  return result;
}
