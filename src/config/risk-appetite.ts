export interface RiskAppetiteConfig {
  maxAllowedRiskIncrease: number;
  minRequiredCashDelta: number;
  minRequiredMarginDelta: number;
  allowNegativeMarginActions: boolean;
}

export const DefaultRiskAppetite: RiskAppetiteConfig = {
  maxAllowedRiskIncrease: 5,
  minRequiredCashDelta: 0,
  minRequiredMarginDelta: 0,
  allowNegativeMarginActions: false
};

export function getRiskAppetite(): RiskAppetiteConfig {
  return {
    maxAllowedRiskIncrease: Number(
      process.env.MAX_ALLOWED_RISK_INCREASE ?? DefaultRiskAppetite.maxAllowedRiskIncrease
    ),
    minRequiredCashDelta: Number(
      process.env.MIN_REQUIRED_CASH_DELTA ?? DefaultRiskAppetite.minRequiredCashDelta
    ),
    minRequiredMarginDelta: Number(
      process.env.MIN_REQUIRED_MARGIN_DELTA ?? DefaultRiskAppetite.minRequiredMarginDelta
    ),
    allowNegativeMarginActions:
      process.env.ALLOW_NEGATIVE_MARGIN_ACTIONS === "true"
        ? true
        : DefaultRiskAppetite.allowNegativeMarginActions
  };
}
