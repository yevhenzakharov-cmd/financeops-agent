import { CsvInvoiceInputAdapter } from "../src/adapters/csv-invoice-input-adapter.js";

async function main() {
  const csvPath =
    process.env.CSV_PATH ?? "fixtures/client-samples/invoices-demo.csv";

  const adapter = new CsvInvoiceInputAdapter(csvPath);
  const snapshot = await adapter.loadSnapshot();

  console.log(
    JSON.stringify(
      {
        status: "success",
        adapterName: adapter.adapterName,
        sourceName: snapshot.sourceName,
        loadedAt: snapshot.loadedAt,
        counts: {
          projects: snapshot.projects.length,
          invoices: snapshot.invoices.length,
          payments: snapshot.payments.length,
          bankTransactions: snapshot.bankTransactions.length
        },
        invoices: snapshot.invoices
      },
      null,
      2
    )
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
