import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { products, categories } from "@/lib/mock-products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atelier — Considered objects for daily wear" },
      { name: "description", content: "Footwear, bags, apparel and accessories from independent makers." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">New Season — Vol. 04</p>
            <h1 className="mt-4 font-display text-5xl font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
              Quiet objects,<br />built to be kept.
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground">
              A small collection of footwear, bags and everyday wear from independent makers we trust.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:bg-foreground/90"
              >
                Shop the collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/products"
                search={{ category: "Footwear" } as never}
                className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-accent"
              >
                Browse footwear
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
                alt="New season collection"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-border bg-card p-4 shadow-sm sm:block">
              <p className="font-display text-2xl">04</p>
              <p className="text-xs text-muted-foreground">New arrivals this week</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl">Shop by category</h2>
          <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground">All →</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/products"
              search={{ category: c.name } as never}
              className="group relative overflow-hidden rounded-xl bg-secondary"
            >
              <div className="aspect-[3/4]">
                <img src={c.image} alt={c.name} className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="font-display text-xl text-white">{c.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-3xl">Featured</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-3xl">Bestsellers</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Promise */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 rounded-2xl bg-secondary/60 p-8 md:grid-cols-3 md:p-12">
          {[
            { icon: Truck, t: "Free shipping over $80", d: "On all domestic orders." },
            { icon: RotateCcw, t: "30-day returns", d: "Easy returns, no questions." },
            { icon: ShieldCheck, t: "Secure checkout", d: "Encrypted from start to finish." },
          ].map((b, i) => (
            <div key={i} className="flex gap-4">
              <b.icon className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">{b.t}</p>
                <p className="text-sm text-muted-foreground">{b.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
