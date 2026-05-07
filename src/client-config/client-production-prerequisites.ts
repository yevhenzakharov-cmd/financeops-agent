export type ProductionPrerequisiteStatus = "ready" | "client_action_required" | "blocked";

export interface ClientProductionPrerequisite {
  id: string;
  title: string;
  owner: "client" | "builder" | "shared";
  status: ProductionPrerequisiteStatus;
  reason: string;
  requiredEvidence: string[];
}

export interface ClientProductionPrerequisites {
  title: string;
  summary: string;
  prerequisites: ClientProductionPrerequisite[];
  blockedPrerequisites: string[];
  clientActionRequired: string[];
  readyPrerequisites: string[];
}

export function buildClientProductionPrerequisites(): ClientProductionPrerequisites {
  const prerequisites: ClientProductionPrerequisite[] = [
    {
      id: "prod-client-data-samples",
      title: "Representative client data samples approved",
      owner: "client",
      status: "client_action_required",
      reason: "Pilot can use mock-shaped data, but production planning needs client-approved samples.",
      requiredEvidence: [
        "Invoice export sample",
        "Bank export sample",
        "Project margin sample",
        "Field dictionary"
      ]
    },
    {
      id: "prod-bank-mapping",
      title: "Bank transaction mapping confirmed",
      owner: "shared",
      status: "client_action_required",
      reason: "Bank transaction ID mapping must be stable before reconciliation can be trusted.",
      requiredEvidence: [
        "Stable bank transaction identifier",
        "Matching reference strategy",
        "Example matched and unmatched transactions"
      ]
    },
    {
      id: "prod-payment-data",
      title: "Vendor payment data provided",
      owner: "client",
      status: "blocked",
      reason: "Payment approval preparation remains blocked until vendor payment data exists.",
      requiredEvidence: [
        "Vendor payment method field",
        "Authorized approver list",
        "Payment approval policy",
        "Idempotency strategy"
      ]
    },
    {
      id: "prod-approval-policy",
      title: "Human approval policy confirmed",
      owner: "client",
      status: "ready",
      reason: "Current demo governance already requires approval for payments and accounting postings.",
      requiredEvidence: [
        "Payment approval owner",
        "Accounting posting approval owner",
        "Blocked action list"
      ]
    },
    {
      id: "prod-credential-boundary",
      title: "Production credentials remain client-owned",
      owner: "client",
      status: "ready",
      reason: "Builder should not receive production credentials in the public demo or production setup.",
      requiredEvidence: [
        "Client-owned deployment environment",
        "Credential storage policy",
        "Secret rotation policy"
      ]
    }
  ];

  return {
    title: "Client Production Prerequisites",
    summary:
      "Checklist of what must be true before a client-shaped pilot can move into production implementation planning.",
    prerequisites,
    blockedPrerequisites: prerequisites
      .filter((item) => item.status === "blocked")
      .map((item) => item.title),
    clientActionRequired: prerequisites
      .filter((item) => item.status === "client_action_required")
      .map((item) => item.title),
    readyPrerequisites: prerequisites
      .filter((item) => item.status === "ready")
      .map((item) => item.title)
  };
}
