import { userAuthStore } from "@/features/auth/store";
import { useAuth } from "@clerk/react";

import { Navigate, Outlet, useLocation } from "react-router";
import CommonLoader from "../common/Loader";

export function ProtectedLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isBootstraped, status } = userAuthStore();
  const location = useLocation();
  if (!isLoaded || (isSignedIn && (!isBootstraped || status === "loading"))) {
    return <CommonLoader />;
  }

  if (!isSignedIn) {
    return (
      <Navigate
        to="/sign-in"
        state={{ from: `${location.pathname}${location.search}` }}
        replace
      />
    );
  }

  return <Outlet />;
}
