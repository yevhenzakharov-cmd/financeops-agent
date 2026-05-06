import fs from "fs";
import path from "path";

import type { PaymentExecutionResult } from "./payment-types.js";

const OUTPUT_DIR = path.join(process.cwd(), "outputs", "payments");
const LATEST_PAYMENT_EXECUTION_PATH = path.join(
  OUTPUT_DIR,
  "latest-payment-execution.json"
);

export function persistPaymentExecutionResult(
  result: PaymentExecutionResult
): void {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    LATEST_PAYMENT_EXECUTION_PATH,
    JSON.stringify(result, null, 2),
    "utf-8"
  );
}

export function getLatestPaymentExecutionPath(): string {
  return LATEST_PAYMENT_EXECUTION_PATH;
}
