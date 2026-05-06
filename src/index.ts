import "dotenv/config";

import { runFinanceOpsPipeline } from "./pipeline/run-financeops-pipeline.js";

(async () => {
  console.log("FinanceOps Agent — Governed FinanceOps Platform\n");

  const result = await runFinanceOpsPipeline();

  console.log(`Execution Mode: ${result.mode}\n`);
  console.log("Execution Complete.\n");

  console.log("=== CFO Summary ===");
  console.log(result.cfoBriefing.executiveSummary);
  console.log(`Confidence Score: ${result.cfoBriefing.confidenceScore}\n`);

  console.log("=== Selected Strategies ===");
  result.selectedActions.forEach((action) => {
    console.log(
      `Exception: ${action.exceptionId} | Selected Action: ${action.actionType}`
    );
  });

  console.log("\n=== Governance Decisions ===");
  result.decisions.forEach((decision) => {
    console.log(
      `Exception: ${decision.exceptionId} | Action: ${decision.actionType} | Decision: ${decision.decision} | Reason: ${decision.reason}`
    );
  });

  console.log("\n=== Approval Queue ===");
  result.approvalQueue.items.forEach((item) => {
    console.log(
      `Approval: ${item.id} | Role: ${item.requiredRole} | Status: ${item.status} | Action: ${item.actionType}`
    );
  });

  console.log("\nExecution ledger written to outputs/ledger/latest-execution-ledger.json");
  console.log("Approval queue written to outputs/approvals/latest-approval-queue.json");
})();
