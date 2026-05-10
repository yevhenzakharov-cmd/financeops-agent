# Client First Adapter Build Plan

This guide explains how to turn a client-provided sample input and desired output into the first client-specific FinanceOps adapter.

The public repository remains demo-safe. Real adapters should be added only after the client provides safe sample files, field definitions, approval rules, and desired output examples.

## Build goal

The first adapter should prove one real client workflow end to end:

1. accept one safe input shape
2. normalize it into the FinanceOps core
3. run deterministic checks
4. classify exceptions
5. prepare one desired output
6. keep sensitive actions approval-gated or blocked
7. generate audit evidence

## Recommended first adapter scope

Start with one workflow only.

Good first workflows:

- invoice aging and overdue detection
- invoice versus bank reconciliation review
- vendor payment approval preparation
- OCR invoice extraction review
- payroll input validation
- margin or budget exception review
- CFO summary from client-provided exports

Avoid starting with:

- autonomous payment execution
- autonomous accounting write-back
- final payroll execution
- final tax or legal conclusions
- multi-system write operations
- production bank credentials
- production ERP credentials

## Adapter phases

### Phase 1: sample intake

Collect:

- sample file
- schema notes
- field definitions
- desired output example
- approval policy
- blocked actions
- reviewer owner

### Phase 2: field mapping

Map client fields into controlled internal fields.

For each field, classify:

- provided
- missing
- optional
- needs mapping
- sensitive
- blocked from demo

### Phase 3: deterministic logic

Only deterministic code should calculate:

- totals
- days overdue
- matching status
- exception severity
- risk level
- approval requirement
- output readiness

AI may explain results, but must not invent financial values.

### Phase 4: output delivery

Build the simplest safe output first.

Examples:

- JSON artifact
- CSV export
- CFO briefing payload
- approval queue item
- exception queue item
- Slack-ready summary
- email-ready summary

### Phase 5: audit evidence

The adapter should make clear:

- what input was used
- what mapping was applied
- what calculations were run
- what exceptions were created
- what output was generated
- what remains blocked for production

## Production blockers

Production remains blocked until the client owns:

- authentication
- authorization
- secrets
- production data location
- retention and deletion policy
- approval roles
- payment controls
- accounting write-back controls
- monitoring
- incident response
- compliance signoff

Client sample packet template: [`examples/client-sample-packet`](../examples/client-sample-packet).

## Definition of done for first adapter

A first client adapter is ready for demo when:

- sample input is accepted
- required fields are validated
- missing fields are reported clearly
- deterministic checks run successfully
- one desired output is generated
- sensitive actions remain approval-gated or blocked
- audit evidence is generated
- README or client docs explain how to run it

## What not to claim

Do not claim:

- production readiness
- autonomous payment execution
- autonomous accounting posting
- final tax or legal advice
- universal ERP support
- support for every client input format

The correct claim is:

The repo can be adapted to a client-specific FinanceOps workflow once the client provides safe sample inputs, field mappings, approval rules, and desired outputs.
