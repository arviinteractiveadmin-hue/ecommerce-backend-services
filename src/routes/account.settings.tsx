import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/account/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const user = useStore((s) => s.user);
  const addresses = useStore((s) => s.addresses);
  const addAddress = useStore((s) => s.addAddress);
  const signIn = useStore((s) => s.signIn);

  const [profile, setProfile] = useState({ name: user?.name ?? "", email: user?.email ?? "" });
  const [addr, setAddr] = useState({ fullName: "", line1: "", city: "", state: "", zip: "", phone: "" });

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    signIn({ name: profile.name, email: profile.email });
    toast.success("Profile updated");
  };

  const saveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(addr);
    toast.success("Address added");
    setAddr({ fullName: "", line1: "", city: "", state: "", zip: "", phone: "" });
  };

  return (
    <div>
      <h2 className="font-display text-2xl">Profile & settings</h2>
      <Tabs defaultValue="profile" className="mt-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="prefs">Prefs</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <form onSubmit={saveProfile} className="max-w-md space-y-4 rounded-xl border border-border bg-card p-6">
            <div><Label htmlFor="pn">Name</Label><Input id="pn" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
            <div><Label htmlFor="pe">Email</Label><Input id="pe" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
            <Button type="submit" className="rounded-full">Save changes</Button>
          </form>
        </TabsContent>

        <TabsContent value="addresses" className="mt-6 space-y-6">
          {addresses.length > 0 && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {addresses.map((a, i) => (
                <li key={i} className="rounded-xl border border-border bg-card p-5 text-sm">
                  <p className="font-medium">{a.fullName}</p>
                  <p className="mt-1 text-muted-foreground">{a.line1}, {a.city}, {a.state} {a.zip}</p>
                  <p className="text-muted-foreground">{a.phone}</p>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={saveAddress} className="grid gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-2">
            <h3 className="font-display text-lg sm:col-span-2">Add a new address</h3>
            {(["fullName", "line1", "city", "state", "zip", "phone"] as const).map((f) => (
              <div key={f} className={f === "line1" ? "sm:col-span-2" : ""}>
                <Label htmlFor={f} className="capitalize">{f === "line1" ? "Address" : f === "zip" ? "Zip" : f}</Label>
                <Input id={f} required value={addr[f]} onChange={(e) => setAddr({ ...addr, [f]: e.target.value })} />
              </div>
            ))}
            <Button type="submit" className="rounded-full sm:col-span-2 sm:w-fit">Save address</Button>
          </form>
        </TabsContent>

        <TabsContent value="password" className="mt-6">
          <form
            onSubmit={(e) => { e.preventDefault(); toast.success("Password updated"); }}
            className="max-w-md space-y-4 rounded-xl border border-border bg-card p-6"
          >
            <div><Label htmlFor="cp">Current password</Label><Input id="cp" type="password" required /></div>
            <div><Label htmlFor="np">New password</Label><Input id="np" type="password" required /></div>
            <div><Label htmlFor="cn">Confirm new password</Label><Input id="cn" type="password" required /></div>
            <Button type="submit" className="rounded-full">Update password</Button>
          </form>
        </TabsContent>

        <TabsContent value="prefs" className="mt-6">
          <div className="max-w-md space-y-4 rounded-xl border border-border bg-card p-6">
            {[
              { label: "Order updates", desc: "Shipping and delivery notifications", on: true },
              { label: "Promotional emails", desc: "New arrivals and exclusive offers", on: false },
              { label: "SMS notifications", desc: "Critical updates via SMS", on: true },
            ].map((p) => (
              <div key={p.label} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
                <Switch defaultChecked={p.on} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
