import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout/address")({
  head: () => ({ meta: [{ title: "Checkout — Shipping address" }] }),
  component: AddressPage,
});

function AddressPage() {
  const router = useRouter();
  const cart = useStore((s) => s.cart);
  const addAddress = useStore((s) => s.addAddress);
  const [form, setForm] = useState({
    fullName: "", line1: "", city: "", state: "", zip: "", phone: "",
  });
  const [billingSame, setBillingSame] = useState(true);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-32 text-center">
        <p className="font-display text-2xl">Your cart is empty.</p>
        <Link to="/products" className="mt-4 inline-block text-primary underline">Browse products</Link>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(form);
    sessionStorage.setItem("checkout-address", JSON.stringify(form));
    router.navigate({ to: "/checkout/payment" });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Steps step={1} />
      <h1 className="mt-8 font-display text-3xl">Shipping address</h1>

      <form onSubmit={onSubmit} className="mt-8 grid gap-5">
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="line1">Address</Label>
          <Input id="line1" required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="zip">PIN / Zip</Label>
            <Input id="zip" required value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
          </div>
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} />
          Billing address is the same as shipping (optional).
        </label>

        <div className="mt-2 flex items-center justify-between">
          <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground">← Back to cart</Link>
          <Button type="submit" size="lg" className="rounded-full">Continue to payment</Button>
        </div>
      </form>
    </div>
  );
}

export function Steps({ step }: { step: 1 | 2 | 3 }) {
  const items = ["Address", "Payment", "Confirmation"];
  return (
    <ol className="flex items-center gap-3 text-xs">
      {items.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={
                "flex h-6 w-6 items-center justify-center rounded-full border " +
                (done
                  ? "bg-primary border-primary text-primary-foreground"
                  : active
                  ? "border-foreground text-foreground"
                  : "border-border text-muted-foreground")
              }
            >{n}</span>
            <span className={active || done ? "text-foreground" : "text-muted-foreground"}>{label}</span>
            {i < items.length - 1 && <span className="ml-2 h-px w-8 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}
