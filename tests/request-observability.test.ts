import { beforeEach, describe, expect, test } from "vitest";
import {
  buildRequestObservabilitySummary,
  createRequestObservabilityMiddleware,
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
    expect(summary.totals.averageDurationMs).toBe(0);
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

  test("limits recent request summaries to the newest ten requests", () => {
    for (let index = 0; index < 12; index += 1) {
      recordRequestObservation({
        requestId: `req-${index}`,
        method: "GET",
        path: "/health",
        statusCode: 200,
        durationMs: 1,
        observedAt: "2026-05-09T00:00:00.000Z",
        accessLevel: "public_demo"
      });
    }

    const summary = buildRequestObservabilitySummary();

    expect(summary.recentRequests).toHaveLength(10);
    expect(summary.recentRequests[0]?.requestId).toBe("req-11");
    expect(summary.recentRequests[9]?.requestId).toBe("req-2");
  });

  test("middleware preserves incoming request id and classifies protected finance run route", () => {
    const middleware = createRequestObservabilityMiddleware();
    const finishCallbacks: Array<() => void> = [];
    const headers: Record<string, string> = {};

    const req = {
      method: "POST",
      path: "/run-financeops-agent",
      header: (name: string) => (name === "x-request-id" ? "incoming-req-id" : undefined)
    };

    const res = {
      statusCode: 202,
      setHeader: (name: string, value: string) => {
        headers[name] = value;
      },
      on: (event: string, callback: () => void) => {
        if (event === "finish") {
          finishCallbacks.push(callback);
        }
      }
    };

    let nextCalled = false;

    middleware(req as never, res as never, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
    expect(headers["x-request-id"]).toBe("incoming-req-id");

    finishCallbacks.forEach((callback) => callback());

    const [observation] = getRecentRequestObservations(1);

    expect(observation?.requestId).toBe("incoming-req-id");
    expect(observation?.accessLevel).toBe("protected_action");
    expect(observation?.statusCode).toBe(202);
  });

  test("middleware generates request id and classifies payment routes as protected actions", () => {
    const middleware = createRequestObservabilityMiddleware();
    const finishCallbacks: Array<() => void> = [];
    const headers: Record<string, string> = {};

    const req = {
      method: "POST",
      path: "/payments/payrec-001/approve-and-send",
      header: () => "   "
    };

    const res = {
      statusCode: 200,
      setHeader: (name: string, value: string) => {
        headers[name] = value;
      },
      on: (event: string, callback: () => void) => {
        if (event === "finish") {
          finishCallbacks.push(callback);
        }
      }
    };

    middleware(req as never, res as never, () => undefined);
    finishCallbacks.forEach((callback) => callback());

    const [observation] = getRecentRequestObservations(1);

    expect(headers["x-request-id"]).toBeDefined();
    expect(headers["x-request-id"]?.trim().length).toBeGreaterThan(0);
    expect(observation?.requestId).toBe(headers["x-request-id"]);
    expect(observation?.accessLevel).toBe("protected_action");
  });
});
