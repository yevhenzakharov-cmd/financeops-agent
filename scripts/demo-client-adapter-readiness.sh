#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client implementation readiness ----"
curl -s "$BASE_URL/client/implementation-readiness" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client adapter blueprint ----"
curl -s "$BASE_URL/client/adapter-blueprint" | python3 -m json.tool | sed -n '1,140p'

echo
echo "---- client output delivery plan ----"
curl -s "$BASE_URL/client/output-delivery-plan" | python3 -m json.tool | sed -n '1,140p'

echo
echo "---- client build package ----"
curl -s "$BASE_URL/client/build-package" | python3 -m json.tool | sed -n '1,160p'

echo
echo "---- client adapter registry summary ----"
curl -s "$BASE_URL/client/adapter-registry/summary" | python3 -m json.tool

echo
echo "---- client adapter registry validation ----"
curl -s "$BASE_URL/client/adapter-registry/validation" | python3 -m json.tool
