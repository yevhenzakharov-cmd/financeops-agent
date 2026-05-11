import { readFile } from "node:fs/promises";
import { z } from "zod";
import { projects, payments, bankTransactions } from "../domain/mock-data.js";
import type { Invoice } from "../domain/schemas.js";
import type {
  FinanceOpsInputAdapter,
  FinanceOpsInputSnapshot
} from "./financeops-input-adapter.js";

const invoiceRowSchema = z.object({
  invoiceId: z.string().min(1),
  projectId: z.string().min(1),
  clientId: z.string().min(1),
  issuedDate: z.string().min(1),
  dueDate: z.string().min(1),
  amount: z.coerce.number().positive(),
  currency: z.string().min(1),
  status: z.enum(["draft", "sent", "paid", "overdue"])
});

type InvoiceCsvRow = z.infer<typeof invoiceRowSchema>;

function splitCsvLine(line: string): string[] {
  return line.split(",").map((value) => value.trim());
}

function parseInvoiceCsv(csv: string): InvoiceCsvRow[] {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const [headerLine, ...dataLines] = lines;

  if (!headerLine) {
    throw new Error("Invoice CSV is empty.");
  }

  const headers = splitCsvLine(headerLine);
  const requiredHeaders = [
    "invoiceId",
    "projectId",
    "clientId",
    "issuedDate",
    "dueDate",
    "amount",
    "currency",
    "status"
  ];

  const missingHeaders = requiredHeaders.filter(
    (header) => !headers.includes(header)
  );

  if (missingHeaders.length > 0) {
    throw new Error(`Invoice CSV missing headers: ${missingHeaders.join(", ")}`);
  }

  return dataLines.map((line, index) => {
    const values = splitCsvLine(line);
    const rawRow = Object.fromEntries(
      headers.map((header, headerIndex) => [header, values[headerIndex] ?? ""])
    );

    const parsed = invoiceRowSchema.safeParse(rawRow);

    if (!parsed.success) {
      throw new Error(`Invalid invoice CSV row ${index + 2}.`);
    }

    return parsed.data;
  });
}

function toInvoice(row: InvoiceCsvRow): Invoice {
  return {
    id: row.invoiceId,
    projectId: row.projectId,
    clientId: row.clientId,
    issuedDate: row.issuedDate,
    dueDate: row.dueDate,
    amount: {
      amount: row.amount,
      currency: row.currency
    },
    status: row.status
  };
}

export class CsvInvoiceInputAdapter implements FinanceOpsInputAdapter {
  adapterName = "csv_invoice_input_adapter";

  constructor(private readonly filePath: string) {}

  async loadSnapshot(): Promise<FinanceOpsInputSnapshot> {
    const csv = await readFile(this.filePath, "utf8");
    const invoiceRows = parseInvoiceCsv(csv);

    return {
      sourceName: "demo_safe_invoice_csv",
      loadedAt: new Date().toISOString(),
      projects,
      invoices: invoiceRows.map(toInvoice),
      payments,
      bankTransactions
    };
  }
}
