import { describe, expect, test } from "vitest";

import {
  buildAuditVisibilityPackage,
  getAuditHealth,
  getAuditLogPath,
  summarizeLatestAuditLog
} from "../src/api/audit-read-service.js";

describe("audit read service", () => {
  test("exposes a stable audit log path", () => {
    expect(getAuditLogPath()).toContain("outputs/audit/latest-audit-log.json");
  });

  test("returns audit health with stable shape", () => {
    const health = getAuditHealth();

    expect(["healthy", "missing", "invalid"]).toContain(health.status);
    expect(typeof health.exists).toBe("boolean");
    expect(health.path).toContain("latest-audit-log.json");
    expect(health.eventCount).toBeGreaterThanOrEqual(0);
    expect(health.message.length).toBeGreaterThan(0);
  });

  test("summarizes audit log when available", () => {
    const summary = summarizeLatestAuditLog();

    if (!summary) {
      expect(summary).toBeNull();
      return;
    }

    expect(summary.traceId.length).toBeGreaterThan(0);
    expect(summary.startedAt).toMatch(/T/);
    expect(summary.eventCount).toBeGreaterThanOrEqual(0);
    expect(Object.keys(summary.phases).length).toBeGreaterThanOrEqual(0);
    expect(Object.keys(summary.eventTypes).length).toBeGreaterThanOrEqual(0);
    expect(summary.latestEvents.length).toBeLessThanOrEqual(5);
  });

  test("builds audit visibility package for reviewers", () => {
    const result = buildAuditVisibilityPackage();

    expect(result.title).toBe("Audit Visibility Package");
    expect(result.generatedAt).toMatch(/T/);
    expect(result.health).toBeDefined();
    expect(result.reviewerNotes.length).toBeGreaterThan(0);
    expect(result.reviewerNotes.some((note) => note.includes("traceability"))).toBe(true);
  });
});
