#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"
IDEMPOTENCY_KEY="${IDEMPOTENCY_KEY:-demo-payment-key-script-$(date +%s)}"

echo "---- health ----"
curl -s "$BASE_URL/health" | python3 -m json.tool

echo ""
echo "---- system summary ----"
curl -s "$BASE_URL/system-summary" | python3 -m json.tool

echo ""
echo "---- run financeops agent: payment recommendations ----"
curl -s -X POST "$BASE_URL/run-financeops-agent" \
  | python3 -m json.tool \
  | grep -A 25 "paymentRecommendations"

echo ""
echo "---- approve and send mock payment ----"
curl -s -X POST "$BASE_URL/payments/payrec-001/approve-and-send" \
  -H "Content-Type: application/json" \
  -d "{\"approvedBy\":\"demo-cfo\",\"idempotencyKey\":\"$IDEMPOTENCY_KEY\"}" \
  | python3 -m json.tool

echo ""
echo "---- persisted payment execution record ----"
cat outputs/payments/latest-payment-execution.json
echo ""

echo ""
echo "---- persisted client output artifact ----"
cat outputs/artifacts/latest-output-artifact.json
echo ""

echo ""
echo "---- latest client output artifact API endpoint ----"
curl -s "$BASE_URL/artifacts/latest-output" | python3 -m json.tool | head -n 60
echo ""

echo ""
echo "---- compact dashboard artifact API endpoint ----"
curl -s "$BASE_URL/artifacts/latest-dashboard" | python3 -m json.tool
echo ""

echo ""
echo "---- artifact status endpoint ----"
curl -s "$BASE_URL/artifacts/status" | python3 -m json.tool
echo ""

echo ""
echo "---- artifact health endpoint ----"
curl -s "$BASE_URL/artifacts/health" | python3 -m json.tool
echo ""

echo ""
echo "---- artifact names endpoint ----"
curl -s "$BASE_URL/artifacts/names" | python3 -m json.tool
echo ""

echo ""
echo "---- artifact summaries endpoint ----"
curl -s "$BASE_URL/artifacts/summaries" | python3 -m json.tool | head -n 80
echo ""

echo ""
echo "---- available artifact names endpoint ----"
curl -s "$BASE_URL/artifacts/available-names" | python3 -m json.tool
echo ""

echo ""
echo "---- missing artifact names endpoint ----"
curl -s "$BASE_URL/artifacts/missing-names" | python3 -m json.tool
echo ""

echo ""
echo "---- named artifact endpoint: execution ledger ----"
curl -s "$BASE_URL/artifacts/executionLedger" | python3 -m json.tool | head -n 50
echo ""

echo ""
echo "---- named artifact endpoint: client output artifact ----"
curl -s "$BASE_URL/artifacts/clientOutputArtifact" | python3 -m json.tool | head -n 50
echo ""
