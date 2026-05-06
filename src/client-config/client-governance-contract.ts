export type ClientApprovalStrictness = "low" | "medium" | "high";

export interface ClientGovernanceContract {
  approvalStrictness: ClientApprovalStrictness;
  requireHumanApprovalForPayments: boolean;
  requireHumanApprovalForHighRiskFindings: boolean;
  maxAutoApprovalAmount: number;
  escalationRoles: string[];
}
