export type ApiEnvelope<T> = {
  status: "success" | "error";
  data: T | null;
  meta?: Record<string, unknown>;
  errors?: Array<{ message: string; code?: string }>;
};

export function successResponse<T>(
  data: T,
  meta?: Record<string, unknown>,
): ApiEnvelope<T> {
  return { status: "success", data, meta };
}

export function errorResponse(
  errors?: Array<{ message: string; code?: string }>,
): ApiEnvelope<null> {
  return { status: "error", data: null, errors };
}
