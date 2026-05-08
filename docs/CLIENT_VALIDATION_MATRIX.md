# Client Validation Matrix

The Client Validation Matrix turns the FinanceOps Agent demo evidence into explicit reviewer and buyer acceptance checks.

Endpoint: GET /client/validation-matrix

## What it validates

- invoice data readiness,
- bank mapping status,
- payment workflow blocking,
- AI explanation boundary,
- production credential boundary,
- audit traceability,
- client output acceptance.

## Why it exists

This layer makes the project easier to evaluate because it separates what passes today from what is only warning-level and what blocks production.

## Production boundary

The matrix should not be treated as production approval. It is a structured demo and pilot validation artifact. Production remains blocked until the client provides required data, confirms mapping, accepts outputs, and owns credentials.
