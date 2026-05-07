export type ClientBuyerFaqItem = {
  id: string;
  question: string;
  answer: string;
  evidence: string[];
};

export type ClientBuyerFaq = {
  title: string;
  summary: string;
  items: ClientBuyerFaqItem[];
};

export function getClientBuyerFaq(): ClientBuyerFaq {
  return {
    title: "Client Buyer FAQ",
    summary:
      "Buyer-facing FAQ for explaining the FinanceOps Agent safely during sales, discovery, and demo conversations.",
    items: [
      {
        id: "faq-production-ready",
        question: "Is this production-ready today?",
        answer:
          "No. The current project is production-aware, but production planning remains blocked until client-owned data samples, mappings, output acceptance, and approval rules are confirmed.",
        evidence: ["/client/go-live-package", "/client/production-handoff-package"]
      },
      {
        id: "faq-ai-calculations",
        question: "Does AI calculate the finance numbers?",
        answer:
          "No. Finance calculations are deterministic. AI is used to explain verified outputs and create clearer CFO-style summaries.",
        evidence: ["/client/governance-brief", "/client/commercial-summary"]
      },
      {
        id: "faq-payment-execution",
        question: "Can the agent send payments?",
        answer:
          "No. Payment execution is excluded, and payment preparation is blocked until vendor payment data, authorized approvers, and approval policy are confirmed.",
        evidence: ["/client/go-live-checklist", "/client/objection-handling"]
      },
      {
        id: "faq-client-credentials",
        question: "Do we need to give the builder production credentials?",
        answer:
          "No. The production boundary keeps credentials in a client-owned environment and outside the public repo or builder machine.",
        evidence: ["/client/production-prerequisites", "/client/go-live-checklist"]
      },
      {
        id: "faq-roi",
        question: "Is the ROI verified?",
        answer:
          "No. ROI is currently a discovery estimate. Verified ROI requires real client workflow timing, real data samples, and accepted scope.",
        evidence: ["/client/roi-model", "/client/commercial-readiness-score"]
      }
    ]
  };
}
