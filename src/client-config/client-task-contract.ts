export type ClientFinanceTask =
  | "receivables_review"
  | "payables_review"
  | "reconciliation_review"
  | "margin_review"
  | "budget_burn_review"
  | "payment_approval_review"
  | "executive_finance_briefing";

export interface ClientTaskContract {
  id: string;
  task: ClientFinanceTask;
  description: string;
  requiredInputIds: string[];
  desiredOutputIds: string[];
}
