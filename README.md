# FinanceOps Agent

A governed finance operations automation core built in TypeScript.

FinanceOps Agent shows how a finance/accounting workflow can be turned into deterministic checks, approval-gated recommendations, audit-visible artifacts, and reviewer-ready API outputs.

It is not a generic chatbot and it is not positioned as production-ready SaaS. The public repo is a demo-safe implementation core using mock data.

## Senior reviewer quick path

Start here if you are reviewing the repo quickly:

1. [Reviewer 60-Second Walkthrough](docs/REVIEWER_60_SECOND_WALKTHROUGH.md) - fastest plain-English overview of what the repo proves.
2. [Product Positioning](docs/PRODUCT_POSITIONING.md) - broader configurable FinanceOps core and safe product claims.
3. [AI Company Reviewer Path](docs/AI_COMPANY_REVIEWER_PATH.md) - why the repo is relevant to AI companies, technical reviewers, and hiring teams.
4. [Reviewer Demo Command Index](docs/REVIEWER_DEMO_INDEX.md) - fastest command path for inspecting the repo.
5. [Architecture Overview](docs/ARCHITECTURE_DIAGRAM.md) - deterministic core, approval gates, audit layer, and reviewer-facing API surface.
6. [Reviewer Demo Script](docs/REVIEWER_DEMO_SCRIPT.md) - copy-ready walkthrough for technical, product, and buyer review.
7. [Reviewer Architecture Summary](docs/REVIEWER_ARCHITECTURE_SUMMARY.md) - senior-level architecture, control boundaries, auditability, and reviewer-facing design.

## What this repo proves

FinanceOps Agent demonstrates:

- TypeScript-first backend architecture.
- Deterministic finance workflow logic.
- Mock-data finance operations pipeline.
- Approval gates for sensitive finance actions.
- Audit log, execution ledger, approval queue, and output artifact generation.
- API inventory and OpenAPI-style contract visibility.
- Client discovery, implementation, procurement, security, compliance, pilot, and go-live packages.
- Buyer/reviewer-facing documentation and demo scripts.
- Clear production blockers instead of overclaiming readiness.

## What this repo does not claim

This repo does not claim:

- production deployment readiness,
- autonomous money movement,
- real ERP, bank, accounting, payroll, or payment processor integration,
- verified ROI,
- legal, tax, or final accounting advice,
- AI-generated financial truth.

AI-style output is used only to explain already-computed deterministic results. Finance calculations, classifications, approval states, and artifacts come from typed workflow logic.

## Core principle

The central design principle is simple:

Finance logic should be deterministic. AI should explain verified outputs, not invent numbers or approve sensitive finance actions.

Sensitive actions are either blocked, simulated, or approval-gated.

## What the AI layer can help with

In this repo, AI is not the source of financial truth. The deterministic TypeScript workflow computes classifications, risks, approval states, and artifacts first.

The AI layer can sit around those verified outputs to help with:

- Explaining deterministic finance outputs as CFO-style summaries, risk explanations, and reviewer-friendly briefings.
- Reviewing finance exceptions such as overdue invoices, reconciliation issues, budget burn issues, margin risks, missing payments, and orphan bank transactions.
- Preparing approval queues with severity, reason, recommended action, approval status, and human-review requirements.
- Supporting document intake in a real client implementation, including OCR/document extraction from invoices, statements, reports, or client-provided files before deterministic validation and computation.
- Generating client and buyer-facing packages such as discovery packs, readiness packs, procurement/security/compliance answers, pilot proposals, SOW-style drafts, and go-live packages.
- Supporting client onboarding and discovery by identifying available inputs, required outputs, missing fields, and mappings that need confirmation.
- Acting as a reviewer or demo guide across API endpoints, artifacts, production blockers, audit evidence, and safe product claims.
- Assisting with audit and traceability by explaining audit logs, execution ledgers, approval queues, artifact manifests, and why each decision was produced.
- Helping configure client-specific implementations by suggesting required adapters, mappings, approval rules, output formats, and deployment boundaries.

## Additional implementation docs

- [Implementation Model](docs/IMPLEMENTATION_MODEL.md)
- [Client Implementation Path](docs/CLIENT_IMPLEMENTATION_PATH.md)
- [Client Input and Output Request](docs/CLIENT_INPUT_OUTPUT_REQUEST.md)
- [Client Discovery Form](docs/CLIENT_DISCOVERY_FORM.md)
- [First Adapter Decision Tree](docs/FIRST_ADAPTER_DECISION_TREE.md)
- [Accounting Task Registry](docs/ACCOUNTING_TASK_REGISTRY.md)
- [Accounting Workflow Routing](docs/ACCOUNTING_WORKFLOW_ROUTING.md)
- [Client Workflow Intake](docs/CLIENT_WORKFLOW_INTAKE.md)
- [API Overview](docs/API.md)

Client sample packet template: [`examples/client-sample-packet`](examples/client-sample-packet).

## Product positioning

FinanceOps Agent is positioned as a configurable FinanceOps automation core.

The public repo shows the reusable core. A real client implementation would clone or configure this core around the client's own inputs, mappings, workflows, approval rules, output formats, and deployment boundary.

See [Product Positioning](docs/PRODUCT_POSITIONING.md) for the full positioning and capability model.

## Current project status

Current status: **demo-ready / pilot-discussion-ready / production-blocked**.

Ready now:

- TypeScript finance workflow core.
- Mock finance dataset.
- Deterministic margin, burn, overdue invoice, and reconciliation review scaffold.
- Exception classification.
- Approval-gated execution model.
- Mock payment approval simulation.
- Audit log generation.
- Execution ledger and approval queue artifacts.
- Output artifact store.
- API inventory and OpenAPI-style contract.
- Client readiness, discovery, implementation, procurement, security, compliance, pilot, and go-live packages.
- Reviewer documentation and demo scripts.
- Local verification and CI passing.

Still blocked for production:

- real client data adapter,
- real ERP, bank, accounting, or payment integrations,
- client-owned authentication and authorization,
- client-owned secret management,
- production deployment and monitoring,
- approved client data samples,
- accepted client output format,
- final finance approval policy,
- verified ROI claims.

## Fast reviewer commands

Run from the repository root:

```bash
pnpm install
pnpm run verify:local
pnpm run demo:reviewer-path
pnpm run demo:reviewer-demo-script
pnpm run demo:api-inventory
pnpm run demo:openapi-contract
pnpm run demo:audit-visibility
```
