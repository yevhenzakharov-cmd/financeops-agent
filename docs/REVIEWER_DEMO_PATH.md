# Reviewer Demo Path

This guide gives a reviewer the shortest path through the FinanceOps Agent repository.

The project should be reviewed as a production-aware public demo and implementation foundation, not as a finished enterprise deployment.

## Fast review sequence

1. Read the README reviewer quick path.
2. Read the Reviewer Architecture Summary.
3. Read the Implementation Model.
4. Review the Accounting Task Registry.
5. Review the Accounting Workflow Routing guide.
6. Run local verification.
7. Run the API inventory demo.
8. Run the accounting task registry demo.
9. Run the accounting workflow router demo.

## Recommended commands

- pnpm run verify:local
- pnpm run demo:api-inventory
- pnpm run demo:accounting-task-registry
- pnpm run demo:accounting-workflow-router

## What to notice

The project is not trying to make AI perform accounting decisions.

The intended pattern is:

client input -> deterministic code -> control framework -> workflow routing -> approval gate -> audit evidence -> reviewer output

The AI layer can explain already-computed outputs, but deterministic code and control rules decide what is allowed, blocked, simulated, or approval-gated.

## What is intentionally not production-ready

The public demo intentionally does not include:

- production client data
- production credentials
- production RBAC
- production ERP adapters
- production bank adapters
- production payment execution
- autonomous accounting postings
- final tax or legal decisioning

Those pieces must be added only after a client confirms inputs, field mappings, approval rules, output destinations, deployment environment, and security boundaries.

## Reviewer takeaway

The strongest review path is to verify that the repo already contains the reusable core: deterministic finance logic, accounting task classification, workflow routing, governance boundaries, audit artifacts, API visibility, and demo-safe documentation.
