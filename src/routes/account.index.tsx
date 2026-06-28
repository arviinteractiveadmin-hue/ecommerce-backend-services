import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Heart, MapPin, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { money } from "@/lib/format";

export const Route = createFileRoute("/account/")({
  component: Overview,
});

function Overview() {
  const user = useStore((s) => s.user);
  const orders = useStore((s) => s.orders);
  const wishlist = useStore((s) => s.wishlist);

  return (
    <div>
      <div className="rounded-2xl border border-border bg-card p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Welcome back</p>
        <h2 className="mt-2 font-display text-3xl">{user?.name ?? "Friend"}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{user?.email ?? "Sign in to sync your orders and wishlist."}</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { to: "/account/orders", label: "Orders", value: orders.length, icon: Package },
          { to: "/account/wishlist", label: "Wishlist", value: wishlist.length, icon: Heart },
          { to: "/account/settings", label: "Addresses", value: useStore.getState().addresses.length, icon: MapPin },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="group rounded-xl border border-border bg-card p-5 transition hover:border-foreground">
            <c.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 font-display text-2xl">{c.value}</p>
            <p className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
              {c.label} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="font-display text-xl">Recent orders</h3>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">You haven't placed any orders yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {orders.slice(0, 3).map((o) => (
              <li key={o.id}>
                <Link to="/account/orders/$id" params={{ id: o.id }} className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:border-foreground">
                  <div>
                    <p className="text-sm font-medium">{o.id}</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.date).toLocaleDateString()} · {o.status}</p>
                  </div>
                  <p className="text-sm font-semibold">{money(o.total)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
