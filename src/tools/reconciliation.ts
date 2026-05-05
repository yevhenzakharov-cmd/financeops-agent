import {
  invoices,
  payments,
  bankTransactions
} from "../domain/mock-data.js";

import type { ReconciliationMatch } from "../domain/schemas.js";
import {
  defaultReconciliationConfig,
  type ReconciliationConfig
} from "../config/reconciliation-config.js";

type SeverityLevel = "low" | "medium" | "high";

interface ExtendedReconciliationMatch extends ReconciliationMatch {
  variancePercent?: number;
  severity?: SeverityLevel;
}

function calculateVariancePercent(
  expected: number,
  actual: number
): number {
  if (expected === 0) return 0;
  return Number((((actual - expected) / expected) * 100).toFixed(2));
}

function classifySeverity(
  variancePercent: number,
  config: ReconciliationConfig
): SeverityLevel {
  const absVariance = Math.abs(variancePercent);

  if (absVariance <= config.lowSeverityThresholdPercent) {
    return "low";
  }

  if (absVariance <= config.mediumSeverityThresholdPercent) {
    return "medium";
  }

  return "high";
}

export function runReconciliation(
  config: ReconciliationConfig = defaultReconciliationConfig
): ExtendedReconciliationMatch[] {
  const results: ExtendedReconciliationMatch[] = [];

  for (const invoice of invoices) {
    const payment = payments.find(
      (p) => p.invoiceId === invoice.id
    );

    if (!payment) {
      results.push({
        invoiceId: invoice.id,
        status: "missing_payment"
      });
      continue;
    }

    const bankMatch = bankTransactions.find((bt) => {
      const variancePercent = calculateVariancePercent(
        payment.amount.amount,
        bt.amount.amount
      );

      return Math.abs(variancePercent) <= config.amountTolerancePercent;
    });

    if (!bankMatch) {
      results.push({
        invoiceId: invoice.id,
        paymentId: payment.id,
        status: "missing_bank"
      });
      continue;
    }

    const variancePercent = calculateVariancePercent(
      payment.amount.amount,
      bankMatch.amount.amount
    );

    if (variancePercent !== 0) {
      results.push({
        invoiceId: invoice.id,
        paymentId: payment.id,
        bankTransactionId: bankMatch.id,
        status: "amount_mismatch",
        variance: bankMatch.amount.amount - payment.amount.amount,
        variancePercent,
        severity: classifySeverity(variancePercent, config)
      });
      continue;
    }

    results.push({
      invoiceId: invoice.id,
      paymentId: payment.id,
      bankTransactionId: bankMatch.id,
      status: "matched"
    });
  }

  for (const bank of bankTransactions) {
    const linked = payments.find((p) => {
      const variancePercent = calculateVariancePercent(
        p.amount.amount,
        bank.amount.amount
      );

      return Math.abs(variancePercent) <= config.amountTolerancePercent;
    });

    if (!linked) {
      results.push({
        invoiceId: "N/A",
        bankTransactionId: bank.id,
        status: "orphan_bank"
      });
    }
  }

  return results;
}
