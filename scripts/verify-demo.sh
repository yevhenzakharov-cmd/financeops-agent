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
echo "---- client contract validation ----"
curl -s http://localhost:3001/client-contract/mock-game-studio/validation | python3 -m json.tool || true

echo ""
echo "---- client implementation plan ----"
curl -s http://localhost:3001/client-contract/mock-game-studio/implementation-plan | python3 -m json.tool | head -n 50 || true

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
echo "---- largest artifact ----"
curl -s http://localhost:3001/artifacts/largest | python3 -m json.tool || true

echo ""
echo "---- artifact size map ----"
curl -s http://localhost:3001/artifacts/size-map | python3 -m json.tool || true

echo ""
echo "---- artifact readiness ----"
curl -s http://localhost:3001/artifacts/readiness | python3 -m json.tool || true

echo ""
echo "---- artifact data types ----"
curl -s http://localhost:3001/artifacts/data-types | python3 -m json.tool || true

echo ""
echo "---- artifact manifest ----"
curl -s http://localhost:3001/artifacts/manifest | python3 -m json.tool | head -n 40 || true

echo ""
echo "---- artifact registry version ----"
curl -s http://localhost:3001/artifacts/registry-version | python3 -m json.tool || true

echo ""
echo "---- recent commits ----"
git log --oneline -12

echo ""
echo "---- package scripts ----"
npm run
