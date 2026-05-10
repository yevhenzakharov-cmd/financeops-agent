import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

describe("accounting workflow router API routes", () => {
  const serverSource = readFileSync("src/api/server.ts", "utf8");

  test("exposes read-only workflow routing demo routes", () => {
    expect(serverSource).toContain("app.get(\"/accounting/workflows/demo-routes\"");
    expect(serverSource).toContain("buildDemoAccountingWorkflowRoutes");
    expect(serverSource).toContain("accounting-workflow-router-v1");
  });

  test("exposes workflow intent routing evaluator", () => {
    expect(serverSource).toContain("app.post(\"/accounting/workflows/route\"");
    expect(serverSource).toContain("routeAccountingWorkflowIntent");
    expect(serverSource).toContain("invalid_accounting_workflow_intent");
  });

  test("keeps workflow routing API non-executing", () => {
    expect(serverSource).toContain("requiredFields: [\"title\", \"requestedOutcome\"]");
    expect(serverSource).toContain("clientOutputDestination");
  });
});
