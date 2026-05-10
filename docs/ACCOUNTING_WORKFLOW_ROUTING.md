# Accounting Workflow Routing

The Accounting Workflow Router maps a client-described accounting task into a controlled FinanceOps execution lane.

It is designed for the sales and implementation workflow where a client says:

- here are our inputs
- here is the accounting task
- here is the desired output
- here is where the output should go
- here is who should approve it

The router does not require every possible input or output adapter to be pre-built. Instead, it proves that the core can classify the requested work before client-specific adapters are implemented.

## What the router does

The router takes a workflow intent and returns:

- selected accounting task template
- normalized task request
- control-framework decision
- routing lane
- readiness state
- human review requirement
- required client configuration
- next client questions
- allowed next steps
- blocked work

## Routing lanes

Current routing lanes:

- read_only_review
- deterministic_finance_core
- approval_queue
- professional_review_packet
- simulation_dry_run
- blocked

## Why this matters

This is the bridge between a generic demo and a real client implementation.

A client may ask for many different workflows:

- calculate receivables aging
- prepare payment approval
- draft a journal entry
- calculate taxes from configured rules
- prepare tax/legal review evidence
- write approved data back to a client system
- create a CFO summary

The router keeps those workflows controlled.

The AI layer can describe the task and explain results, but deterministic code and governance rules decide what is allowed, blocked, simulated, or approval-gated.

## Production boundary

The router does not mean production integrations are ready.

Production remains blocked until the client confirms:

- real input source
- field mappings
- output destination
- reviewer roles
- approval policy
- authentication and authorization
- secret handling
- audit retention
- external adapter owner
- rollback path
- compliance and legal signoff

## Reviewer takeaway

The workflow router shows that the core can adapt to different accounting department needs without pretending that all integrations already exist.

The public repo stays demo-safe, while the architecture is ready to accept client-specific inputs, task definitions, desired outputs, and approval policies later.
