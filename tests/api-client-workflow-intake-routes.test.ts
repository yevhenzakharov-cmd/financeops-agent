import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

describe("client workflow intake API routes", () => {
  const serverSource = readFileSync("src/api/server.ts", "utf8");
  const packageJson = readFileSync("package.json", "utf8");

  test("exposes mock client workflow intake plan", () => {
    expect(serverSource).toContain("app.get(\"/client-requirements/mock-client/workflow-intake-plan\"");
    expect(serverSource).toContain("buildClientWorkflowIntakePlan(mockClientRequirementsIntake)");
  });

  test("exposes custom client workflow intake planning endpoint", () => {
    expect(serverSource).toContain("app.post(\"/client-requirements/workflow-intake-plan\"");
    expect(serverSource).toContain("invalid_client_workflow_intake");
    expect(serverSource).toContain("requiredFields");
  });

  test("keeps workflow intake endpoint as planning only", () => {
    expect(serverSource).toContain("plan: buildClientWorkflowIntakePlan(intake)");
    expect(serverSource).not.toContain("executeClientWorkflowIntake");
  });

  test("adds demo script for reviewer path", () => {
    expect(packageJson).toContain("demo:client-workflow-intake");
    expect(packageJson).toContain("./scripts/demo-client-workflow-intake.sh");
  });
});
