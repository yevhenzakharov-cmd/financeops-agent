# Container Deployment Notes

FinanceOps Agent includes a Docker packaging layer for reviewer and client-owned deployment planning.

## What this proves

- The TypeScript API can be built into a runtime container.
- Lint, tests, and build run during the Docker build stage.
- The final runtime image only copies production dependencies and compiled dist output.
- The container exposes port 3001.
- The demo keeps production secrets out of the public repo.

## Run locally

Run:

docker build -t financeops-agent:local .

Then run:

docker run -p 3001:3001 -e DEMO_API_KEY=local-demo-key financeops-agent:local

Then check:

curl http://localhost:3001/health
curl http://localhost:3001/api/inventory

## Docker Compose

Run:

docker compose up --build

## Security boundary

This container is a deployment packaging proof, not a claim that the public demo is production-ready.

Production implementations should run in a client-owned environment with:

- client-owned secrets,
- client-owned credentials,
- client-owned logging and monitoring,
- accepted input mappings,
- accepted output format,
- human approval rules for money movement and accounting postings.
