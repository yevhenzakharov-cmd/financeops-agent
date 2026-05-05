import path from "path";
import { safeWriteJson } from "../security/safe-output-policy.js";

export function persistApiResponse(data: unknown): void {
  const outputPath = path.resolve("outputs/api/latest-api-response.json");
  safeWriteJson(outputPath, data);
}
