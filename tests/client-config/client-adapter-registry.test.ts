import { describe, expect, test } from "vitest";
import {
  buildClientAdapterRegistry,
  summarizeClientAdapterRegistry,
  validateClientAdapterRegistry
} from "../../src/client-config/client-adapter-registry.js";

describe("client adapter registry", () => {
  test("builds a registry for client-specific input, output, approval, and audit adapters", () => {
    const registry = buildClientAdapterRegistry();

    expect(registry.registryVersion).toBe("client-adapter-registry-v1");
    expect(registry.adapters.length).toBeGreaterThanOrEqual(8);
    expect(registry.adapters.some((adapter) => adapter.kind === "input")).toBe(true);
    expect(registry.adapters.some((adapter) => adapter.kind === "output")).toBe(true);
    expect(registry.adapters.some((adapter) => adapter.kind === "approval")).toBe(true);
    expect(registry.adapters.some((adapter) => adapter.kind === "audit")).toBe(true);
  });

  test("keeps payment profile adapter blocked until client-owned setup exists", () => {
    const registry = buildClientAdapterRegistry();

    const paymentAdapter = registry.adapters.find(
      (adapter) => adapter.id === "adapter-input-payment-profiles"
    );

    expect(paymentAdapter).toBeDefined();
    expect(paymentAdapter?.status).toBe("blocked_until_client_owned");
    expect(registry.missingClientOwnedAdapters).toContain("Vendor payment profile adapter");
  });

  test("identifies reusable core adapters separately from client-mapped adapters", () => {
    const registry = buildClientAdapterRegistry();

    expect(registry.reusableCoreAdapters).toContain("CFO briefing output adapter");
    expect(registry.reusableCoreAdapters).toContain("Exception queue output adapter");
    expect(registry.mappingRequiredAdapters).toContain("Bank transaction input adapter");
  });

  test("summarizes adapter counts for reviewers", () => {
    const summary = summarizeClientAdapterRegistry();

    expect(summary.registryVersion).toBe("client-adapter-registry-v1");
    expect(summary.adapterCount).toBeGreaterThanOrEqual(8);
    expect(summary.inputAdapterCount).toBeGreaterThanOrEqual(3);
    expect(summary.outputAdapterCount).toBeGreaterThanOrEqual(3);
    expect(summary.missingClientOwnedAdapterCount).toBeGreaterThanOrEqual(1);
  });

  test("validates the default adapter registry", () => {
    const validation = validateClientAdapterRegistry();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
