# Client Go-Live Package

The go-live layer turns production handoff into a launch decision.

It includes:

- go-live checklist,
- go-live risk report,
- go-live decision,
- launch brief,
- go-live package.

## Purpose

The layer explains whether the client implementation is ready for launch planning, blocked, or ready only with exclusions.

## Key rule

If payment data, required production-shaped data, approval policy, or open high-risk items are unresolved, go-live remains blocked or limited to explicitly approved scope.

## Related commercial package

After go-live evaluation, the commercial package explains what can be safely claimed in a sales conversation and what claims should be avoided.

## Reviewer Dashboard Context

The reviewer dashboard intentionally keeps the project marked as blocked for production until client-owned data, mapping confirmation, output acceptance, and approval policy are confirmed.

GET /client/reviewer-dashboard

## Sample Input Fixture Context

GET /client/sample-input-fixtures

The sample input fixtures clarify which data inputs can support demo flow and which fields still block production readiness.
