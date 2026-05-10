import { describe, expect, test } from "vitest";

import { buildOpenApiDocument } from "../src/api/openapi-service.js";

describe("openapi service", () => {
  test("builds an OpenAPI 3.1 document", () => {
    const document = buildOpenApiDocument();

    expect(document.openapi).toBe("3.1.0");
    expect(document.info.title).toBe("FinanceOps Agent API");
    expect(document.servers[0]?.url).toBe("http://localhost:3001");
  });

  test("documents protected action routes", () => {
    const document = buildOpenApiDocument();

    expect(document.paths["/run-financeops-agent"]?.post).toBeDefined();
    expect(document.paths["/payments/{paymentRecommendationId}/approve-and-send"]?.post).toBeDefined();
    expect(document.components.securitySchemes.demoApiKey).toBeDefined();
  });

  test("documents read-only visibility routes", () => {
    const document = buildOpenApiDocument();

    expect(document.paths["/health"]?.get).toBeDefined();
    expect(document.paths["/system-summary"]?.get).toBeDefined();
    expect(document.paths["/audit/visibility"]?.get).toBeDefined();
    expect(document.paths["/api/inventory"]?.get).toBeDefined();
    expect(document.paths["/accounting/tasks"]?.get).toBeDefined();
    expect(document.paths["/accounting/tasks/{templateId}"]?.get).toBeDefined();
    expect(document.paths["/accounting/tasks/{templateId}/control-decision"]?.get).toBeDefined();
    expect(document.paths["/accounting/workflows/demo-routes"]?.get).toBeDefined();
    expect(document.paths["/accounting/workflows/route"]?.post).toBeDefined();
  });

  test("documents client workflow intake routes", () => {
    const document = buildOpenApiDocument();

    const mockWorkflowRoute = document.paths["/client-requirements/mock-client/workflow-intake-plan"]?.get as
      | { summary?: string; tags?: string[] }
      | undefined;
    const customWorkflowRoute = document.paths["/client-requirements/workflow-intake-plan"]?.post as
      | { summary?: string; tags?: string[] }
      | undefined;

    expect(mockWorkflowRoute).toBeDefined();
    expect(customWorkflowRoute).toBeDefined();
    expect(mockWorkflowRoute?.summary).toBe("Client workflow intake planning endpoint");
    expect(customWorkflowRoute?.summary).toBe("Client workflow intake planning endpoint");
    expect(mockWorkflowRoute?.tags).toContain("client_requirements");
    expect(customWorkflowRoute?.tags).toContain("client_requirements");
  });

  test("declares every operation tag in the OpenAPI tag list", () => {
    const document = buildOpenApiDocument();
    const declaredTags = new Set(document.tags.map((tag) => tag.name));

    for (const methods of Object.values(document.paths)) {
      for (const operation of Object.values(methods)) {
        const tags = (operation as { tags?: string[] }).tags ?? [];

        for (const tag of tags) {
          expect(declaredTags.has(tag)).toBe(true);
        }
      }
    }
  });

  test("includes standard error schema", () => {
    const document = buildOpenApiDocument();

    expect(document.components.schemas.StandardError).toBeDefined();
  });
});
