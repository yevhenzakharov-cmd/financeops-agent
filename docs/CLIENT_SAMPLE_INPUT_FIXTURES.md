# Client Sample Input Fixtures

The Client Sample Input Fixtures layer documents the sample client inputs used to explain FinanceOps Agent data readiness.

Endpoint: GET /client/sample-input-fixtures

## What it covers

- invoice export sample,
- bank transaction export sample,
- project margin sample,
- vendor payment profile sample.

## Why it exists

The endpoint makes client data requirements visible before adapter work starts. It separates ready demo fixtures from mapping-required fixtures and blocked payment fixtures.

## Production boundary

These fixtures are mock-shaped examples. Production implementation still requires client-approved samples, field mapping confirmation, approval policy, and client-owned credentials.

## Security Boundary Link

GET /client/security-boundary

The fixture layer should be reviewed together with the security boundary so the client understands that public fixtures are mock-shaped examples, not production data.
