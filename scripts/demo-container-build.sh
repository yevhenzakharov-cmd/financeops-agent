#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="${IMAGE_NAME:-financeops-agent:local}"
CONTAINER_NAME="${CONTAINER_NAME:-financeops-agent-demo}"
HOST_PORT="${HOST_PORT:-3001}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker CLI was not found. Install Docker Desktop to run the container demo."
  exit 1
fi

echo "---- build container image ----"
docker build -t "$IMAGE_NAME" .

echo "---- run container ----"
docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
docker run \
  -d \
  --name "$CONTAINER_NAME" \
  -p "$HOST_PORT:3001" \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -e DEMO_API_KEY="${DEMO_API_KEY:-local-demo-key}" \
  "$IMAGE_NAME" >/dev/null

cleanup() {
  docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
}
trap cleanup EXIT

sleep 2

echo "---- container health ----"
curl -s "http://localhost:$HOST_PORT/health" | python3 -m json.tool

echo "---- container api inventory ----"
curl -s "http://localhost:$HOST_PORT/api/inventory" | python3 -m json.tool | sed -n '1,120p'
