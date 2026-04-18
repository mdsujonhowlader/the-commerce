import { errorResponse } from "../utils/envelope.js";
import type { Request, Response } from "express";
export function notFound(req: Request, res: Response) {
  res.status(404).json(errorResponse([{message:`Route not Found ${req.method}`}]));
}
