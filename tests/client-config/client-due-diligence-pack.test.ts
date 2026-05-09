import { describe, expect, test } from "vitest";
import {
  buildClientDueDiligencePack,
  summarizeClientDueDiligencePack,
  validateClientDueDiligencePack
} from "../../src/client-config/client-due-diligence-pack.js";

describe("client due diligence pack", () => {
  test("builds an enterprise due diligence pack", () => {
    const pack = buildClientDueDiligencePack();

    expect(pack.packVersion).toBe("client-due-diligence-pack-v1");
    expect(pack.items.length).toBeGreaterThanOrEqual(6);
    expect(pack.buyerSummary).toContain("production remains blocked");
  });

  test("covers required enterprise review areas", () => {
    const pack = buildClientDueDiligencePack();
    const areas = pack.items.map((item) => item.area);

    expect(areas).toContain("data");
    expect(areas).toContain("security");
    expect(areas).toContain("controls");
    expect(areas).toContain("finance");
    expect(areas).toContain("audit");
    expect(areas).toContain("deployment");
  });

  test("keeps money movement and auth blocked until client-owned controls exist", () => {
    const pack = buildClientDueDiligencePack();

    expect(pack.items.find((item) => item.id === "dd-money-movement-control")?.status).toBe(
      "blocked_until_client_owned"
    );
    expect(pack.items.find((item) => item.id === "dd-auth-and-authorization")?.status).toBe(
      "blocked_until_client_owned"
    );
  });

  test("summarizes due diligence review counts", () => {
    const summary = summarizeClientDueDiligencePack();

    expect(summary.packVersion).toBe("client-due-diligence-pack-v1");
    expect(summary.itemCount).toBeGreaterThanOrEqual(6);
    expect(summary.blockedItems).toBeGreaterThanOrEqual(2);
    expect(summary.requiredClientAnswerCount).toBeGreaterThanOrEqual(1);
  });

  test("validates the default due diligence pack", () => {
    const validation = validateClientDueDiligencePack();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
