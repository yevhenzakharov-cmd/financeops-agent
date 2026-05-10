# Accounting Task Registry

The Accounting Task Registry is a typed catalog of accounting department task templates.

It is designed for the sales and implementation model where the client later provides:

- the actual input sources
- the accounting task they want automated or assisted
- the desired output destination
- the approval policy
- the reviewer roles
- the production boundary

The registry does not try to pre-build every possible client integration. Instead, it gives the FinanceOps Agent a reusable control-aware task layer that can be adapted once a real client workflow is known.

## Why it exists

The project needs to prove that the core can handle more than one hardcoded demo flow.

The registry shows that accounting work can be described as structured task templates before client-specific inputs and outputs are connected.

Each template defines:

- task category
- default risk level
- default autonomy level
- typical inputs
- expected outputs
- reviewer role
- client configuration needed
- production boundary

## Current templates

The registry currently covers:

- CFO exception briefing
- receivables aging review
- bank reconciliation review
- budget variance review
- project margin review
- duplicate invoice review
- expense policy exception review
- payment approval preparation
- journal entry draft preparation
- tax calculation packet
- tax or legal review packet
- external writeback dry run

## Safety model

The registry connects to the Accounting Control Framework.

This means sensitive categories such as money movement, accounting posting, tax or legal conclusions, and external writeback are routed through control decisions before execution.

The intended operating model is:

- AI prepares or explains.
- Deterministic code calculates and validates.
- The task registry classifies the task.
- The control framework decides what is allowed, blocked, simulated, or approval-gated.
- Human reviewers approve sensitive outcomes.
- Audit evidence records the result.

## Demo endpoints

The demo exposes read-only registry endpoints:

- GET /accounting/tasks
- GET /accounting/tasks/:templateId
- GET /accounting/tasks/:templateId/control-decision

These endpoints are public demo/reviewer endpoints because they do not execute actions, move money, write to external systems, or expose secrets.

## Demo command

Run:

pnpm run demo:accounting-task-registry

## Production boundary

Production use still requires a client-specific implementation.

Before any production workflow is enabled, the client must confirm:

- real input schema
- field mappings
- output destination
- reviewer roles
- approval thresholds
- auth and RBAC
- secret handling
- audit retention
- rollback path
- compliance and legal review

The registry is a foundation for adapting to client accounting work. It is not a claim that every client integration is already built.
