import { randomUUID } from "crypto";
import path from "path";

import type {
  AuditLog,
  AuditEvent,
  AuditPhase
} from "../domain/schemas.js";

import { safeWriteJson } from "./safe-output-policy.js";

function nowISO(): string {
  return new Date().toISOString();
}

function generateEventId(): string {
  return randomUUID();
}

export function createAuditLog(): AuditLog {
  return {
    traceId: randomUUID(),
    startedAt: nowISO(),
    events: []
  };
}

export function recordAuditEvent(
  auditLog: AuditLog,
  phase: AuditPhase,
  type: string,
  metadata: Record<string, unknown>
): void {
  const event: AuditEvent = {
    id: generateEventId(),
    traceId: auditLog.traceId,
    timestamp: nowISO(),
    phase,
    type,
    metadata
  };

  auditLog.events.push(event);
}

export function finalizeAuditLog(auditLog: AuditLog): void {
  auditLog.finishedAt = nowISO();
}

export function persistAuditLog(auditLog: AuditLog): void {
  const outputDir = path.resolve("outputs/audit");
  const outputPath = path.join(outputDir, "latest-audit-log.json");

  safeWriteJson(outputPath, auditLog);
}
