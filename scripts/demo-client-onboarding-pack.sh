#!/usr/bin/env bash
set -euo pipefail

echo "==== FinanceOps Agent client onboarding pack ===="
echo
echo "This command shows the docs and sample files a real client should review before sending safe inputs and desired outputs."
echo "It does not start the API server and does not require credentials."
echo

echo "==== Client onboarding docs ===="
for file in \
  docs/CLIENT_INPUT_OUTPUT_REQUEST.md \
  docs/CLIENT_INPUT_OUTPUT_EMAIL_TEMPLATE.md \
  docs/CLIENT_DISCOVERY_FORM.md \
  docs/CLIENT_FIRST_ADAPTER_BUILD_PLAN.md \
  docs/CLIENT_IMPLEMENTATION_PATH.md
do
  if [ -f "$file" ]; then
    echo "OK  $file"
  else
    echo "MISSING  $file"
    exit 1
  fi
done

echo
echo "==== Client sample packet files ===="
for file in \
  examples/client-sample-packet/README.md \
  examples/client-sample-packet/sample-invoices.csv \
  examples/client-sample-packet/sample-bank-transactions.csv \
  examples/client-sample-packet/desired-output-example.json \
  examples/client-sample-packet/field-notes.md
do
  if [ -f "$file" ]; then
    echo "OK  $file"
  else
    echo "MISSING  $file"
    exit 1
  fi
done

echo
echo "==== Recommended client sequence ===="
echo "1. Send the client the email template."
echo "2. Ask for a safe sample packet using examples/client-sample-packet as the model."
echo "3. Fill out the discovery form with the client."
echo "4. Use the first adapter build plan to scope the first client-specific adapter."
echo "5. Keep production blocked until client-owned data, auth, secrets, approval rules, and controls exist."

echo
echo "==== Fast file preview ===="
echo
echo "-- docs/CLIENT_INPUT_OUTPUT_EMAIL_TEMPLATE.md --"
sed -n "1,45p" docs/CLIENT_INPUT_OUTPUT_EMAIL_TEMPLATE.md

echo
echo "-- examples/client-sample-packet/README.md --"
sed -n "1,80p" examples/client-sample-packet/README.md

echo
echo "==== Client onboarding pack complete ===="
