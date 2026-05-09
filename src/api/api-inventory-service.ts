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
      path: "/client/risk-acceptance-package",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose a risk acceptance package that classifies demo, pilot, client-input-required, and production-blocked risks across data, security, payments, accounting, AI governance, auditability, deployment, compliance, procurement, and operations.",
      riskNotes: [
        "Read-only risk acceptance endpoint.",
        "Draft risk review support only.",
        "Does not approve production use, autonomous money movement, accounting write-back, compliance certification, or deployment."
      ]
    },
    {
      method: "GET",
      path: "/client/risk-acceptance-package/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact risk acceptance counts for demo-accepted, pilot-accepted-with-controls, client-input-required, and production-blocked risks.",
      riskNotes: ["Read-only risk acceptance summary endpoint."]
    },
    {
      method: "GET",
      path: "/client/risk-acceptance-package/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate risk acceptance coverage across data, security, payments, accounting, AI governance, auditability, deployment, compliance, procurement, and operations categories.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not approve production risk acceptance."
      ]
    },
    {
      method: "GET",
      path: "/client/compliance-review-package",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose a compliance review package covering data privacy, finance controls, AI governance, auditability, payment controls, accounting controls, access controls, retention, vendor review, and production approval.",
      riskNotes: [
        "Read-only compliance review endpoint.",
        "Draft compliance review support only.",
        "Does not approve production compliance, autonomous money movement, accounting write-back, or deployment."
      ]
    },
    {
      method: "GET",
      path: "/client/compliance-review-package/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact compliance readiness counts for sections, blocked client-owned controls, required client inputs, and production claims still blocked.",
      riskNotes: ["Read-only compliance review summary endpoint."]
    },
    {
      method: "GET",
      path: "/client/compliance-review-package/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate compliance package coverage across data privacy, finance controls, AI governance, auditability, payments, accounting, access, retention, vendor review, and production approval.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not approve production compliance."
      ]
    },
    {
      method: "GET",
      path: "/client/security-questionnaire-package",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose a security questionnaire package covering data handling, auth, authorization, secrets, audit logging, monitoring, AI boundaries, payment boundaries, deployment, and incident response.",
      riskNotes: [
        "Read-only security questionnaire endpoint.",
        "Draft security review support only.",
        "Does not approve production security, deployment, or autonomous money movement."
      ]
    },
    {
      method: "GET",
      path: "/client/security-questionnaire-package/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact security questionnaire counts for demo answers, client-required inputs, blocked client-owned controls, reviewer notes, and blocked production claims.",
      riskNotes: ["Read-only security questionnaire summary endpoint."]
    },
    {
      method: "GET",
      path: "/client/security-questionnaire-package/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate security questionnaire coverage across data handling, auth, authorization, secrets, audit, monitoring, AI, payment, deployment, and incident response categories.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not approve production security."
      ]
    },
    {
      method: "GET",
      path: "/client/procurement-review-package",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose an enterprise procurement review package covering vendor intake, security, legal, data, finance terms, procurement workflow, pilot boundary, and decision ownership.",
      riskNotes: [
        "Read-only procurement review endpoint.",
        "Draft procurement package only.",
        "Does not approve production use, autonomous money movement, or legal terms."
      ]
    },
    {
      method: "GET",
      path: "/client/procurement-review-package/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact procurement readiness counts for sections, vendor checklist, security/legal questions, and blocked production claims.",
      riskNotes: ["Read-only procurement review summary endpoint."]
    },
    {
      method: "GET",
      path: "/client/procurement-review-package/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate procurement package coverage across vendor intake, security, legal, data, finance, workflow, pilot boundary, and decision owner categories.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not approve production use or create a legal agreement."
      ]
    },
    {
      method: "GET",
      path: "/client/pilot-proposal-package",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose a buyer-facing pilot proposal package connecting business problem, pilot offer, value hypothesis, delivery plan, commercial terms, risk boundaries, and decision process.",
      riskNotes: [
        "Read-only pilot proposal endpoint.",
        "Draft buyer-facing package only.",
        "Does not claim ROI, production readiness, or autonomous money movement."
      ]
    },
    {
      method: "GET",
      path: "/client/pilot-proposal-package/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact proposal counts for sections, decision inputs, exclusions, and blocked client-owned controls.",
      riskNotes: ["Read-only pilot proposal summary endpoint."]
    },
    {
      method: "GET",
      path: "/client/pilot-proposal-package/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate proposal coverage across buyer problem, offer, value hypothesis, delivery plan, commercial terms, risk boundaries, decision process, and next steps.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not approve production use or create a legal agreement."
      ]
    },
    {
      method: "GET",
      path: "/client/pilot-sow-package",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose a statement-of-work style pilot package with scope, deliverables, responsibilities, exclusions, acceptance criteria, and production boundaries.",
      riskNotes: [
        "Read-only pilot SOW endpoint.",
        "Draft package only; does not create legal terms.",
        "Keeps production claims and autonomous money movement blocked."
      ]
    },
    {
      method: "GET",
      path: "/client/pilot-sow-package/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact pilot SOW counts for draft sections, required client input, exclusions, acceptance criteria, and blocked production claims.",
      riskNotes: ["Read-only pilot SOW summary endpoint."]
    },
    {
      method: "GET",
      path: "/client/pilot-sow-package/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate pilot SOW coverage across scope, deliverables, responsibilities, acceptance criteria, exclusions, risk boundaries, and commercial terms.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not approve production use or create a legal agreement."
      ]
    },
    {
      method: "GET",
      path: "/client/pilot-kickoff-package",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose a pilot kickoff package with scope, data, access, approval, evidence, runtime, success metrics, and next-step sections.",
      riskNotes: [
        "Read-only pilot kickoff endpoint.",
        "Keeps production boundaries visible.",
        "Does not authorize production deployment or autonomous money movement."
      ]
    },
    {
      method: "GET",
      path: "/client/pilot-kickoff-package/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact pilot kickoff readiness counts, prework items, agenda items, success criteria, and blocked production boundaries.",
      riskNotes: ["Read-only pilot kickoff summary endpoint."]
    },
    {
      method: "GET",
      path: "/client/pilot-kickoff-package/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate pilot kickoff coverage across scope, data, access, approval policy, evidence, runtime, success metrics, and next steps.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not approve production use."
      ]
    },
    {
      method: "GET",
      path: "/client/pilot-decision-packet",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose a buyer-facing pilot decision packet with gates for scope, data, security, finance controls, evidence, deployment, and commercial readiness.",
      riskNotes: [
        "Read-only pilot decision endpoint.",
        "Frames pilot readiness without claiming production authorization.",
        "Production claims remain blocked until client-owned controls exist."
      ]
    },
    {
      method: "GET",
      path: "/client/pilot-decision-packet/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact pilot gate counts, readiness score, client answers needed, and blocked production claims.",
      riskNotes: ["Read-only pilot decision summary endpoint."]
    },
    {
      method: "GET",
      path: "/client/pilot-decision-packet/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate pilot decision gate coverage across scope, data, security, finance controls, evidence, deployment, and commercial readiness.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not approve production use."
      ]
    },
    {
      method: "GET",
      path: "/client/evidence-binder",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose reviewer-facing evidence across architecture, controls, auditability, finance logic, delivery, and production-readiness boundaries.",
      riskNotes: [
        "Read-only evidence binder endpoint.",
        "Packages demo evidence without claiming production authorization.",
        "Production evidence remains client-owned."
      ]
    },
    {
      method: "GET",
      path: "/client/evidence-binder/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact evidence counts by demo-ready, client-review-required, and production-blocked status.",
      riskNotes: ["Read-only evidence binder summary endpoint."]
    },
    {
      method: "GET",
      path: "/client/evidence-binder/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate evidence coverage across architecture, controls, audit, security, finance, delivery, and production boundary categories.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not certify enterprise production readiness."
      ]
    },
    {
      method: "GET",
      path: "/client/control-matrix",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose enterprise control matrix mapping finance risks to demo evidence, owners, production requirements, and reviewer questions.",
      riskNotes: [
        "Read-only control matrix endpoint.",
        "Production controls are visible but not claimed as configured.",
        "Sensitive controls remain client-owned."
      ]
    },
    {
      method: "GET",
      path: "/client/control-matrix/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact control counts by demo-ready, client-configuration-required, and client-owned-blocked status.",
      riskNotes: ["Read-only control matrix summary endpoint."]
    },
    {
      method: "GET",
      path: "/client/control-matrix/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate coverage across data, auth, secrets, payments, accounting, audit, monitoring, and AI-boundary controls.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not certify production readiness."
      ]
    },
    {
      method: "GET",
      path: "/client/due-diligence-pack",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose enterprise due diligence questions, demo evidence, production requirements, and blocked claims for client-facing review.",
      riskNotes: [
        "Read-only due diligence endpoint.",
        "Designed to support enterprise review without claiming production readiness.",
        "Does not expose private client records or secrets."
      ]
    },
    {
      method: "GET",
      path: "/client/due-diligence-pack/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact due diligence item counts, blocked items, required answers, and production claim boundaries.",
      riskNotes: ["Read-only due diligence summary endpoint."]
    },
    {
      method: "GET",
      path: "/client/due-diligence-pack/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate due diligence coverage across data, security, controls, finance, audit, and deployment review areas.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not certify enterprise production readiness."
      ]
    },
    {
      method: "GET",
      path: "/client/enterprise-red-team",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose a red-team report for enterprise buyer claims, risky assumptions, safe replacement wording, and production blockers.",
      riskNotes: [
        "Read-only enterprise red-team endpoint.",
        "Designed to prevent overclaiming production readiness.",
        "Does not validate real enterprise compliance certification."
      ]
    },
    {
      method: "GET",
      path: "/client/enterprise-red-team/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact enterprise red-team finding counts by severity and claim boundary.",
      riskNotes: ["Read-only enterprise red-team summary endpoint."]
    },
    {
      method: "GET",
      path: "/client/enterprise-red-team/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate that enterprise red-team findings block production-ready, autonomous money movement, secret handling, and client data overclaims.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not validate real enterprise production readiness."
      ]
    },
    {
      method: "GET",
      path: "/client/enterprise-sales-brief",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose an enterprise buyer-facing sales brief that turns implementation evidence into honest positioning, buyer signals, demo talk track, objections, and production boundaries.",
      riskNotes: [
        "Read-only enterprise sales brief endpoint.",
        "Does not claim production readiness.",
        "Blocks production claims until client-owned controls and approvals exist."
      ]
    },
    {
      method: "GET",
      path: "/client/enterprise-sales-brief/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact enterprise sales brief counts for buyer signals, objections, demo steps, and production proof requirements.",
      riskNotes: ["Read-only enterprise sales brief summary endpoint."]
    },
    {
      method: "GET",
      path: "/client/enterprise-sales-brief/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate that the enterprise sales brief includes buyer signals, honest production boundary, deterministic finance signal, and client proof requirements.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not validate real enterprise production readiness."
      ]
    },
    {
      method: "GET",
      path: "/client/delivery-package",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose a buyer and reviewer-facing delivery package for the reusable client-specific FinanceOps implementation layers.",
      riskNotes: [
        "Read-only delivery package endpoint.",
        "Uses demo-safe metadata only.",
        "Blocks unsupported production-readiness claims until client-owned controls exist."
      ]
    },
    {
      method: "GET",
      path: "/client/delivery-package/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact delivery package artifact counts, buyer proof points, and blocked production claims.",
      riskNotes: ["Read-only delivery package summary endpoint."]
    },
    {
      method: "GET",
      path: "/client/delivery-package/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate that delivery package artifacts and production-claim boundaries are present.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not validate real enterprise production readiness."
      ]
    },
    {
      method: "GET",
      path: "/client/acceptance-gate",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose a client acceptance gate that separates demo-ready evidence from pilot acceptance and production blockers.",
      riskNotes: [
        "Read-only acceptance gate endpoint.",
        "Uses demo-safe planning metadata only.",
        "Production remains blocked until client-owned controls and approvals exist."
      ]
    },
    {
      method: "GET",
      path: "/client/acceptance-gate/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact acceptance gate counts by pass, warning, blocked, and production blocker status.",
      riskNotes: ["Read-only acceptance gate summary endpoint."]
    },
    {
      method: "GET",
      path: "/client/acceptance-gate/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate that acceptance gates keep production deployment and sensitive actions blocked until client-owned controls exist.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not validate real client production authorization."
      ]
    },
    {
      method: "GET",
      path: "/client/deployment-profile",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose demo, pilot, and production deployment boundaries for client-owned enterprise implementations.",
      riskNotes: [
        "Read-only deployment profile endpoint.",
        "Does not expose secrets.",
        "Production deployment requires client-owned auth, credentials, monitoring, and approval policy."
      ]
    },
    {
      method: "GET",
      path: "/client/deployment-profile/summary",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Expose compact deployment control counts and blocked enterprise readiness items.",
      riskNotes: ["Read-only deployment profile summary endpoint."]
    },
    {
      method: "GET",
      path: "/client/deployment-profile/validation",
      group: "client",
      accessLevel: "public_demo",
      purpose: "Validate that deployment profile includes environment, secrets, auth, data, monitoring, approval, and audit controls.",
      riskNotes: [
        "Read-only validation endpoint.",
        "Does not validate production infrastructure or client credentials."
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
