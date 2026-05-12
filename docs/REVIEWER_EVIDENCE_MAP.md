# Reviewer Evidence Map

This document gives technical reviewers, CFO-style buyers, founders, operators, and potential clients a fast way to verify what the FinanceOps Agent proves.

The goal is not to make reviewers read every route or source file. The goal is to connect the strongest claims to concrete proof in the repository, demo scripts, tests, and API endpoints.

## Reviewer questions and proof

| Reviewer question | Proof in repo | Command or endpoint | Why it matters |
|---|---|---|---|
| Is this more than a chatbot? | Deterministic finance tools, typed pipeline, approval workflow, artifact persistence | `src/tools`, `src/pipeline`, `src/approval`, `src/output-adapters` | Shows the system is built around structured finance logic rather than free-form AI text. |
| Are financial numbers hallucinated by AI? | CFO briefing is generated from deterministic pipeline results | `src/agent/cfo-briefing.ts`, `tests/agent-cfo-briefing.test.ts`, `pnpm run demo:ai-company-reviewer-path` | Shows AI-style language explains verified outputs instead of creating the source of truth. |
| Are sensitive actions gated? | Demo auth, approval workflow, safe output policy, payment simulation boundary | `src/api/demo-auth.ts`, `src/approval/approval-workflow.ts`, `src/security/safe-output-policy.ts`, `pnpm run demo:protected-action-routes` | Shows payments and accounting-style actions are blocked, simulated, or approval-gated. |
| Can outputs be audited? | Audit log, execution ledger, approval queue, payment execution artifact, client output artifact | `/audit/visibility`, `/artifacts/status`, `/artifacts/manifest`, `pnpm run demo:audit-visibility` | Shows recommendations are traceable to persisted evidence. |
| Can a reviewer inspect the API surface quickly? | API inventory and OpenAPI contract | `/api/inventory`, `/api/routes`, `pnpm run demo:api-inventory`, `pnpm run demo:openapi-contract` | Shows route coverage, public demo routes, protected action routes, and standardized error behavior. |
| Can this be adapted for a real client? | Client work order, implementation manifest, adapter registry, workflow intake, delivery packages | `/client/work-order`, `/client/implementation-manifest`, `/client/adapter-registry`, `/client/workflow-intake` | Shows the repo is a reusable implementation core that can be cloned and configured per client. |
| Does it avoid overclaiming production readiness? | Acceptance gate, deployment profile, production readiness package, red-team package | `/client/acceptance-gate`, `/client/deployment-profile`, `/client/production-readiness-package`, `/client/enterprise-red-team` | Shows production blockers are named instead of hidden. |
| Is the buyer story credible? | Commercial package, buyer brief, objection handling, sales handoff package | `/client/commercial-package`, `/client/buyer-brief`, `/client/objection-handling`, `/client/sales-handoff-package` | Shows the project can be explained to CFOs, founders, finance leads, and clients without unsafe claims. |
| Is the repo test-backed? | Local verification, test suite, coverage, CI | `pnpm run verify:local`, GitHub Actions CI | Shows linting, typecheck, tests, coverage, build, and demo verification all pass. |
| Is the demo easy to run? | Reviewer command index and demo scripts | `pnpm run demo:reviewer-command-index`, `pnpm run demo:reviewer-demo-script`, `pnpm run demo:reviewer-path` | Gives reviewers a guided path instead of requiring them to guess which scripts matter. |

## Fast reviewer path

For a quick review, run:

```bash
pnpm run verify:local
pnpm run demo:reviewer-path
pnpm run demo:reviewer-command-index
pnpm run demo:api-inventory
pnpm run demo:openapi-contract
pnpm run demo:audit-visibility
pnpm run demo:client-commercial-package
pnpm run demo:client-production-readiness-package
```

## What this proves

This map proves that the repository has a reviewer-friendly evidence trail:

- deterministic finance logic,
- approval-gated sensitive actions,
- audit and artifact visibility,
- API inventory and OpenAPI visibility,
- client-specific implementation planning,
- production-readiness boundaries,
- buyer-facing commercial packaging,
- repeatable local and CI verification.

## Claims to make safely

- FinanceOps Agent is a reusable FinanceOps implementation core.
- The public repo is demo-safe and uses mock data.
- Finance calculations are deterministic.
- AI-style output explains already-computed results.
- Sensitive actions are blocked, simulated, or approval-gated.
- Client-specific implementations can be created by cloning/configuring the core.
- Production use requires client-owned data, credentials, auth, monitoring, approvals, and deployment controls.

## Claims to avoid

- Do not claim the public repo is already production-ready.
- Do not claim autonomous money movement.
- Do not claim AI is the source of financial calculations.
- Do not claim verified ROI without client workflow timing and real accepted data.
- Do not commit private client data, production credentials, or client-owned secrets.

## Suggested reviewer order

1. Start with the README reviewer entry point.
2. Open the reviewer dashboard and reviewer audit endpoints.
3. Run the reviewer command index.
4. Inspect API inventory and OpenAPI contract.
5. Inspect audit visibility and artifact manifest.
6. Review client commercial and production-readiness packages.
7. Confirm local verification and CI pass.
