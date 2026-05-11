#!/usr/bin/env bash
set -euo pipefail

echo "==== FinanceOps Agent AI-company reviewer path ===="
echo
echo "This command previews the reviewer guide."
echo "It does not start the API server and does not require credentials."
echo

echo "==== Required reviewer files ===="
for file in \
  docs/AI_COMPANY_REVIEWER_PATH.md \
  README.md \
  docs/REVIEWER_DEMO_PATH.md \
  docs/API.md \
  docs/IMPLEMENTATION_MODEL.md
do
  if [ -f "$file" ]; then
    echo "OK  $file"
  else
    echo "MISSING  $file"
    exit 1
  fi
done

echo
echo "==== Reviewer path preview ===="
sed -n "1,180p" docs/AI_COMPANY_REVIEWER_PATH.md

echo
echo "==== AI-company reviewer path complete ===="
