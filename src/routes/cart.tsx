import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, Tag, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useStore, cartTotal } from "@/lib/store";
import { money } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your cart — Atelier" }] }),
  component: CartPage,
});

function CartPage() {
  const cart = useStore((s) => s.cart);
  const updateQty = useStore((s) => s.updateQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = cartTotal(cart);
  const shipping = subtotal > 80 || subtotal === 0 ? 0 : 9;
  const total = Math.max(0, subtotal - discount + shipping);

  const apply = () => {
    if (coupon.trim().toUpperCase() === "ATELIER10") {
      setDiscount(subtotal * 0.1);
      toast.success("Coupon applied", { description: "10% off your subtotal." });
    } else {
      toast.error("Invalid coupon code.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-32 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-6 font-display text-3xl">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Add a few things you love to get started.</p>
        <Link to="/products" className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-sm text-background">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl">Your cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">{cart.length} item{cart.length === 1 ? "" : "s"}</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {cart.map((item) => (
            <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 rounded-xl border border-border bg-card p-4">
              <Link to="/products/$id" params={{ id: item.productId }} className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-secondary">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to="/products/$id" params={{ id: item.productId }} className="font-medium hover:underline">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[item.size, item.color].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <p className="font-semibold">{money(item.price * item.quantity)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-border">
                    <button onClick={() => updateQty(item.productId, item.size, item.color, item.quantity - 1)} className="p-2"><Minus className="h-3 w-3" /></button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQty(item.productId, item.size, item.color, item.quantity + 1)} className="p-2"><Plus className="h-3 w-3" /></button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId, item.size, item.color)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl">Order summary</h2>

            <div className="mt-5 flex gap-2">
              <Input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" />
              <Button variant="outline" onClick={apply}><Tag className="mr-1.5 h-4 w-4" />Apply</Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Try ATELIER10 for 10% off.</p>

            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
              {discount > 0 && <div className="flex justify-between text-primary"><dt>Discount</dt><dd>−{money(discount)}</dd></div>}
              <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping === 0 ? "Free" : money(shipping)}</dd></div>
              <div className="mt-2 flex justify-between border-t border-border pt-3 text-base font-semibold">
                <dt>Total</dt><dd>{money(total)}</dd>
              </div>
            </dl>

            <Link
              to="/checkout/address"
              className="mt-6 block w-full rounded-full bg-foreground py-3 text-center text-sm font-medium text-background hover:bg-foreground/90"
            >
              Proceed to checkout
            </Link>
            <Link to="/products" className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground">
              ← Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
