import type {
  Project,
  Invoice,
  Payment,
  BankTransaction
} from "../domain/schemas.js";

export interface FinanceOpsInputSnapshot {
  sourceName: string;
  loadedAt: string;
  projects: Project[];
  invoices: Invoice[];
  payments: Payment[];
  bankTransactions: BankTransaction[];
}

export interface FinanceOpsInputAdapter {
  adapterName: string;
  loadSnapshot(): Promise<FinanceOpsInputSnapshot>;
}
