import { describe, expect, test } from "vitest";
import {
  buildClientEnterpriseSalesBrief,
  summarizeClientEnterpriseSalesBrief,
  validateClientEnterpriseSalesBrief
} from "../../src/client-config/client-enterprise-sales-brief.js";

describe("client enterprise sales brief", () => {
  test("builds an enterprise buyer-facing brief", () => {
    const brief = buildClientEnterpriseSalesBrief();

    expect(brief.briefVersion).toBe("client-enterprise-sales-brief-v1");
    expect(brief.positioning.oneLiner).toContain("FinanceOps Agent");
    expect(brief.buyerSignals.length).toBeGreaterThanOrEqual(6);
    expect(brief.demoTalkTrack.length).toBeGreaterThanOrEqual(5);
  });

  test("keeps production readiness blocked in the buyer story", () => {
    const brief = buildClientEnterpriseSalesBrief();

    const productionSignal = brief.buyerSignals.find(
      (signal) => signal.id === "signal-production-readiness"
    );

    expect(productionSignal).toBeDefined();
    expect(productionSignal?.strength).toBe("blocked");
    expect(productionSignal?.caveat).toContain("Not production-ready");
  });

  test("includes enterprise objections that a large buyer would ask", () => {
    const brief = buildClientEnterpriseSalesBrief();

    expect(brief.enterpriseObjections).toContain("Where does our data live?");
    expect(brief.enterpriseObjections).toContain("Who controls credentials and auth?");
    expect(brief.enterpriseObjections).toContain("How do we audit decisions and approvals?");
  });

  test("summarizes enterprise sales brief counts", () => {
    const summary = summarizeClientEnterpriseSalesBrief();

    expect(summary.briefVersion).toBe("client-enterprise-sales-brief-v1");
    expect(summary.buyerSignalCount).toBeGreaterThanOrEqual(6);
    expect(summary.blockedSignals).toBeGreaterThanOrEqual(1);
    expect(summary.requiredClientProofCount).toBeGreaterThanOrEqual(6);
  });

  test("validates the default enterprise sales brief", () => {
    const validation = validateClientEnterpriseSalesBrief();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
