#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client deployment profile ----"
curl -s "$BASE_URL/client/deployment-profile" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client deployment profile summary ----"
curl -s "$BASE_URL/client/deployment-profile/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client deployment profile validation ----"
curl -s "$BASE_URL/client/deployment-profile/validation" | python3 -m json.tool | sed -n '1,120p'
