export interface ClientObjectionResponse {
  id: string;
  objection: string;
  response: string;
  proofPoint: string[];
}

export interface ClientObjectionHandlingGuide {
  title: string;
  summary: string;
  responses: ClientObjectionResponse[];
}

export function buildClientObjectionHandlingGuide(): ClientObjectionHandlingGuide {
  return {
    title: "Client Objection Handling Guide",
    summary:
      "Sales and discovery guide for answering common objections without overstating production readiness.",
    responses: [
      {
        id: "objection-ai-hallucination",
        objection: "How do we know the AI is not inventing finance numbers?",
        response:
          "The system separates deterministic finance calculations from AI explanation. AI explains verified outputs instead of creating the financial truth.",
        proofPoint: [
          "/client/governance-brief",
          "/client/go-live-risk-report",
          "/artifacts/manifest"
        ]
      },
      {
        id: "objection-payment-risk",
        objection: "Can the agent accidentally send money?",
        response:
          "No. Payment execution is excluded and payment preparation remains blocked until vendor payment data and approval policy are provided.",
        proofPoint: [
          "/client/go-live-checklist",
          "/client/production-handoff-package",
          "/client/go-live-decision"
        ]
      },
      {
        id: "objection-production-secrets",
        objection: "Do we need to share bank or ERP credentials with the builder?",
        response:
          "No. The production handoff explicitly keeps credentials in a client-owned environment.",
        proofPoint: [
          "/client/production-prerequisites",
          "/client/go-live-checklist"
        ]
      },
      {
        id: "objection-demo-vs-production",
        objection: "Is this already production-ready?",
        response:
          "The project is production-aware, but the current state is a controlled demo or limited pilot until client-owned data, mappings, and exclusions are accepted.",
        proofPoint: [
          "/client/production-handoff-plan",
          "/client/go-live-package"
        ]
      }
    ]
  };
}
