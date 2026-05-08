import { describe, expect, test } from "vitest";

import { buildClientAcceptancePackage } from "../../src/client-config/client-acceptance-package.js";
import { buildClientAdapterBlueprint } from "../../src/client-config/client-adapter-blueprint.js";
import { buildClientDeploymentChecklist } from "../../src/client-config/client-deployment-checklist.js";
import { buildClientGoLiveDecision } from "../../src/client-config/client-go-live-decision.js";
import { buildClientGoLivePackage } from "../../src/client-config/client-go-live-package.js";
import { buildClientOutputDeliveryPlan } from "../../src/client-config/client-output-delivery-plan.js";
import { buildClientPilotPlan } from "../../src/client-config/client-pilot-plan.js";
import { buildClientProductionHandoffPackage } from "../../src/client-config/client-production-handoff-package.js";

describe("client delivery packages", () => {
  test("builds adapter blueprint with ready, mapping, and blocked adapters", () => {
    const result = buildClientAdapterBlueprint();

    expect(result.clientName).toBe("Mock Game Studio Finance Team");
    expect(result.inputAdapters.length).toBeGreaterThanOrEqual(3);
    expect(result.inputAdapters.some((adapter) => adapter.status === "ready")).toBe(true);
    expect(result.inputAdapters.some((adapter) => adapter.status === "mapping_required")).toBe(true);
    expect(result.inputAdapters.some((adapter) => adapter.status === "blocked")).toBe(true);
  });

  test("builds output delivery plan with available and blocked outputs", () => {
    const result = buildClientOutputDeliveryPlan();

    expect(result.title).toBe("Client Output Delivery Plan");
    expect(result.targets.length).toBeGreaterThanOrEqual(3);
    expect(result.targets.some((target) => target.status === "available")).toBe(true);
    expect(result.targets.some((target) => target.status === "blocked")).toBe(true);
    expect(result.acceptanceCriteria.length).toBeGreaterThan(0);
  });

  test("builds deployment checklist with client-owned credential boundary", () => {
    const result = buildClientDeploymentChecklist();

    expect(result.title).toBe("Client Deployment Checklist");
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.blockedItems.length).toBeGreaterThan(0);
    expect(result.items.some((item) => item.title.includes("credentials"))).toBe(true);
  });

  test("builds acceptance package with criteria and scenarios", () => {
    const result = buildClientAcceptancePackage();

    expect(result.title).toBe("Client Acceptance Package");
    expect(result.status).toBe("blocked");
    expect(result.acceptanceCriteria).toBeDefined();
    expect(result.testScenarios).toBeDefined();
    expect(result.buildPackage).toBeDefined();
  });

  test("builds pilot plan with included and excluded workflows", () => {
    const result = buildClientPilotPlan();

    expect(result.title).toBe("Client Pilot Plan");
    expect(result.status).toBe("blocked");
    expect(result.scope.includedWorkflows.length).toBeGreaterThan(0);
    expect(result.scope.excludedWorkflows.length).toBeGreaterThan(0);
    expect(result.riskRegister.openRisks.length).toBeGreaterThan(0);
    expect(result.successMetrics.metrics.length).toBeGreaterThan(0);
  });

  test("builds production handoff package with production blockers", () => {
    const result = buildClientProductionHandoffPackage();

    expect(result.title).toBe("Client Production Handoff Package");
    expect(result.status).toBe("blocked");
    expect(result.handoffPlan).toBeDefined();
    expect(result.handoffPlan.prerequisites.blockedPrerequisites.length).toBeGreaterThan(0);
    expect(result.handoffPlan.riskReport.openRiskCount).toBeGreaterThan(0);
  });

  test("builds go-live decision with go/no-go evidence", () => {
    const result = buildClientGoLiveDecision();

    expect(result.title).toBe("Client Go-Live Decision");
    expect(result.status).toBe("blocked");
    expect(result.checklist.blockedItems.length).toBeGreaterThan(0);
    expect(result.riskReport.risks.length).toBeGreaterThan(0);
    expect(result.summary).toContain("Launch decision");
  });

  test("builds go-live package with launch brief and decision", () => {
    const result = buildClientGoLivePackage();

    expect(result.title).toBe("Client Go-Live Package");
    expect(result.status).toBe("blocked");
    expect(result.decision).toBeDefined();
    expect(result.launchBrief).toBeDefined();
    expect(result.decision.status).toBe("blocked");
  });
});
