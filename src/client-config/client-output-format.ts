export type ClientOutputFormat =
  | "json"
  | "csv"
  | "markdown"
  | "slack_blocks"
  | "plain_text"
  | "dashboard_payload";

export interface ClientDesiredOutputSpec {
  outputId: string;
  format: ClientOutputFormat;
  audience: "cfo" | "controller" | "accountant" | "ops_manager" | "executive";
  deliveryTarget: "api" | "file" | "slack" | "dashboard" | "email_draft";
  description: string;
}
