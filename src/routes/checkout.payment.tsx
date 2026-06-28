import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Smartphone, Building2, Banknote } from "lucide-react";
import { useStore, cartTotal, type Address } from "@/lib/store";
import { money, newOrderId } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Steps } from "./checkout.address";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout/payment")({
  head: () => ({ meta: [{ title: "Checkout — Payment" }] }),
  component: PaymentPage,
});

const METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, hint: "Visa, Mastercard, Amex" },
  { id: "upi", label: "UPI", icon: Smartphone, hint: "Pay from any UPI app" },
  { id: "netbanking", label: "Net Banking", icon: Building2, hint: "All major banks" },
  { id: "cod", label: "Cash on Delivery", icon: Banknote, hint: "Pay when you receive" },
];

function PaymentPage() {
  const router = useRouter();
  const cart = useStore((s) => s.cart);
  const placeOrder = useStore((s) => s.placeOrder);
  const clearCart = useStore((s) => s.clearCart);
  const [method, setMethod] = useState("card");
  const [submitting, setSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-32 text-center">
        <p className="font-display text-2xl">Nothing to pay for.</p>
        <Link to="/products" className="mt-4 inline-block text-primary underline">Shop now</Link>
      </div>
    );
  }

  const subtotal = cartTotal(cart);
  const shipping = subtotal > 80 ? 0 : 9;
  const total = subtotal + shipping;

  const onPay = () => {
    setSubmitting(true);
    const addrRaw = sessionStorage.getItem("checkout-address");
    const address: Address = addrRaw ? JSON.parse(addrRaw) : { fullName: "Guest", line1: "", city: "", state: "", zip: "", phone: "" };
    const orderId = newOrderId();
    placeOrder({
      id: orderId,
      date: new Date().toISOString(),
      items: cart,
      total,
      status: "Placed",
      address,
      paymentMethod: METHODS.find((m) => m.id === method)?.label ?? method,
    });
    setTimeout(() => {
      clearCart();
      sessionStorage.removeItem("checkout-address");
      router.navigate({ to: "/checkout/confirmation", search: { id: orderId } as never });
    }, 600);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Steps step={2} />
      <h1 className="mt-8 font-display text-3xl">Select payment method</h1>

      <div className="mt-8 space-y-3">
        {METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={cn(
              "flex w-full items-center gap-4 rounded-xl border p-5 text-left transition",
              method === m.id ? "border-foreground bg-secondary/50" : "border-border hover:bg-secondary/30",
            )}
          >
            <m.icon className="h-5 w-5" />
            <div className="flex-1">
              <p className="font-medium">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.hint}</p>
            </div>
            <span className={cn("h-4 w-4 rounded-full border-2", method === m.id ? "border-foreground bg-foreground" : "border-border")} />
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-5 text-sm">
        <div className="flex justify-between"><span>Items ({cart.length})</span><span>{money(subtotal)}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : money(shipping)}</span></div>
        <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-semibold">
          <span>Total</span><span>{money(total)}</span>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Link to="/checkout/address" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>
        <Button onClick={onPay} disabled={submitting} size="lg" className="rounded-full">
          {submitting ? "Processing..." : `Pay ${money(total)}`}
        </Button>
      </div>
    </div>
  );
}
