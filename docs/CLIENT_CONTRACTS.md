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
