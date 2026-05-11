# Reviewer Demo Command Index

This index gives AI-company, technical, and CFO-style reviewers a short path through the most important FinanceOps Agent commands.

For a copy-ready walkthrough with safe claims and claims to avoid, see [Reviewer Demo Script](REVIEWER_DEMO_SCRIPT.md).

The repository has many demo commands. This file highlights the commands that best prove the working governed FinanceOps core, deterministic logic, safety boundaries, API visibility, auditability, and implementation foundation.

## Fastest reviewer path

Run these first:

- `pnpm run verify:local`
- `pnpm run demo:client-reviewer-dashboard-package`
- `pnpm run demo:ai-company-reviewer-path`
- `pnpm run demo:reviewer-path`
- `pnpm run demo:api-inventory`
- `pnpm run demo:openapi-contract`
- `pnpm run demo:audit-visibility`

## Consolidated reviewer dashboard package

Use this when a reviewer wants one first entry point instead of opening every individual package separately:

- `pnpm run demo:client-reviewer-dashboard-package`
- API route: `/client/reviewer-dashboard-package`

This package is the best first reviewer handoff because it combines or points to the reviewer dashboard, reviewer audit, commercial package, evidence binder, control matrix, production readiness package, proof endpoints, suggested demo order, production blockers, and buyer/reviewer trust signals.

It does not claim production readiness. It keeps the public repository honest by separating the mock-data environment from client-owned production controls.

## Core FinanceOps architecture

Use these to review the governed finance/accounting core:

- `pnpm run demo:accounting-task-registry`
- `pnpm run demo:accounting-workflow-router`
- `pnpm run demo:protected-action-routes`
- `pnpm run demo:payment-flow`
- `pnpm run demo:request-observability`

## Adapter and implementation foundation

Use these to review how the core can be shaped around client-specific inputs and outputs:

- `pnpm run demo:client-workflow-intake`
- `pnpm run demo:client-adapter-readiness`
- `pnpm run demo:client-adapter-registry`
- `pnpm run demo:client-plugin-contracts`
- `pnpm run demo:first-adapter-decision-tree`

## Evidence, safety, and production boundaries

Use these to review auditability, governance, risk, and production blockers:

- `pnpm run demo:client-evidence-binder`
- `pnpm run demo:client-control-matrix`
- `pnpm run demo:client-security-questionnaire-package`
- `pnpm run demo:client-compliance-review-package`
- `pnpm run demo:client-risk-acceptance-package`
- `pnpm run demo:client-production-readiness-package`

## Commercial and reviewer evidence

Use these to review product judgment, buyer-readiness, and implementation thinking:

- `pnpm run demo:client-reviewer-dashboard-package`
- `pnpm run demo:client-commercial-package`
- `pnpm run demo:client-enterprise-sales-brief`
- `pnpm run demo:client-pilot-proposal-package`
- `pnpm run demo:client-pilot-sow-package`
- `pnpm run demo:client-procurement-review-package`

## Recommended review sequence

1. Start with `pnpm run verify:local`.
2. Run `pnpm run demo:client-reviewer-dashboard-package`.
3. Run `pnpm run demo:ai-company-reviewer-path`.
4. Run `pnpm run demo:api-inventory`.
5. Run `pnpm run demo:accounting-workflow-router`.
6. Run `pnpm run demo:audit-visibility`.
7. Run `pnpm run demo:client-production-readiness-package`.

## Reviewer takeaway

This project should be reviewed as a working governed FinanceOps core and implementation foundation.

The strongest commands show deterministic finance logic, protected action boundaries, audit visibility, API inventory, client-shaped implementation planning, and production-blocked safety controls.
