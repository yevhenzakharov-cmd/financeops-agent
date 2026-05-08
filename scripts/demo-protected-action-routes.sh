#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"
DEMO_API_KEY="${DEMO_API_KEY:-local-demo-key}"

echo "---- demo auth status ----"
curl -s "$BASE_URL/security/demo-auth-status" | python3 -m json.tool | sed -n '1,100p'

echo
echo "---- protected run without key ----"
curl -s "$BASE_URL/run-financeops-agent" \
  -X POST \
  -H "Content-Type: application/json" | python3 -m json.tool | sed -n '1,100p'

echo
echo "---- protected run with key ----"
curl -s "$BASE_URL/run-financeops-agent" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "x-demo-api-key: $DEMO_API_KEY" | python3 -m json.tool | sed -n '1,120p'
