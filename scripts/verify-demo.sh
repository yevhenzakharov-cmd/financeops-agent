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
echo "---- recent commits ----"
git log --oneline -12

echo ""
echo "---- package scripts ----"
npm run
