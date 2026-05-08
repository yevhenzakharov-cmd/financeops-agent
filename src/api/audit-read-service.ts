import fs from "fs";
import path from "path";

export interface AuditEventPreview {
  id: string;
  traceId: string;
  timestamp: string;
  phase: string;
  type: string;
  metadataKeys: string[];
}

export interface AuditLogFile {
  traceId: string;
  startedAt: string;
  finishedAt?: string;
  events: AuditEventFile[];
}

interface AuditEventFile {
  id: string;
  traceId: string;
  timestamp: string;
  phase: string;
  type: string;
  metadata?: Record<string, unknown>;
}

export interface AuditHealth {
  status: "healthy" | "missing" | "invalid";
  path: string;
  exists: boolean;
  eventCount: number;
  message: string;
}

export interface AuditSummary {
  traceId: string;
  startedAt: string;
  finishedAt: string | null;
  eventCount: number;
  phases: Record<string, number>;
  eventTypes: Record<string, number>;
  latestEvents: AuditEventPreview[];
}

export interface AuditVisibilityPackage {
  title: string;
  generatedAt: string;
  health: AuditHealth;
  summary: AuditSummary | null;
  reviewerNotes: string[];
}

const AUDIT_LOG_PATH = path.resolve("outputs/audit/latest-audit-log.json");

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAuditEvent(value: unknown): value is AuditEventFile {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.traceId === "string" &&
    typeof value.timestamp === "string" &&
    typeof value.phase === "string" &&
    typeof value.type === "string"
  );
}

function isAuditLog(value: unknown): value is AuditLogFile {
  if (!isRecord(value)) return false;
  if (typeof value.traceId !== "string") return false;
  if (typeof value.startedAt !== "string") return false;
  if (value.finishedAt !== undefined && typeof value.finishedAt !== "string") return false;
  if (!Array.isArray(value.events)) return false;

  return value.events.every(isAuditEvent);
}

function countBy(items: string[]): Record<string, number> {
  return items.reduce<Record<string, number>>((counts, item) => {
    counts[item] = (counts[item] ?? 0) + 1;
    return counts;
  }, {});
}

function toAuditEventPreview(event: AuditEventFile): AuditEventPreview {
  return {
    id: event.id,
    traceId: event.traceId,
    timestamp: event.timestamp,
    phase: event.phase,
    type: event.type,
    metadataKeys: event.metadata ? Object.keys(event.metadata) : []
  };
}

export function getAuditLogPath(): string {
  return AUDIT_LOG_PATH;
}

export function readLatestAuditLog(): AuditLogFile | null {
  if (!fs.existsSync(AUDIT_LOG_PATH)) {
    return null;
  }

  const parsed: unknown = JSON.parse(fs.readFileSync(AUDIT_LOG_PATH, "utf-8"));

  if (!isAuditLog(parsed)) {
    throw new Error("Latest audit log has an invalid shape.");
  }

  return parsed;
}

export function getAuditHealth(): AuditHealth {
  if (!fs.existsSync(AUDIT_LOG_PATH)) {
    return {
      status: "missing",
      path: AUDIT_LOG_PATH,
      exists: false,
      eventCount: 0,
      message: "Latest audit log has not been generated yet. Run the FinanceOps pipeline first."
    };
  }

  try {
    const auditLog = readLatestAuditLog();

    return {
      status: auditLog ? "healthy" : "missing",
      path: AUDIT_LOG_PATH,
      exists: Boolean(auditLog),
      eventCount: auditLog?.events.length ?? 0,
      message: auditLog
        ? "Latest audit log is available and readable."
        : "Latest audit log has not been generated yet."
    };
  } catch {
    return {
      status: "invalid",
      path: AUDIT_LOG_PATH,
      exists: true,
      eventCount: 0,
      message: "Latest audit log exists but could not be parsed or validated."
    };
  }
}

export function summarizeLatestAuditLog(): AuditSummary | null {
  const auditLog = readLatestAuditLog();

  if (!auditLog) {
    return null;
  }

  return {
    traceId: auditLog.traceId,
    startedAt: auditLog.startedAt,
    finishedAt: auditLog.finishedAt ?? null,
    eventCount: auditLog.events.length,
    phases: countBy(auditLog.events.map((event) => event.phase)),
    eventTypes: countBy(auditLog.events.map((event) => event.type)),
    latestEvents: auditLog.events.slice(-5).map(toAuditEventPreview)
  };
}

export function buildAuditVisibilityPackage(): AuditVisibilityPackage {
  const health = getAuditHealth();
  const summary = health.status === "healthy"
    ? summarizeLatestAuditLog()
    : null;

  return {
    title: "Audit Visibility Package",
    generatedAt: new Date().toISOString(),
    health,
    summary,
    reviewerNotes: [
      "Audit endpoints expose traceability without requiring a reviewer to inspect raw output files.",
      "Event previews intentionally show metadata keys rather than full metadata payloads.",
      "Run the protected FinanceOps pipeline route to regenerate the latest audit log.",
      "Production implementations should keep audit access role-gated and client-owned."
    ]
  };
}
