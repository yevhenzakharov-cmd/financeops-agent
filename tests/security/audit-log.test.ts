import { describe, expect, test } from "vitest";

import {
  createAuditLog,
  finalizeAuditLog,
  recordAuditEvent
} from "../../src/security/audit-log.js";

describe("audit log", () => {
  test("creates audit log with trace id and empty events", () => {
    const audit = createAuditLog();

    expect(audit.traceId.length).toBeGreaterThan(0);
    expect(audit.startedAt).toMatch(/T/);
    expect(audit.events).toEqual([]);
  });

  test("records audit event with matching trace id", () => {
    const audit = createAuditLog();

    recordAuditEvent(audit, "analysis", "test_event", {
      source: "unit-test",
      count: 1
    });

    expect(audit.events).toHaveLength(1);
    expect(audit.events[0]?.traceId).toBe(audit.traceId);
    expect(audit.events[0]?.phase).toBe("analysis");
    expect(audit.events[0]?.type).toBe("test_event");
    expect(audit.events[0]?.metadata).toEqual({
      source: "unit-test",
      count: 1
    });
  });

  test("finalizes audit log with finished timestamp", () => {
    const audit = createAuditLog();

    finalizeAuditLog(audit);

    expect(audit.finishedAt).toBeDefined();
    expect(audit.finishedAt).toMatch(/T/);
  });
});
