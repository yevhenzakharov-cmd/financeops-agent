import { beforeEach, describe, expect, test } from "vitest";
import {
  buildRequestObservabilitySummary,
  getRecentRequestObservations,
  recordRequestObservation,
  resetRequestObservabilityForTests
} from "../src/api/request-observability.js";

describe("request observability", () => {
  beforeEach(() => {
    resetRequestObservabilityForTests();
  });

  test("builds an empty demo-safe summary", () => {
    const summary = buildRequestObservabilitySummary();

    expect(summary.status).toBe("ready");
    expect(summary.totals.requestCount).toBe(0);
    expect(summary.window.maxRecentRequests).toBe(50);
    expect(summary.reviewerNotes.some((note) => note.includes("demo-safe"))).toBe(true);
  });

  test("records method, status, duration, and access level counts", () => {
    recordRequestObservation({
      requestId: "req-public",
      method: "GET",
      path: "/health",
      statusCode: 200,
      durationMs: 12.5,
      observedAt: "2026-05-09T00:00:00.000Z",
      accessLevel: "public_demo"
    });

    recordRequestObservation({
      requestId: "req-protected",
      method: "POST",
      path: "/run-financeops-agent",
      statusCode: 401,
      durationMs: 4.5,
      observedAt: "2026-05-09T00:00:01.000Z",
      accessLevel: "protected_action"
    });

    const summary = buildRequestObservabilitySummary();

    expect(summary.totals.requestCount).toBe(2);
    expect(summary.totals.publicDemoRequestCount).toBe(1);
    expect(summary.totals.protectedActionRequestCount).toBe(1);
    expect(summary.totals.averageDurationMs).toBe(8.5);
    expect(summary.methodCounts.GET).toBe(1);
    expect(summary.methodCounts.POST).toBe(1);
    expect(summary.statusCodeCounts["200"]).toBe(1);
    expect(summary.statusCodeCounts["401"]).toBe(1);
  });

  test("returns newest requests first", () => {
    recordRequestObservation({
      requestId: "req-1",
      method: "GET",
      path: "/health",
      statusCode: 200,
      durationMs: 1,
      observedAt: "2026-05-09T00:00:00.000Z",
      accessLevel: "public_demo"
    });

    recordRequestObservation({
      requestId: "req-2",
      method: "GET",
      path: "/system-summary",
      statusCode: 200,
      durationMs: 2,
      observedAt: "2026-05-09T00:00:01.000Z",
      accessLevel: "public_demo"
    });

    expect(getRecentRequestObservations(2).map((request) => request.requestId)).toEqual([
      "req-2",
      "req-1"
    ]);
  });

  test("keeps only the most recent request window", () => {
    for (let index = 0; index < 55; index += 1) {
      recordRequestObservation({
        requestId: `req-${index}`,
        method: "GET",
        path: "/health",
        statusCode: 200,
        durationMs: index,
        observedAt: "2026-05-09T00:00:00.000Z",
        accessLevel: "public_demo"
      });
    }

    const summary = buildRequestObservabilitySummary();

    expect(summary.window.storedRequestCount).toBe(50);
    expect(getRecentRequestObservations(1)[0]?.requestId).toBe("req-54");
  });
});
