export type ClientInputType =
  | "csv"
  | "json"
  | "google_sheet"
  | "erp_export"
  | "bank_export"
  | "payroll_export"
  | "payment_processor_export"
  | "internal_api";

export interface ClientInputContract {
  id: string;
  name: string;
  type: ClientInputType;
  required: boolean;
  description: string;
  expectedFields: string[];
}
