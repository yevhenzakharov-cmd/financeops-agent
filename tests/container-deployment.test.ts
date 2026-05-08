import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

describe("container deployment packaging", () => {
  test("uses a multi-stage Node Dockerfile with pnpm and production runtime", () => {
    const dockerfile = readFileSync("Dockerfile", "utf8");

    expect(dockerfile).toContain("FROM node:20-slim AS base");
    expect(dockerfile).toContain("FROM deps AS build");
    expect(dockerfile).toContain("FROM base AS prod-deps");
    expect(dockerfile).toContain("FROM node:20-slim AS runtime");
    expect(dockerfile).toContain("pnpm install --frozen-lockfile");
    expect(dockerfile).toContain("pnpm install --prod --frozen-lockfile");
    expect(dockerfile).toContain("pnpm run lint:strict");
    expect(dockerfile).toContain("pnpm run test");
    expect(dockerfile).toContain("pnpm run build");
    expect(dockerfile).toContain("USER node");
    expect(dockerfile).toContain('CMD ["node", "dist/api/server.js"]');
  });

  test("keeps local-only files out of Docker build context", () => {
    const dockerignore = readFileSync(".dockerignore", "utf8");

    expect(dockerignore).toContain("node_modules");
    expect(dockerignore).toContain("dist");
    expect(dockerignore).toContain("outputs");
    expect(dockerignore).toContain(".env");
  });

  test("documents the client-owned production boundary", () => {
    const docs = readFileSync("docs/CONTAINER_DEPLOYMENT.md", "utf8");

    expect(docs).toContain("client-owned secrets");
    expect(docs).toContain("not a claim that the public demo is production-ready");
  });
});
