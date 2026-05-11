# API Route Refactor Plan

This plan documents how to reduce `src/api/server.ts` route sprawl without changing behavior.

## Why this plan exists

The current API is working, tested, and CI-proven, but `src/api/server.ts` has become too large.

Latest audit snapshot showed:

- 190 `app.get` registrations
- 4 `app.post` registrations
- 4 `app.use` registrations

Largest route groups:

- `/client`: 112 routes
- `/artifacts`: 46 routes
- `/client-contract`: 10 routes
- `/client-requirements`: 7 routes
- `/accounting`: 5 routes
- `/audit`: 3 routes
- `/security`: 2 routes

This is not a correctness issue. It is a maintainability and reviewer-confidence issue.

A reviewer dashboard UI should not be built on top of a route file that is difficult to inspect. The API should be easier to understand first.

## Current risk

`src/api/server.ts` is currently doing too much:

- app creation
- middleware registration
- public core routes
- protected action routes
- accounting routes
- audit routes
- artifact routes
- security routes
- client package routes
- validation routes
- route inventory support
- OpenAPI support
- server startup

The strongest product and architecture signals are already present, but the route file shape makes the backend look less modular than the actual domain logic.

## Refactor goal

Split route registration by area while keeping behavior unchanged.

The goal is not to rewrite the API.

The goal is to move route groups into small route registration modules that are easier to inspect, test, and explain.

## Proposed route module structure

Suggested future structure:

    src/api/routes/
      accounting-routes.ts
      artifact-routes.ts
      audit-routes.ts
      client-contract-routes.ts
      client-requirements-routes.ts
      client-routes.ts
      core-routes.ts
      security-routes.ts
      protected-action-routes.ts

Each module should export a route registration function. For example:

    export function registerAuditRoutes(app: Express): void {
      app.get("/audit/health", ...)
      app.get("/audit/summary", ...)
      app.get("/audit/visibility", ...)
    }

Then `src/api/server.ts` can become the composition root:

    registerCoreRoutes(app)
    registerSecurityRoutes(app)
    registerAuditRoutes(app)
    registerArtifactRoutes(app)
    registerAccountingRoutes(app)
    registerClientRoutes(app)
    registerProtectedActionRoutes(app)

## Non-goals

Do not change API behavior during the first route split.

Do not rename endpoints.

Do not change response shapes.

Do not change authentication behavior.

Do not change artifact paths.

Do not change demo scripts.

Do not start UI work during this refactor.

## Safest first route group

Start with `/audit`.

Reason:

- only 3 routes
- read-only
- contained conceptually
- already supported by audit read service tests
- lower risk than `/client`, `/artifacts`, or protected action routes

Suggested first module:

    src/api/routes/audit-routes.ts

Move only:

- `GET /audit/health`
- `GET /audit/summary`
- `GET /audit/visibility`

Then run:

    pnpm run lint:strict
    pnpm run typecheck
    pnpm run test
    pnpm run verify:demo

If clean, run full verification:

    pnpm run verify:local

## Second candidate

Move `/security`.

Reason:

- only 2 routes
- read-only
- clear security/status boundary
- useful reviewer signal

Suggested module:

    src/api/routes/security-routes.ts

Move only:

- `GET /security/http-hardening`
- `GET /security/demo-auth-status`

## Avoid moving first

Avoid moving these first:

- `/client`
- `/artifacts`
- `POST /run-financeops-agent`
- `POST /payments/:paymentRecommendationId/approve-and-send`
- `POST /accounting/workflows/route`
- `POST /client-requirements/workflow-intake-plan`

Reason:

These have more surface area, more reviewer importance, more generated packages, or more sensitive behavior.

## Required safety checks after every route move

After each route group move:

    pnpm run lint:strict
    pnpm run typecheck
    pnpm run test
    pnpm run verify:demo

Before push:

    pnpm run verify:local

After push:

    pnpm run ci:watch

## Reviewer benefit

After this refactor, reviewers should be able to understand the API shape faster:

- `server.ts` becomes the composition root
- route groups become easier to inspect
- protected routes are easier to identify
- client package routes can be split gradually
- UI work can start from a cleaner backend foundation

## Recommended sequence before UI

1. Commit this route refactor plan.
2. Move `/audit` routes into a route module.
3. Move `/security` routes into a route module.
4. Re-run full verification and CI.
5. Reassess whether to harden tests or continue route modularization.
6. Only then consider a reviewer dashboard UI.

## Current decision

Do not build UI yet.

Do the backend audit cleanup first.
