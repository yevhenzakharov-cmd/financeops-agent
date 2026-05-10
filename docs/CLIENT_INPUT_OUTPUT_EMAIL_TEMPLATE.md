# Client Input and Output Email Template

Use this message when asking a real client for the first safe sample packet.

## Short version

Hi [Name],

To start building the first FinanceOps workflow, I need a small safe sample packet from your side.

Please do not send production credentials, API keys, access tokens, or full private datasets yet.

For the first pass, please send:

- 1-3 redacted sample input files
- a short explanation of what each file contains
- field definitions for the important columns
- 3-10 fake or redacted example rows if possible
- the finance/accounting task you want automated first
- the output you want to receive
- the person who should review or approve the output
- anything the system must never do automatically

Examples of useful inputs:

- invoice export
- bank transaction export
- payment export
- vendor list
- payroll export
- Excel workbook
- CSV file
- JSON export
- OCR sample document
- example report currently prepared manually

Examples of useful outputs:

- CFO briefing
- exception queue
- approval queue
- reconciliation report
- overdue invoice report
- payment approval request
- dashboard-ready JSON
- Slack-ready summary
- email-ready summary
- audit evidence bundle

Once I see the sample input shape and desired output, I can map the workflow, identify missing fields, and build the first client-specific adapter safely.

Best,
[Your Name]

## Longer version

Hi [Name],

To start the first FinanceOps workflow safely, I need a small redacted sample packet from your team.

The goal is not to connect production systems immediately. The goal is to understand your input shape, finance workflow, approval rules, and desired output before any client-specific adapter is built.

Please send:

1. Sample input files

- 1-3 files if possible
- redacted or fake values are fine
- CSV, Excel, JSON, PDF, OCR sample, or exported report is fine
- no production credentials or secrets

2. Field definitions

For each important field, please explain:

- what the field means
- whether it is required
- whether it uniquely identifies a record
- whether it contains sensitive data
- any expected format such as date, amount, currency, vendor, customer, invoice ID, or transaction ID

3. Desired workflow

Please describe the first workflow you want automated.

Examples:

- detect overdue invoices
- reconcile bank transactions against invoices
- prepare vendor payment approvals
- identify missing payments
- review payroll inputs
- extract invoice data with OCR
- prepare a CFO summary
- flag accounting exceptions

4. Desired output

Please send or describe the output your finance team wants.

Examples:

- CFO briefing
- approval queue
- exception report
- dashboard payload
- CSV export
- Slack summary
- email summary
- payment approval packet
- audit evidence bundle

5. Approval and blocked-action rules

Please confirm:

- who reviews the output
- who approves payment-like actions
- what the system may draft
- what the system may only simulate
- what the system must never do automatically
- whether any accounting, payroll, tax, legal, or payment step requires human approval

Please do not send production credentials, API keys, access tokens, full customer lists, full employee payroll files, or unredacted sensitive data at this stage.

After I receive this, I will prepare the first adapter plan and confirm what can be built safely.

Best,
[Your Name]
