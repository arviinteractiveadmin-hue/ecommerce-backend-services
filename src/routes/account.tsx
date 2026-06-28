import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AccountSidebar } from "@/components/AccountSidebar";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My account — Atelier" }] }),
  component: AccountLayout,
});

function AccountLayout() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl">My account</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-[240px_minmax(0,1fr)]">
        <AccountSidebar />
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
