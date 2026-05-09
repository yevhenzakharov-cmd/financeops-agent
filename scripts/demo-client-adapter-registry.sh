#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client adapter registry ----"
curl -s "$BASE_URL/client/adapter-registry" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client adapter registry summary ----"
curl -s "$BASE_URL/client/adapter-registry/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client adapter registry validation ----"
curl -s "$BASE_URL/client/adapter-registry/validation" | python3 -m json.tool | sed -n '1,120p'
