export type GoLiveChecklistStatus = "ready" | "client_action_required" | "blocked";

export interface ClientGoLiveChecklistItem {
  id: string;
  title: string;
  owner: "client" | "builder" | "shared";
  status: GoLiveChecklistStatus;
  evidenceRequired: string[];
  notes: string;
}

export interface ClientGoLiveChecklist {
  title: string;
  summary: string;
  items: ClientGoLiveChecklistItem[];
  readyItems: string[];
  clientActionItems: string[];
  blockedItems: string[];
}

export function buildClientGoLiveChecklist(): ClientGoLiveChecklist {
  const items: ClientGoLiveChecklistItem[] = [
    {
      id: "go-live-data-samples",
      title: "Production-shaped data samples approved",
      owner: "client",
      status: "client_action_required",
      evidenceRequired: [
        "Approved invoice sample",
        "Approved bank sample",
        "Approved project margin sample",
        "Field dictionary"
      ],
      notes:
        "Go-live requires client-approved production-shaped data, not only public mock fixtures."
    },
    {
      id: "go-live-payment-data",
      title: "Payment data and approvers confirmed",
      owner: "client",
      status: "blocked",
      evidenceRequired: [
        "Vendor payment method data",
        "Authorized approver list",
        "Payment approval policy",
        "Idempotency key strategy"
      ],
      notes:
        "Payment preparation and payment execution remain excluded until this is resolved."
    },
    {
      id: "go-live-governance",
      title: "Governance and blocked actions confirmed",
      owner: "shared",
      status: "ready",
      evidenceRequired: [
        "Human approval policy",
        "Blocked action list",
        "Escalation roles"
      ],
      notes:
        "Current demo policy already blocks tax/legal advice and requires approval for money movement and accounting postings."
    },
    {
      id: "go-live-credentials",
      title: "Client-owned credential boundary confirmed",
      owner: "client",
      status: "ready",
      evidenceRequired: [
        "Client-owned secret storage",
        "Deployment owner",
        "Credential rotation policy"
      ],
      notes:
        "Production secrets must remain outside the public repo and outside the builder machine."
    },
    {
      id: "go-live-acceptance",
      title: "Client acceptance decision recorded",
      owner: "client",
      status: "client_action_required",
      evidenceRequired: [
        "Accepted output format",
        "Accepted pilot scope",
        "Accepted production exclusions"
      ],
      notes:
        "The client must accept the final output format and exclusions before go-live planning."
    }
  ];

  return {
    title: "Client Go-Live Checklist",
    summary:
      "Go-live checklist for deciding whether a client implementation can move from production handoff into launch planning.",
    items,
    readyItems: items
      .filter((item) => item.status === "ready")
      .map((item) => item.title),
    clientActionItems: items
      .filter((item) => item.status === "client_action_required")
      .map((item) => item.title),
    blockedItems: items
      .filter((item) => item.status === "blocked")
      .map((item) => item.title)
  };
}
