#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client enterprise red team ----"
curl -s "$BASE_URL/client/enterprise-red-team" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client enterprise red team summary ----"
curl -s "$BASE_URL/client/enterprise-red-team/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client enterprise red team validation ----"
curl -s "$BASE_URL/client/enterprise-red-team/validation" | python3 -m json.tool | sed -n '1,120p'
