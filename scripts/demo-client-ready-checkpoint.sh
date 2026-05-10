#!/usr/bin/env bash
set -euo pipefail

echo "==== FinanceOps Agent client-ready checkpoint ===="
echo
echo "This command previews the current client-readiness checkpoint."
echo "It does not start the API server and does not require credentials."
echo

echo "==== Required checkpoint files ===="
for file in \
  docs/CLIENT_READY_CHECKPOINT.md \
  docs/CLIENT_INPUT_OUTPUT_REQUEST.md \
  docs/CLIENT_INPUT_OUTPUT_EMAIL_TEMPLATE.md \
  docs/CLIENT_DISCOVERY_FORM.md \
  docs/CLIENT_FIRST_ADAPTER_BUILD_PLAN.md \
  docs/CLIENT_IMPLEMENTATION_PATH.md \
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
echo "==== Checkpoint preview ===="
sed -n "1,140p" docs/CLIENT_READY_CHECKPOINT.md

echo
echo "==== Client-ready checkpoint complete ===="
