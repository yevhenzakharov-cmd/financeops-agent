#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- client sales narrative ----"
curl -s "$BASE_URL/client/sales-narrative" | python3 -m json.tool | head -100

echo
echo "---- client demo agenda ----"
curl -s "$BASE_URL/client/demo-agenda" | python3 -m json.tool | head -100

echo
echo "---- client follow-up email ----"
curl -s "$BASE_URL/client/follow-up-email" | python3 -m json.tool | head -120

echo
echo "---- client buyer faq ----"
curl -s "$BASE_URL/client/buyer-faq" | python3 -m json.tool | head -120

echo
echo "---- client sales handoff package ----"
curl -s "$BASE_URL/client/sales-handoff-package" | python3 -m json.tool | head -160
