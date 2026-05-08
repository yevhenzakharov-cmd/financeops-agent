import fs from "fs";
import os from "os";
import path from "path";
import { describe, expect, test } from "vitest";

import { safeWriteJson } from "../../src/security/safe-output-policy.js";

function tempFile(name: string): string {
  return path.join(os.tmpdir(), `financeops-agent-${Date.now()}-${name}.json`);
}

describe("safe output policy", () => {
  test("writes safe JSON output", () => {
    const outputPath = tempFile("safe");

    safeWriteJson(outputPath, {
      status: "safe",
      requestId: "req_123",
      amount: 42
    });

    const parsed = JSON.parse(fs.readFileSync(outputPath, "utf-8")) as {
      status: string;
      amount: number;
    };

    expect(parsed.status).toBe("safe");
    expect(parsed.amount).toBe(42);
  });

  test("blocks OpenAI-style secret patterns", () => {
    const outputPath = tempFile("openai-secret");

    expect(() =>
      safeWriteJson(outputPath, {
        token: "sk-this_is_a_fake_secret_key_for_test_only"
      })
    ).toThrow("Secret pattern detected");
  });

  test("blocks private key blocks", () => {
    const outputPath = tempFile("private-key");

    expect(() =>
      safeWriteJson(outputPath, {
        key: "-----BEGIN PRIVATE KEY-----\nfake\n-----END PRIVATE KEY-----"
      })
    ).toThrow("Secret pattern detected");
  });

  test("allows normal ids that are not secrets", () => {
    const outputPath = tempFile("normal-id");

    safeWriteJson(outputPath, {
      idempotencyKey: "payment-test-idempotency-001",
      traceId: "trace-123"
    });

    expect(fs.existsSync(outputPath)).toBe(true);
  });
});
