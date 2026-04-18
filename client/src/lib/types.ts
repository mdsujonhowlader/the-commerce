export type UserRole = "user" | "admin";
export type AppUser = {
  id: string;
  clerkUserId: string;
  email?: string;
  name?: string;
  role: UserRole;
};

export type ApiError = {
  message: string;
  code?: string;
};

export type ApiEnvelope<T> = {
  status: "success" | "error";
  data: T | null;
  meta?: string;
  errors?: ApiError[];
};
