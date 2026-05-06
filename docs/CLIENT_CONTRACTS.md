# Client Implementation Contracts

FinanceOps Agent is designed so each client can provide different inputs, accounting tasks, governance rules, and desired outputs without changing the core pipeline.

A client implementation contract defines:

- client profile
- expected input sources
- desired output artifacts
- finance tasks to run
- governance and approval rules

This keeps the core deterministic FinanceOps engine stable while allowing client-specific adapters and reporting formats.
