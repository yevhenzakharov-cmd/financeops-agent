#!/usr/bin/env bash
set -euo pipefail

echo "==== FinanceOps Agent reviewer demo command index ===="
echo
echo "This command lists the strongest reviewer commands for AI-company, technical, and CFO-style review."
echo "It does not start the API server and does not require credentials."
echo

echo "==== Required index files ===="
for file in \
  docs/REVIEWER_DEMO_INDEX.md \
  docs/PRODUCT_POSITIONING.md \
  docs/AI_COMPANY_REVIEWER_PATH.md \
  docs/REVIEWER_DEMO_PATH.md \
  README.md
do
  if [ -f "$file" ]; then
    echo "OK  $file"
  else
    echo "MISSING  $file"
    exit 1
  fi
done

echo
echo "==== Recommended first commands ===="
echo "pnpm run verify:local"
echo "pnpm run demo:client-reviewer-dashboard-package"
echo "pnpm run demo:ai-company-reviewer-path"
echo "pnpm run demo:reviewer-path"
echo "pnpm run demo:api-inventory"
echo "pnpm run demo:openapi-contract"
echo "pnpm run demo:audit-visibility"
echo "pnpm run demo:accounting-workflow-router"

echo
echo "==== Full index preview ===="
sed -n "1,180p" docs/REVIEWER_DEMO_INDEX.md

echo
echo "==== Reviewer demo command index complete ===="
