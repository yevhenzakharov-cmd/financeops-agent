#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client reviewer audit ----"
curl -s "$BASE_URL/client/reviewer-audit" | python3 -m json.tool | head -160
