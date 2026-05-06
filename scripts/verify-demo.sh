#!/usr/bin/env bash
set -euo pipefail

echo "---- typecheck ----"
npm run typecheck

echo ""
echo "---- build ----"
npm run build

echo ""
echo "---- git status ----"
git status

echo ""
echo "---- artifact status ----"
curl -s http://localhost:3001/artifacts/status | python3 -m json.tool || true

echo ""
echo "---- named artifact smoke check ----"
curl -s http://localhost:3001/artifacts/executionLedger | python3 -m json.tool | head -n 30 || true

echo ""
echo "---- artifact health ----"
curl -s http://localhost:3001/artifacts/health | python3 -m json.tool || true

echo ""
echo "---- artifact names ----"
curl -s http://localhost:3001/artifacts/names | python3 -m json.tool || true

echo ""
echo "---- artifact registry summary ----"
curl -s http://localhost:3001/artifacts/registry/summary | python3 -m json.tool || true

echo ""
echo "---- recent commits ----"
git log --oneline -12

echo ""
echo "---- package scripts ----"
npm run
