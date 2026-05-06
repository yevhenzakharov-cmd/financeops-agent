import type { ClientFinanceTask } from "./client-task-contract.js";
import type { ClientInputType } from "./client-input-contract.js";
import type { ClientOutputType } from "./client-output-contract.js";

export interface ClientRequirementsIntake {
  clientName: string;
  industryNotes: string;
  currentAccountingPain: string;
  inputTypesAvailable: ClientInputType[];
  desiredOutputs: ClientOutputType[];
  priorityTasks: ClientFinanceTask[];
  approvalRequirements: string[];
  implementationNotes: string[];
}
