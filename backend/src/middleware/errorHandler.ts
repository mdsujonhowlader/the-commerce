import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { errorResponse } from "../utils/envelope.js";
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(errorResponse([{ message: err.message, code: "App_ERROR" }]));
  }

  console.error("error", err);
  return res
    .status(500)
    .json(
      errorResponse([{ message: "Internal Server Error", code: "INTERNAL" }]),
    );
}
