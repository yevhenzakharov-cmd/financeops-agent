import { describe, expect, test } from "vitest";
import {
  buildClientControlMatrix,
  summarizeClientControlMatrix,
  validateClientControlMatrix
} from "../../src/client-config/client-control-matrix.js";

describe("client control matrix", () => {
  test("builds an enterprise control matrix", () => {
    const matrix = buildClientControlMatrix();

    expect(matrix.matrixVersion).toBe("client-control-matrix-v1");
    expect(matrix.status).toBe("production_blocked");
    expect(matrix.items.length).toBeGreaterThanOrEqual(8);
  });

  test("covers required control categories", () => {
    const matrix = buildClientControlMatrix();
    const categories = matrix.items.map((item) => item.category);

    expect(categories).toContain("data");
    expect(categories).toContain("auth");
    expect(categories).toContain("secrets");
    expect(categories).toContain("payments");
    expect(categories).toContain("accounting");
    expect(categories).toContain("audit");
    expect(categories).toContain("monitoring");
    expect(categories).toContain("ai_boundary");
  });

  test("keeps payment, secret, and auth controls blocked until client-owned", () => {
    const matrix = buildClientControlMatrix();

    expect(matrix.items.find((item) => item.id === "control-payment-human-approval")?.status).toBe(
      "blocked_until_client_owned"
    );
    expect(matrix.items.find((item) => item.id === "control-secret-management")?.status).toBe(
      "blocked_until_client_owned"
    );
    expect(matrix.items.find((item) => item.id === "control-client-owned-auth")?.status).toBe(
      "blocked_until_client_owned"
    );
  });

  test("summarizes control counts", () => {
    const summary = summarizeClientControlMatrix();

    expect(summary.matrixVersion).toBe("client-control-matrix-v1");
    expect(summary.itemCount).toBeGreaterThanOrEqual(8);
    expect(summary.blockedUntilClientOwnedControls).toBeGreaterThanOrEqual(3);
  });

  test("validates the default control matrix", () => {
    const validation = validateClientControlMatrix();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
