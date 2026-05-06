import type { ClientImplementationContract } from "./client-implementation-contract.js";
import { buildClientAdapterPlan } from "./client-input-mapping-service.js";
import { buildClientOutputPlan } from "./client-output-plan-service.js";
import { summarizeClientImplementationContract } from "./client-contract-summary.js";

export function buildClientImplementationPlan(contract: ClientImplementationContract) {
  return {
    summary: summarizeClientImplementationContract(contract),
    inputAdapterPlan: buildClientAdapterPlan(contract),
    outputPlan: buildClientOutputPlan(contract),
    taskCount: contract.tasks.length
  };
}
