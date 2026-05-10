#!/usr/bin/env bash
set -euo pipefail

echo "==== FinanceOps Agent reviewer demo path ===="
echo
echo "This script runs the shortest buyer/reviewer walkthrough after local verification."
echo "Run pnpm run verify:local first when you want the full quality-gate proof."
echo "This wrapper focuses only on reviewer-facing demo output."
echo

echo "==== API inventory ===="
pnpm run demo:api-inventory

echo
echo "==== Accounting task registry ===="
pnpm run demo:accounting-task-registry

echo
echo "==== Accounting workflow router ===="
pnpm run demo:accounting-workflow-router

echo
echo "==== Client workflow intake ===="
pnpm run demo:client-workflow-intake

echo
echo "==== Client adapter readiness ===="
pnpm run demo:client-adapter-readiness

echo
echo "==== Reviewer demo path complete ===="
echo "Review docs/REVIEWER_DEMO_PATH.md and docs/CLIENT_IMPLEMENTATION_PATH.md for the narrative."
