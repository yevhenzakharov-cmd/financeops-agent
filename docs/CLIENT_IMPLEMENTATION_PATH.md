# Client Implementation Path

Related adapter plan: [Client First Adapter Build Plan](CLIENT_FIRST_ADAPTER_BUILD_PLAN.md).

Related discovery form: [Client Discovery Form](CLIENT_DISCOVERY_FORM.md).

Related intake guide: [Client Input and Output Request](CLIENT_INPUT_OUTPUT_REQUEST.md).

This document connects the public FinanceOps Agent demo into a realistic client implementation path.

The repo is not trying to prebuild every possible input source or output destination. It proves the governed FinanceOps core first, then shows how client-specific adapters, mappings, policies, and delivery paths can be added after discovery.

## Implementation flow

The intended client path is:

client requirements intake -> workflow intake plan -> accounting task registry -> workflow router -> accounting control framework -> approval queue -> audit evidence -> production readiness gates

## 1. Requirements intake

The client requirements intake captures the client's business context before build work starts.

It answers:

- what finance problem the client wants solved
- which inputs exist today
- which outputs the client wants
- which tasks are high priority
- who approves sensitive work
- which requirements are missing or blocked

The purpose is not to execute work. The purpose is to convert a vague business request into a reviewable implementation plan.

## 2. Workflow intake plan

The workflow intake layer translates client-described finance work into controlled workflow planning.

It identifies:

- workflow objective
- source input expectations
- desired output destination
- approval requirement
- professional review requirement
- missing client details
- safe implementation next steps

This matters because clients may ask for different workflows, such as invoice OCR intake, payroll preparation, reconciliation review, payment approval packets, budget monitoring, or CFO reporting.

The workflow intake plan keeps those requests scoped and governed before production adapters are built.

## 3. Accounting task registry

The accounting task registry defines reusable accounting task templates before client-specific inputs and outputs are known.

It records:

- task category
- typical inputs
- expected outputs
- default risk level
- default autonomy level
- reviewer role
- client configuration needed
- production boundary

This gives the repo a reusable accounting operating model instead of a one-off script.

## 4. Workflow router

The workflow router evaluates whether a client-described accounting workflow should be:

- allowed
- simulation-only
- approval-gated
- professionally reviewed
- blocked

This protects the system from treating every finance request as equally safe.

Low-risk analysis can remain demo-safe. Sensitive work such as money movement, accounting write-back, tax decisions, legal decisions, or payroll execution must stay blocked or approval-gated until client-owned controls exist.

## 5. Accounting control framework

The accounting control framework applies deterministic policy decisions before any sensitive workflow can move forward.

It checks:

- task risk
- autonomy level
- approval requirement
- professional review requirement
- production boundary
- blocked action categories

AI does not decide these controls. The deterministic core does.

## 6. Approval queue

The approval queue shows which recommendations require human review.

For production-style finance work, the final reviewer is usually an accountant, controller, CFO, tax professional, legal reviewer, or system owner.

The queue demonstrates that the agent can prepare work, but sensitive outcomes remain human-owned.

## 7. Audit evidence

Audit evidence makes the workflow reviewable.

The repo exposes:

- audit log
- execution ledger
- approval queue
- artifact registry
- API inventory
- OpenAPI contract
- reviewer-facing documentation

This lets a reviewer trace what happened without trusting an AI explanation as the source of truth.

## 8. Production readiness gates

Production remains blocked until the client owns the missing controls.

A real implementation requires:

- approved source systems
- safe sample data
- field mappings
- output requirements
- authentication
- authorization
- secret management
- approval thresholds
- finance control ownership
- audit retention
- deployment environment
- incident response
- compliance signoff

The public repo should therefore be judged as a strong demo and implementation foundation, not as a finished SaaS product.

## Reviewer takeaway

FinanceOps Agent is strongest when reviewed as a reusable governed core.

The correct path is not:

build every possible integration first

The correct path is:

prove the deterministic FinanceOps core -> collect client inputs and outputs -> build the right adapters -> configure controls -> run a governed pilot -> only then consider production readiness.
