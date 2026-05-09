import { describe, expect, test } from "vitest";
import {
  buildClientImplementationRoadmap,
  summarizeClientImplementationRoadmap,
  validateClientImplementationRoadmap
} from "../../src/client-config/client-implementation-roadmap.js";

describe("client implementation roadmap", () => {
  test("builds a phased roadmap for client-specific implementation", () => {
    const roadmap = buildClientImplementationRoadmap();

    expect(roadmap.roadmapVersion).toBe("client-implementation-roadmap-v1");
    expect(roadmap.phases.length).toBeGreaterThanOrEqual(5);
    expect(roadmap.criticalPath).toContain("Confirm work order");
    expect(roadmap.criticalPath).toContain("Define client-owned production boundary");
  });

  test("includes safe sample data and production boundary phases", () => {
    const roadmap = buildClientImplementationRoadmap();

    expect(roadmap.phases.some((phase) => phase.id === "phase-safe-sample-data")).toBe(true);
    expect(roadmap.phases.some((phase) => phase.id === "phase-production-boundary")).toBe(true);
  });

  test("keeps client-owned production boundary blocked", () => {
    const roadmap = buildClientImplementationRoadmap();

    const productionPhase = roadmap.phases.find(
      (phase) => phase.id === "phase-production-boundary"
    );

    expect(productionPhase).toBeDefined();
    expect(productionPhase?.status).toBe("blocked_until_client_owned");
    expect(productionPhase?.blockedBy.length).toBeGreaterThanOrEqual(1);
  });

  test("summarizes roadmap status for reviewers", () => {
    const summary = summarizeClientImplementationRoadmap();

    expect(summary.roadmapVersion).toBe("client-implementation-roadmap-v1");
    expect(summary.phaseCount).toBeGreaterThanOrEqual(5);
    expect(summary.blockedUntilClientOwnedPhases).toBeGreaterThanOrEqual(1);
    expect(summary.controlCount).toBeGreaterThanOrEqual(5);
  });

  test("validates the default roadmap", () => {
    const validation = validateClientImplementationRoadmap();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
