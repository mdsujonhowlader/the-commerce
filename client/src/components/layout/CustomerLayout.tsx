import { Outlet } from "react-router";
import CustomerNavbar from "../customer/common/DesktopCustomerNavbar";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navber */}

      <CustomerNavbar/>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
