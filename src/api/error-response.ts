import type { ErrorRequestHandler, Express, NextFunction, Request, Response } from "express";

export interface ApiErrorBody {
  status: "error";
  error: {
    code: string;
    message: string;
    method: string;
    path: string;
    timestamp: string;
  };
}

export function buildApiErrorBody(
  code: string,
  message: string,
  req: Pick<Request, "method" | "path">
): ApiErrorBody {
  return {
    status: "error",
    error: {
      code,
      message,
      method: req.method,
      path: req.path,
      timestamp: new Date().toISOString()
    }
  };
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json(
    buildApiErrorBody(
      "route_not_found",
      "Route not found.",
      req
    )
  );
}

export const standardApiErrorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const message = err instanceof Error
    ? err.message
    : "Unexpected API error.";

  res.status(500).json(
    buildApiErrorBody(
      "internal_server_error",
      message,
      req
    )
  );
};

export function registerStandardApiErrorHandlers(app: Express): void {
  app.use(notFoundHandler);
  app.use(standardApiErrorHandler);
}
