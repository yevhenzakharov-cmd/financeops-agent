import type {
  Project,
  Client,
  Invoice,
  Expense,
  ContractorCost,
  Payment,
  BankTransaction
} from "./schemas.js";

export const clients: Client[] = [
  {
    id: "client-001",
    name: "Nova Interactive",
    country: "US",
    contactEmail: "finance@nova-interactive.com",
    isActive: true
  }
];

export const projects: Project[] = [
  {
    id: "project-001",
    name: "Project Atlas",
    clientId: "client-001",
    engine: "FinanceOpsCore",
    platform: ["Operations"],
    stage: "pilot",
    budget: {
      totalBudget: { amount: 500000, currency: "USD" },
      approvedAt: "2025-01-10"
    },
    startDate: "2025-01-15"
  }
];

export const invoices: Invoice[] = [
  {
    id: "inv-001",
    projectId: "project-001",
    clientId: "client-001",
    issuedDate: "2025-03-01",
    dueDate: "2025-03-31",
    amount: { amount: 150000, currency: "USD" },
    status: "paid"
  },
  {
    id: "inv-002",
    projectId: "project-001",
    clientId: "client-001",
    issuedDate: "2025-03-15",
    dueDate: "2025-04-01",
    amount: { amount: 50000, currency: "USD" },
    status: "sent"
  }
];

export const payments: Payment[] = [
  {
    id: "pay-001",
    invoiceId: "inv-001",
    receivedDate: "2025-03-20",
    amount: { amount: 150000, currency: "USD" },
    method: "wire"
  }
];

export const bankTransactions: BankTransaction[] = [
  {
    id: "bank-001",
    date: "2025-03-20",
    description: "Wire from Nova Interactive",
    amount: { amount: 150000, currency: "USD" }
  },
  {
    id: "bank-002",
    date: "2025-04-10",
    description: "Unknown incoming transfer",
    amount: { amount: 48000, currency: "USD" }
  }
];

export const expenses: Expense[] = [
  {
    id: "exp-001",
    projectId: "project-001",
    category: "software",
    date: "2025-02-01",
    amount: { amount: 20000, currency: "USD" },
    description: "FinanceOpsCore Pro licenses"
  }
];

export const contractorCosts: ContractorCost[] = [
  {
    id: "cc-001",
    projectId: "project-001",
    contractorName: "Senior Finance Operations Analyst",
    role: "Finance Operations",
    date: "2025-02-28",
    amount: { amount: 40000, currency: "USD" }
  }
];
