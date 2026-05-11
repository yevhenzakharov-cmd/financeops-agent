# AI Company Reviewer Path

This guide is for AI companies, senior engineers, and technical reviewers evaluating FinanceOps Agent as a public portfolio implementation foundation.

The repository is still evolving. This guide shows the current strongest review path for evaluating the project as evidence of AI-agent architecture, TypeScript engineering, finance automation judgment, and production-aware safety design.

## What this project is

FinanceOps Agent is a working governed FinanceOps core and implementation foundation for client-specific finance/accounting automation.

It demonstrates:

- deterministic finance calculations
- AI as an explanation layer only
- approval-gated workflow design
- audit artifacts and evidence trails
- API visibility for reviewers
- demo-safe security boundaries
- TypeScript architecture
- tests and CI validation
- product and implementation judgment

This is not a generic chatbot. It is also not claiming that the public repo already includes hosted SaaS infrastructure, real client integrations, or production client credentials.

## What to review first

Recommended review order:

1. `README.md` - project positioning, commands, and safety boundary.
2. `docs/REVIEWER_DEMO_PATH.md` - reviewer-facing demo sequence.
3. `docs/API.md` - API groups, route purposes, and protected action boundaries.
4. `docs/IMPLEMENTATION_MODEL.md` - demo, pilot, and production boundary model.
5. `src/pipeline/run-financeops-pipeline.ts` - deterministic orchestration flow.
6. `src/tools/` - finance logic for overdue invoices, reconciliation, burn, margin, and exceptions.
7. `src/security/` - safe output policy, audit logging, accounting controls, task registry, and workflow router.
8. `src/api/` - reviewer endpoints, protected routes, OpenAPI, inventory, artifacts, and audit visibility.
9. `tests/` - validation coverage across tools, API, security, artifacts, client packages, and auth.

## Fast validation path

A reviewer can run:

- `pnpm install`
- `pnpm run lint:strict`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run verify:demo`

The stronger local verification path is:

- `pnpm run verify:local`

Useful reviewer demo commands:\n\n- `pnpm run demo:reviewer-command-index`

- `pnpm run demo:reviewer-path`
- `pnpm run demo:ai-company-reviewer-path`
- `pnpm run demo:client-ready-checkpoint`
- `pnpm run demo:first-adapter-decision-tree`

## Architecture signal

The main architecture signal is the separation between deterministic finance logic and AI-generated explanation.

The intended flow is:

mock or client-shaped inputs -> normalized FinanceOps data -> deterministic checks -> exception classification -> policy and control evaluation -> simulated or approval-gated action preparation -> audit artifacts -> CFO/reviewer explanation

AI may explain already-computed outputs. It must not invent numbers, approve payments, post accounting entries, move money, or provide final tax/legal advice.

## Engineering signal

The repo is designed to show work across:

- TypeScript application architecture
- Express API design
- finance/accounting domain modeling
- deterministic business logic
- testable service boundaries
- audit and artifact generation
- safety-first AI-agent design
- CI-backed repository hygiene
- documentation for technical and business reviewers

## Safety and governance signal

The project intentionally blocks or limits high-risk actions.

Important boundaries:

- mock data only in the public repo
- no production credentials
- no real bank or ERP integration yet
- no autonomous money movement
- no autonomous accounting postings
- no final tax/legal advice
- production blocked until client-owned controls exist

## What not to over-index on

Do not review this public repository as a finished hosted SaaS product.

The public repo intentionally does not include real client data, private client integrations, production auth/RBAC, production deployment secrets, live payment rails, or live accounting write-back.

Those belong in a private client-specific implementation repo, not in this public portfolio repository.

## Current reviewer takeaway

FinanceOps Agent should be reviewed as a production-aware AI-agent architecture foundation.

The strongest signal is not that the public repo connects to every real finance system today. The strongest signal is that the system shows how to structure a real AI-assisted finance workflow with deterministic logic, safety boundaries, tests, audit trails, and clear implementation judgment.
