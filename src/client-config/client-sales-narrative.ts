import { buildClientCommercialSummary } from "./client-commercial-summary.js";

export type ClientSalesNarrative = {
  title: string;
  clientName: string;
  audience: string[];
  opening: string;
  problemStatement: string[];
  solutionNarrative: string[];
  proofPoints: string[];
  safeClaims: string[];
  claimsToAvoid: string[];
  close: string;
};

export function getClientSalesNarrative(): ClientSalesNarrative {
  const commercialSummary = buildClientCommercialSummary();

  return {
    title: "Client Sales Narrative",
    clientName: commercialSummary.clientName,
    audience: ["CFO", "Controller", "Finance Operations Lead", "Founder"],
    opening:
      "FinanceOps Agent is a governed finance operations agent that turns client finance data into traceable exception queues, CFO briefings, and approval-gated recommendations.",
    problemStatement: [
      "Finance teams spend time manually reviewing overdue invoices, bank exceptions, and project margin risk.",
      "Important exceptions can stay hidden until someone manually reviews exports or spreadsheets.",
      "AI-led finance automation can be risky if calculations are not deterministic or if sensitive actions are not approval-gated.",
      "Clients need automation without giving up control over credentials, approvals, and final finance decisions."
    ],
    solutionNarrative: [
      "The system separates deterministic finance calculations from AI explanation.",
      "It produces CFO-style summaries, exception queues, audit artifacts, and approval-gated recommendations.",
      "It keeps payments, accounting postings, and tax/legal advice blocked or human-approved.",
      "It documents readiness, pilot scope, production handoff, go-live decision, and commercial readiness in a structured API."
    ],
    proofPoints: [
      "/client/commercial-summary",
      "/client/buyer-brief",
      "/client/objection-handling",
      "/client/go-live-package",
      "/artifacts/manifest"
    ],
    safeClaims: commercialSummary.strongestClaims,
    claimsToAvoid: commercialSummary.avoidClaims,
    close:
      "The next step is a controlled discovery or pilot using client-approved sample data, not a claim that the public demo is already production-ready."
  };
}
