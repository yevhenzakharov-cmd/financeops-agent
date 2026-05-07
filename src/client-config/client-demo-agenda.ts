export type ClientDemoAgendaItem = {
  id: string;
  title: string;
  goal: string;
  evidenceToShow: string[];
  talkTrack: string;
};

export type ClientDemoAgenda = {
  title: string;
  summary: string;
  items: ClientDemoAgendaItem[];
};

export function getClientDemoAgenda(): ClientDemoAgenda {
  return {
    title: "Client Sales Demo Agenda",
    summary:
      "Buyer-facing demo agenda for presenting the FinanceOps Agent as a production-aware, approval-gated finance operations system.",
    items: [
      {
        id: "demo-commercial-summary",
        title: "Open with the commercial summary",
        goal: "Explain the one-line value proposition and safe claims.",
        evidenceToShow: ["/client/commercial-summary"],
        talkTrack:
          "Start with the clear buyer-facing pitch and immediately explain that the current version is a controlled demo, not a production deployment."
      },
      {
        id: "demo-workflow-value",
        title: "Show the workflow value",
        goal: "Connect buyer pain to exception queues, CFO briefings, and audit artifacts.",
        evidenceToShow: ["/client/buyer-brief", "/artifacts/manifest"],
        talkTrack:
          "Show how finance exceptions become structured outputs that a controller or CFO can review faster."
      },
      {
        id: "demo-governance",
        title: "Show governance and safety",
        goal: "Prove that sensitive actions are blocked or approval-gated.",
        evidenceToShow: ["/client/governance-brief", "/client/go-live-risk-report"],
        talkTrack:
          "Explain that AI does not create the financial truth. It explains verified deterministic outputs, while payments and postings stay human-approved."
      },
      {
        id: "demo-commercial-readiness",
        title: "Show commercial readiness honestly",
        goal: "Explain what is strong and what still blocks production claims.",
        evidenceToShow: ["/client/commercial-readiness-score", "/client/go-live-package"],
        talkTrack:
          "Use the readiness score to show credibility. The demo is strong, but production requires client data, mapping confirmation, and accepted exclusions."
      }
    ]
  };
}
