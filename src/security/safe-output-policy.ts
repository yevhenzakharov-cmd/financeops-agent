import { writeFileSync } from "fs";

/**
 * Strict but realistic secret detection patterns.
 * Only blocks real secret formats — not UUIDs or request IDs.
 */
const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9_-]{20,}/,           // OpenAI-style API keys
  /-----BEGIN PRIVATE KEY-----/,     // Private key blocks
  /AKIA[0-9A-Z]{16}/,                // AWS access keys
  /AIza[0-9A-Za-z\-_]{35}/           // Google API keys
];

/**
 * Scan content for secrets before writing to disk.
 */
function containsSecret(content: string): boolean {
  return SECRET_PATTERNS.some((pattern) => pattern.test(content));
}

/**
 * Safe JSON write with secret scanning enforcement.
 */
export function safeWriteJson(path: string, data: unknown): void {
  const serialized = JSON.stringify(data, null, 2);

  if (containsSecret(serialized)) {
    throw new Error("Secret pattern detected in output. Write blocked.");
  }

  writeFileSync(path, serialized, {
    encoding: "utf-8"
  });
}
