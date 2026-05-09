import { describe, expect, test } from "vitest";
import {
  buildClientEvidenceBinder,
  summarizeClientEvidenceBinder,
  validateClientEvidenceBinder
} from "../../src/client-config/client-evidence-binder.js";

describe("client evidence binder", () => {
  test("builds an enterprise evidence binder", () => {
    const binder = buildClientEvidenceBinder();

    expect(binder.binderVersion).toBe("client-evidence-binder-v1");
    expect(binder.status).toBe("production_evidence_blocked");
    expect(binder.items.length).toBeGreaterThanOrEqual(7);
  });

  test("covers required evidence categories", () => {
    const binder = buildClientEvidenceBinder();
    const categories = binder.items.map((item) => item.category);

    expect(categories).toContain("architecture");
    expect(categories).toContain("controls");
    expect(categories).toContain("audit");
    expect(categories).toContain("security");
    expect(categories).toContain("finance");
    expect(categories).toContain("delivery");
    expect(categories).toContain("production_boundary");
  });

  test("references control matrix and red-team report evidence", () => {
    const binder = buildClientEvidenceBinder();
    const sources = binder.items.map((item) => item.evidenceSource);

    expect(sources.some((source) => source.includes("/client/control-matrix"))).toBe(true);
    expect(sources.some((source) => source.includes("/client/enterprise-red-team"))).toBe(true);
  });

  test("summarizes evidence counts", () => {
    const summary = summarizeClientEvidenceBinder();

    expect(summary.binderVersion).toBe("client-evidence-binder-v1");
    expect(summary.itemCount).toBeGreaterThanOrEqual(7);
    expect(summary.demoEvidenceCount).toBeGreaterThanOrEqual(4);
    expect(summary.productionBlockedEvidenceCount).toBeGreaterThanOrEqual(1);
  });

  test("validates the default evidence binder", () => {
    const validation = validateClientEvidenceBinder();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
