export interface ClientProductionDemoStep {
  id: string;
  title: string;
  goal: string;
  endpointEvidence: string[];
  talkTrack: string;
}

export interface ClientProductionDemoScript {
  title: string;
  summary: string;
  steps: ClientProductionDemoStep[];
}

export function buildClientProductionDemoScript(): ClientProductionDemoScript {
  return {
    title: "Client Production Handoff Demo Script",
    summary:
      "Demo script for explaining why the current implementation is production-aware but still gated by client-owned data and approvals.",
    steps: [
      {
        id: "prod-demo-prerequisites",
        title: "Show production prerequisites",
        goal: "Explain what must be provided before production implementation.",
        endpointEvidence: ["/client/production-prerequisites"],
        talkTrack:
          "This view shows which prerequisites are ready, which require client action, and which block production scope."
      },
      {
        id: "prod-demo-risk",
        title: "Show production handoff risks",
        goal: "Explain open risks and mitigations.",
        endpointEvidence: ["/client/production-risk-report"],
        talkTrack:
          "This risk report separates open high-risk items from mitigated items so the production decision is not ambiguous."
      },
      {
        id: "prod-demo-pilot-to-production",
        title: "Connect pilot plan to production decision",
        goal: "Show how pilot scope informs production readiness.",
        endpointEvidence: ["/client/pilot-plan", "/client/production-handoff-plan"],
        talkTrack:
          "The system can run a limited demo or pilot with safe workflows, but production remains blocked where required data is missing."
      },
      {
        id: "prod-demo-governance",
        title: "Confirm governance boundaries",
        goal: "Show that finance actions remain approval-gated.",
        endpointEvidence: ["/client/governance-brief", "/artifacts/manifest"],
        talkTrack:
          "The agent can prepare recommendations and artifacts, but money movement and accounting postings remain human-approved."
      }
    ]
  };
}
