import { describe, expect, test } from "vitest";
import {
  buildClientRepoStarterPackage,
  summarizeClientRepoStarterPackage,
  validateClientRepoStarterPackage
} from "../../src/client-config/client-repo-starter.js";

describe("client repo starter package", () => {
  test("describes how to turn the core repo into a client-specific implementation", () => {
    const starterPackage = buildClientRepoStarterPackage();

    expect(starterPackage.packageVersion).toBe("client-repo-starter-v1");
    expect(starterPackage.cloneModel.sourceRepoRole).toBe("reusable_financeops_core");
    expect(starterPackage.cloneModel.targetRepoRole).toBe("client_specific_implementation");
    expect(starterPackage.firstBuildSequence).toContain(
      "Create a client-specific repository from the reusable core."
    );
  });

  test("marks mock data and work order as client-specific replacement points", () => {
    const starterPackage = buildClientRepoStarterPackage();

    const mockDataItem = starterPackage.starterItems.find(
      (item) => item.path === "src/domain/mock-data.ts"
    );

    const workOrderItem = starterPackage.starterItems.find(
      (item) => item.path === "src/client-config/client-work-order.ts"
    );

    expect(mockDataItem?.status).toBe("replace_per_client");
    expect(workOrderItem?.status).toBe("replace_per_client");
  });

  test("keeps payment implementation blocked until client-owned setup exists", () => {
    const starterPackage = buildClientRepoStarterPackage();

    const paymentItem = starterPackage.starterItems.find((item) => item.path === "src/payments");

    expect(paymentItem).toBeDefined();
    expect(paymentItem?.status).toBe("blocked_until_client_owned");
    expect(paymentItem?.action).toContain("client-owned credentials");
  });

  test("summarizes starter package counts for reviewers", () => {
    const summary = summarizeClientRepoStarterPackage();

    expect(summary.packageVersion).toBe("client-repo-starter-v1");
    expect(summary.starterItemCount).toBeGreaterThanOrEqual(8);
    expect(summary.replacePerClientCount).toBeGreaterThanOrEqual(2);
    expect(summary.blockedUntilClientOwnedCount).toBeGreaterThanOrEqual(1);
  });

  test("validates the default starter package", () => {
    const validation = validateClientRepoStarterPackage();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
