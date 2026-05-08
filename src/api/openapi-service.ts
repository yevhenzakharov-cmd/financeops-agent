import { buildApiInventoryPackage } from "./api-inventory-service.js";

export interface OpenApiDocument {
  openapi: "3.1.0";
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  security: Array<Record<string, string[]>>;
  components: {
    securitySchemes: Record<string, unknown>;
    schemas: Record<string, unknown>;
  };
  paths: Record<string, Record<string, unknown>>;
  tags: Array<{
    name: string;
    description: string;
  }>;
}

function toOpenApiPath(path: string): string {
  return path.replace(":paymentRecommendationId", "{paymentRecommendationId}");
}

function routeSummary(path: string): string {
  if (path === "/run-financeops-agent") return "Run FinanceOps agent pipeline";
  if (path.includes("approve-and-send")) return "Approve and simulate payment execution";
  if (path.includes("audit")) return "Audit visibility endpoint";
  if (path.includes("security")) return "Demo auth status endpoint";
  if (path.includes("api")) return "API inventory endpoint";
  if (path.includes("client")) return "Client and reviewer package endpoint";
  if (path.includes("artifact")) return "Artifact visibility endpoint";
  return "FinanceOps Agent endpoint";
}

function buildRouteOperation(route: ReturnType<typeof buildApiInventoryPackage>["routes"][number]): Record<string, unknown> {
  const requiresDemoKey = route.accessLevel === "demo_api_key_required";

  return {
    tags: [route.group],
    summary: routeSummary(route.path),
    description: route.purpose,
    security: requiresDemoKey ? [{ demoApiKey: [] }] : [],
    responses: {
      "200": {
        description: "Successful response"
      },
      "401": {
        description: "Missing demo API key"
      },
      "403": {
        description: "Invalid demo API key"
      },
      "404": {
        description: "Route not found"
      },
      "500": {
        description: "Internal server error"
      }
    }
  };
}

export function buildOpenApiDocument(): OpenApiDocument {
  const inventory = buildApiInventoryPackage();

  const paths = inventory.routes.reduce<OpenApiDocument["paths"]>((acc, route) => {
    if (route.path.endsWith("/*")) {
      return acc;
    }

    const path = toOpenApiPath(route.path);
    const method = route.method.toLowerCase();

    acc[path] = {
      ...(acc[path] ?? {}),
      [method]: buildRouteOperation(route)
    };

    return acc;
  }, {});

  return {
    openapi: "3.1.0",
    info: {
      title: "FinanceOps Agent API",
      version: inventory.version,
      description:
        "Machine-readable API contract for the FinanceOps Agent portfolio demo. The spec documents demo-safe route groups, protected action routes, audit visibility, artifact visibility, and client package endpoints."
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Local development server"
      }
    ],
    security: [],
    components: {
      securitySchemes: {
        demoApiKey: {
          type: "apiKey",
          in: "header",
          name: inventory.authBoundary.protectedHeader,
          description:
            "Demo-only API key for action-like routes. Production implementations should use client-owned authentication and authorization."
        }
      },
      schemas: {
        StandardError: {
          type: "object",
          required: ["status", "error"],
          properties: {
            status: {
              type: "string",
              enum: ["error"]
            },
            error: {
              type: "object",
              required: ["code", "message", "method", "path", "timestamp"],
              properties: {
                code: { type: "string" },
                message: { type: "string" },
                method: { type: "string" },
                path: { type: "string" },
                timestamp: { type: "string" }
              }
            }
          }
        }
      }
    },
    paths,
    tags: [
      {
        name: "core",
        description: "Core health and system overview endpoints."
      },
      {
        name: "protected_action",
        description: "Action-like routes protected by demo API key."
      },
      {
        name: "audit",
        description: "Audit visibility and traceability endpoints."
      },
      {
        name: "security",
        description: "Demo security boundary endpoints."
      },
      {
        name: "client",
        description: "Client readiness, validation, commercial, and reviewer package endpoints."
      }
    ]
  };
}
