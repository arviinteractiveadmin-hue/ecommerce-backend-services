import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Atelier" },
      {
        name: "description",
        content:
          "Questions about an order, sizing or a return? Get in touch with the Atelier team.",
      },
    ],
  }),
  component: ContactPage,
});

const channels = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@atelier.shop",
    hint: "We reply within one business day.",
  },
  {
    icon: MessageCircle,
    title: "Live chat",
    value: "Mon–Fri, 9–6",
    hint: "Bottom-right of every page.",
  },
  {
    icon: MapPin,
    title: "Studio",
    value: "12 Maker's Row, Portland",
    hint: "Visits by appointment.",
  },
  {
    icon: Clock,
    title: "Order help",
    value: "Track or return",
    hint: "Manage everything from your account.",
  },
];

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "Order question", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent", {
      description: `Thanks ${form.name || "there"} — we'll be in touch shortly.`,
    });
    setForm({ name: "", email: "", subject: "Order question", message: "" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">We're here to help</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Get in touch</h1>
        <p className="mt-4 text-base text-muted-foreground">
          Questions about sizing, an order, or a return? Send us a note and a real person will get
          back to you.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form
          onSubmit={submit}
          className="grid gap-5 rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <Button type="submit" size="lg" className="rounded-full sm:w-fit">
            Send message
          </Button>
        </form>

        <Reveal as="aside" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {channels.map((c) => (
            <div key={c.title} className="rounded-xl border border-border bg-card p-5">
              <c.icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-semibold">{c.title}</p>
              <p className="text-sm">{c.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.hint}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
