import type { ClientImplementationContract } from "./client-implementation-contract.js";
import { validateClientImplementationContract } from "./client-contract-validator.js";

export function summarizeClientImplementationContract(contract: ClientImplementationContract) {
  const validation = validateClientImplementationContract(contract);

  return {
    clientId: contract.profile.id,
    clientName: contract.profile.name,
    industry: contract.profile.industry,
    baseCurrency: contract.profile.baseCurrency,
    inputCount: contract.inputs.length,
    outputCount: contract.outputs.length,
    taskCount: contract.tasks.length,
    governance: contract.governance,
    validation
  };
}
