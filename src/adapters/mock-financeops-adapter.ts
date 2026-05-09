import {
  projects,
  invoices,
  payments,
  bankTransactions
} from "../domain/mock-data.js";
import type {
  FinanceOpsInputAdapter,
  FinanceOpsInputSnapshot
} from "./financeops-input-adapter.js";

export class MockFinanceOpsAdapter implements FinanceOpsInputAdapter {
  adapterName = "mock_financeops_adapter";

  async loadSnapshot(): Promise<FinanceOpsInputSnapshot> {
    return {
      sourceName: "public_mock_client_dataset",
      loadedAt: new Date().toISOString(),
      projects,
      invoices,
      payments,
      bankTransactions
    };
  }
}
