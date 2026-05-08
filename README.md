

FinanceOps Agent

A governed autonomous FinanceOps agent platform for a game development studio.

## Reviewer Architecture Summary

For a high-level reviewer explanation of the FinanceOps Agent architecture, demo boundaries, proof endpoints, and portfolio value, see:

- [Reviewer Architecture Summary](docs/REVIEWER_ARCHITECTURE_SUMMARY.md)

This project demonstrates an enterprise-style AI agent architecture that combines deterministic financial controls, risk classification, financial intervention simulation, intelligent strategy selection, risk appetite governance, approval routing, execution ledger persistence, audit tracing, REST API access, API response persistence, safe output enforcement, and AI-generated CFO briefings.

The core system does not need to be rewritten for every new input source. Each adapter would normalize external data into the internal domain schema.
In the simplest case, where the company provides a clean CSV/JSON export and a clearly defined target output, adding a new input/output adapter is usually a small implementation task. In a clean-data scenario, this could realistically be completed in roughly 1–2 hours max. More complex integrations may take longer depending on authentication, data quality, field mapping, approval logic, and system access.

The system currently uses simulated company data for demo purposes. The architecture is intentionally designed so real company inputs can later be connected through adapters, including ERP exports, accounting systems, bank feeds, payroll systems, payment processors, Google Sheets, CSV files, JSON files, data warehouses, or internal APIs.
A company can provide whichever input type it actually uses, and the system can be adapted to produce whichever output format the company needs based on that data.

Executive Summary

The FinanceOps Agent is not a simple AI wrapper.

It is a governed autonomous finance-control system where:

* deterministic tools calculate financial truth
* exception classifiers identify operational risk
* simulation engines model possible financial interventions
* strategy selection logic chooses the best action per exception
* risk appetite configuration controls what is allowed
* execution modes define the level of autonomy
* approval workflows route decisions to the right role
* execution ledgers persist decision history
* audit logs preserve traceability
* safe output policies block secret leakage
* the AI layer generates a CFO-style briefing from validated structured data

The LLM is not the source of truth.

The deterministic finance engine is the source of truth.

The AI layer is used for executive interpretation, not uncontrolled financial calculation or blind action execution.

Why This Is Not a Simple AI Wrapper

Many AI agent demos follow this pattern:
raw data
→ LLM prompt
→ free-form response

This project follows a controlled enterprise pattern:
simulated company inputs
→ deterministic finance engine
→ exception classification
→ intervention simulation
→ strategy selection
→ policy governance
→ approval routing
→ ledger persistence
→ audit trace
→ AI CFO briefing
→ REST API response
The AI model is deliberately placed near the end of the pipeline. It receives structured outputs from deterministic tools and produces an executive briefing. The system calculates financial numbers through deterministic TypeScript tools, not through the LLM. The AI layer receives those already-computed results and explains them in CFO-style language.

Why This Architecture Matters

Most AI agents directly reason over unstructured data and produce free-form output.

This system separates responsibilities:
Deterministic tools calculate financial truth.
Simulation engines model possible interventions.
Governance policies decide what is allowed.
Approval workflows route human review.
Execution ledgers preserve decision history.
The AI layer explains the result.
Audit logs preserve traceability.

                       ┌────────────────────────────┐
                       │  Simulated Company Inputs  │
                       └─────────────┬──────────────┘
                                     │
                                     ▼
                       ┌────────────────────────────┐
                       │ Deterministic Finance Core │
                       └─────────────┬──────────────┘
                                     │
                                     ▼
                       ┌────────────────────────────┐
                       │ Exception Classification   │
                       └─────────────┬──────────────┘
                                     │
                                     ▼
                       ┌────────────────────────────┐
                       │ Financial Action Simulator │
                       └─────────────┬──────────────┘
                                     │
                                     ▼
                       ┌────────────────────────────┐
                       │ Intelligent Strategy Select│
                       └─────────────┬──────────────┘
                                     │
                                     ▼
                       ┌────────────────────────────┐
                       │ Risk Appetite Governance   │
                       └─────────────┬──────────────┘
                                     │
                                     ▼
                       ┌────────────────────────────┐
                       │ Approval Workflow Routing  │
                       └─────────────┬──────────────┘
                                     │
                                     ▼
                       ┌────────────────────────────┐
                       │ Execution Ledger           │
                       └─────────────┬──────────────┘
                                     │
                                     ▼
                       ┌────────────────────────────┐
                       │ AI CFO Briefing Layer      │
                       └─────────────┬──────────────┘
                                     │
                                     ▼
                       ┌────────────────────────────┐
                       │ Audit + Safe Persistence   │
                       └─────────────┬──────────────┘
                                     │
                                     ▼
                       ┌────────────────────────────┐
                       │ REST API Response          │
                       └────────────────────────────┘
     

Current Capabilities
* deterministic margin analysis
* budget burn risk detection
* overdue receivables detection
* reconciliation exception detection
* finance exception classification
* financial intervention simulation
* intelligent best-action selection
* risk appetite governance
* execution mode control
* approval queue generation
* execution ledger persistence
* audit log persistence
* API response persistence
* AI CFO briefing generation
* payment recommendation generation
* human-approved mock payment execution
* payment execution audit record persistence
* secret-safe output writing
* REST API access
* system summary endpoint
* health check endpoint

Simulated Company Data

The current project uses simulated company data for demonstration.

The simulated data represents a game development studio with:

* projects
* project budgets
* invoices
* payments
* expenses
* contractor costs
* bank transactions
* reconciliation events
* finance exceptions

This allows the agent to demonstrate realistic FinanceOps workflows without exposing private company data.

Source files:

* src/domain/mock-data.ts￼
* src/domain/schemas.ts￼

Real Input Adapter Strategy

The system is designed so real company inputs can be added later through adapters.

Possible input sources:

* NetSuite
* QuickBooks
* Xero
* SAP
* Oracle
* Stripe
* Wise
* bank transaction feeds
* payroll systems
* Google Sheets
* CSV exports
* JSON exports
* Snowflake
* BigQuery
* internal finance APIs
* ERP exports
* invoice aging reports
* accounts receivable reports
* vendor payment files

The core system does not need to be rewritten for every new input source. Each adapter would normalize external data into the internal domain schema.

Custom Output Strategy

A company can define whichever output format it needs.

Possible outputs:

* structured JSON API response
* CFO executive summary
* margin risk report
* overdue receivables queue
* reconciliation exception report
* approval queue
* execution ledger
* audit trace
* Slack notification payload
* CSV export
* dashboard API response
* PDF report
* ERP task payload
* finance operations ticket
* compliance review package

The current demo returns structured API JSON and persists generated artifacts locally. Future company-specific output adapters could convert the same internal results into whichever output format the company wants.

Deterministic Finance Core

The financial calculations are handled by deterministic TypeScript tools, not by the LLM. This reduces the risk of the AI model inventing financial numbers, because the model receives already-computed financial outputs instead of being asked to calculate them from scratch.

Examples:

* revenue
* costs
* gross margin
* margin percentage
* budget utilization
* expected burn percentage
* burn variance
* overdue invoice detection
* reconciliation mismatch detection

This prevents the AI model from inventing financial numbers.
Implementation files:

* src/tools/project-margin.ts￼
* src/tools/budget-burn.ts￼
* src/tools/overdue-invoices.ts￼
* src/tools/reconciliation.ts￼
* src/tools/index.ts￼

Exception Classification Layer

Detected issues are converted into structured finance exceptions.

Example categories:

* underburn
* overdue invoice
* missing payment
* orphan bank transaction

Each exception includes:

* ID
* source
* reference ID
* category
* severity
* recommended action type
* human review flag

Implementation file:

* src/tools/exception-classifier.ts￼

⸻

Financial Intervention Simulation

The system simulates potential finance actions before any execution.

Example simulated actions:

* escalate collection
* offer settlement
* write off invoice
* freeze vendor payments
* reallocate budget

Each simulated action includes:

* projected cash delta
* projected margin delta
* projected risk delta
* explanation

Implementation files:

* src/simulation/financial-impact-engine.ts￼
* src/simulation/action-simulator.ts￼

Intelligent Strategy Selection

The system scores simulated actions and selects the best strategy per exception.

The scoring logic considers:

* projected cash impact
* projected margin impact
* projected risk delta

Instead of returning every possible action as equal, the agent selects the best intervention per exception and then passes that selected strategy into the governance layer.

Strategy selection currently happens inside:

* src/index.ts￼
* src/api/server.ts￼

Risk Appetite Governance

Execution decisions are controlled by configurable risk appetite settings.

Examples:

* maximum allowed risk increase
* minimum required cash delta
* minimum required margin delta
* whether negative-margin actions are allowed

Environment variables:
MAX_ALLOWED_RISK_INCREASE=5
MIN_REQUIRED_CASH_DELTA=0
MIN_REQUIRED_MARGIN_DELTA=0
ALLOW_NEGATIVE_MARGIN_ACTIONS=false
Implementation files:

* src/config/risk-appetite.ts￼
* src/execution/execution-mode.ts￼
* src/execution/auto-executor.ts￼

Execution Mode Control

The system supports multiple execution modes:
simulation
approval_required
auto_execute_safe
full_autonomous

Configured through .env:
EXECUTION_MODE=simulation

simulation

All selected actions are simulated. No action is treated as executed.

approval_required

All selected actions require approval.

auto_execute_safe

Only actions satisfying configured risk appetite are treated as executable.

full_autonomous

The system allows broader autonomous execution while still applying core policy checks.

For the public demo, simulation mode is the safest and recommended mode.

Implementation file:

* src/execution/execution-mode.ts￼

Approval Workflow

The system creates an approval queue with role routing.

Example roles:

* controller
* CFO
* auditor

Approval statuses:

* pending
* not_required
* blocked

This simulates how a real finance team could review agent-selected actions before execution.

Implementation file:
* src/approval/approval-workflow.ts￼

Execution Ledger

Every selected strategy and governance decision is persisted into a structured execution ledger.

The ledger records:

* ledger entry ID
* timestamp
* exception ID
* action type
* decision
* reason
* projected cash delta
* projected margin delta
* projected risk delta
* explanation

Implementation file:
* src/execution/execution-ledger.ts￼

Audit Logging

The system creates traceable audit logs with execution phases and trace IDs.

Audit events can include:

* system start
* action generation
* policy enforcement
* AI briefing validation
* artifact persistence
* system completion

Implementation file:
* src/security/audit-log.ts￼

Secure Output Policy

All persisted JSON artifacts go through safeWriteJson.

The output policy scans for sensitive secret patterns before writing files.

The current policy blocks patterns such as:

* OpenAI-style API keys
* private key blocks
* AWS access keys
* Google API keys

This helps prevent accidental secret leakage into generated runtime outputs.

Implementation file:
* src/security/safe-output-policy.ts￼

Additional Security and Validation Files

The project also includes policy/evidence modules from the earlier security layer:

* src/security/action-policy.ts￼
* src/security/evidence-judge.ts￼

These files demonstrate the broader intended security model around action gating and evidence validation.

AI CFO Briefing Layer

The OpenAI-powered CFO briefing is generated only after deterministic analysis, action simulation, strategy selection, governance decisions, approval routing, and ledger construction are complete.

The AI receives structured system outputs and produces a CFO-style briefing.

The AI output is schema-validated before use.

The AI layer is used for executive interpretation, not financial calculation.

Implementation files:
* src/agent/cfo-briefing.ts￼
* src/agent/briefing-schema.ts￼

API Response Shape

The /run-financeops-agent endpoint returns:
status
result.mode
result.project
result.margin
result.burn
result.overdue
result.reconciliation
result.exceptions
result.selectedActions
result.decisions
result.ledger
result.approvalQueue
result.cfoBriefing
result.auditTraceId

Persisted Artifacts

Each run can produce structured artifacts:
outputs/audit/latest-audit-log.json
outputs/ledger/latest-execution-ledger.json
outputs/approvals/latest-approval-queue.json
outputs/api/latest-api-response.json
These outputs are ignored by git because they are generated runtime artifacts.

Writers:

* src/security/audit-log.ts￼
* src/execution/execution-ledger.ts￼
* src/approval/approval-workflow.ts￼
* src/api/api-output-writer.ts￼
* src/security/safe-output-policy.ts￼

Key Implementation Files

This section maps the architecture to the actual source files so reviewers can quickly inspect the system.

Domain Layer

* src/domain/schemas.ts￼
* src/domain/mock-data.ts￼

Purpose:

* defines the core financial domain objects
* provides simulated company data for the public demo
* can later be replaced by real input adapters

Deterministic Finance Tools

* src/tools/project-margin.ts￼
* src/tools/budget-burn.ts￼
* src/tools/overdue-invoices.ts￼
* src/tools/reconciliation.ts￼
* src/tools/exception-classifier.ts￼
* src/tools/index.ts￼

Purpose:

* computes financial state deterministically
* detects receivables, burn, margin, and reconciliation issues
* produces structured exceptions used by the agent pipeline

Simulation Engine

* src/simulation/financial-impact-engine.ts￼
* src/simulation/action-simulator.ts￼

Purpose:

* simulates possible finance interventions
* models projected cash delta, margin delta, and risk delta
* provides candidate actions before governance selection

Governance and Execution Layer

* src/config/risk-appetite.ts￼
* src/execution/execution-mode.ts￼
* src/execution/auto-executor.ts￼
* src/execution/execution-ledger.ts￼

Purpose:

* loads configurable risk appetite values
* controls execution mode
* applies governance rules before any action is treated as executable
* persists selected strategies and governance decisions

Approval Workflow

* src/approval/approval-workflow.ts￼

Purpose:

* builds an approval queue
* assigns controller, CFO, or auditor roles
* marks actions as pending, blocked, or not required

AI CFO Briefing Layer

* src/agent/cfo-briefing.ts￼
* src/agent/briefing-schema.ts￼

Purpose:

* calls the OpenAI API
* generates a CFO-style structured briefing
* parses model output
* validates output against the briefing schema

Security Layer

* src/security/safe-output-policy.ts￼
* src/security/audit-log.ts￼
* src/security/action-policy.ts￼
* src/security/evidence-judge.ts￼

Purpose:

* blocks secret-like patterns before writing outputs
* persists structured audit logs
* enforces action policy decisions
* validates evidence consistency

REST API Layer

* src/api/server.ts￼
* src/api/api-output-writer.ts￼

Purpose:

* exposes the governed FinanceOps pipeline as an API service
* provides /health, /system-summary, and /run-financeops-agent
* persists the latest API response for review

Architecture-to-File Map
Simulated company inputs
  → src/domain/mock-data.ts

Domain modeling
  → src/domain/schemas.ts

Deterministic finance analysis
  → src/tools/project-margin.ts
  → src/tools/budget-burn.ts
  → src/tools/overdue-invoices.ts
  → src/tools/reconciliation.ts

Exception classification
  → src/tools/exception-classifier.ts

Financial intervention simulation
  → src/simulation/financial-impact-engine.ts
  → src/simulation/action-simulator.ts

Risk appetite governance
  → src/config/risk-appetite.ts
  → src/execution/execution-mode.ts
  → src/execution/auto-executor.ts

Approval workflow
  → src/approval/approval-workflow.ts

Execution ledger
  → src/execution/execution-ledger.ts

AI CFO briefing
  → src/agent/cfo-briefing.ts
  → src/agent/briefing-schema.ts

Audit and safe persistence
  → src/security/audit-log.ts
  → src/security/safe-output-policy.ts

REST API
  → src/api/server.ts
  → src/api/api-output-writer.ts

  Security Model

This project demonstrates several security-focused design choices:

* API keys are stored only in .env
* .env is ignored by git
* .env.example documents required variables without secrets
* runtime outputs are ignored by git
* persisted JSON goes through safe output writing
* secret patterns are blocked before file writes
* AI output is schema-validated
* AI does not directly execute financial actions
* execution modes control autonomy
* approval workflow simulates human-in-the-loop governance
* audit logs preserve traceability
* deterministic tools remain the source of financial truth

Security Features Implemented

Environment Secret Isolation

Secrets are stored in .env and excluded from git.

Files:

* .gitignore￼
* .env.example￼

Safe Output Persistence

All generated JSON artifacts pass through safeWriteJson.

The safe writer scans generated output for secret-like patterns before writing to disk.

File:

* src/security/safe-output-policy.ts￼

Schema Validation

The AI CFO briefing is validated against a schema before use.

Files:

* src/agent/briefing-schema.ts￼
* src/agent/cfo-briefing.ts￼

Strict TypeScript

The project uses strict TypeScript settings.

Files:

* tsconfig.json￼
* package.json￼

API Boundary

The system exposes a REST API using Express.

File:

* src/api/server.ts￼

Audit Traceability

The system persists audit logs with trace IDs and execution phases.

File:

* src/security/audit-log.ts￼

Governance Before Autonomy

Execution modes and risk appetite controls prevent uncontrolled autonomous execution.

Files:

* src/config/risk-appetite.ts￼
* src/execution/execution-mode.ts￼
* src/execution/auto-executor.ts￼

⸻

Current Demo Scope

This is a public simulated-data demo.

It does not connect to real:

* bank accounts
* ERP systems
* payroll systems
* payment processors
* accounting systems

The current goal is to demonstrate the architecture of a governed autonomous FinanceOps agent.

Real company inputs can later be connected through adapters without changing the core system design.

⸻

Future Production Integrations

Possible real-world input adapters:

* NetSuite
* QuickBooks
* Xero
* Stripe
* Wise
* bank transaction feeds
* payroll systems
* Snowflake
* BigQuery
* Google Sheets
* internal finance exports
* CSV upload
* JSON upload

Possible execution adapters:

* create ERP task
* open collection escalation
* route approval to CFO
* create audit case
* send Slack notification
* persist action to internal ledger
* create finance operations ticket
* write back to internal dashboard

⸻

Production Hardening Ideas

To move from demo to production, the next hardening steps would include:

* authentication and authorization
* API rate limiting
* request validation
* idempotency keys
* external database persistence
* structured logging
* real input adapters
* monitoring and alerting
* test coverage
* CI pipeline
* deployment configuration
* encrypted secret management
* real approval identity checks
* tenant isolation
* background job processing
* webhook delivery
* observability dashboards

⸻

Why This Architecture Matters

Most AI agents directly reason over unstructured data and produce free-form output.

This system separates responsibilities:
Deterministic tools calculate financial truth.
Simulation engines model possible interventions.
Governance policies decide what is allowed.
Approval workflows route human review.
Execution ledgers preserve decision history.
The AI layer explains the result.
Audit logs preserve traceability.

That separation makes the system safer, more explainable, and aligned to how an enterprise finance agent would need to operate.


Demo Payment Approval Flow

The current working demo includes a governed payment approval flow.

This demonstrates the following pattern:

agent recommends payment
→ human reviews
→ human approves through API
→ mock payment adapter simulates execution
→ payment execution audit record is persisted

This is intentionally not a live banking integration. It is a safe mock execution layer that shows how a real client-specific bank, treasury, payment processor, or custom payout API could later be connected through an adapter.

Current payment-related implementation files:

* src/payments/payment-types.ts
* src/payments/payment-recommendation-builder.ts
* src/payments/mock-payment-adapter.ts
* src/payments/payment-execution-service.ts
* src/payments/payment-execution-store.ts

Current payment API endpoint:

POST /payments/:paymentRecommendationId/approve-and-send

Current demo command:

npm run demo:payment-flow

Current verification command:

./scripts/verify-demo.sh

Current Working Demo vs Planned Sellable Demo Roadmap

Current Working Demo

The current repository already demonstrates:

* governed FinanceOps agent pipeline
* deterministic finance calculations
* exception classification
* action simulation
* best-action selection
* risk appetite governance
* approval routing
* execution ledger persistence
* audit log persistence
* AI CFO briefing generation
* REST API access
* input adapter foundation
* payment recommendation generation
* human-approved mock payment execution
* persisted payment execution audit record
* demo script for the full payment approval flow
* verification script for build/typecheck/status review

Planned Sellable Demo Roadmap

The next build priorities for the stronger commercial demo are:

* add a cleaner buyer-facing README section at the top
* add a richer mock client scenario with more realistic finance data
* add a small CSV or JSON input adapter example
* add a clearer output adapter example for client-specific exports
* expose the payment approval flow in a simple dashboard UI
* add a review screen where a human can approve or reject recommended actions
* show the payment execution record in the UI
* add a more polished executive dashboard summary
* add a demo walkthrough section for non-technical reviewers
* add a buyer-facing ROI narrative explaining what finance teams save
* add a “custom client deployment model” section explaining that each buyer can provide their own inputs and required outputs
* keep all real integrations client-specific instead of pretending the repo is a finished universal SaaS product

This roadmap is intentionally separated from the current working demo so reviewers can clearly see what already works and what is planned next.


## Client-specific implementation contracts

The system is designed to support different accounting departments without rewriting the core engine.

Each client can define:

- one or multiple input sources
- the finance tasks they want automated
- the output artifacts they need
- governance and approval rules
- escalation roles and risk tolerance

The current mock game studio contract demonstrates how a client-specific implementation can sit on top of the shared FinanceOps core.



Before implementation, each client can provide a lightweight requirements intake describing available inputs, desired outputs, priority finance tasks, and approval requirements. The system converts that intake into a plan before final adapter work begins.


The client data request packet turns onboarding requirements into a concrete list of files, fields, questions, and desired outputs needed before building a client-specific adapter.



The client implementation plan turns a client's requested inputs and desired outputs into a concrete adapter/output plan. This makes the system easier to customize for different accounting teams without changing the deterministic FinanceOps core.



## Client implementation readiness

The project includes a client-readiness layer for custom FinanceOps implementations.

This is not a SaaS onboarding flow. It is a builder-side scoping system that helps determine whether a specific client has provided enough information to build their client-owned agent.

It checks:

- required client input fields,
- missing data,
- fields that need mapping,
- optional enhancements,
- governance rules,
- human approval requirements,
- next implementation steps.

This supports the intended business model: each client provides their own inputs, desired outputs, rules, and infrastructure; the FinanceOps core is adapted to that client-specific scope.

## Client build package

The project now includes a client build package layer.

This combines implementation readiness, adapter planning, output delivery, deployment checklist, and builder next actions into one implementation handoff.

It helps answer:

- what can be reused from the FinanceOps core,
- what must be customized for the client,
- what data is missing,
- what field mappings are required,
- what outputs the client expects,
- what approval gates must exist before any finance action is prepared.

## Client acceptance package

The project includes a client acceptance package layer.

This layer packages acceptance criteria, test scenarios, demo script, and build package into a final demo-to-build handoff.

It helps show whether a client implementation is accepted, accepted with warnings, or blocked before deeper client-specific build work starts.

## Reviewer Dashboard

The project exposes a reviewer-friendly dashboard endpoint:

curl -s http://localhost:3001/client/reviewer-dashboard | python3 -m json.tool

Use this endpoint first when demonstrating the repo. It summarizes the deterministic finance core, artifact proof, approval-gated safety model, production blockers, and suggested demo order.

## Client Sample Input Fixtures

The project includes a client sample input fixtures endpoint:

curl -s http://localhost:3001/client/sample-input-fixtures | python3 -m json.tool

Use it to show the data readiness layer before discussing real client adapters.

## Client Security Boundary

The project includes a client security boundary endpoint:

curl -s http://localhost:3001/client/security-boundary | python3 -m json.tool

Use it to explain why the public demo is safe to review but still blocked for production until client-owned data, credentials, mappings, and approval policy are confirmed.
