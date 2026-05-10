#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- accounting workflow demo routes ----"
curl -s "$BASE_URL/accounting/workflows/demo-routes" | python3 -m json.tool | sed -n "1,180p"

echo
echo "---- route payment workflow intent ----"
curl -s -X POST "$BASE_URL/accounting/workflows/route" \
  -H "content-type: application/json" \
  -d '{
    "id": "demo-payment-route",
    "title": "Prepare vendor payment approval",
    "requestedOutcome": "Validate invoice data and prepare a CFO approval package before money movement.",
    "keywords": ["vendor payment", "approval", "money movement"],
    "clientOutputDestination": "approval queue"
  }' | python3 -m json.tool

echo
echo "---- route external writeback workflow intent ----"
curl -s -X POST "$BASE_URL/accounting/workflows/route" \
  -H "content-type: application/json" \
  -d '{
    "id": "demo-writeback-route",
    "title": "Write approved exception status to client ERP",
    "requestedOutcome": "Prepare a dry-run payload for an external system writeback.",
    "keywords": ["erp", "writeback", "external system"],
    "clientOutputDestination": "client ERP"
  }' | python3 -m json.tool

echo
echo "---- invalid workflow intent check ----"
curl -s -X POST "$BASE_URL/accounting/workflows/route" \
  -H "content-type: application/json" \
  -d '{"title":"Missing requested outcome"}' | python3 -m json.tool
