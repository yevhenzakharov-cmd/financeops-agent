import { buildClientAdapterRegistry } from "./client-adapter-registry.js";
import { buildClientRepoStarterPackage } from "./client-repo-starter.js";
import { buildClientWorkOrder } from "./client-work-order.js";

export type ClientImplementationRoadmapStatus =
  | "ready_for_discovery"
  | "blocked_waiting_for_client_data"
  | "ready_for_build";

export type ClientImplementationRoadmapPhaseStatus =
  | "available_now"
  | "client_input_required"
  | "blocked_until_client_owned";

export interface ClientImplementationRoadmapPhase {
  id: string;
  title: string;
  status: ClientImplementationRoadmapPhaseStatus;
  owner: "builder" | "client" | "shared";
  objective: string;
  deliverables: string[];
  exitCriteria: string[];
  blockedBy: string[];
}

export interface ClientImplementationRoadmap {
  roadmapVersion: "client-implementation-roadmap-v1";
  status: ClientImplementationRoadmapStatus;
  clientContext: {
    clientId: string;
    clientName: string;
    requestedOutcome: string;
  };
  phases: ClientImplementationRoadmapPhase[];
  criticalPath: string[];
  nonNegotiableControls: string[];
}

export interface ClientImplementationRoadmapValidation {
  valid: boolean;
  status: "pass" | "blocked";
  errors: string[];
  warnings: string[];
}

export function buildClientImplementationRoadmap(): ClientImplementationRoadmap {
  const workOrder = buildClientWorkOrder();
  const repoStarter = buildClientRepoStarterPackage();
  const adapterRegistry = buildClientAdapterRegistry();

  const phases: ClientImplementationRoadmapPhase[] = [
    {
      id: "phase-discovery",
      title: "Client discovery and work-order confirmation",
      status: "available_now",
      owner: "shared",
      objective: "Confirm the exact finance workflow, manual process, desired outcome, and approval expectations.",
      deliverables: [
        "Confirmed client work order",
        "Accepted initial scope",
        "List of required input samples",
        "List of desired outputs"
      ],
      exitCriteria: [
        "Requested outcome is written clearly.",
        "Manual process is documented.",
        "Client confirms desired output audience and format."
      ],
      blockedBy: []
    },
    {
      id: "phase-safe-sample-data",
      title: "Safe sample data and field mapping",
      status: "client_input_required",
      owner: "shared",
      objective: "Collect safe representative data and map source fields into normalized FinanceOps contracts.",
      deliverables: [
        "Safe invoice sample",
        "Safe bank transaction sample",
        "Field mapping notes",
        "Adapter configuration decisions"
      ],
      exitCriteria: [
        "Representative samples are available.",
        "Stable identifiers are confirmed.",
        "Required field mappings are accepted."
      ],
      blockedBy: adapterRegistry.mappingRequiredAdapters
    },
    {
      id: "phase-client-shaped-demo",
      title: "Client-shaped demo implementation",
      status: "available_now",
      owner: "builder",
      objective: "Replace generic mock data with client-shaped safe data and run the deterministic FinanceOps pipeline.",
      deliverables: [
        "Client-shaped mock fixtures",
        "Configured input adapter",
        "CFO briefing output",
        "Exception queue output",
        "Audit evidence"
      ],
      exitCriteria: [
        "Pipeline runs with client-shaped data.",
        "Outputs are traceable to deterministic results.",
        "Blocked workflows explain missing client-owned configuration."
      ],
      blockedBy: []
    },
    {
      id: "phase-output-acceptance",
      title: "Output acceptance and workflow tuning",
      status: "client_input_required",
      owner: "shared",
      objective: "Tune outputs to the exact shape the client accepts for review, reporting, dashboarding, or export.",
      deliverables: [
        "Accepted CFO briefing format",
        "Accepted exception queue format",
        "Accepted export or API payload shape",
        "Updated acceptance criteria"
      ],
      exitCriteria: [
        "Client accepts output shape.",
        "Client confirms reviewer roles.",
        "Client confirms delivery destination."
      ],
      blockedBy: ["Accepted output format", "Reviewer roles", "Delivery destination"]
    },
    {
      id: "phase-production-boundary",
      title: "Client-owned production boundary",
      status: "blocked_until_client_owned",
      owner: "client",
      objective: "Move from public demo planning into client-owned production setup without exposing private data or credentials.",
      deliverables: [
        "Client-owned deployment target",
        "Client-owned credentials strategy",
        "Approval identity rules",
        "Monitoring and audit access rules"
      ],
      exitCriteria: [
        "Production credentials stay outside the public repo.",
        "Sensitive actions remain approval-gated.",
        "Client owns deployment, monitoring, and access."
      ],
      blockedBy: [
        ...repoStarter.blockedUntilClientProvides,
        ...adapterRegistry.missingClientOwnedAdapters
      ]
    }
  ];

  const hasBlockedPhase = phases.some((phase) => phase.status === "blocked_until_client_owned");
  const hasClientInputPhase = phases.some((phase) => phase.status === "client_input_required");

  const status: ClientImplementationRoadmapStatus = hasBlockedPhase
    ? "blocked_waiting_for_client_data"
    : hasClientInputPhase
      ? "ready_for_discovery"
      : "ready_for_build";

  return {
    roadmapVersion: "client-implementation-roadmap-v1",
    status,
    clientContext: {
      clientId: workOrder.request.clientId,
      clientName: workOrder.request.clientName,
      requestedOutcome: workOrder.request.requestedOutcome
    },
    phases,
    criticalPath: [
      "Confirm work order",
      "Collect safe sample data",
      "Map source fields",
      "Configure client-shaped demo",
      "Accept output format",
      "Define client-owned production boundary"
    ],
    nonNegotiableControls: [
      "No production credentials in the public repo.",
      "No private client financial records in the public repo.",
      "Money movement stays human-approved.",
      "Accounting postings stay human-approved.",
      "AI explanations stay grounded in deterministic finance outputs.",
      "Audit evidence stays visible for reviewer trust."
    ]
  };
}

export function summarizeClientImplementationRoadmap(
  roadmap: ClientImplementationRoadmap = buildClientImplementationRoadmap()
) {
  return {
    roadmapVersion: roadmap.roadmapVersion,
    status: roadmap.status,
    clientName: roadmap.clientContext.clientName,
    phaseCount: roadmap.phases.length,
    availableNowPhases: roadmap.phases.filter((phase) => phase.status === "available_now").length,
    clientInputRequiredPhases: roadmap.phases.filter(
      (phase) => phase.status === "client_input_required"
    ).length,
    blockedUntilClientOwnedPhases: roadmap.phases.filter(
      (phase) => phase.status === "blocked_until_client_owned"
    ).length,
    criticalPathStepCount: roadmap.criticalPath.length,
    controlCount: roadmap.nonNegotiableControls.length
  };
}

export function validateClientImplementationRoadmap(
  roadmap: ClientImplementationRoadmap = buildClientImplementationRoadmap()
): ClientImplementationRoadmapValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (roadmap.phases.length === 0) {
    errors.push("Roadmap must include at least one implementation phase.");
  }

  if (roadmap.criticalPath.length === 0) {
    errors.push("Roadmap must include a critical path.");
  }

  if (roadmap.nonNegotiableControls.length === 0) {
    errors.push("Roadmap must include non-negotiable controls.");
  }

  const hasDiscovery = roadmap.phases.some((phase) => phase.id === "phase-discovery");
  const hasSafeData = roadmap.phases.some((phase) => phase.id === "phase-safe-sample-data");
  const hasProductionBoundary = roadmap.phases.some(
    (phase) => phase.id === "phase-production-boundary"
  );

  if (!hasDiscovery) {
    errors.push("Roadmap must include discovery phase.");
  }

  if (!hasSafeData) {
    errors.push("Roadmap must include safe sample data phase.");
  }

  if (!hasProductionBoundary) {
    errors.push("Roadmap must include client-owned production boundary phase.");
  }

  const hasCredentialControl = roadmap.nonNegotiableControls.some((control) =>
    control.toLowerCase().includes("credentials")
  );

  const hasHumanApprovalControl = roadmap.nonNegotiableControls.some((control) =>
    control.toLowerCase().includes("human-approved")
  );

  if (!hasCredentialControl) {
    errors.push("Roadmap controls must explicitly block public-repo production credentials.");
  }

  if (!hasHumanApprovalControl) {
    errors.push("Roadmap controls must explicitly require human approval for sensitive actions.");
  }

  if (roadmap.status === "ready_for_build") {
    warnings.push("Roadmap is marked ready for build. Confirm client-owned data and approvals exist.");
  }

  return {
    valid: errors.length === 0,
    status: errors.length === 0 ? "pass" : "blocked",
    errors,
    warnings
  };
}
