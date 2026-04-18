import type { AppUser } from "@/lib/types";
import { create } from "zustand";
type AuthStatus = "idle" | "loading" | "ready" | "error";
type AuthStore = {
  status: AuthStatus;
  isBootstraped: boolean;
  user: AppUser | null;
  error: string | null;

  setLoading: () => void;
  setUser: (user: AppUser | null) => void;
  setError: (message: string) => void;
  clearAuth: () => void;
};

export const userAuth = create<AuthStore>((set) => ({
  status: "idle",
  isBootstraped: false,
  user: null,
  error: null,
  setLoading: () =>
    set({
      status: "loading",
      error: null,
    }),
  setUser: (user) =>
    set({
      status: "ready",
      isBootstraped: true,
      user,
      error: null,
    }),
  setError: (message) =>
    set({
      status: "error",
      isBootstraped: true,
      error: message,
    }),
  clearAuth: () =>
    set({
      status: "idle",
      isBootstraped: false,
      user: null,
      error: null,
    }),
}));
