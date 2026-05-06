import type { ClientImplementationContract } from "./client-implementation-contract.js";

export function buildClientOutputPlan(contract: ClientImplementationContract) {
  return contract.outputs.map((output) => {
    const desiredSpec = contract.desiredOutputSpecs?.find(
      (spec) => spec.outputId === output.id
    );

    return {
      output,
      desiredSpec: desiredSpec ?? null,
      implementationNotes: [
        `Generate ${output.type} output: ${output.name}.`,
        desiredSpec
          ? `Deliver as ${desiredSpec.format} to ${desiredSpec.deliveryTarget} for ${desiredSpec.audience}.`
          : "No desired output spec configured yet."
      ]
    };
  });
}
