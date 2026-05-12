import type {
  PaymentAdapter,
  PaymentApprovalRequest,
  PaymentExecutionResult,
  PaymentRecommendation
} from "./payment-types.js";

export class MockPaymentAdapter implements PaymentAdapter {
  adapterName = "mock_payment_adapter";

  async executeApprovedPayment(
    recommendation: PaymentRecommendation,
    approval: PaymentApprovalRequest
  ): Promise<PaymentExecutionResult> {
    if (approval.paymentRecommendationId !== recommendation.id) {
      return {
        paymentRecommendationId: recommendation.id,
        status: "failed",
        provider: "mock",
        providerPaymentId: "mock-payment-failed",
        idempotencyKey: approval.idempotencyKey,
        executedAt: new Date().toISOString(),
        message: "Approval does not match payment recommendation."
      };
    }

    return {
      paymentRecommendationId: recommendation.id,
      status: "simulated_approval_recorded",
      provider: "mock",
      providerPaymentId: `mock-payment-${recommendation.id}`,
      idempotencyKey: approval.idempotencyKey,
      executedAt: new Date().toISOString(),
      message: `Mock payment approval simulation recorded for ${recommendation.recipient.name} for ${recommendation.amount} ${recommendation.currency}.`
    };
  }
}
