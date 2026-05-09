#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client security questionnaire package ----"
curl -s "$BASE_URL/client/security-questionnaire-package" | python3 -m json.tool | sed -n '1,180p'

echo
echo "---- client security questionnaire package summary ----"
curl -s "$BASE_URL/client/security-questionnaire-package/summary" | python3 -m json.tool | sed -n '1,120p'

echo
echo "---- client security questionnaire package validation ----"
curl -s "$BASE_URL/client/security-questionnaire-package/validation" | python3 -m json.tool | sed -n '1,120p'
