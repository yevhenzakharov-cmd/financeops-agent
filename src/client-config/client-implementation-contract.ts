import type { ClientGovernanceContract } from "./client-governance-contract.js";
import type { ClientInputContract } from "./client-input-contract.js";
import type { ClientOutputContract } from "./client-output-contract.js";
import type { ClientDesiredOutputSpec } from "./client-output-format.js";
import type { ClientProfile } from "./client-profile.js";
import type { ClientTaskContract } from "./client-task-contract.js";

export interface ClientImplementationContract {
  profile: ClientProfile;
  inputs: ClientInputContract[];
  outputs: ClientOutputContract[];
  desiredOutputSpecs?: ClientDesiredOutputSpec[];
  tasks: ClientTaskContract[];
  governance: ClientGovernanceContract;
}
