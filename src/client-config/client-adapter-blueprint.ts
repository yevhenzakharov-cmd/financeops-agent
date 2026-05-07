import { buildClientImplementationReadiness } from "./client-implementation-readiness.js";
import { mockGameStudioReadinessFixture } from "./client-readiness-fixture.js";

export type AdapterBuildStatus = "blocked" | "mapping_required" | "ready";

export interface ClientInputAdapterBlueprint {
  id: string;
  name: string;
  sourceType: "csv" | "json" | "excel" | "api" | "manual_export";
  owner: "client" | "builder" | "shared";
  status: AdapterBuildStatus;
  requiredFields: string[];
  mappingQuestions: string[];
  implementationNotes: string[];
}

export interface ClientAdapterBlueprint {
  clientName: string;
  status: AdapterBuildStatus;
  summary: string;
  inputAdapters: ClientInputAdapterBlueprint[];
}

export function buildClientAdapterBlueprint(): ClientAdapterBlueprint {
  const readiness = buildClientImplementationReadiness(mockGameStudioReadinessFixture);

  const status: AdapterBuildStatus =
    readiness.readinessStatus === "blocked"
      ? "blocked"
      : readiness.readinessStatus === "mapping_required"
        ? "mapping_required"
        : "ready";

  return {
    clientName: readiness.clientName,
    status,
    summary:
      "Adapter blueprint for converting client-owned finance inputs into the normalized FinanceOps core schema.",
    inputAdapters: [
      {
        id: "adapter-invoice-export",
        name: "Invoice Export Adapter",
        sourceType: "csv",
        owner: "shared",
        status: "ready",
        requiredFields: ["Invoice ID", "Invoice due date", "Customer name"],
        mappingQuestions: [],
        implementationNotes: [
          "Parse client invoice export.",
          "Normalize invoice IDs, customer references, due dates, status, amount, and currency.",
          "Feed normalized invoice records into overdue receivables and exception detection."
        ]
      },
      {
        id: "adapter-bank-export",
        name: "Bank Transaction Adapter",
        sourceType: "csv",
        owner: "shared",
        status: "mapping_required",
        requiredFields: ["Bank transaction ID"],
        mappingQuestions: [
          "Confirm whether the bank transaction ID remains stable across exports.",
          "Confirm whether bank references can be matched to invoice IDs or customer names."
        ],
        implementationNotes: [
          "Parse bank export.",
          "Normalize bank transaction identifiers.",
          "Feed normalized bank records into reconciliation and orphan transaction detection."
        ]
      },
      {
        id: "adapter-payment-profile",
        name: "Vendor Payment Profile Adapter",
        sourceType: "manual_export",
        owner: "client",
        status: "blocked",
        requiredFields: ["Vendor payment method"],
        mappingQuestions: [
          "Confirm whether vendor payment profile data will be provided as a file, API, or manual export."
        ],
        implementationNotes: [
          "Do not enable payment preparation until the client provides approved payment method data.",
          "Keep money movement gated behind human approval."
        ]
      }
    ]
  };
}
