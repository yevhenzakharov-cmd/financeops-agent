#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"
API_LOG="${API_LOG:-/tmp/financeops-api.log}"

echo "---- lint:strict ----"
pnpm run lint:strict

echo
echo "---- typecheck ----"
pnpm run typecheck

echo
echo "---- test ----"
pnpm run test

echo
echo "---- coverage ----"
pnpm run test:coverage

echo
echo "---- build ----"
pnpm run build

echo
echo "---- start API for demo verification ----"
FINANCEOPS_BYPASS_DEMO_RATE_LIMIT=true pnpm run api > "$API_LOG" 2>&1 &
API_PID=$!

cleanup() {
  kill "$API_PID" >/dev/null 2>&1 || true
}

trap cleanup EXIT

for i in {1..30}; do
  if curl -fsS "$BASE_URL/health" >/dev/null 2>&1; then
    break
  fi

  sleep 1
done

if ! curl -fsS "$BASE_URL/health" >/dev/null 2>&1; then
  echo "API failed to start"
  cat "$API_LOG"
  exit 1
fi

echo
echo "---- verify:demo ----"
pnpm run verify:demo || {
  echo
  echo "---- API log ----"
  cat "$API_LOG"
  exit 1
}

echo
echo "verify:local PASS"
