#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client pilot decision packet ----"
curl -s "$BASE_URL/client/pilot-decision-packet" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client pilot decision packet summary ----"
curl -s "$BASE_URL/client/pilot-decision-packet/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client pilot decision packet validation ----"
curl -s "$BASE_URL/client/pilot-decision-packet/validation" | python3 -m json.tool | sed -n '1,120p'
