# Client Implementation Readiness Layer

This layer helps scope a custom client-owned FinanceOps Agent implementation before build work starts.

It does not assume one shared SaaS product.

Each client may have different:

- input systems,
- file formats,
- bank/payment APIs,
- desired outputs,
- approval rules,
- deployment ownership,
- compliance boundaries,
- documentation requirements.

## Purpose

The readiness layer answers:

1. What data has the client already provided?
2. What required data is missing?
3. What fields need mapping before implementation?
4. What governance rules control agent behavior?
5. Is the build blocked, mapping-ready, or ready for implementation?

## Outputs

The layer exposes:

- onboarding questionnaire,
- field coverage result,
- data request packet,
- governance brief,
- implementation readiness summary.

## Client-owned deployment model

The client owns:

- data,
- infrastructure,
- API keys,
- credentials,
- compliance,
- audit requirements,
- final validation of finance outputs.

The builder adapts the reusable FinanceOps core to the client's actual workflow.
