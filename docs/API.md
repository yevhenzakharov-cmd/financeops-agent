# FinanceOps Agent API

## Overview

The FinanceOps Agent exposes the governed FinanceOps pipeline as a REST API.

The API runs deterministic financial analysis, classifies exceptions, simulates financial interventions, selects actions, applies governance rules, builds an approval queue, persists an execution ledger, generates an AI CFO briefing, and returns a structured response.

## Base URL

http://localhost:3001

## Start API

pnpm api

## Endpoints

### GET /health

Returns basic service health and current execution mode.

curl http://localhost:3001/health

### GET /system-summary

Returns service description, capabilities, and current execution mode.

curl http://localhost:3001/system-summary

### POST /run-financeops-agent

Runs the full governed FinanceOps pipeline.

curl -X POST http://localhost:3001/run-financeops-agent

The response includes:

- mode
- project
- margin
- burn
- overdue receivables
- reconciliation results
- finance exceptions
- selected actions
- governance decisions
- execution ledger
- approval queue
- AI CFO briefing
- audit trace ID

## Runtime Artifacts

The system can write runtime artifacts locally:

- outputs/audit/latest-audit-log.json
- outputs/ledger/latest-execution-ledger.json
- outputs/approvals/latest-approval-queue.json
- outputs/api/latest-api-response.json

These are generated files and are intentionally ignored by Git.

## Adapter Strategy

The API currently runs on simulated company data.

For real company usage, an input adapter can normalize company data into the internal schema, and an output adapter can format the result into the target business output.

The public API demo intentionally shows one simulated input and one demo output path. Additional adapters should be added only after a client confirms their source systems, sample payloads, field mappings, approval policy, and desired output destination.

The core agent pipeline does not need to be rewritten for each company or data source. Only the adapter layer changes.


## Approve and Send Mock Payment

POST /payments/:paymentRecommendationId/approve-and-send

Approves a payment recommendation and executes it through the mock payment adapter.

Flow:
agent recommends payment -> human approves -> mock payment adapter simulates execution -> payment execution record is persisted.

Request body example:
{
  "approvedBy": "demo-cfo",
  "idempotencyKey": "demo-payment-key-001"
}

Example request:
curl -s -X POST http://localhost:3001/payments/payrec-001/approve-and-send -H "Content-Type: application/json" -d '{"approvedBy":"demo-cfo","idempotencyKey":"demo-payment-key-001"}' | python3 -m json.tool

Persisted output:
outputs/payments/latest-payment-execution.json

Persisted record includes: recommendation, approval, result, recordedAt.

## Client Reviewer Dashboard

GET /client/reviewer-dashboard

Returns a compact reviewer-facing dashboard containing the project summary, proof cards, trust signals, production blockers, proof endpoints, suggested demo order, and next best actions.

## Client Sample Input Fixtures

GET /client/sample-input-fixtures

Returns typed sample input fixtures for invoice exports, bank transaction exports, project margin data, and vendor payment profiles. The response shows which inputs are ready, which need mapping, and which remain blocked.

## Client Security Boundary

GET /client/security-boundary

Returns the security and production boundary package for mock data usage, client-owned credentials, approval-gated payments, deterministic finance logic, AI explanation boundaries, and audit traceability.

## Client Validation Matrix

GET /client/validation-matrix

Returns reviewer-facing acceptance checks that validate data readiness, mapping status, payment blocking, AI boundaries, security boundaries, audit traceability, and output acceptance.

## Client Workflow Intake

GET /client-requirements/mock-client/workflow-intake-plan

Returns a demo-safe workflow intake plan from the mock client requirements intake. This shows how client-described finance work is translated into a governed implementation plan before production adapters exist.

POST /client-requirements/workflow-intake-plan

Accepts a client requirements intake payload and returns a workflow intake plan. The endpoint is demo-safe: it plans and classifies the workflow, but does not move money, post accounting entries, write to external systems, or treat AI output as approval.

Recommended demo command:

pnpm run demo:client-workflow-intake

## Client Adapter and Build Readiness

GET /client/implementation-readiness

Returns the current demo client's implementation readiness status, missing required fields, mapping questions, data request packet, and governance brief.

GET /client/adapter-blueprint

Returns a client input adapter blueprint showing which source adapters are ready, which require mapping, and which remain blocked until client-owned data exists.

GET /client/output-delivery-plan

Returns the output delivery plan for CFO briefing, exception queue, and payment approval request outputs.

GET /client/build-package

Returns a builder-facing package combining implementation readiness, adapter blueprint, output delivery plan, deployment checklist, and next actions.

GET /client/adapter-registry

Returns the broader adapter registry covering input, output, approval, and audit adapters. This endpoint is useful for explaining why the repo includes one simulated input/output path while real adapters are scoped per client.

Recommended reviewer sequence:

pnpm run demo:client-adapter-readiness
