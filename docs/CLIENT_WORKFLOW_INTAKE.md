# Client Workflow Intake

The Client Workflow Intake layer turns a client's discovery answers into routed accounting workflow plans.

It sits between:

- client requirements intake
- accounting task registry
- accounting workflow router
- approval and review controls

## Why it exists

Every real client will have different:

- input files
- accounting systems
- databases
- field names
- approval rules
- output destinations
- reviewer roles
- security boundaries

The public demo should not pretend to have every possible connector ready.

Instead, the core needs to prove that it can accept a client-described workflow, classify it safely, and identify what must be confirmed before implementation.

## What it produces

The workflow intake plan produces:

- workflow intents
- routed workflows
- validation status
- blockers
- required client questions
- recommended implementation steps

## Demo endpoints

The client workflow intake planner is exposed through demo-safe planning endpoints:

- GET /client-requirements/mock-client/workflow-intake-plan
- POST /client-requirements/workflow-intake-plan

These endpoints return validation, blockers, routed workflows, required client questions, and recommended implementation steps.

They do not execute accounting work.

## Demo command

Run the workflow intake demo with:

- pnpm run demo:client-workflow-intake

## Safety boundary

The intake plan does not execute accounting work.

It does not:

- move money
- post journal entries
- write to external systems
- calculate final tax or legal conclusions
- treat AI output as approval

It prepares a controlled implementation path that can be reviewed by the accountant, controller, CFO, tax professional, legal reviewer, or client system owner.

## Reviewer takeaway

This layer makes the project easier to sell and adapt.

The client can say:

- here are our inputs
- here is the accounting task
- here is the desired output
- here is where the output should go
- here is who approves it

The system can then classify the request and show whether it is ready, approval-gated, simulation-only, professionally reviewed, or blocked until missing client details are provided.
