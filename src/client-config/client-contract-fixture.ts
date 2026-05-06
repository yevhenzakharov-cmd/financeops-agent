import { mockGameStudioClient } from "./mock-game-studio-client.js";
import { buildClientImplementationPlan } from "./client-implementation-plan.js";
import { validateClientImplementationContract } from "./client-contract-validator.js";

export function getMockClientContractFixture() {
  return {
    contract: mockGameStudioClient,
    validation: validateClientImplementationContract(mockGameStudioClient),
    implementationPlan: buildClientImplementationPlan(mockGameStudioClient)
  };
}
