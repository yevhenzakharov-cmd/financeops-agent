import { describe, expect, it } from "vitest";

import { MockFinanceOpsAdapter } from "../../src/adapters/mock-financeops-adapter.js";

describe("MockFinanceOpsAdapter", () => {
  it("loads the public mock client dataset with expected snapshot fields", async () => {
    const adapter = new MockFinanceOpsAdapter();

    const snapshot = await adapter.loadSnapshot();

    expect(adapter.adapterName).toBe("mock_financeops_adapter");
    expect(snapshot.sourceName).toBe("public_mock_client_dataset");
    expect(snapshot.loadedAt).toEqual(expect.any(String));
    expect(new Date(snapshot.loadedAt).toString()).not.toBe("Invalid Date");

    expect(snapshot.projects.length).toBeGreaterThan(0);
    expect(snapshot.invoices.length).toBeGreaterThan(0);
    expect(snapshot.payments.length).toBeGreaterThan(0);
    expect(snapshot.bankTransactions.length).toBeGreaterThan(0);
  });
});
