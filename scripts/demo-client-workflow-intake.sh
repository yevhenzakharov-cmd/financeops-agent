#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- mock client workflow intake plan ----"
curl -s "$BASE_URL/client-requirements/mock-client/workflow-intake-plan" \
  | python3 -m json.tool \
  | sed -n "1,220p"

echo
echo "---- custom client workflow intake plan ----"
curl -s -X POST "$BASE_URL/client-requirements/workflow-intake-plan" \
  -H "content-type: application/json" \
  -d '{
    "clientName": "Example Client Finance Team",
    "industryNotes": "Remote services company with invoices, vendor payouts, bank exports, and manual approval workflows.",
    "currentAccountingPain": "Accountants spend too much time preparing payment approvals, reviewing overdue invoices, and checking reconciliation exceptions.",
    "inputTypesAvailable": ["csv", "bank_export", "payment_processor_export"],
    "desiredOutputs": ["approval_queue", "cfo_briefing", "dashboard_payload"],
    "priorityTasks": ["payment_approval_request", "overdue_invoice_detection", "approved_status_writeback_to_database"],
    "approvalRequirements": ["Human approval required before money movement.", "Controller review required for writeback."],
    "implementationNotes": ["Start with client-shaped mock data before production adapters."]
  }' \
  | python3 -m json.tool \
  | sed -n "1,260p"

echo
echo "---- invalid client workflow intake check ----"
curl -s -X POST "$BASE_URL/client-requirements/workflow-intake-plan" \
  -H "content-type: application/json" \
  -d '{"industryNotes":"missing clientName"}' \
  | python3 -m json.tool
