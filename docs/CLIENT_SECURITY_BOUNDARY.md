# Client Security Boundary

The Client Security Boundary package explains what is safe in the public FinanceOps Agent demo and what must remain client-owned before production.

Endpoint: GET /client/security-boundary

## What it covers

- mock data boundary,
- client-owned credentials,
- approval-gated payment workflow,
- deterministic finance calculations,
- AI explanation boundary,
- audit traceability,
- client-owned production deployment.

## Why it matters

This layer makes the project more credible for technical reviewers and buyers because it does not pretend the public demo is production-ready.

## Production boundary

Production work remains blocked until the client provides approved data samples, confirms field mappings, owns credentials, defines approval policy, and accepts output formats.

## Validation Matrix Link

GET /client/validation-matrix

Use the validation matrix after the security boundary to show which trust and production-readiness checks pass, warn, or block the implementation.
