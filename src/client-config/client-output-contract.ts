export type ClientOutputType =
  | "cfo_briefing"
  | "approval_queue"
  | "exception_report"
  | "dashboard_payload"
  | "slack_summary"
  | "csv_export"
  | "json_export";

export interface ClientOutputContract {
  id: string;
  name: string;
  type: ClientOutputType;
  description: string;
  requiredFields: string[];
}
