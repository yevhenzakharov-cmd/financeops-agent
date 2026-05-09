import { describe, expect, test } from "vitest";
import {
  buildClientDeploymentProfile,
  summarizeClientDeploymentProfile,
  validateClientDeploymentProfile
} from "../../src/client-config/client-deployment-profile.js";

describe("client deployment profile", () => {
  test("builds a deployment profile separating demo, pilot, and production", () => {
    const profile = buildClientDeploymentProfile();

    expect(profile.profileVersion).toBe("client-deployment-profile-v1");
    expect(profile.deploymentModel.publicDemo).toContain("Mock data");
    expect(profile.deploymentModel.production).toContain("Client-owned runtime");
  });

  test("includes required enterprise deployment control categories", () => {
    const profile = buildClientDeploymentProfile();

    expect(profile.controls.some((control) => control.category === "environment")).toBe(true);
    expect(profile.controls.some((control) => control.category === "secrets")).toBe(true);
    expect(profile.controls.some((control) => control.category === "auth")).toBe(true);
    expect(profile.controls.some((control) => control.category === "data")).toBe(true);
    expect(profile.controls.some((control) => control.category === "monitoring")).toBe(true);
    expect(profile.controls.some((control) => control.category === "approval")).toBe(true);
    expect(profile.controls.some((control) => control.category === "audit")).toBe(true);
  });

  test("keeps secrets and approval policy blocked until client-owned configuration exists", () => {
    const profile = buildClientDeploymentProfile();

    const secretsControl = profile.controls.find((control) => control.category === "secrets");
    const approvalControl = profile.controls.find((control) => control.category === "approval");

    expect(secretsControl?.status).toBe("blocked_until_configured");
    expect(approvalControl?.status).toBe("blocked_until_configured");
  });

  test("summarizes deployment profile control counts", () => {
    const summary = summarizeClientDeploymentProfile();

    expect(summary.profileVersion).toBe("client-deployment-profile-v1");
    expect(summary.controlCount).toBeGreaterThanOrEqual(7);
    expect(summary.blockedUntilConfiguredControls).toBeGreaterThanOrEqual(2);
  });

  test("validates the default deployment profile", () => {
    const validation = validateClientDeploymentProfile();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
