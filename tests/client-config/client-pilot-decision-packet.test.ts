import { describe, expect, test } from "vitest";
import {
  buildClientPilotDecisionPacket,
  summarizeClientPilotDecisionPacket,
  validateClientPilotDecisionPacket
} from "../../src/client-config/client-pilot-decision-packet.js";

describe("client pilot decision packet", () => {
  test("builds a pilot decision packet", () => {
    const packet = buildClientPilotDecisionPacket();

    expect(packet.packetVersion).toBe("client-pilot-decision-packet-v1");
    expect(packet.status).toBe("production_blocked");
    expect(packet.gates.length).toBeGreaterThanOrEqual(7);
  });

  test("covers required pilot decision gate categories", () => {
    const packet = buildClientPilotDecisionPacket();
    const categories = packet.gates.map((gate) => gate.category);

    expect(categories).toContain("scope");
    expect(categories).toContain("data");
    expect(categories).toContain("security");
    expect(categories).toContain("finance_control");
    expect(categories).toContain("evidence");
    expect(categories).toContain("deployment");
    expect(categories).toContain("commercial");
  });

  test("keeps auth and money movement blocked until client-owned controls exist", () => {
    const packet = buildClientPilotDecisionPacket();

    expect(packet.gates.find((gate) => gate.id === "pilot-gate-auth")?.status).toBe(
      "blocked_until_client_owned"
    );
    expect(packet.gates.find((gate) => gate.id === "pilot-gate-money-movement")?.status).toBe(
      "blocked_until_client_owned"
    );
  });

  test("summarizes pilot decision readiness", () => {
    const summary = summarizeClientPilotDecisionPacket();

    expect(summary.packetVersion).toBe("client-pilot-decision-packet-v1");
    expect(summary.gateCount).toBeGreaterThanOrEqual(7);
    expect(summary.clientAnswersNeededCount).toBeGreaterThanOrEqual(1);
    expect(summary.productionClaimsStillBlockedCount).toBeGreaterThanOrEqual(1);
  });

  test("validates the default pilot decision packet", () => {
    const validation = validateClientPilotDecisionPacket();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
