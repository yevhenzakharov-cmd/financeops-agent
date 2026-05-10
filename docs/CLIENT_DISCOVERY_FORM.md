# Client Discovery Form

Use this form before building a client-specific FinanceOps adapter.

The goal is to collect enough safe information to understand the client workflow, input files, required calculations, desired outputs, review process, and production blockers without asking for production credentials or full sensitive datasets.

## Client overview

- Client or company name:
- Finance owner:
- Technical owner:
- Accounting or review owner:
- Primary business model:
- Base currency:
- Timezone:
- Current finance or accounting tools:
- Current reporting cadence:

## First workflow to automate

Describe the first workflow the client wants automated.

Examples:

- overdue invoice detection
- bank reconciliation review
- vendor payment approval preparation
- payroll input validation
- OCR extraction from invoices or receipts
- margin or budget risk review
- CFO briefing generation
- accounting exception queue generation

## Current manual process

Ask the client to describe the current process step by step.

- Who receives the input?
- Where does the input come from?
- Which fields are checked manually?
- Which calculations are performed?
- Which exceptions are flagged?
- Who reviews the result?
- Where does the final output go?
- How often does this happen?

## Input files or systems

For each input source, collect:

| Field | Client answer |
|---|---|
| Input name | |
| Source system | |
| Format | CSV, Excel, JSON, PDF, API, OCR, or other |
| Owner | |
| Refresh frequency | |
| Required fields | |
| Optional fields | |
| Unique record ID | |
| Date format | |
| Currency format | |
| Amount format | |
| Sensitive fields | |
| Redacted sample available | Yes or No |
| Production credentials needed later | Yes or No |

## Desired output

For each desired output, collect:

| Field | Client answer |
|---|---|
| Output name | |
| Audience | CFO, controller, accountant, operator, founder, or other |
| Format | dashboard, JSON, CSV, Slack, email, PDF, approval queue, or other |
| Destination | |
| Required sections | |
| Approval required | Yes or No |
| Reviewer | |
| Escalation owner | |
| Audit evidence required | Yes or No |

## Required calculations

Ask what the system should calculate.

Examples:

- days overdue
- invoice aging bucket
- matched or missing payment
- orphan bank transaction
- margin percentage
- budget utilization
- burn variance
- payroll totals
- payment approval amount
- exception severity

## Exception rules

Ask what should be flagged.

Examples:

- invoice overdue by more than X days
- payment missing
- unmatched bank transaction
- vendor payment data missing
- payroll mismatch
- duplicate invoice
- currency mismatch
- missing approval
- margin below threshold
- budget burn above threshold

## Approval rules

Confirm what can be automated, simulated, approval-gated, or blocked.

| Action type | Allowed | Approval owner | Notes |
|---|---|---|---|
| Generate report | | | |
| Create exception queue | | | |
| Draft payment approval request | | | |
| Send Slack or email summary | | | |
| Prepare accounting entry draft | | | |
| Post accounting entry | | | |
| Trigger payment | | | |
| Provide tax or legal conclusion | No | | Blocked |

## Data safety

The client should not send:

- production credentials
- API keys
- access tokens
- full private datasets
- unredacted payroll files
- raw customer lists
- private bank data beyond safe samples
- final tax or legal documents unless explicitly approved for secure handling

Client sample packet template: [`examples/client-sample-packet`](../examples/client-sample-packet).

## First adapter readiness checklist

The first adapter can be planned when the client provides:

- safe sample input
- field definitions
- desired output example
- approval rules
- blocked-action rules
- reviewer owner
- known edge cases

The first adapter should remain file-based when possible until the workflow is proven with safe sample data.
