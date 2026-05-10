#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"

echo "---- accounting task registry ----"
curl -s "$BASE_URL/accounting/tasks" | python3 -m json.tool | sed -n "1,120p"

echo
echo "---- payment approval task template ----"
curl -s "$BASE_URL/accounting/tasks/payment_approval_preparation" | python3 -m json.tool

echo
echo "---- payment approval control decision ----"
curl -s "$BASE_URL/accounting/tasks/payment_approval_preparation/control-decision" | python3 -m json.tool

echo
echo "---- external writeback dry-run control decision ----"
curl -s "$BASE_URL/accounting/tasks/external_writeback_dry_run/control-decision" | python3 -m json.tool

echo
echo "---- missing task template check ----"
curl -s "$BASE_URL/accounting/tasks/not_real_template" | python3 -m json.tool
