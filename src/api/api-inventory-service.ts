export type ApiInventoryRouteGroup =
  | "core"
  | "protected_action"
  | "audit"
  | "observability"
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
    observability: 0,
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
      method: "GET",
      path: "/api/inventory",
      group: "core",
      accessLevel: "public_demo",
      purpose: "Expose grouped API inventory, auth boundary, error model, and reviewer notes.",
      riskNotes: ["Read-only API documentation endpoint."]
    },
    {
      method: "GET",
      path: "/api/routes",
      group: "core",
      accessLevel: "public_demo",
      purpose: "Expose route inventory entries as a compact list.",
      riskNotes: ["Read-only API route inventory endpoint."]
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
      path: "/security/http-hardening",
      group: "security",
      accessLevel: "public_demo",
      purpose: "Expose demo-safe HTTP security header and rate-limit configuration for reviewers.",
      riskNotes: [
        "Read-only security visibility endpoint.",
        "Does not expose secret values.",
        "Production implementations should tune rate limits and security controls in a client-owned environment."
      ]
    },
    {
      method: "GET",
      path: "/observability/request-summary",
      group: "observability",
      accessLevel: "public_demo",
      purpose: "Expose demo-safe request counts, status counts, method counts, durations, and recent request metadata.",
      riskNotes: [
        "Read-only observability endpoint.",
        "Does not store request bodies, API keys, payment payloads, or client-owned secrets.",
        "Production implementation should use client-owned logging and monitoring."
      ]
    },
    {
      method: "GET",
      path: "/observability/recent-requests",
      group: "observability",
      accessLevel: "public_demo",
      purpose: "Expose recent demo request metadata with request IDs for reviewer traceability.",
      riskNotes: [
        "Read-only observability endpoint.",
        "Recent request storage is in-memory and demo-scoped.",
        "Production implementation should use client-owned log retention policy."
      ]
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
      path: "/client/implementation-roadmap",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose a phased roadmap for turning a client work order, adapter registry, and repo starter package into a client-specific implementation.",
      riskNotes: [
        "Read-only roadmap endpoint.",
        "Uses demo-safe planning metadata only.",
        "Production rollout remains blocked until client-owned inputs, credentials, and approval boundaries exist."
      ]
    },
    {
      method: "GET",
      path: "/client/implementation-roadmap/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact roadmap counts by phase status, critical path, and non-negotiable controls.",
      riskNotes: ["Read-only roadmap summary endpoint."]
    },
    {
      method: "GET",
      path: "/client/implementation-roadmap/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate that roadmap phases include discovery, safe sample data, production boundary, credential controls, and human approval controls.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not validate production deployment or client-owned credentials."
      ]
    },
    {
      method: "GET",
      path: "/client/adapter-registry",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose input, output, approval, and audit adapters needed for client-specific FinanceOps implementations.",
      riskNotes: [
        "Read-only adapter registry endpoint.",
        "Uses demo-safe planning metadata only.",
        "Production adapters must be configured in a client-owned environment."
      ]
    },
    {
      method: "GET",
      path: "/client/adapter-registry/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact adapter counts by type and readiness status.",
      riskNotes: ["Read-only summary for implementation planning."]
    },
    {
      method: "GET",
      path: "/client/adapter-registry/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate that required input, output, approval, audit, and payment-boundary adapter rules exist.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not validate production credentials or real client integrations."
      ]
    },
    {
      method: "GET",
      path: "/client/repo-starter",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose a client repository starter package that identifies what to keep, replace, configure, and block when cloning the core for a client.",
      riskNotes: [
        "Read-only client repo starter endpoint.",
        "Designed for implementation planning only.",
        "Does not expose production credentials or client-owned data."
      ]
    },
    {
      method: "GET",
      path: "/client/repo-starter/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact starter package counts for replacement, configuration, blocked, and safety items.",
      riskNotes: ["Read-only summary for reviewers and builders."]
    },
    {
      method: "GET",
      path: "/client/repo-starter/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate that client repo starter boundaries include mock-data replacement, payment blocking, and safety rules.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not validate production infrastructure or client credentials."
      ]
    },
    {
      method: "GET",
      path: "/client/work-order",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose a builder-facing client work order that translates client task, input, output, and approval needs into implementation items.",
      riskNotes: [
        "Read-only client work-order endpoint.",
        "Uses mock client data and demo-safe planning contracts only."
      ]
    },
    {
      method: "GET",
      path: "/client/work-order/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact work-order status, item counts, and blocked/client-action counts.",
      riskNotes: ["Read-only summary for reviewers and implementation planning."]
    },
    {
      method: "GET",
      path: "/client/work-order/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate that the client work order has required task, input, output, and approval planning fields.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not validate production credentials or real client data."
      ]
    },
    {
      method: "GET",
      path: "/client/implementation-manifest",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose the clone-per-client implementation manifest for configuring client-specific inputs, outputs, workflows, and approval boundaries.",
      riskNotes: [
        "Read-only client implementation planning endpoint.",
        "Uses mock data and demo-safe contracts only.",
        "Production implementation must be configured in a client-owned environment."
      ]
    },
    {
      method: "GET",
      path: "/client/implementation-manifest/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact manifest counts, readiness status, and missing client items.",
      riskNotes: ["Read-only summary for reviewers and builders."]
    },
    {
      method: "GET",
      path: "/client/implementation-manifest/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate the implementation manifest boundary before adapting the repo for a client.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not validate production credentials or real client data."
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
      path: "/client-contract/mock-client/*",
      group: "client_contract",
      accessLevel: "public_demo",
      purpose: "Expose mock client client contract and implementation planning views.",
      riskNotes: ["Mock data only."]
    },
    {
      method: "GET",
      path: "/client-requirements/mock-client/*",
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
