import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { useStore } from "@/lib/store";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/orders/")({
  component: OrdersPage,
});

const statusStyle: Record<string, string> = {
  Placed: "bg-secondary text-foreground",
  Shipped: "bg-sage/30 text-sage-foreground",
  "Out for Delivery": "bg-primary/15 text-primary",
  Delivered: "bg-sage/40 text-sage-foreground",
};

function OrdersPage() {
  const orders = useStore((s) => s.orders);

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center">
        <Package className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-4 font-medium">No orders yet</p>
        <Link to="/products" className="mt-2 inline-block text-sm text-primary underline">Start shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-2xl">My orders</h2>
      <ul className="mt-6 space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{o.id}</p>
                <p className="mt-1 text-sm">Placed on {new Date(o.date).toLocaleDateString()}</p>
              </div>
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", statusStyle[o.status])}>{o.status}</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {o.items.slice(0, 4).map((it, i) => (
                <img key={i} src={it.image} alt="" className="h-14 w-14 rounded-md object-cover" />
              ))}
              <div className="ml-auto text-right">
                <p className="text-sm text-muted-foreground">{o.items.length} item{o.items.length === 1 ? "" : "s"}</p>
                <p className="font-semibold">{money(o.total)}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3 text-sm">
              <Link to="/account/orders/$id" params={{ id: o.id }} className="rounded-full bg-foreground px-4 py-2 text-background">Track</Link>
              <Link to="/account/returns" className="rounded-full border border-border px-4 py-2 hover:bg-accent">Return</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
