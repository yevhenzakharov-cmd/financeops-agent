#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client validation matrix ----"
curl -s "$BASE_URL/client/validation-matrix" | python3 -m json.tool | head -260

echo
echo "---- client security boundary ----"
curl -s "$BASE_URL/client/security-boundary" | python3 -m json.tool | head -120

echo
echo "---- client sample input fixtures ----"
curl -s "$BASE_URL/client/sample-input-fixtures" | python3 -m json.tool | head -120
