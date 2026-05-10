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
  });

  test("includes standard error schema", () => {
    const document = buildOpenApiDocument();

    expect(document.components.schemas.StandardError).toBeDefined();
  });
});
