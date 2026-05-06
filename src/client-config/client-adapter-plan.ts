import type { ClientInputContract } from "./client-input-contract.js";
import type { ClientInputMapping } from "./client-input-mapping.js";

export interface ClientAdapterPlan {
  input: ClientInputContract;
  mapping: ClientInputMapping | null;
  implementationNotes: string[];
}
