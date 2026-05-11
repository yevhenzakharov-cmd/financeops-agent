# Reviewer Demo Script

This script gives a technical reviewer, AI-company hiring team, senior engineer, founder, CFO-style buyer, or potential client a clear walkthrough of the FinanceOps Agent repository.

FinanceOps Agent should be reviewed as a governed FinanceOps automation core and client-specific implementation foundation, not as a finished enterprise deployment.

## One-sentence positioning

FinanceOps Agent is a configurable FinanceOps automation core demo built around deterministic TypeScript finance logic, client-specific workflow configuration, approval gates, audit artifacts, reviewer-safe API visibility, and an AI explanation layer that does not perform financial calculations.

## Main message to reviewers

This is not a generic chatbot.

The system demonstrates how finance and accounting workflows can be routed through deterministic logic, control checks, approval boundaries, audit evidence, and client implementation packages before any production integration is attempted.

AI can explain verified outputs, but AI is not the source of financial truth.

## Best first command path

Run these commands in this order:

pnpm run verify:local
pnpm run demo:client-reviewer-dashboard-package
pnpm run demo:ai-company-reviewer-path
pnpm run demo:reviewer-command-index
pnpm run demo:api-inventory
pnpm run demo:openapi-contract
pnpm run demo:audit-visibility

This sequence proves the strongest review story:

1. Local quality gates pass.
2. The reviewer dashboard package gives one consolidated handoff.
3. The AI-company reviewer path explains why the project is relevant to technical reviewers.
4. The command index shows how to inspect the repo without guessing.
5. The API inventory shows public demo routes and protected action routes.
6. The OpenAPI contract shows a machine-readable API surface.
7. Audit visibility shows traceable outputs after the demo workflow runs.

## What to show first

Start with:

pnpm run verify:local

This proves the repo passes the local quality gate before any demo claims are made.

Reviewer takeaway:

The repo is not just a collection of static documents. It has a working TypeScript codebase with automated checks.

## Show the consolidated reviewer dashboard package

Run:

pnpm run demo:client-reviewer-dashboard-package

What it proves:

- The repo has a reviewer-first entry point.
- Buyer, audit, control, readiness, and proof signals are grouped together.
- Production blockers are explicitly documented.
- The project separates demo readiness from production readiness.
- Reviewers do not need to inspect every file manually to understand the system.

Safe claim:

The project provides a consolidated reviewer package that summarizes the strongest technical, commercial, audit, control, and readiness signals.

Avoid claiming:

The dashboard package proves the system is production-ready for a real client.

## Show API inventory

Run:

pnpm run demo:api-inventory

What it proves:

- The API surface is visible and reviewable.
- Routes are grouped by purpose.
- Read-only reviewer endpoints are separated from protected action-like routes.
- Action-like routes are gated with the demo API key.
- Route risk notes are documented.

Safe claim:

The API inventory makes the demo surface transparent and reviewable.

Avoid claiming:

The demo API key is production-grade authentication or role-based authorization.

## Show OpenAPI contract

Run:

pnpm run demo:openapi-contract

What it proves:

- The project exposes a machine-readable API contract.
- Reviewer and integration paths are easier to inspect.
- Protected action routes can be documented separately from public demo routes.
- Error responses and auth boundaries can be reviewed more formally.

Safe claim:

The repo includes an OpenAPI contract for reviewer and implementation visibility.

Avoid claiming:

The OpenAPI contract means the system is already ready for enterprise production use.

## Show audit visibility

Run:

pnpm run demo:audit-visibility

What it proves:

- The system produces audit-visible execution evidence.
- Reviewers can inspect trace IDs, event phases, event types, and artifact status.
- Outputs are not just printed to the console; they are persisted as reviewable artifacts.
- Audit visibility supports technical and CFO-style review.

Safe claim:

The project demonstrates auditability patterns through persisted demo artifacts and audit visibility endpoints.

Avoid claiming:

The public demo already satisfies a specific client audit standard, compliance framework, or regulatory requirement.

## Optional deeper technical path

Use this path when the reviewer wants to inspect accounting workflow logic:

pnpm run demo:accounting-task-registry
pnpm run demo:accounting-workflow-router
pnpm run demo:client-workflow-intake
pnpm run demo:client-adapter-readiness

What this proves:

- Accounting tasks are classified before execution.
- Workflows are routed into allowed, simulated, approval-gated, professionally reviewed, or blocked lanes.
- Vague client requests can be converted into structured implementation plans.
- Real adapters are intentionally scoped after client discovery and field mapping.

Safe claim:

The project demonstrates a controlled implementation model for client-specific FinanceOps workflows.

Avoid claiming:

The system can already connect to every client ERP, bank, payroll, or accounting system without custom adapter work.

## Optional buyer-facing path

Use this path when speaking with a founder, CFO-style buyer, or potential client:

pnpm run demo:client-commercial-package
pnpm run demo:client-evidence-binder
pnpm run demo:client-control-matrix
pnpm run demo:client-production-readiness-package
pnpm run demo:client-risk-acceptance-package

What this proves:

- The repo contains buyer-facing packaging.
- The project explains implementation value in business terms.
- Security, procurement, compliance, risk acceptance, and production readiness are not ignored.
- Production is intentionally blocked until client-owned controls exist.

Safe claim:

The project is packaged to support technical review, buyer review, procurement-style review, and client implementation scoping.

Avoid claiming:

The package replaces real security review, legal review, compliance review, or client approval.

## What the main endpoints prove

### /api/inventory

Proves the API surface is visible, grouped, and risk-noted.

### /openapi.json

Proves the API can be inspected through a machine-readable contract.

### /audit/visibility

Proves demo execution artifacts can be reviewed without manually searching local output files.

### /artifacts/manifest

Proves the system tracks generated artifacts such as execution ledger, approval queue, payment execution artifact, and client output artifact.

### /client/reviewer-dashboard-package

Proves the project has a consolidated reviewer handoff package.

### /client/production-readiness-package

Proves the repo is honest about production blockers and does not pretend the public demo is production-ready.

### /client/risk-acceptance-package

Proves the system documents which risks are accepted for demo, which are acceptable for pilot with controls, and which remain blocked for production.

### POST /run-financeops-agent

Proves the protected demo execution path can run the FinanceOps workflow and generate outputs.

Important: this is an action-like demo route and must remain protected.

### POST /payments/:paymentRecommendationId/approve-and-send

Proves payment-like behavior is simulated through a protected demo route.

Important: this is not autonomous production money movement.

## Safe claims

Use these claims when describing the project:

- The repo demonstrates a governed FinanceOps automation core.
- Financial calculations and routing decisions are deterministic TypeScript logic.
- AI is used only as an explanation layer over already-computed results.
- The demo uses mock data only.
- Action-like demo routes are protected with a demo API key.
- The project generates audit logs and reviewable artifacts.
- The API surface is visible through inventory and OpenAPI outputs.
- Production remains blocked until client-owned data, authentication, authorization, secrets, approvals, monitoring, deployment, and compliance controls exist.
- Real client adapters are scoped after discovery, field mapping, and client approval.

## Claims to avoid

Do not claim:

- The repo is a finished enterprise product.
- The system autonomously approves payments.
- The system autonomously posts accounting entries.
- AI performs the financial calculations.
- The demo API key is production-grade authentication.
- The current repo contains production ERP, bank, payroll, or payment integrations.
- The demo satisfies a specific regulatory or audit framework.
- The system can be deployed to production without client-owned controls.

## Reviewer close

The strongest reviewer takeaway:

FinanceOps Agent is a credible governed automation foundation because it combines deterministic finance logic, approval boundaries, audit visibility, API transparency, client implementation planning, and honest production blockers.

It should be evaluated as a portfolio-grade technical demo and client-specific implementation foundation, not as a generic chatbot or finished enterprise accounting platform.