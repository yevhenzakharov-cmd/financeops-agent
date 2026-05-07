#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client adapter blueprint ----"
curl -s "$BASE_URL/client/adapter-blueprint" | python3 -m json.tool | head -140

echo
echo "---- client output delivery plan ----"
curl -s "$BASE_URL/client/output-delivery-plan" | python3 -m json.tool | head -140

echo
echo "---- client deployment checklist ----"
curl -s "$BASE_URL/client/deployment-checklist" | python3 -m json.tool | head -140

echo
echo "---- client build package ----"
curl -s "$BASE_URL/client/build-package" | python3 -m json.tool | head -180
