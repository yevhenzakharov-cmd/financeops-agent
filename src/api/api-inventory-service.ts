export type ApiInventoryRouteGroup =
  | "core"
  | "protected_action"
  | "audit"
  | "security"
  | "artifact"
  | "client"
  | "client_contract"
  | "client_requirements";

export type ApiInventoryAccessLevel =
  | "public_demo"
  | "demo_api_key_required"
  | "client_owned_production_required";

export interface ApiInventoryRoute {
  method: "GET" | "POST";
  path: string;
  group: ApiInventoryRouteGroup;
  accessLevel: ApiInventoryAccessLevel;
  purpose: string;
  riskNotes: string[];
}

export interface ApiInventorySummary {
  totalRoutes: number;
  protectedActionRoutes: number;
  publicDemoRoutes: number;
  groups: Record<ApiInventoryRouteGroup, number>;
}

export interface ApiInventoryPackage {
  title: string;
  generatedAt: string;
  version: "api-inventory-v1";
  status: "ready";
  summary: ApiInventorySummary;
  routes: ApiInventoryRoute[];
  authBoundary: {
    protectedHeader: "x-demo-api-key";
    protectedRoutes: string[];
    note: string;
  };
  errorModel: {
    statusShape: "standard_json_error";
    notFoundCode: "route_not_found";
    internalErrorCode: "internal_server_error";
  };
  reviewerNotes: string[];
}

function countByGroup(routes: ApiInventoryRoute[]): Record<ApiInventoryRouteGroup, number> {
  const groups: Record<ApiInventoryRouteGroup, number> = {
    core: 0,
    protected_action: 0,
    audit: 0,
    security: 0,
    artifact: 0,
    client: 0,
    client_contract: 0,
    client_requirements: 0
  };

  for (const route of routes) {
    groups[route.group] += 1;
  }

  return groups;
}

export function getApiInventoryRoutes(): ApiInventoryRoute[] {
  return [
    {
      method: "GET",
      path: "/health",
      group: "core",
      accessLevel: "public_demo",
      purpose: "Service health and execution mode check.",
      riskNotes: ["Read-only demo endpoint."]
    },
    {
      method: "GET",
      path: "/system-summary",
      group: "core",
      accessLevel: "public_demo",
      purpose: "High-level capability map for reviewers.",
      riskNotes: ["Read-only system summary."]
    },
    {
      method: "POST",
      path: "/run-financeops-agent",
      group: "protected_action",
      accessLevel: "demo_api_key_required",
      purpose: "Run the FinanceOps pipeline and generate artifacts.",
      riskNotes: [
        "Action-like route.",
        "Protected by x-demo-api-key in demo scope.",
        "Production implementation should use client-owned auth and authorization."
      ]
    },
    {
      method: "POST",
      path: "/payments/:paymentRecommendationId/approve-and-send",
      group: "protected_action",
      accessLevel: "demo_api_key_required",
      purpose: "Approve and simulate/send an approved payment recommendation.",
      riskNotes: [
        "Money-movement-like route.",
        "Protected by x-demo-api-key in demo scope.",
        "Production implementation must remain approval-gated and client-owned."
      ]
    },
    {
      method: "GET",
      path: "/security/demo-auth-status",
      group: "security",
      accessLevel: "public_demo",
      purpose: "Explain which demo routes require the API key header.",
      riskNotes: ["Does not reveal secret values."]
    },
    {
      method: "GET",
      path: "/audit/health",
      group: "audit",
      accessLevel: "public_demo",
      purpose: "Check whether the latest audit log is available and readable.",
      riskNotes: ["Read-only audit health."]
    },
    {
      method: "GET",
      path: "/audit/summary",
      group: "audit",
      accessLevel: "public_demo",
      purpose: "Summarize latest audit event counts and phases.",
      riskNotes: ["Returns metadata summaries, not full sensitive payloads."]
    },
    {
      method: "GET",
      path: "/audit/visibility",
      group: "audit",
      accessLevel: "public_demo",
      purpose: "Reviewer-facing audit visibility package.",
      riskNotes: ["Read-only traceability endpoint."]
    },
    {
      method: "GET",
      path: "/artifacts/*",
      group: "artifact",
      accessLevel: "public_demo",
      purpose: "Expose generated artifact registry, metadata, manifests, summaries, and named artifact previews.",
      riskNotes: [
        "Read-only demo artifact endpoints.",
        "Production implementation should role-gate artifact access."
      ]
    },
    {
      method: "GET",
      path: "/client/*",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose client readiness, commercial, validation, security, plugin-contract, and reviewer packages.",
      riskNotes: ["Read-only client/reviewer package endpoints."]
    },
    {
      method: "GET",
      path: "/client-contract/mock-game-studio/*",
      group: "client_contract",
      accessLevel: "public_demo",
      purpose: "Expose mock game studio client contract and implementation planning views.",
      riskNotes: ["Mock data only."]
    },
    {
      method: "GET",
      path: "/client-requirements/mock-game-studio/*",
      group: "client_requirements",
      accessLevel: "public_demo",
      purpose: "Expose mock client requirements intake, validation, plan, and questionnaire views.",
      riskNotes: ["Mock data only."]
    }
  ];
}

export function buildApiInventoryPackage(): ApiInventoryPackage {
  const routes = getApiInventoryRoutes();
  const protectedRoutes = routes
    .filter((route) => route.accessLevel === "demo_api_key_required")
    .map((route) => `${route.method} ${route.path}`);

  return {
    title: "API Inventory Package",
    generatedAt: new Date().toISOString(),
    version: "api-inventory-v1",
    status: "ready",
    summary: {
      totalRoutes: routes.length,
      protectedActionRoutes: protectedRoutes.length,
      publicDemoRoutes: routes.filter((route) => route.accessLevel === "public_demo").length,
      groups: countByGroup(routes)
    },
    routes,
    authBoundary: {
      protectedHeader: "x-demo-api-key",
      protectedRoutes,
      note:
        "Only action-like POST routes require the demo API key. Read-only reviewer and artifact endpoints remain public for portfolio/demo review."
    },
    errorModel: {
      statusShape: "standard_json_error",
      notFoundCode: "route_not_found",
      internalErrorCode: "internal_server_error"
    },
    reviewerNotes: [
      "This inventory intentionally groups wildcard route families to keep the public demo readable.",
      "It documents which endpoints are read-only and which endpoints are action-like.",
      "It reduces API documentation blind spots without a risky route refactor.",
      "Production implementations should generate OpenAPI documentation and enforce client-owned auth."
    ]
  };
}
