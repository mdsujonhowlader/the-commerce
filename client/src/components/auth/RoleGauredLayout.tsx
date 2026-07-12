import { userAuthStore } from "@/features/auth/store";
import type { UserRole } from "@/lib/types";
import { Navigate, Outlet } from "react-router";
import CommonLoader from "../common/Loader";

type RoleGaurdLayoutProps = {
  allow: UserRole[];
};

export function RoleGaurdLayout({ allow }: RoleGaurdLayoutProps) {
  const { isBootstraped, status, user } = userAuthStore();

  if (!isBootstraped || status === "loading") {
    return <CommonLoader />;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!allow.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
