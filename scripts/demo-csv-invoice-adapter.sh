#!/usr/bin/env bash
set -euo pipefail

CSV_PATH="${CSV_PATH:-fixtures/client-samples/invoices-demo.csv}"
export CSV_PATH

echo "---- CSV invoice adapter demo ----"
echo "CSV_PATH=$CSV_PATH"
echo

pnpm exec tsx scripts/demo-csv-invoice-adapter.ts
