import { userAuthStore } from "@/features/auth/store";
import { useAuth } from "@clerk/react";

import { Navigate, Outlet } from "react-router";

export function PublicLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isBootstraped, status } = userAuthStore();

  if (!isLoaded) return null;
  if (isSignedIn && (!isBootstraped || status === "loading")) {
    return null;
  }
  if (isSignedIn) {
    return <Navigate to={"profile"} replace />;
  }

  return <Outlet />;
}
