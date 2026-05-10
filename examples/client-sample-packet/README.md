# Client Sample Packet Template

This folder shows the kind of safe sample packet a real client can provide before a client-specific FinanceOps adapter is built.

Use fake or redacted values only.

Do not include:

- production credentials
- API keys
- access tokens
- full private datasets
- full payroll files
- raw customer lists
- private bank data beyond safe samples
- unredacted tax or legal documents

## Included example files

- `sample-invoices.csv` shows a simple invoice export.
- `sample-bank-transactions.csv` shows a simple bank transaction export.
- `desired-output-example.json` shows the kind of output the finance team may want.
- `field-notes.md` explains field meanings, mapping questions, and missing data.

## How to use this folder with a client

Ask the client to replace these examples with their own redacted samples.

A first client packet is ready for adapter planning when it includes:

- at least one safe input sample
- field definitions
- desired output example
- approval rules
- blocked-action rules
- reviewer owner
- known edge cases
