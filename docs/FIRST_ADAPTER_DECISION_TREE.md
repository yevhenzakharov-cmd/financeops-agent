# First Adapter Decision Tree

This document explains how to choose the first client-specific FinanceOps adapter after a real client provides a safe sample packet.

The public repository intentionally does not include real client adapters yet. The first adapter should be selected only after the client provides redacted sample inputs, field definitions, desired output examples, approval rules, blocked-action rules, and known edge cases.

## Decision principle

Choose the first adapter by balancing:

- business value
- input quality
- finance-control risk
- implementation complexity
- reviewability
- safety boundary clarity

The best first adapter is usually not the most ambitious integration. It is the narrowest workflow that proves value, validates the data model, and keeps production execution blocked until client-owned controls exist.

## Step 1: Identify the first workflow

Start by asking which finance workflow the client wants improved first.

Common first workflows:

- overdue invoice review
- bank reconciliation review
- orphan transaction detection
- payment approval preparation
- vendor payment exception queue
- project margin review
- budget or burn review
- monthly finance briefing
- audit evidence bundle
- Slack/email-ready exception summary

If the client names multiple workflows, choose the one with the clearest input file and desired output.

## Step 2: Score input readiness

Use the client sample packet to score readiness.

| Signal | Ready | Not ready |
|---|---|---|
| Safe sample file exists | Client provided redacted CSV, JSON, Excel, or export sample | Client only described system verbally |
| Field definitions exist | Important fields are explained | Column meanings are unclear |
| Desired output exists | Client provided example output/report | No output format is defined |
| Owner exists | Finance reviewer or approver is named | No review owner is named |
| Blocked actions are clear | Client says what must never happen automatically | Automation boundaries are vague |
| Edge cases are known | Client gives examples of exceptions | Edge cases are unknown |

If required fields or output examples are missing, do not build the adapter yet. Ask for the missing packet items first.

## Step 3: Choose the adapter lane

Use this sequence:

1. **CSV/Excel export adapter**  
   Choose this when the client can export a spreadsheet or flat file from their accounting, ERP, bank, payroll, or payment system. This is usually the safest first adapter.

2. **JSON export adapter**  
   Choose this when the client already has structured exports or internal API payload examples.

3. **Bank transaction export adapter**  
   Choose this when the first workflow is reconciliation, orphan transaction detection, or cash movement review.

4. **Invoice export adapter**  
   Choose this when the first workflow is overdue invoice detection, AR exception review, or collections prioritization.

5. **Payment approval preparation adapter**  
   Choose this only when approval rules, reviewer owner, payment fields, and blocked-action rules are clear.

6. **OCR invoice or receipt extraction workflow**  
   Choose this later unless the client already has clean document samples and accepts extraction uncertainty.

7. **Live API integration**  
   Choose this only after the flat-file or sample-packet workflow proves value and the client owns auth, secrets, permissions, and deployment controls.

## Step 4: Apply risk gating

Do not choose a first adapter that requires:

- production credentials
- live bank write access
- autonomous money movement
- autonomous accounting postings
- final tax/legal judgment
- unredacted payroll files
- full private customer datasets
- unclear reviewer ownership
- unclear approval rules

If the client wants one of these, start with a read-only export or simulated adapter first.

## Step 5: Recommended default

Default first adapter:

**CSV or Excel invoice/bank export adapter with read-only exception output.**

This is usually the best first adapter because it can prove value quickly without production credentials or live system access.

Recommended first output:

- exception queue
- CFO-style summary
- approval-ready recommendation list
- audit evidence bundle
- dashboard JSON
- Slack/email-ready summary

## Step 6: Exit criteria

The first adapter is ready to build when the client provides:

- one safe input sample
- field definitions
- desired output example
- reviewer owner
- blocked-action rules
- approval rules
- known edge cases
- confirmation that production remains blocked until client-owned controls exist

## Reviewer takeaway

A strong FinanceOps implementation should not start by connecting every possible integration.

It should start with one safe, narrow, high-value adapter that proves the deterministic FinanceOps core can turn client-specific finance data into governed, approval-ready outputs.
