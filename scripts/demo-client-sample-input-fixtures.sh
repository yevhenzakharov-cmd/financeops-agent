#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client sample input fixtures ----"
curl -s "$BASE_URL/client/sample-input-fixtures" | python3 -m json.tool | head -240

echo
echo "---- client implementation readiness ----"
curl -s "$BASE_URL/client/implementation-readiness" | python3 -m json.tool | head -120

echo
echo "---- client data request packet ----"
curl -s "$BASE_URL/client/data-request-packet" | python3 -m json.tool | head -120
