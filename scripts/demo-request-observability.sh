#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- generate sample observable requests ----"
curl -s "$BASE_URL/health" > /dev/null
curl -s "$BASE_URL/system-summary" > /dev/null
curl -s "$BASE_URL/openapi.json" > /dev/null

echo "---- request observability summary ----"
curl -s "$BASE_URL/observability/request-summary" | python3 -m json.tool | sed -n '1,160p'

echo "---- recent requests ----"
curl -s "$BASE_URL/observability/recent-requests" | python3 -m json.tool | sed -n '1,160p'
