import { describe, expect, test } from "vitest";
import {
  buildClientWorkOrder,
  mockClientWorkOrderRequest,
  summarizeClientWorkOrder,
  validateClientWorkOrder
} from "../../src/client-config/client-work-order.js";

describe("client work order", () => {
  test("turns a client request into a reusable implementation work order", () => {
    const workOrder = buildClientWorkOrder();

    expect(workOrder.workOrderVersion).toBe("client-work-order-v1");
    expect(workOrder.request.clientName).toBe(mockClientWorkOrderRequest.clientName);
    expect(workOrder.implementationSummary.cloneStrategy).toBe("clone_core_repo_per_client");
    expect(workOrder.buildItems.length).toBeGreaterThanOrEqual(4);
  });

  test("blocks payment preparation when payment profiles are not configured", () => {
    const workOrder = buildClientWorkOrder();

    const paymentItem = workOrder.buildItems.find(
      (item) => item.id === "work-item-payment-preparation"
    );

    expect(paymentItem).toBeDefined();
    expect(paymentItem?.status).toBe("blocked");
    expect(paymentItem?.notes.join(" ")).toContain("Vendor payment profiles");
  });

  test("keeps client ownership boundaries explicit", () => {
    const workOrder = buildClientWorkOrder();

    expect(workOrder.productionBoundaries).toContain(
      "Client owns production credentials and deployment environment."
    );
    expect(workOrder.acceptanceCriteria).toContain(
      "No production credentials are stored in the public repo."
    );
  });

  test("summarizes work order state for reviewers", () => {
    const summary = summarizeClientWorkOrder();

    expect(summary.workOrderVersion).toBe("client-work-order-v1");
    expect(summary.buildItemCount).toBeGreaterThanOrEqual(4);
    expect(summary.blockedItems).toBeGreaterThanOrEqual(1);
  });

  test("validates the default work order", () => {
    const validation = validateClientWorkOrder();

    expect(validation.valid).toBe(true);
    expect(validation.status).toBe("pass");
    expect(validation.errors).toEqual([]);
  });
});
