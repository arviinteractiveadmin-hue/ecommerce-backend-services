import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { useStore } from "@/lib/store";
import { money } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout/confirmation")({
  validateSearch: z.object({ id: z.string() }),
  head: () => ({ meta: [{ title: "Order confirmed — Atelier" }] }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { id } = Route.useSearch();
  const order = useStore((s) => s.orders.find((o) => o.id === id));

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage/30">
          <CheckCircle2 className="h-9 w-9 text-sage-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl">Thank you</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your order has been placed.</p>
        <p className="mt-6 text-sm">Order ID</p>
        <p className="font-display text-2xl">{id}</p>
        {order && (
          <>
            <p className="mt-6 text-sm text-muted-foreground">Total paid</p>
            <p className="text-lg font-semibold">{money(order.total)}</p>
            <p className="mt-4 text-xs text-muted-foreground">Paid via {order.paymentMethod}</p>
          </>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/account/orders/$id" params={{ id }}>
            <Button variant="outline" className="w-full rounded-full sm:w-auto">Track order</Button>
          </Link>
          <Link to="/products">
            <Button className="w-full rounded-full sm:w-auto">Continue shopping</Button>
          </Link>
        </div>
      </div>
      <ul className="mt-8 grid gap-3 text-sm text-muted-foreground">
        <li>✓ Order success message sent</li>
        <li>✓ Order ID generated</li>
        <li>✓ Next steps: we'll email a shipping update soon</li>
      </ul>
    </div>
  );
}
