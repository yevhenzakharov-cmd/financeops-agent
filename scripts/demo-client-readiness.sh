#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client onboarding questionnaire ----"
curl -s "$BASE_URL/client/onboarding-questionnaire" | python3 -m json.tool | head -120

echo "\n---- client field coverage ----"
curl -s "$BASE_URL/client/field-coverage" | python3 -m json.tool | head -120

echo "\n---- client data request packet ----"
curl -s "$BASE_URL/client/data-request-packet" | python3 -m json.tool | head -120

echo "\n---- client governance brief ----"
curl -s "$BASE_URL/client/governance-brief" | python3 -m json.tool | head -120

echo "\n---- client implementation readiness ----"
curl -s "$BASE_URL/client/implementation-readiness" | python3 -m json.tool | head -160
