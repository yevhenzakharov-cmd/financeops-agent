#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client due diligence pack ----"
curl -s "$BASE_URL/client/due-diligence-pack" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client due diligence pack summary ----"
curl -s "$BASE_URL/client/due-diligence-pack/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client due diligence pack validation ----"
curl -s "$BASE_URL/client/due-diligence-pack/validation" | python3 -m json.tool | sed -n '1,120p'
