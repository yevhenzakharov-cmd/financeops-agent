export type ClientIndustry =
  | "game_studio"
  | "agency"
  | "saas"
  | "marketplace"
  | "web3_company"
  | "general_business";

export type AccountingDepartmentSize = "solo" | "small_team" | "mid_market" | "enterprise";

export interface ClientProfile {
  id: string;
  name: string;
  industry: ClientIndustry;
  accountingDepartmentSize: AccountingDepartmentSize;
  baseCurrency: string;
  timezone: string;
}
