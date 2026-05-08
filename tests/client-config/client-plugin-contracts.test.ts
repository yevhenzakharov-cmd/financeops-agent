import { describe, expect, test } from "vitest";

import {
  ClientPluginContractsPackageSchema,
  buildClientPluginContractsPackage,
  validateClientPluginContractsPackage
} from "../../src/client-config/client-plugin-contracts.js";

describe("client plug-in contracts", () => {
  test("builds a client-specific plug-in package", () => {
    const result = buildClientPluginContractsPackage();

    expect(result.title).toBe("Client Plug-in Contracts Package");
    expect(result.clientModel).toBe("client_specific_plugins");
    expect(result.inputPlugins.length).toBeGreaterThanOrEqual(3);
    expect(result.outputPlugins.length).toBeGreaterThanOrEqual(3);
  });

  test("validates the generated package with zod", () => {
    const result = buildClientPluginContractsPackage();
    const parsed = ClientPluginContractsPackageSchema.parse(result);

    expect(parsed.title).toBe(result.title);
    expect(validateClientPluginContractsPackage(result)).toEqual({
      valid: true,
      errors: []
    });
  });

  test("captures ready, mapping-required, and blocked plug-in states", () => {
    const result = buildClientPluginContractsPackage();

    expect(result.readyItems.length).toBeGreaterThan(0);
    expect(result.mappingRequiredItems).toContain("Client Bank Export Plug-in");
    expect(result.blockedItems).toContain("Client Payment Profile Plug-in");
    expect(result.blockedItems).toContain("Payment Approval Output Plug-in");
    expect(result.status).toBe("blocked");
  });

  test("keeps payment workflows blocked until client-owned data exists", () => {
    const result = buildClientPluginContractsPackage();

    const paymentInput = result.inputPlugins.find((plugin) => plugin.id === "input-plugin-payment-profile");
    const paymentOutput = result.outputPlugins.find((plugin) => plugin.id === "output-plugin-payment-approval");

    expect(paymentInput?.status).toBe("blocked");
    expect(paymentInput?.blockedUntil.length).toBeGreaterThan(0);
    expect(paymentOutput?.approvalRequired).toBe(true);
    expect(paymentOutput?.blockedUntil.some((item) => item.includes("Client-owned payment rails"))).toBe(true);
  });

  test("documents client-specific implementation path", () => {
    const result = buildClientPluginContractsPackage();

    expect(result.integrationRules.some((rule) => rule.includes("normalized FinanceOps fields"))).toBe(true);
    expect(result.integrationRules.some((rule) => rule.includes("Production credentials"))).toBe(true);
    expect(result.clientImplementationPath.length).toBeGreaterThanOrEqual(5);
  });

  test("returns useful validation errors for invalid packages", () => {
    const validation = validateClientPluginContractsPackage({
      title: "",
      clientModel: "wrong"
    });

    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });
});
