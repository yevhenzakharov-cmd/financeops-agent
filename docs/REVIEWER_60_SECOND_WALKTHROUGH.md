# Reviewer 60-Second Walkthrough

This page gives a reviewer the fastest path to understand what FinanceOps Agent proves.

## What this repo is

FinanceOps Agent is a governed FinanceOps automation core for client-specific accounting and finance operations workflows.

It is not a generic chatbot.

The system is designed around deterministic finance logic, approval gates, audit evidence, reviewer-safe APIs, and client-specific implementation packages.

## What to understand first

The core idea is simple:

1. Client data enters through adapters.
2. The system normalizes and validates the data.
3. Deterministic finance logic detects exceptions, risks, reconciliation issues, and approval needs.
4. Sensitive actions stay blocked or approval-gated.
5. Audit logs, ledgers, queues, and artifacts are generated.
6. AI-style output explains already-computed results; it does not create the financial truth.

## Fastest proof path

Run these commands:

    pnpm run verify:local
    pnpm run demo:client-reviewer-dashboard-package
    pnpm run demo:ai-company-reviewer-path
    pnpm run demo:reviewer-command-index

## What this proves

`pnpm run verify:local`

Proves the local quality gate passes: lint, typecheck, tests, coverage, build, and demo verification.

`pnpm run demo:client-reviewer-dashboard-package`

Shows the strongest reviewer-facing summary of the system: deterministic core, artifact proof, approval safety, commercial readiness, and production blockers.

`pnpm run demo:ai-company-reviewer-path`

Explains why the repo is relevant to AI companies, technical reviewers, hiring teams, and product reviewers.

`pnpm run demo:reviewer-command-index`

Shows the command index so reviewers do not need to guess what to run.

## Strongest reviewer signals

- TypeScript-first backend architecture
- deterministic finance workflow logic
- approval-gated automation model
- public read-only reviewer endpoints
- protected action-like routes
- audit visibility
- artifact registry
- OpenAPI contract
- API inventory
- client discovery and implementation planning packages
- commercial, procurement, compliance, security, pilot, and production-readiness packages
- clear production blockers instead of overclaiming

## What to inspect after the first run

Read these files in this order:

1. `README.md`
2. `docs/REVIEWER_DEMO_SCRIPT.md`
3. `docs/REVIEWER_ARCHITECTURE_SUMMARY.md`
4. `docs/ARCHITECTURE_DIAGRAM.md`
5. `docs/AI_COMPANY_REVIEWER_PATH.md`
6. `docs/PRODUCT_POSITIONING.md`
7. `docs/REVIEWER_DEMO_INDEX.md`

## Safe claims

You can safely say:

- This is a public technical demo of a governed FinanceOps automation core.
- The repo demonstrates deterministic finance logic, auditability, approval gates, and reviewer-facing APIs.
- AI-style output is used only as an explanation layer on top of deterministic outputs.
- Sensitive actions are blocked or approval-gated.
- The project is designed to become client-specific through adapters, mappings, policies, and output packages.

## Claims to avoid

Do not claim:

- This is a finished enterprise production deployment.
- The repo is connected to real ERP, bank, payroll, or accounting systems.
- The agent can autonomously move money.
- The agent can post accounting entries without approval.
- ROI is verified with real client data.
- Security, compliance, and procurement are complete for production.

## Honest current boundary

The repo is strong for technical review, buyer review, AI-company review, and scoped pilot discussion.

Production use still requires client-owned data, authentication, authorization, secrets, monitoring, deployment controls, approval policies, audit retention, and accepted output formats.
