# Client Reviewer Dashboard

The Client Reviewer Dashboard is a compact proof endpoint for explaining FinanceOps Agent quickly to a technical reviewer, CFO, founder, operator, or potential client.

Endpoint: GET /client/reviewer-dashboard

## Purpose

The endpoint summarizes:

- deterministic FinanceOps core proof,
- artifact and audit proof,
- approval-gated action safety,
- commercial readiness status,
- production blockers,
- proof endpoints,
- suggested demo order,
- next best actions.

## Positioning

This endpoint is intentionally a reviewer and sales artifact. It does not claim the public demo is production-ready.

The dashboard should be shown before deeper endpoint walkthroughs because it gives reviewers a fast map of what the system proves and what remains blocked.


## Consolidated Reviewer Dashboard Package

Endpoint: GET /client/reviewer-dashboard-package

Recommended command:

pnpm run demo:client-reviewer-dashboard-package

Use this as the first reviewer handoff. It combines the dashboard, reviewer audit, commercial package, evidence binder, control matrix, production readiness package, reviewer decision, strongest proof points, production boundaries, and reviewer scorecard.

The scorecard is intentionally opinionated:

- architecture signal: strong,
- finance control signal: strong,
- auditability signal: strong,
- commercial signal: strong,
- production readiness signal: blocked.

This makes the project easier for an AI-company reviewer, senior engineer, CFO-style buyer, founder, or potential client to evaluate quickly without confusing demo readiness with production readiness.

## Related Fixture Endpoint

GET /client/sample-input-fixtures

Use this endpoint after the reviewer dashboard to show exactly what sample client data is ready, what needs mapping, and what remains blocked before production.

## Related Security Boundary Endpoint

GET /client/security-boundary

Use this endpoint after the reviewer dashboard to explain the mock data boundary, credential boundary, approval-gated payment workflow, and production deployment boundary.

## Related Validation Matrix Endpoint

GET /client/validation-matrix

Use this endpoint after the reviewer dashboard to show explicit pass, warning, and blocked acceptance checks.
