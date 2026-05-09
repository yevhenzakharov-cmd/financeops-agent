import { buildClientDataRequestPacket } from "./client-data-request-packet.js";
import { evaluateClientFieldCoverage } from "./client-field-coverage.js";
import { buildClientGovernanceBrief } from "./client-governance-brief.js";
import {
  mockClientReadinessFixture,
  type ClientReadinessFixture
} from "./client-readiness-fixture.js";

export interface ClientImplementationReadiness {
  clientName: string;
  scenario: string;
  readinessStatus: "blocked" | "mapping_required" | "ready_for_build";
  readinessScore: number;
  blockerSummary: string[];
  nextImplementationSteps: string[];
  fieldCoverage: ReturnType<typeof evaluateClientFieldCoverage>;
  dataRequestPacket: ReturnType<typeof buildClientDataRequestPacket>;
  governanceBrief: ReturnType<typeof buildClientGovernanceBrief>;
}

export function buildClientImplementationReadiness(
  fixture: ClientReadinessFixture = mockClientReadinessFixture
): ClientImplementationReadiness {
  const fieldCoverage = evaluateClientFieldCoverage(fixture.fieldRequirements);
  const dataRequestPacket = buildClientDataRequestPacket(fieldCoverage);
  const governanceBrief = buildClientGovernanceBrief(fixture.governanceRules);

  const readinessStatus =
    fieldCoverage.readinessLevel === "blocked"
      ? "blocked"
      : fieldCoverage.readinessLevel === "ready_for_mapping"
        ? "mapping_required"
        : "ready_for_build";

  const blockerSummary = [
    ...fieldCoverage.missingRequiredFields.map((field) => `Missing required field: ${field}`),
    ...fieldCoverage.needsMappingFields.map((field) => `Needs mapping confirmation: ${field}`)
  ];

  const nextImplementationSteps =
    readinessStatus === "blocked"
      ? [
          "Ask client for missing required fields.",
          "Confirm owner for each input source.",
          "Do not build production adapter until required fields are provided."
        ]
      : readinessStatus === "mapping_required"
        ? [
            "Map client source fields to FinanceOps core fields.",
            "Create client-specific input adapter.",
            "Run mock-to-client fixture comparison."
          ]
        : [
            "Create client-specific input adapter.",
            "Create client-specific output adapter.",
            "Connect final workflow to the client's requested delivery format."
          ];

  return {
    clientName: fixture.clientName,
    scenario: fixture.scenario,
    readinessStatus,
    readinessScore: fieldCoverage.coverageScore,
    blockerSummary,
    nextImplementationSteps,
    fieldCoverage,
    dataRequestPacket,
    governanceBrief
  };
}

export function evaluateClientImplementationReadiness(
  _client?: unknown,
  _requirementsIntake?: unknown
): ClientImplementationReadiness {
  return buildClientImplementationReadiness();
}
