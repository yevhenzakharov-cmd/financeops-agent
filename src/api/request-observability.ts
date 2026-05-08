import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export type RequestAccessLevel = "public_demo" | "protected_action";

export type RequestObservation = {
  requestId: string;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  observedAt: string;
  accessLevel: RequestAccessLevel;
};

export type RequestObservabilitySummary = {
  status: "ready";
  generatedAt: string;
  window: {
    maxRecentRequests: number;
    storedRequestCount: number;
  };
  totals: {
    requestCount: number;
    publicDemoRequestCount: number;
    protectedActionRequestCount: number;
    averageDurationMs: number;
  };
  methodCounts: Record<string, number>;
  statusCodeCounts: Record<string, number>;
  recentRequests: RequestObservation[];
  reviewerNotes: string[];
};

const MAX_RECENT_REQUESTS = 50;
const recentRequests: RequestObservation[] = [];

function classifyAccessLevel(method: string, path: string): RequestAccessLevel {
  if (method === "POST" && path === "/run-financeops-agent") {
    return "protected_action";
  }

  if (method === "POST" && path.startsWith("/payments/")) {
    return "protected_action";
  }

  return "public_demo";
}

function countBy<T extends string | number>(
  items: RequestObservation[],
  selector: (item: RequestObservation) => T
): Record<string, number> {
  return items.reduce<Record<string, number>>((counts, item) => {
    const key = String(selector(item));
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function averageDurationMs(items: RequestObservation[]): number {
  if (items.length === 0) return 0;

  const total = items.reduce((sum, item) => sum + item.durationMs, 0);
  return Number((total / items.length).toFixed(2));
}

export function recordRequestObservation(observation: RequestObservation): void {
  recentRequests.push(observation);

  if (recentRequests.length > MAX_RECENT_REQUESTS) {
    recentRequests.splice(0, recentRequests.length - MAX_RECENT_REQUESTS);
  }
}

export function resetRequestObservabilityForTests(): void {
  recentRequests.splice(0, recentRequests.length);
}

export function getRecentRequestObservations(limit = 20): RequestObservation[] {
  return recentRequests.slice(-limit).reverse();
}

export function buildRequestObservabilitySummary(): RequestObservabilitySummary {
  const publicDemoRequestCount = recentRequests.filter(
    (request) => request.accessLevel === "public_demo"
  ).length;

  const protectedActionRequestCount = recentRequests.filter(
    (request) => request.accessLevel === "protected_action"
  ).length;

  return {
    status: "ready",
    generatedAt: new Date().toISOString(),
    window: {
      maxRecentRequests: MAX_RECENT_REQUESTS,
      storedRequestCount: recentRequests.length
    },
    totals: {
      requestCount: recentRequests.length,
      publicDemoRequestCount,
      protectedActionRequestCount,
      averageDurationMs: averageDurationMs(recentRequests)
    },
    methodCounts: countBy(recentRequests, (request) => request.method),
    statusCodeCounts: countBy(recentRequests, (request) => request.statusCode),
    recentRequests: getRecentRequestObservations(10),
    reviewerNotes: [
      "Request observability is intentionally demo-safe and in-memory.",
      "Each request receives an x-request-id response header for traceability.",
      "Production implementations should send structured logs and metrics to the client-owned logging stack.",
      "No request bodies, API keys, payment payloads, or client-owned secrets are stored in this public demo layer."
    ]
  };
}

export function createRequestObservabilityMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const incomingRequestId = req.header("x-request-id");
    const requestId =
      incomingRequestId && incomingRequestId.trim().length > 0
        ? incomingRequestId
        : randomUUID();

    const startedAt = process.hrtime.bigint();

    res.setHeader("x-request-id", requestId);

    res.on("finish", () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

      recordRequestObservation({
        requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        durationMs: Number(durationMs.toFixed(2)),
        observedAt: new Date().toISOString(),
        accessLevel: classifyAccessLevel(req.method, req.path)
      });
    });

    next();
  };
}
