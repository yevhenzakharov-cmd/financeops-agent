import { describe, expect, test } from "vitest";

import { runReconciliation } from "../../src/tools/reconciliation.js";

describe("reconciliation tool", () => {
  test("returns deterministic reconciliation statuses for mock finance data", () => {
    const result = runReconciliation();

    expect(result).toEqual([
      {
        invoiceId: "inv-001",
        paymentId: "pay-001",
        bankTransactionId: "bank-001",
        status: "matched"
      },
      {
        invoiceId: "inv-002",
        status: "missing_payment"
      },
      {
        invoiceId: "N/A",
        bankTransactionId: "bank-002",
        status: "orphan_bank"
      }
    ]);
  });

  test("marks matching payments as missing bank when tolerance is too strict", () => {
    const result = runReconciliation({
      amountTolerancePercent: -1,
      lowSeverityThresholdPercent: 1,
      mediumSeverityThresholdPercent: 5
    });

    expect(result).toContainEqual({
      invoiceId: "inv-001",
      paymentId: "pay-001",
      status: "missing_bank"
    });

    expect(result).toContainEqual({
      invoiceId: "inv-002",
      status: "missing_payment"
    });

    expect(result).toContainEqual({
      invoiceId: "N/A",
      bankTransactionId: "bank-001",
      status: "orphan_bank"
    });

    expect(result).toContainEqual({
      invoiceId: "N/A",
      bankTransactionId: "bank-002",
      status: "orphan_bank"
    });
  });
});
