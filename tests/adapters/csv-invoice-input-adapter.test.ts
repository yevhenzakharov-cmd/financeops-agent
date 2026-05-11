import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CsvInvoiceInputAdapter } from "../../src/adapters/csv-invoice-input-adapter.js";

async function withTempCsv(
  contents: string,
  run: (filePath: string) => Promise<void>
) {
  const dir = await mkdtemp(join(tmpdir(), "financeops-csv-test-"));
  const filePath = join(dir, "invoices.csv");

  try {
    await writeFile(filePath, contents);
    await run(filePath);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

describe("CsvInvoiceInputAdapter", () => {
  it("loads demo-safe invoice rows into a FinanceOps input snapshot", async () => {
    await withTempCsv(
      [
        "invoiceId,projectId,clientId,issuedDate,dueDate,amount,currency,status",
        "INV-001,project-001,client-001,2026-03-01,2026-03-31,42000,USD,sent",
        "INV-002,project-001,client-001,2026-03-15,2026-04-15,18500,USD,paid"
      ].join("\n"),
      async (filePath) => {
        const adapter = new CsvInvoiceInputAdapter(filePath);
        const snapshot = await adapter.loadSnapshot();

        expect(snapshot.sourceName).toBe("demo_safe_invoice_csv");
        expect(snapshot.projects.length).toBeGreaterThan(0);
        expect(snapshot.invoices).toHaveLength(2);
        expect(snapshot.invoices[0]).toMatchObject({
          id: "INV-001",
          projectId: "project-001",
          clientId: "client-001",
          amount: {
            amount: 42000,
            currency: "USD"
          },
          status: "sent"
        });
      }
    );
  });

  it("rejects CSV rows with invalid invoice status", async () => {
    await withTempCsv(
      [
        "invoiceId,projectId,clientId,issuedDate,dueDate,amount,currency,status",
        "INV-003,project-001,client-001,2026-03-01,2026-03-31,1000,USD,unknown"
      ].join("\n"),
      async (filePath) => {
        const adapter = new CsvInvoiceInputAdapter(filePath);

        await expect(adapter.loadSnapshot()).rejects.toThrow(
          "Invalid invoice CSV row 2."
        );
      }
    );
  });

  it("rejects CSV files missing required headers", async () => {
    await withTempCsv(
      ["invoiceId,projectId,clientId", "INV-004,project-001,client-001"].join(
        "\n"
      ),
      async (filePath) => {
        const adapter = new CsvInvoiceInputAdapter(filePath);

        await expect(adapter.loadSnapshot()).rejects.toThrow(
          "Invoice CSV missing headers:"
        );
      }
    );
  });
});
