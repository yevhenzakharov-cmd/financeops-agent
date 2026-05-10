# Client Input and Output Request

Related adapter plan: [Client First Adapter Build Plan](CLIENT_FIRST_ADAPTER_BUILD_PLAN.md).

Related discovery form: [Client Discovery Form](CLIENT_DISCOVERY_FORM.md).

This guide explains what a real client should provide before a client-specific FinanceOps implementation begins.

The public repository intentionally uses mock data only. Real input adapters, output destinations, approval rules, and production integrations should be added only after the client confirms their actual workflow, sample data, field meanings, and control requirements.

Related email template: [Client Input and Output Email Template](CLIENT_INPUT_OUTPUT_EMAIL_TEMPLATE.md).

Client sample packet template: [`examples/client-sample-packet`](../examples/client-sample-packet).

## What the client should send first

Ask the client for safe sample materials, not full private production data.

Recommended first packet:

- 1-3 safe sample input files
- field definitions for each file
- example rows with fake or redacted values
- description of the accounting or finance task to automate
- desired output format
- approval rules
- blocked actions
- current manual workflow notes
- known edge cases
- system owner or finance reviewer contact

## Input examples

Possible inputs include:

- CSV export
- Excel workbook
- JSON export
- bank export
- invoice export
- payment processor export
- ERP/accounting system export
- manually prepared finance report
- OCR-extracted invoice or receipt data
- API payload from a client-owned system

The first implementation should use the simplest safe sample format the client can provide.

## Output examples

Possible outputs include:

- CFO briefing
- exception queue
- approval queue item
- dashboard payload
- JSON artifact
- CSV export
- Slack-ready summary
- email-ready summary
- payment approval request
- reconciliation exception report
- audit evidence bundle
- dry-run writeback payload

The client must confirm the exact output destination before production build.

## Required client answers

Before building a real adapter, confirm:

1. What source system or file creates the input?
2. Which fields are required?
3. Which fields are optional?
4. Which fields are sensitive and must be redacted from samples?
5. What does each field mean?
6. What field uniquely identifies a record?
7. What date, currency, and amount formats are used?
8. What calculations should the system perform?
9. What exceptions should be flagged?
10. What output should the finance team receive?
11. Who reviews the output?
12. Which actions are allowed, approval-gated, simulation-only, or blocked?
13. Whether OCR is required.
14. Whether an ERP, bank, payroll, or payment integration is required later.
15. Whether the first build should stay file-based before API integration.

## Safe sample rules

The first client packet should avoid:

- real bank credentials
- API keys
- access tokens
- production secrets
- full customer lists
- full employee lists
- private payroll records
- raw bank statements with unnecessary personal data
- unredacted tax or legal documents
- production payment authorization data

If private data is required later, it should be handled only inside a client-owned environment with client-owned access control, retention, deletion, and audit rules.

## Minimum viable first client packet

A good first packet can be as simple as:

- one redacted invoice export
- one redacted payment or bank export
- one example of the desired CFO or accounting output
- approval rules for what must never happen automatically
- notes explaining the current manual process

That is enough to start building the first client-specific adapter.

## How this maps to the current repo

The current repo already demonstrates the reusable core:

- workflow intake planning
- accounting task registry
- accounting workflow routing
- adapter readiness planning
- output delivery planning
- approval gates
- audit evidence
- production blockers

Client-specific work starts after the client provides real sample input shape and desired output shape.
