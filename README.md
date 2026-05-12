# FinanceOps Agent

A governed finance operations automation demo built in TypeScript.

FinanceOps Agent shows how a finance/accounting workflow can be turned into deterministic checks, approval-gated recommendations, audit-visible artifacts, and reviewer-ready API outputs.

It is not a generic chatbot and it is not positioned as production-ready SaaS. The public repo is a demo-safe implementation core using mock data.

## Senior reviewer quick path

Start here if you are reviewing the repo quickly:

1. Read this README.
2. Open [Reviewer 60-Second Walkthrough](docs/REVIEWER_60_SECOND_WALKTHROUGH.md).
3. Open [Reviewer Demo Script](docs/REVIEWER_DEMO_SCRIPT.md).
4. Open [Reviewer Architecture Summary](docs/REVIEWER_ARCHITECTURE_SUMMARY.md).
5. Run the fast reviewer commands below.

Share note for a senior dev reviewer: [Senior dev review share note](docs/SENIOR_DEV_REVIEW_SHARE_NOTE.md).

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

## Start here

Key reviewer docs:

- [Reviewer 60-Second Walkthrough](docs/REVIEWER_60_SECOND_WALKTHROUGH.md) - fastest plain-English overview of what the repo proves.
- [Product Positioning](docs/PRODUCT_POSITIONING.md) - broader configurable FinanceOps core and safe product claims.
- [AI Company Reviewer Path](docs/AI_COMPANY_REVIEWER_PATH.md) - why the repo is relevant to AI companies, technical reviewers, and hiring teams.
- [Reviewer Demo Command Index](docs/REVIEWER_DEMO_INDEX.md) - fastest command path for inspecting the repo.
- [Architecture Overview](docs/ARCHITECTURE_DIAGRAM.md) - deterministic core, approval gates, audit layer, and reviewer-facing API surface.
- [Reviewer Demo Script](docs/REVIEWER_DEMO_SCRIPT.md) - copy-ready walkthrough for technical, product, and buyer review.
- [Reviewer Architecture Summary](docs/REVIEWER_ARCHITECTURE_SUMMARY.md) - senior-level architecture, control boundaries, auditability, and reviewer-facing design.

Additional implementation docs:

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

## Core principle

The central design principle is simple:

Finance logic should be deterministic. AI should explain verified outputs, not invent numbers or approve sensitive finance actions.

Sensitive actions are either blocked, simulated, or approval-gated.

## Product positioning

FinanceOps Agent is positioned as a configurable FinanceOps automation core.

The public repo shows the reusable core. A real client implementation would clone or configure this core around the client's own inputs, mappings, workflows, approval rules, output formats, and deployment boundary.

See [Product Positioning](docs/PRODUCT_POSITIONING.md) for the full positioning and capability model.

## Current project status

Current status: **demo-ready / pilot-discussion-ready / production-blocked**.

Ready now:

- TypeScript finance workflow core.
- Mock finance dataset.
- Deterministic margin, burn, overdue invoice, and reconciliation logic.
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