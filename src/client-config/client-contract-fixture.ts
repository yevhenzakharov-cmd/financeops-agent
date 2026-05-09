import { mockClientContract } from "./mock-client-contract.js";
import { buildClientImplementationPlan } from "./client-implementation-plan.js";
import { validateClientImplementationContract } from "./client-contract-validator.js";

export function getMockClientContractFixture() {
  return {
    contract: mockClientContract,
    validation: validateClientImplementationContract(mockClientContract),
    implementationPlan: buildClientImplementationPlan(mockClientContract)
  };
}
