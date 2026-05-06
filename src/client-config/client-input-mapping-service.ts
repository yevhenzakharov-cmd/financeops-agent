import type { ClientImplementationContract } from "./client-implementation-contract.js";
import type { ClientAdapterPlan } from "./client-adapter-plan.js";

export function buildClientAdapterPlan(
  contract: ClientImplementationContract
): ClientAdapterPlan[] {
  return contract.inputs.map((input) => ({
    input,
    mapping: null,
    implementationNotes: [
      `Build adapter for ${input.type} input: ${input.name}.`,
      `Normalize expected fields: ${input.expectedFields.join(", ")}.`
    ]
  }));
}
