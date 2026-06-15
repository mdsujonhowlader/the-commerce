import { Outlet } from "react-router";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import AdminSidebar from "../admin/AdminSidebar";
import { userAuthStore } from "@/features/auth/store";
import { UserButton } from "@clerk/react";

export default function AdminLayout() {
  const {user}=userAuthStore()
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 lg:fixed lg:inset-y-0 lg:left-0">
        <AdminSidebar />
      </div>

{/* Main Content Area */}
        <div className="flex-1 lg:pl-64">
          {/* Mobile Header with Menu */}
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <AdminSidebar />
              </SheetContent>
            </Sheet>
            <h1 className="text-sm font-semibold">Admin Panel</h1>
            <div className="w-10" />
          </header>

          {/* Desktop Header */}
          <header className="hidden lg:sticky lg:top-0 lg:z-40 lg:flex lg:h-16 lg:items-center lg:justify-between lg:border-b lg:bg-background lg:px-8">
            {user && <span className="text-sm ">{`Hello sir, ${user.name}`}</span>}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                <UserButton/>
              </span>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
    </div>
  );
}