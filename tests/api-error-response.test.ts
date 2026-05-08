import { describe, expect, test } from "vitest";

import { buildApiErrorBody } from "../src/api/error-response.js";

describe("standard API error response", () => {
  test("builds a stable not-found style JSON error body", () => {
    const body = buildApiErrorBody(
      "route_not_found",
      "Route not found.",
      {
        method: "GET",
        path: "/missing"
      }
    );

    expect(body.status).toBe("error");
    expect(body.error.code).toBe("route_not_found");
    expect(body.error.message).toBe("Route not found.");
    expect(body.error.method).toBe("GET");
    expect(body.error.path).toBe("/missing");
    expect(body.error.timestamp).toMatch(/T/);
  });

  test("builds a stable internal-error style JSON error body", () => {
    const body = buildApiErrorBody(
      "internal_server_error",
      "Unexpected API error.",
      {
        method: "POST",
        path: "/payments"
      }
    );

    expect(body.status).toBe("error");
    expect(body.error.code).toBe("internal_server_error");
    expect(body.error.message).toBe("Unexpected API error.");
    expect(body.error.method).toBe("POST");
    expect(body.error.path).toBe("/payments");
  });
});
