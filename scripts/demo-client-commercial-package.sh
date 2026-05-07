#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client commercial value hypothesis ----"
curl -s "$BASE_URL/client/commercial-value-hypothesis" | python3 -m json.tool | head -140

echo
echo "---- client roi model ----"
curl -s "$BASE_URL/client/roi-model" | python3 -m json.tool | head -160

echo
echo "---- client commercial readiness score ----"
curl -s "$BASE_URL/client/commercial-readiness-score" | python3 -m json.tool | head -140

echo
echo "---- client buyer brief ----"
curl -s "$BASE_URL/client/buyer-brief" | python3 -m json.tool | head -180

echo
echo "---- client objection handling ----"
curl -s "$BASE_URL/client/objection-handling" | python3 -m json.tool | head -160

echo
echo "---- client commercial package ----"
curl -s "$BASE_URL/client/commercial-package" | python3 -m json.tool | head -240

echo
echo "---- client commercial summary ----"
curl -s "$BASE_URL/client/commercial-summary" | python3 -m json.tool | head -120
