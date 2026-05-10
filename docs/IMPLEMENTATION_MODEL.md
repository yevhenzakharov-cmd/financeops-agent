# FinanceOps Agent Implementation Model

Related intake guide: [Client Input and Output Request](CLIENT_INPUT_OUTPUT_REQUEST.md).

Related guide: [Client Implementation Path](CLIENT_IMPLEMENTATION_PATH.md).

This document explains how the FinanceOps Agent public demo can be adapted into a real client-specific finance operations implementation.

The current repository is a demo-safe foundation. It uses mock data, deterministic finance logic, approval gates, audit artifacts, and reviewer-friendly APIs to show how the system works without exposing real client data or production credentials.

## Core implementation principle

FinanceOps Agent is not a generic chatbot.

It is a governed finance operations automation system where:

1. Client data is loaded through controlled input adapters.
2. Data is normalized into expected FinanceOps structures.
3. Deterministic tools calculate finance outputs.
4. Exceptions and risks are classified.
5. Recommended actions are simulated.
6. Sensitive actions remain approval-gated.
7. Audit evidence and reviewer artifacts are generated.
8. AI is used only to explain already-computed outputs.

AI does not calculate finance numbers, approve payments, send money, post accounting entries, or provide final legal or tax advice.

## High-level architecture

Client input sources
  -> Input adapters
  -> Normalized FinanceOps data
  -> Deterministic FinanceOps core
  -> Exception and risk classification
  -> Action simulation
  -> Governance and approval layer
  -> Audit log, execution ledger, approval queue, and CFO/reviewer outputs
  -> Output adapters

## Public demo input and output boundary

The public demo is intentionally narrow at the edges and strong in the middle.

It includes:

- one simulated finance input stack
- one demo output path through local and API-visible artifacts
- deterministic finance calculations
- controlled workflow routing
- approval-gated recommendations
- audit evidence
- reviewer-friendly documentation and APIs

It intentionally does not prebuild every possible client input or output. Real clients may need OCR invoice intake, spreadsheet imports, payroll preparation, bank reconciliation exports, internal API adapters, accounting system writebacks, or reporting dashboards. Those should be added after the client provides actual files, schemas, access rules, approval requirements, and output expectations.

This avoids bloating the public repo with speculative integrations and keeps the architecture focused on the reusable FinanceOps core.

## 1. Client input model

A real implementation starts with the client's actual finance workflow.

Possible input sources include:

- CSV exports
- JSON exports
- Google Sheets
- ERP exports
- accounting system exports
- bank transaction exports
- payroll exports
- payment processor exports
- procurement exports
- CRM exports
- internal APIs
- databases
- data warehouses
- webhook events
- manual uploads
- scheduled reports

The public demo uses mock data only. Production adapters should not be built until the client confirms exact input sources, sample rows, field definitions, access patterns, and security requirements.

## 2. Field mapping model

Each client implementation needs a mapping layer that translates client-specific fields into FinanceOps fields.

Example:

| Client field | FinanceOps field | Required for | Status |
|---|---|---|---|
| invoice_id | invoiceId | overdue invoice detection | required |
| due_date | dueAt | overdue invoice detection | required |
| amount_due | amount | receivables review | required |
| bank_tx_id | bankTransactionId | reconciliation | mapping required |
| project_code | projectId | margin review | client-specific |
| vendor_payment_method | vendorPaymentMethod | payment preparation | required only if payment preparation is in scope |

The system should reject production readiness when required fields are missing or mapping is unresolved.

## 3. Deterministic FinanceOps core

The deterministic core is the trusted calculation layer.

Current demo capabilities include:

- overdue invoice detection
- missing payment detection
- orphan bank transaction detection
- reconciliation review
- project margin review
- budget burn review
- exception classification
- action simulation
- approval queue generation
- audit log generation
- execution ledger generation
- CFO-style briefing generation from computed results

The core should remain separate from the AI explanation layer.

## 4. Governance and approval model

Finance workflows require explicit control boundaries.

The system should classify outcomes into states such as:

- pass
- warning
- blocked
- human review required
- approval required
- production blocked
- client-owned control required

Sensitive actions must remain approval-gated.

Examples:

| Action type | Demo behavior | Production requirement |
|---|---|---|
| Run FinanceOps analysis | allowed with demo controls | client-owned auth and access policy |
| Generate CFO briefing | allowed from computed results | role-based visibility if sensitive |
| Prepare payment recommendation | simulated only | client-approved policy and complete vendor data |
| Send money | not supported as autonomous action | explicit human approval and client-owned payment controls |
| Post accounting entry | not autonomous | client finance approval required |
| Tax/legal advice | blocked | client professional review required |

## 5. Output model

Current demo outputs are local/API-visible artifacts.

A real implementation can adapt outputs to the client's workflow, such as:

- CFO briefing
- exception queue
- approval queue
- audit log
- execution ledger
- dashboard view
- Slack summary
- email summary
- CSV export
- JSON API response
- PDF-style report
- ERP draft entry
- accounting review packet
- payment approval request
- procurement review package

Output destinations should be defined during client discovery.

## 6. Security and deployment model

The public repo is intentionally demo-safe.

A production implementation should be client-owned and configured around the client's requirements for:

- authentication
- role-based access control
- secret management
- deployment environment
- data retention
- monitoring
- incident response
- audit access
- approval authority
- compliance review
- legal review
- finance signoff

The demo API key is not production authentication. It only protects action-like demo routes.

Production credentials and client data must never be committed to the public repository.

## 7. Pilot implementation sequence

A controlled client pilot should follow this sequence:

1. Confirm business problem and finance workflow.
2. Collect sample inputs and desired outputs.
3. Map client fields into normalized FinanceOps structures.
4. Define approval rules and blocked actions.
5. Build client-specific input adapters.
6. Build client-specific output adapters.
7. Run the pipeline on client-shaped test data.
8. Validate calculations with the finance owner.
9. Validate audit artifacts and exception queues.
10. Run a limited pilot in simulation mode.
11. Review results with the client.
12. Decide whether to expand scope.

## 8. What is intentionally not included in the public demo

The public demo does not include:

- real client data
- real ERP integration
- real bank integration
- production RBAC
- production secrets
- production payment execution
- autonomous accounting postings
- final tax/legal decisioning
- client-specific compliance certification

These are intentionally excluded until a real client provides requirements, approvals, and security boundaries.

## 9. Reviewer takeaway

The repo should be reviewed as a production-aware public demo and implementation foundation.

It proves the architecture pattern:

client data -> deterministic FinanceOps core -> governed exceptions -> approval-gated recommendations -> audit artifacts -> CFO/reviewer outputs

The next production step is not to make the public demo generic for every company. The next step is to adapt the core to a specific client's finance inputs, approval rules, output needs, and deployment environment.
