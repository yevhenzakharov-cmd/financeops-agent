# Client Build Package

The client build package is the builder-facing handoff for turning a discovery/readiness review into an implementation plan.

It combines:

- client implementation readiness,
- input adapter blueprint,
- output delivery plan,
- deployment checklist,
- builder next actions.

## Why this exists

The FinanceOps core should stay reusable.

The client build package defines what must change per client:

- source files,
- field mappings,
- APIs,
- output destinations,
- approval rules,
- deployment requirements.

## Build status

A client build package can be:

- blocked,
- ready for mapping,
- ready for build.

Blocked means required data or approval rules are missing.

Ready for mapping means data exists, but fields still need to be mapped.

Ready for build means the builder can start creating client-specific adapters and output delivery.

## Acceptance handoff

After a build package is generated, the acceptance package can be used to decide whether the implementation is ready to move forward, blocked by missing client data, or accepted with documented warnings.

## Related pilot plan

The pilot plan converts the build package and acceptance package into a limited pilot scope with measurable success criteria.
