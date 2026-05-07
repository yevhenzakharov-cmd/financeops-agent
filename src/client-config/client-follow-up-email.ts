import { getClientCommercialSummary } from "./client-commercial-summary";

export type ClientFollowUpEmail = {
  title: string;
  subject: string;
  body: string;
  attachmentsOrLinksToInclude: string[];
  claimsToAvoid: string[];
};

export function getClientFollowUpEmail(): ClientFollowUpEmail {
  const summary = getClientCommercialSummary();

  return {
    title: "Client Follow-Up Email",
    subject: "FinanceOps Agent demo follow-up",
    body: `Hi [Name],

Thanks for taking the time to review the FinanceOps Agent demo.

The short version: ${summary.oneLinePitch}

The strongest parts of the current demo are:
- production-aware workflow design,
- traceable finance outputs,
- deterministic calculations separated from AI explanation,
- approval gates for sensitive actions,
- client-owned credential boundaries.

The important caveat is that this is not being positioned as production-ready yet. A real implementation would require approved client data samples, confirmed mappings, accepted output formats, and final approval rules before production planning.

Recommended next step:
Run a controlled discovery or pilot using client-approved sample data and confirm which workflows should stay included, limited, or excluded.

Best,
[Your Name]`,
    attachmentsOrLinksToInclude: [
      "/client/commercial-summary",
      "/client/buyer-brief",
      "/client/go-live-package",
      "/client/objection-handling"
    ],
    claimsToAvoid: summary.avoidClaims
  };
}
