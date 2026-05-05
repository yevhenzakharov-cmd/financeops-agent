import type { Invoice } from "../domain/schemas.js";
import { invoices } from "../domain/mock-data.js";

export interface OverdueInvoiceResult {
  invoiceId: string;
  projectId: string;
  clientId: string;
  daysOverdue: number;
  amount: number;
}

function daysBetween(date1: Date, date2: Date): number {
  const diff = date1.getTime() - date2.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function detectOverdueInvoices(referenceDate: Date = new Date()): OverdueInvoiceResult[] {
  return invoices
    .filter((inv) => {
      if (inv.status === "overdue") return true;

      if (inv.status !== "paid") {
        const due = new Date(inv.dueDate);
        return due < referenceDate;
      }

      return false;
    })
    .map((inv) => {
      const due = new Date(inv.dueDate);
      const daysOverdue = daysBetween(referenceDate, due);

      return {
        invoiceId: inv.id,
        projectId: inv.projectId,
        clientId: inv.clientId,
        daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
        amount: inv.amount.amount
      };
    });
}
