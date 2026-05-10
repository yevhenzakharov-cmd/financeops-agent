import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

describe("accounting task registry API routes", () => {
  const serverSource = readFileSync("src/api/server.ts", "utf8");

  test("exposes a read-only accounting task registry endpoint", () => {
    expect(serverSource).toContain("app.get(\"/accounting/tasks\"");
    expect(serverSource).toContain("listAccountingTaskTemplates");
    expect(serverSource).toContain("accounting-task-registry-v1");
  });

  test("exposes individual template and control-decision endpoints", () => {
    expect(serverSource).toContain("app.get(\"/accounting/tasks/:templateId\"");
    expect(serverSource).toContain("app.get(\"/accounting/tasks/:templateId/control-decision\"");
    expect(serverSource).toContain("evaluateAccountingTaskTemplate");
  });

  test("keeps unknown task templates explicit", () => {
    expect(serverSource).toContain("accounting_task_template_not_found");
  });
});
