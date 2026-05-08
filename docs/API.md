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
