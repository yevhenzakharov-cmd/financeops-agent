export interface ClientDemoScriptStep {
  id: string;
  title: string;
  speaker: "builder" | "client";
  script: string;
  evidenceToShow: string[];
}

export interface ClientDemoScript {
  title: string;
  purpose: string;
  steps: ClientDemoScriptStep[];
}

export function buildClientDemoScript(): ClientDemoScript {
  return {
    title: "Client Demo Script",
    purpose:
      "Structured demo narrative for showing how the FinanceOps Agent moves from client inputs to governed outputs.",
    steps: [
      {
        id: "demo-context",
        title: "Confirm client workflow",
        speaker: "builder",
        script:
          "We start by confirming the exact finance workflow: overdue invoices, reconciliation exceptions, margin risk, and payment approval preparation.",
        evidenceToShow: [
          "/client/onboarding-questionnaire",
          "/client/implementation-readiness"
        ]
      },
      {
        id: "demo-readiness",
        title: "Show readiness blockers",
        speaker: "builder",
        script:
          "The readiness report shows what is available, what is missing, and what still needs mapping before production build.",
        evidenceToShow: [
          "/client/field-coverage",
          "/client/data-request-packet"
        ]
      },
      {
        id: "demo-build-package",
        title: "Show build package",
        speaker: "builder",
        script:
          "The build package turns readiness into adapter planning, output delivery, deployment checklist, and builder next actions.",
        evidenceToShow: [
          "/client/adapter-blueprint",
          "/client/output-delivery-plan",
          "/client/build-package"
        ]
      },
      {
        id: "demo-governance",
        title: "Confirm governance",
        speaker: "client",
        script:
          "Client confirms which actions are suggest-only, which require approval, and which are blocked.",
        evidenceToShow: [
          "/client/governance-brief",
          "/artifacts/manifest"
        ]
      }
    ]
  };
}
