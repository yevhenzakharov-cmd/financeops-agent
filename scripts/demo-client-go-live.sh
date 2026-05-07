#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client go-live checklist ----"
curl -s "$BASE_URL/client/go-live-checklist" | python3 -m json.tool | head -140

echo
echo "---- client go-live risk report ----"
curl -s "$BASE_URL/client/go-live-risk-report" | python3 -m json.tool | head -140

echo
echo "---- client go-live decision ----"
curl -s "$BASE_URL/client/go-live-decision" | python3 -m json.tool | head -180

echo
echo "---- client launch brief ----"
curl -s "$BASE_URL/client/launch-brief" | python3 -m json.tool | head -140

echo
echo "---- client go-live package ----"
curl -s "$BASE_URL/client/go-live-package" | python3 -m json.tool | head -220
