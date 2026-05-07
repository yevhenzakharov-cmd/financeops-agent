import { getClientSalesNarrative } from "./client-sales-narrative.js";
import { getClientDemoAgenda } from "./client-demo-agenda.js";
import { getClientFollowUpEmail } from "./client-follow-up-email.js";
import { getClientBuyerFaq } from "./client-buyer-faq.js";
import { getClientCommercialPackage } from "./client-commercial-package.js";

export type ClientSalesHandoffPackage = {
  title: string;
  generatedAt: string;
  clientName: string;
  status: string;
  summary: string;
  narrative: ReturnType<typeof getClientSalesNarrative>;
  demoAgenda: ReturnType<typeof getClientDemoAgenda>;
  followUpEmail: ReturnType<typeof getClientFollowUpEmail>;
  buyerFaq: ReturnType<typeof getClientBuyerFaq>;
  commercialPackage: ReturnType<typeof getClientCommercialPackage>;
  nextBestAction: string;
};

export function getClientSalesHandoffPackage(): ClientSalesHandoffPackage {
  const narrative = getClientSalesNarrative();
  const commercialPackage = getClientCommercialPackage();

  return {
    title: "Client Sales Handoff Package",
    generatedAt: new Date().toISOString(),
    clientName: narrative.clientName,
    status: commercialPackage.status,
    summary:
      "Buyer-facing sales handoff package combining sales narrative, demo agenda, follow-up email, FAQ, and commercial readiness context.",
    narrative,
    demoAgenda: getClientDemoAgenda(),
    followUpEmail: getClientFollowUpEmail(),
    buyerFaq: getClientBuyerFaq(),
    commercialPackage,
    nextBestAction:
      commercialPackage.status === "ready"
        ? "Use for external buyer demo with approved claims."
        : "Use for internal rehearsal or controlled discovery until commercial blockers are reduced."
  };
}
