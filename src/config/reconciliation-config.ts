export interface ReconciliationConfig {
  amountTolerancePercent: number;
  lowSeverityThresholdPercent: number;
  mediumSeverityThresholdPercent: number;
}

export const defaultReconciliationConfig: ReconciliationConfig = {
  amountTolerancePercent: 5,          // Acceptable payment variance ±5%
  lowSeverityThresholdPercent: 2,     // <=2% variance = low
  mediumSeverityThresholdPercent: 5   // <=5% variance = medium
};
