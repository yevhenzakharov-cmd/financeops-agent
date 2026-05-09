#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client control matrix ----"
curl -s "$BASE_URL/client/control-matrix" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client control matrix summary ----"
curl -s "$BASE_URL/client/control-matrix/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client control matrix validation ----"
curl -s "$BASE_URL/client/control-matrix/validation" | python3 -m json.tool | sed -n '1,120p'
