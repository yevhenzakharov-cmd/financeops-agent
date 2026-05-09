#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client implementation manifest ----"
curl -s "$BASE_URL/client/implementation-manifest" | python3 -m json.tool | sed -n '1,160p'

echo
echo "---- client implementation manifest summary ----"
curl -s "$BASE_URL/client/implementation-manifest/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client implementation manifest validation ----"
curl -s "$BASE_URL/client/implementation-manifest/validation" | python3 -m json.tool | sed -n '1,120p'
