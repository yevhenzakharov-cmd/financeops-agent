import { describe, expect, it } from "vitest";

import type { ClientRequirementsIntake } from "../../src/client-config/client-requirements-intake.js";
import { validateClientRequirementsIntake } from "../../src/client-config/client-requirements-validator.js";

function buildValidIntake(
  overrides: Partial<ClientRequirementsIntake> = {}
): ClientRequirementsIntake {
  return {
    clientName: "Mock Client Finance Team",
    primaryPain:
      "Manual review of overdue invoices and reconciliation exceptions takes too long.",
    inputTypesAvailable: ["CSV invoice export"],
    desiredOutputs: ["CFO briefing"],
    priorityTasks: ["overdue_invoice_detection"],
    approvalRequirements: ["Payments require human approval."],
    implementationNotes:
      "Use safe sample data before connecting production systems.",
    ...overrides
  };
}

describe("validateClientRequirementsIntake", () => {
  it("accepts a complete client requirements intake", () => {
    const validation = validateClientRequirementsIntake(buildValidIntake());

    expect(validation).toEqual({
      valid: true,
      errors: []
    });
  });

  it("rejects a blank client name", () => {
    const validation = validateClientRequirementsIntake(
      buildValidIntake({ clientName: "   " })
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("Client name is required.");
  });

  it("rejects missing input types", () => {
    const validation = validateClientRequirementsIntake(
      buildValidIntake({ inputTypesAvailable: [] })
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("At least one input type is required.");
  });

  it("rejects missing desired outputs", () => {
    const validation = validateClientRequirementsIntake(
      buildValidIntake({ desiredOutputs: [] })
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("At least one desired output is required.");
  });

  it("rejects missing priority finance tasks", () => {
    const validation = validateClientRequirementsIntake(
      buildValidIntake({ priorityTasks: [] })
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain(
      "At least one priority finance task is required."
    );
  });

  it("returns all validation errors together", () => {
    const validation = validateClientRequirementsIntake(
      buildValidIntake({
        clientName: "",
        inputTypesAvailable: [],
        desiredOutputs: [],
        priorityTasks: []
      })
    );

    expect(validation).toEqual({
      valid: false,
      errors: [
        "Client name is required.",
        "At least one input type is required.",
        "At least one desired output is required.",
        "At least one priority finance task is required."
      ]
    });
  });
});
