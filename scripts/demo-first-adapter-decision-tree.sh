#!/usr/bin/env bash
set -euo pipefail

echo "==== FinanceOps Agent first-adapter decision tree ===="
echo
echo "This command previews how a first client-specific adapter should be selected."
echo "It does not start the API server and does not require credentials."
echo

echo "==== Required decision docs ===="
for file in \
  docs/FIRST_ADAPTER_DECISION_TREE.md \
  docs/CLIENT_INPUT_OUTPUT_REQUEST.md \
  docs/CLIENT_FIRST_ADAPTER_BUILD_PLAN.md \
  docs/CLIENT_READY_CHECKPOINT.md \
  examples/client-sample-packet/README.md
do
  if [ -f "$file" ]; then
    echo "OK  $file"
  else
    echo "MISSING  $file"
    exit 1
  fi
done

echo
echo "==== Decision tree preview ===="
sed -n "1,150p" docs/FIRST_ADAPTER_DECISION_TREE.md

echo
echo "==== First-adapter decision tree complete ===="
