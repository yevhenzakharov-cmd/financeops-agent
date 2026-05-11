import type { NextFunction, Request, Response } from "express";
import { describe, expect, test, vi } from "vitest";

import {
  buildApiErrorBody,
  notFoundHandler,
  registerStandardApiErrorHandlers,
  standardApiErrorHandler
} from "../src/api/error-response.js";

type MockRequestInput = Pick<Request, "method" | "path">;

type MockJsonResponse = Pick<Response, "status" | "json"> & {
  headersSent?: boolean;
};

function buildMockRequest(method: string, path: string): Request {
  return {
    method,
    path
  } as MockRequestInput as Request;
}

function buildMockResponse(headersSent = false): {
  response: Response;
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
} {
  const status = vi.fn().mockReturnThis();
  const json = vi.fn();

  const response: MockJsonResponse = {
    headersSent,
    status,
    json
  };

  return {
    response: response as Response,
    status,
    json
  };
}

describe("standard API error response", () => {
  test("builds a stable not-found style JSON error body", () => {
    const body = buildApiErrorBody(
      "route_not_found",
      "Route not found.",
      {
        method: "GET",
        path: "/missing"
      }
    );

    expect(body.status).toBe("error");
    expect(body.error.code).toBe("route_not_found");
    expect(body.error.message).toBe("Route not found.");
    expect(body.error.method).toBe("GET");
    expect(body.error.path).toBe("/missing");
    expect(body.error.timestamp).toMatch(/T/);
  });

  test("builds a stable internal-error style JSON error body", () => {
    const body = buildApiErrorBody(
      "internal_server_error",
      "Unexpected API error.",
      {
        method: "POST",
        path: "/payments"
      }
    );

    expect(body.status).toBe("error");
    expect(body.error.code).toBe("internal_server_error");
    expect(body.error.message).toBe("Unexpected API error.");
    expect(body.error.method).toBe("POST");
    expect(body.error.path).toBe("/payments");
  });

  test("registers not-found and standard error handlers in order", () => {
    const use = vi.fn();

    registerStandardApiErrorHandlers({
      use
    } as Pick<Express.Application, "use"> as Express.Application);

    expect(use).toHaveBeenCalledTimes(2);
    expect(use).toHaveBeenNthCalledWith(1, notFoundHandler);
    expect(use).toHaveBeenNthCalledWith(2, standardApiErrorHandler);
  });

  test("not-found handler returns standardized 404 JSON", () => {
    const { response, status, json } = buildMockResponse();

    notFoundHandler(buildMockRequest("GET", "/unknown-route"), response);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        error: expect.objectContaining({
          code: "route_not_found",
          message: "Route not found.",
          method: "GET",
          path: "/unknown-route"
        })
      })
    );
  });

  test("standard error handler returns standardized 500 JSON for Error objects", () => {
    const { response, status, json } = buildMockResponse();
    const next: NextFunction = vi.fn();

    standardApiErrorHandler(
      new Error("Database unavailable."),
      buildMockRequest("POST", "/client/reviewer-dashboard-package"),
      response,
      next
    );

    expect(next).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        error: expect.objectContaining({
          code: "internal_server_error",
          message: "Database unavailable.",
          method: "POST",
          path: "/client/reviewer-dashboard-package"
        })
      })
    );
  });

  test("standard error handler returns generic message for non-Error values", () => {
    const { response, status, json } = buildMockResponse();
    const next: NextFunction = vi.fn();

    standardApiErrorHandler(
      "string failure",
      buildMockRequest("GET", "/system-summary"),
      response,
      next
    );

    expect(next).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        error: expect.objectContaining({
          code: "internal_server_error",
          message: "Unexpected API error.",
          method: "GET",
          path: "/system-summary"
        })
      })
    );
  });

  test("standard error handler delegates when headers were already sent", () => {
    const err = new Error("Already streaming.");
    const { response, status, json } = buildMockResponse(true);
    const next: NextFunction = vi.fn();

    standardApiErrorHandler(
      err,
      buildMockRequest("GET", "/streaming-response"),
      response,
      next
    );

    expect(status).not.toHaveBeenCalled();
    expect(json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(err);
  });
});
