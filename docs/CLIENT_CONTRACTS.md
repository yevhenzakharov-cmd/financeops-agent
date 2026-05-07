# Client Implementation Contracts

FinanceOps Agent is designed so each client can provide different inputs, accounting tasks, governance rules, and desired outputs without changing the core pipeline.

A client implementation contract defines:

- client profile
- expected input sources
- desired output artifacts
- finance tasks to run
- governance and approval rules

This keeps the core deterministic FinanceOps engine stable while allowing client-specific adapters and reporting formats.



## Implementation plan

The implementation plan translates a client contract into:

- input adapter plan
- output delivery plan
- task count
- validation summary

This is meant to show how a client can provide messy business-specific requirements while the shared FinanceOps core remains stable.



## Requirements intake

Before building a client-specific adapter, the client should provide:

- available input sources
- sample files or API schema
- desired output formats
- finance tasks they want automated
- approval rules and escalation requirements

The requirements intake is converted into a requirements plan before a final implementation contract is created.



## Data request packet

The data request packet gives the client a concrete list of requested input files, expected fields, desired outputs, onboarding checklist items, and open questions.

This is useful before implementation because different accounting departments often use different exports, field names, review processes, and approval policies.

## Client implementation readiness layer

The readiness layer turns discovery answers into a practical build decision:

- what fields the client already provides,
- what fields are missing,
- what fields need mapping,
- what data request packet should be sent back to the client,
- what governance rules control the implementation,
- whether the build is blocked, mapping-ready, or ready for client-specific adapter work.

This keeps the FinanceOps core generic while making every client implementation scoped around their actual inputs, outputs, approval rules, and deployment ownership.

## Client build package contract

The client build package is the implementation handoff created after the readiness review.

It should include:

- readiness status,
- adapter blueprint,
- output delivery plan,
- deployment checklist,
- next builder actions.

The package must not assume access to production credentials. The client owns credentials, source systems, compliance decisions, and final approval policy.

## Client acceptance package contract

The acceptance package is the final demo-to-build handoff.

It should include:

- acceptance criteria,
- test scenarios,
- demo script,
- build package,
- handoff decision.

The package must clearly identify blockers before production planning starts.
