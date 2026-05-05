import path from "path";
import { safeWriteJson } from "../security/safe-output-policy.js";
import type { ExecutionDecision } from "../execution/auto-executor.js";

export type ApprovalRole = "controller" | "cfo" | "auditor";

export interface ApprovalQueueItem {
  id: string;
  exceptionId: string;
  actionType: string;
  decision: ExecutionDecision["decision"];
  requiredRole: ApprovalRole;
  reason: string;
  status: "pending" | "not_required" | "blocked";
}

export interface ApprovalQueue {
  generatedAt: string;
  items: ApprovalQueueItem[];
}

function requiredRoleForDecision(decision: ExecutionDecision): ApprovalRole {
  if (decision.decision === "denied") return "auditor";
  if (decision.decision === "requires_approval") return "cfo";
  return "controller";
}

export function buildApprovalQueue(
  decisions: ExecutionDecision[]
): ApprovalQueue {
  const items: ApprovalQueueItem[] = decisions.map((decision, index) => {
    const requiredRole = requiredRoleForDecision(decision);

    return {
      id: `approval-${String(index + 1).padStart(3, "0")}`,
      exceptionId: decision.exceptionId,
      actionType: decision.actionType,
      decision: decision.decision,
      requiredRole,
      reason: decision.reason,
      status:
        decision.decision === "requires_approval"
          ? "pending"
          : decision.decision === "denied"
            ? "blocked"
            : "not_required"
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    items
  };
}

export function persistApprovalQueue(queue: ApprovalQueue): void {
  const outputPath = path.resolve("outputs/approvals/latest-approval-queue.json");
  safeWriteJson(outputPath, queue);
}
