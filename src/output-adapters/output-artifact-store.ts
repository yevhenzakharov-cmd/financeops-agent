import fs from "fs";
import path from "path";

import type { FinanceOpsOutputArtifact } from "./financeops-output-adapter.js";

const OUTPUT_DIR = path.join(process.cwd(), "outputs", "artifacts");
const LATEST_OUTPUT_ARTIFACT_PATH = path.join(
  OUTPUT_DIR,
  "latest-output-artifact.json"
);

export function persistOutputArtifact(
  artifact: FinanceOpsOutputArtifact
): void {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    LATEST_OUTPUT_ARTIFACT_PATH,
    JSON.stringify(artifact, null, 2),
    "utf-8"
  );
}

export function getLatestOutputArtifactPath(): string {
  return LATEST_OUTPUT_ARTIFACT_PATH;
}
