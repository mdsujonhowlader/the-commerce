import { Outlet } from "react-router";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navber */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
