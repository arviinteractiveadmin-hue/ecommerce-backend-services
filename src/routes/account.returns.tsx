import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Route = createFileRoute("/account/returns")({
  component: ReturnsPage,
});

function ReturnsPage() {
  const orders = useStore((s) => s.orders);
  const [orderId, setOrderId] = useState(orders[0]?.id ?? "");
  const [itemIdx, setItemIdx] = useState("0");
  const [reason, setReason] = useState("Doesn't fit");
  const [note, setNote] = useState("");
  const [mode, setMode] = useState("refund");

  const order = orders.find((o) => o.id === orderId);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Return request submitted", { description: `We'll email instructions for ${orderId}.` });
    setNote("");
  };

  return (
    <div>
      <h2 className="font-display text-2xl">Returns & refunds</h2>
      <p className="mt-1 text-sm text-muted-foreground">Submit a return request within 30 days of delivery.</p>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          You have no orders eligible for return.
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 max-w-xl space-y-5 rounded-xl border border-border bg-card p-6">
          <div>
            <Label>Order ID</Label>
            <Input value={orderId} onChange={(e) => setOrderId(e.target.value)} />
          </div>

          {order && (
            <div>
              <Label>Select item</Label>
              <Select value={itemIdx} onValueChange={setItemIdx}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {order.items.map((it, i) => (
                    <SelectItem key={i} value={String(i)}>{it.name} — {[it.size, it.color].filter(Boolean).join(" · ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Reason for return</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Doesn't fit", "Not as described", "Damaged on arrival", "Changed my mind", "Other"].map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="note">Add a note (optional)</Label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
          </div>

          <div>
            <Label>Refund or exchange?</Label>
            <RadioGroup value={mode} onValueChange={setMode} className="mt-2 grid grid-cols-2 gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm">
                <RadioGroupItem value="refund" /> Refund
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm">
                <RadioGroupItem value="exchange" /> Exchange
              </label>
            </RadioGroup>
          </div>

          <Button type="submit" size="lg" className="rounded-full">Submit request</Button>
        </form>
      )}
    </div>
  );
}
