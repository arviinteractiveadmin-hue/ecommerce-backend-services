import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, CircleDot } from "lucide-react";
import { useStore } from "@/lib/store";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/orders/$id")({
  component: OrderDetail,
  notFoundComponent: () => (
    <div className="p-12 text-center text-sm text-muted-foreground">Order not found.</div>
  ),
});

const STEPS = ["Placed", "Shipped", "Out for Delivery", "Delivered"] as const;

function OrderDetail() {
  const { id } = Route.useParams();
  const order = useStore((s) => s.orders.find((o) => o.id === id));
  if (!order) throw notFound();

  const currentIdx = STEPS.indexOf(order.status);

  return (
    <div>
      <Link to="/account/orders" className="text-xs text-muted-foreground hover:underline">← All orders</Link>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-2xl">Order {order.id}</h2>
        <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleString()}</p>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <p className="text-sm font-semibold">Track your order</p>
        <ol className="mt-6 flex items-start justify-between">
          {STEPS.map((s, i) => {
            const done = i <= currentIdx;
            const active = i === currentIdx;
            return (
              <li key={s} className="flex flex-1 flex-col items-center text-center">
                <div className="flex w-full items-center">
                  <span className={cn("h-px flex-1", i === 0 ? "opacity-0" : done ? "bg-primary" : "bg-border")} />
                  <span className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2",
                    done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground",
                  )}>
                    {done && !active ? <Check className="h-4 w-4" /> : <CircleDot className="h-4 w-4" />}
                  </span>
                  <span className={cn("h-px flex-1", i === STEPS.length - 1 ? "opacity-0" : i < currentIdx ? "bg-primary" : "bg-border")} />
                </div>
                <p className={cn("mt-2 text-xs", done ? "text-foreground font-medium" : "text-muted-foreground")}>{s}</p>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="font-semibold">Items</p>
          <ul className="mt-4 space-y-3">
            {order.items.map((it, i) => (
              <li key={i} className="flex gap-3">
                <img src={it.image} alt={it.name} className="h-14 w-14 rounded-md object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{it.name}</p>
                  <p className="text-xs text-muted-foreground">{[it.size, it.color].filter(Boolean).join(" · ")} · Qty {it.quantity}</p>
                </div>
                <p className="text-sm">{money(it.price * it.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-border pt-4 flex justify-between text-sm font-semibold">
            <span>Total</span><span>{money(order.total)}</span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="font-semibold">Shipping address</p>
          <address className="mt-3 not-italic text-sm text-muted-foreground">
            {order.address.fullName}<br />
            {order.address.line1}<br />
            {order.address.city}, {order.address.state} {order.address.zip}<br />
            {order.address.phone}
          </address>
          <p className="mt-6 font-semibold">Payment</p>
          <p className="mt-2 text-sm text-muted-foreground">{order.paymentMethod}</p>
        </div>
      </div>
    </div>
  );
}
