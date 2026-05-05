import type { Project } from "../domain/schemas.js";
import { invoices, expenses, contractorCosts } from "../domain/mock-data.js";

export interface ProjectMarginResult {
  projectId: string;
  revenue: number;
  costs: number;
  grossMargin: number;
  marginPercent: number;
  budgetUtilizationPercent: number;
}

export function calculateProjectMargin(project: Project): ProjectMarginResult {
  const projectInvoices = invoices.filter(
    (inv) => inv.projectId === project.id && inv.status === "paid"
  );

  const revenue = projectInvoices.reduce(
    (sum, inv) => sum + inv.amount.amount,
    0
  );

  const projectExpenses = expenses.filter(
    (exp) => exp.projectId === project.id
  );

  const projectContractorCosts = contractorCosts.filter(
    (cc) => cc.projectId === project.id
  );

  const expenseTotal = projectExpenses.reduce(
    (sum, exp) => sum + exp.amount.amount,
    0
  );

  const contractorTotal = projectContractorCosts.reduce(
    (sum, cc) => sum + cc.amount.amount,
    0
  );

  const costs = expenseTotal + contractorTotal;

  const grossMargin = revenue - costs;

  const marginPercent =
    revenue === 0 ? 0 : Number(((grossMargin / revenue) * 100).toFixed(2));

  const budget = project.budget.totalBudget.amount;

  const budgetUtilizationPercent =
    budget === 0 ? 0 : Number(((costs / budget) * 100).toFixed(2));

  return {
    projectId: project.id,
    revenue,
    costs,
    grossMargin,
    marginPercent,
    budgetUtilizationPercent
  };
}
