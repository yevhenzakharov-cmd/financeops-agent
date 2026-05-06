import fs from "fs";
import path from "path";

import type {
  PaymentApprovalRequest,
  PaymentExecutionResult,
  PaymentRecommendation
} from "./payment-types.js";

export interface PaymentExecutionRecord {
  recordedAt: string;
  recommendation: PaymentRecommendation;
  approval: PaymentApprovalRequest;
  result: PaymentExecutionResult;
}

const OUTPUT_DIR = path.join(process.cwd(), "outputs", "payments");
const LATEST_PAYMENT_EXECUTION_PATH = path.join(
  OUTPUT_DIR,
  "latest-payment-execution.json"
);

export function persistPaymentExecutionRecord(
  record: PaymentExecutionRecord
): void {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    LATEST_PAYMENT_EXECUTION_PATH,
    JSON.stringify(record, null, 2),
    "utf-8"
  );
}

export function getLatestPaymentExecutionPath(): string {
  return LATEST_PAYMENT_EXECUTION_PATH;
}
