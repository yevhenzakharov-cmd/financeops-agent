# FinanceOps Agent

A governed FinanceOps automation system for client-specific accounting and finance operations.

This repository is a public technical demo showing how a finance operations agent can be built with deterministic business logic, strict approval gates, auditability, API visibility, security boundaries, and client-specific implementation packages.

The most important design principle:

AI does not perform the financial calculations.

The system is built around a deterministic FinanceOps core. The core handles calculations, validation, policy checks, exception detection, risk classification, approval preparation, audit logging, and artifact generation.

AI is only used as an explanation and briefing layer on top of already-computed results. It can summarize and explain. It does not invent numbers, approve payments, post accounting entries, or make final finance decisions.

## Current project status

The current version is a working public demo with:

- deterministic FinanceOps logic
- mock client data
- protected action-like API routes
- read-only reviewer endpoints
- approval workflow
- audit log generation
- execution ledger generation
- approval queue generation
- payment recommendation artifacts
- client output artifacts
- artifact registry
- OpenAPI contract
- API inventory
- request observability
- security boundary documentation
- accounting control framework
- accounting task registry
- accounting workflow routing
- due diligence package
- control matrix
- evidence binder
- procurement review package
- security questionnaire package
- local validation checks
- pre-push verification
- GitHub Actions CI

This is not a finished enterprise product yet. It is a strong technical foundation and reviewable demo for a future client-specific FinanceOps product.

## Reviewer quick path

If you are reviewing this repository for technical, product, or buyer-readiness reasons, start here:

1. [Reviewer Architecture Summary](docs/REVIEWER_ARCHITECTURE_SUMMARY.md) - senior-level overview of the architecture, control boundaries, auditability, and reviewer-facing design.
2. [Implementation Model](docs/IMPLEMENTATION_MODEL.md) - explains how the public demo can become a client-specific FinanceOps implementation.
3. [Client Implementation Path](docs/CLIENT_IMPLEMENTATION_PATH.md) - connects requirements intake, workflow intake, task routing, controls, approvals, audit evidence, and production blockers.
3. [Accounting Task Registry](docs/ACCOUNTING_TASK_REGISTRY.md) - shows the reusable accounting task catalog and safety model.
4. [Accounting Workflow Routing](docs/ACCOUNTING_WORKFLOW_ROUTING.md) - shows how client-described accounting work is routed into controlled execution lanes.
5. [Client Workflow Intake](docs/CLIENT_WORKFLOW_INTAKE.md) - shows how client discovery answers become routed accounting workflow plans.
6. [API Overview](docs/API.md) - summarizes the main API routes and demo interaction surface.
7. [Reviewer Demo Path](docs/REVIEWER_DEMO_PATH.md) - gives reviewers the fastest command-and-doc sequence.

Recommended first local checks:

- pnpm run verify:local
- pnpm run demo:api-inventory
- pnpm run demo:accounting-task-registry
- pnpm run demo:accounting-workflow-router
- pnpm run demo:client-workflow-intake
- pnpm run demo:client-adapter-readiness


## What this project is

FinanceOps Agent is a reusable governed automation core for finance operations.

The goal is to build a system that can be adapted to each client’s actual finance process, inputs, outputs, approval policies, and hosting requirements.

Instead of building a generic chatbot, the project follows a safer enterprise pattern:

1. load client data through adapters
2. normalize and validate the data
3. run deterministic finance checks
4. classify exceptions
5. apply governance rules
6. prepare approval-ready outputs
7. generate audit evidence
8. use AI only to explain already-computed results

## Fast reviewer demo script

For the shortest reviewer or buyer walkthrough, run:

```bash
pnpm run verify:local
pnpm run demo:api-inventory
pnpm run demo:accounting-task-registry
pnpm run demo:accounting-workflow-router
pnpm run demo:client-workflow-intake
pnpm run demo:client-adapter-readiness
```

This sequence proves the core review story:

- local quality gates pass
- API inventory is visible
- accounting work is classified before execution
- workflow routing separates safe, approval-gated, professional-review, and blocked work
- client workflow intake turns a vague finance request into a governed implementation plan
- adapter readiness shows which inputs and outputs are reusable, which need mapping, and which remain blocked until client-owned setup exists

The important takeaway is that the repo proves the governed FinanceOps core. Real client adapters are intentionally added after discovery confirms source data, required calculations, approval rules, and output destinations.

## What this project demonstrates

The current demo demonstrates:

- overdue invoice detection
- missing payment detection
- orphan bank transaction detection
- reconciliation review
- project margin review
- budget burn review
- exception classification
- action simulation
- approval queue generation
- CFO-style briefing generation
- audit log generation
- execution ledger generation
- payment recommendation artifact generation
- client output artifact generation
- protected action-like API routes
- read-only reviewer API routes
- demo API key gating
- route inventory
- OpenAPI contract generation
- request observability
- artifact registry
- security boundary documentation
- procurement review support
- security questionnaire support
- client implementation planning
- client readiness checks
- client deployment profile
- client acceptance gates
- client evidence package
- client pilot proposal package
- accounting task classification
- accounting workflow routing
- approval-gated accounting task planning

## What AI does and does not do

AI can:

- explain already-computed results
- produce CFO-style summaries
- turn structured exceptions into readable briefings
- help reviewers understand why something was flagged
- help prepare business-facing outputs from deterministic data

AI does not:

- calculate financial results
- decide whether invoices are overdue
- decide whether payments are matched
- decide margin or budget burn values
- approve payments
- send money
- post accounting entries
- provide final tax advice
- provide final legal advice
- bypass human approval gates

The financial logic is deterministic. AI sits on top as a communication layer.

### Accounting control framework

The repository includes an Accounting Control Framework that classifies accounting department tasks before execution.

It is designed around this operating model:

- AI prepares and explains.
- Code performs deterministic calculations.
- Controls validate the task.
- Human reviewers approve sensitive outcomes.
- Audit artifacts record what happened.

The framework handles task categories such as read-only analysis, deterministic calculation, approval preparation, external writeback, money movement, accounting posting, tax calculation, and tax/legal advice.

Its decisions include allowed, optional review, approval required, professional review required, simulation only, blocked for missing data, and blocked for unsafe autonomy.

This makes the core safer for future client-specific accounting workflows where the final step is usually accountant, controller, CFO, tax professional, or legal review unless the client explicitly classifies the task as low-risk.

### Accounting task registry

The repository also includes an Accounting Task Registry that defines reusable accounting department task templates before client-specific inputs and outputs are known.

The registry is not meant to pre-build every possible business integration. It provides a typed catalog of common accounting workstreams that can later be adapted during client discovery.

Current task templates include CFO exception briefing, receivables aging review, bank reconciliation review, budget variance review, project margin review, duplicate invoice review, expense policy exception review, payment approval preparation, journal entry draft preparation, tax calculation packets, tax/legal review packets, and external writeback dry runs.

Each template records the task category, default risk level, default autonomy level, typical inputs, expected outputs, reviewer role, client configuration needed, and production boundary.

This gives reviewers a clear enterprise pattern: the client provides the actual inputs, task, and desired output later, while the core already knows how to classify accounting work into controlled, reviewable, approval-gated task types.


### Accounting workflow routing

The repository includes an Accounting Workflow Router that maps a client-described accounting task into a controlled execution lane.

This is designed for the real sales and implementation process:

- the client explains the task
- the client provides the actual input source later
- the client defines the desired output later
- the system classifies the workflow before execution
- the system decides whether the task is read-only, deterministic, approval-gated, professional-review-required, simulation-only, or blocked

This matters because each business will have different inputs, outputs, databases, finance systems, approval rules, and reporting needs. The core does not need every possible integration pre-built. It needs a safe routing model that can accept the client-specific workflow later and keep sensitive accounting work controlled.

The router supports workflows such as payment approval preparation, journal entry draft preparation, tax calculation packets, external writeback dry runs, receivables review, reconciliation review, and CFO exception briefing.

The final step for sensitive accounting work remains human review unless the task is explicitly classified as low-risk and read-only.

## Core architecture

The project is designed around four main layers.

### 1. Input adapters

Input adapters load and normalize client data.

The current demo uses mock data, but the intended product can be adapted to many client input sources, including:

- CSV exports
- JSON files
- Google Sheets
- accounting system exports
- ERP exports
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

The exact adapter depends on the client’s real workflow and data format.

### 2. Deterministic FinanceOps core

The core performs the actual checks and calculations.

Current examples include:

- overdue invoice detection
- budget burn review
- project margin review
- reconciliation checks
- missing payment detection
- orphan bank transaction detection
- exception classification
- risk level assignment
- recommended action simulation
- approval requirement detection

This is the part that should be trusted for logic, not the AI layer.

### 3. Governance and approval layer

The governance layer decides what can happen next.

Examples:

- pass
- warning
- blocked
- human review required
- approval required
- client-owned control required
- production blocked

This is especially important for finance workflows because payment-like actions, accounting write-backs, and sensitive decisions must remain controlled.

### 4. Output adapters

Output adapters deliver results to the right destination.

The current demo generates local and API-visible artifacts, but the intended product can support many output destinations, including:

- CFO briefing
- approval queue
- exception queue
- audit log
- execution ledger
- dashboard UI
- Slack notifications
- email summaries
- JSON API responses
- CSV exports
- PDF-style reports
- accounting draft entries
- ERP updates
- payment approval requests
- payroll review packages
- procurement review packages
- client-specific reports

## Client-specific implementation model

The product is intended to be implemented separately for each client.

Each client can have:

- their own dedicated website or dashboard
- their own deployment
- their own input adapters
- their own output adapters
- their own approval rules
- their own roles and permissions
- their own hosting environment
- their own data retention rules
- their own audit requirements
- their own security requirements

The final production implementation is not meant to be one generic shared website for every company.

Instead, each client receives a tailored implementation based on their actual finance operations workflow.

## How a real client implementation would work

Before building a production client version, the client would provide:

- exact input sources
- sample files or API schemas
- field definitions
- output requirements
- approval workflow requirements
- user roles
- hosting requirements
- security requirements
- monitoring requirements
- audit requirements
- reporting requirements
- integration targets

Then the codebase would be modified so the FinanceOps core does exactly what that client needs.

For example, one client may need overdue invoice review and Slack alerts. Another client may need bank reconciliation and ERP draft entries. Another may need vendor payment approval preparation and a CFO dashboard.

The core stays reusable. The adapters and policies become client-specific.

## Input and output flexibility

The system is designed to handle nearly any structured finance operations input or output once the client provides the schema, field definitions, access pattern, and security requirements.

The public repository intentionally includes one simulated input stack and one demo output stack. That is enough to prove the governed FinanceOps core without pretending that every future client will use the same source systems, accounting workflow, approval policy, or reporting destination.

Real input and output adapters should be built only after client discovery confirms:

- source system or file format
- sample rows or payload examples
- required field mappings
- calculation or workflow objective
- reviewer and approval policy
- destination for the final output
- security and deployment boundary

This keeps the core code strong, reusable, and easier to adapt. The repo should be judged by the quality of the deterministic FinanceOps core, workflow routing, approval gates, audit evidence, API visibility, and implementation model rather than by the number of prebuilt third-party connectors.

This includes:

- different file formats
- different finance systems
- different approval flows
- different output destinations
- different reviewer roles
- different audit requirements
- different hosting requirements

The current repository proves the architecture with mock data and demo-safe artifacts. Production integrations would be added only after client-specific requirements are confirmed.

## Current API and visibility features

The project includes reviewer-friendly endpoints for:

- service health
- system summary
- API inventory
- API route list
- OpenAPI contract
- demo auth status
- HTTP hardening status
- request observability
- audit visibility
- artifact status
- artifact health
- artifact manifest
- artifact size map
- artifact readiness
- client contract validation
- client implementation plan
- client requirements plan
- client implementation readiness
- client package validation routes

The goal is to make the project reviewable without forcing an engineer to inspect every file manually.

## Current client package features

The repository includes multiple client-facing and reviewer-facing packages, including:

- client readiness package
- client build package
- client acceptance package
- client pilot plan
- client production handoff package
- client go-live package
- client commercial package
- client sales handoff package
- client reviewer audit package
- client reviewer dashboard package
- client sample input fixtures package
- client security boundary package
- client validation matrix
- client plugin contracts
- client implementation manifest
- client work order package
- client repository starter
- client adapter registry
- client implementation roadmap
- client deployment profile
- client acceptance gate
- client delivery package
- client enterprise sales brief
- client enterprise red-team package
- client due diligence package
- client control matrix
- client evidence binder
- client pilot decision packet
- client pilot kickoff package
- client pilot SOW package
- client pilot proposal package
- client procurement review package
- client security questionnaire package

These packages are meant to show how the project can move from technical demo to client discovery, pilot planning, procurement review, and production-readiness discussion.

## Enterprise safety boundaries

The current public demo intentionally does not include:

- production client data
- production credentials
- real payment execution
- real accounting write-back
- client-owned authentication
- client-owned authorization
- production secret management
- production monitoring
- production incident response
- production deployment approval
- enterprise compliance certification

Those are blocked until a real client provides requirements and owns the production environment.

## Why this matters

Enterprise finance teams do not need an AI system that guesses.

They need:

- deterministic calculations
- explainable outputs
- audit logs
- approval gates
- blocked risky actions
- traceable artifacts
- clear security boundaries
- client-owned credentials
- client-owned data
- client-owned hosting
- client-specific integrations
- reviewer-friendly evidence

This repository is built to demonstrate those patterns.

## Future roadmap

### Phase 1: Technical review and demo polish

- strengthen README
- keep CI green
- keep local validation simple
- improve reviewer flow
- add clearer architecture explanation
- add more sample API output examples
- improve test coverage for lower-covered files
- clean up naming where useful

### Phase 2: Client discovery

- collect real client input examples
- collect required output formats
- define first workflow
- define manual baseline
- define approval policies
- define user roles
- define hosting requirements
- define security requirements
- define monitoring requirements
- define success criteria

### Phase 3: Client-specific adapter build

- build input adapters
- build output adapters
- map client fields into the FinanceOps schema
- configure client-specific workflow checks
- configure client-specific approval rules
- configure client-specific output artifacts
- test against safe client sample data

### Phase 4: Pilot deployment

- deploy a client-specific website or dashboard
- use client-approved hosting
- keep private data in client-owned systems
- keep secrets in client-owned secret management
- run in approval-required mode
- generate audit artifacts
- review results with finance and technical stakeholders

### Phase 5: Production hardening

- client-owned authentication
- role-based authorization
- production logging
- production monitoring
- alerting
- incident response
- secure secret management
- environment separation
- data retention policy
- disaster recovery planning
- compliance review
- production deployment checklist

### Phase 6: Expanded automation

Potential future workflows include:

- accounts receivable review
- accounts payable review
- vendor payment approval
- bank reconciliation
- month-end close support
- revenue recognition support
- payroll review
- procurement review
- project profitability monitoring
- cashflow monitoring
- multi-entity reporting
- multi-currency reporting
- CFO dashboard
- Slack and email reporting
- ERP integrations
- accounting draft write-back
- payment processor approval flows
- custom client reporting

## How to run locally

Install dependencies:

- pnpm install

Run full local verification:

- pnpm run verify:local

Run the API server:

- pnpm run api

Run demo verification:

- pnpm run verify:demo

Watch the latest GitHub Actions run after pushing:

- pnpm run ci:watch

## Current validation approach

The project currently uses:

- pnpm run lint:strict
- pnpm run typecheck
- pnpm run test
- pnpm run test:coverage
- pnpm run build
- pnpm run verify:demo
- pre-push verification
- GitHub Actions CI
- CI watcher for the exact pushed commit

This helps prevent broken commits from being pushed unnoticed.

## Reviewer note

This project should be reviewed as a public technical demo and architecture foundation, not as a finished enterprise deployment.

The strongest parts of the project are:

- deterministic finance logic
- governance boundaries
- approval gates
- auditability
- API visibility
- client-specific implementation planning
- procurement and security review support
- clear separation between finance logic and AI explanation

The intended final product is a client-specific implementation where the core is adapted to each client’s inputs, outputs, workflows, controls, and hosting environment.
