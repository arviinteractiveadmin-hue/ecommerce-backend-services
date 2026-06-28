import { createFileRoute, Link, useRouter, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Minus, Plus, Star, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { getProduct, products } from "@/lib/mock-products";
import { money } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const p = getProduct(params.id);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.name} — Atelier` },
      { name: "description", content: loaderData?.product.description ?? "" },
      { property: "og:image", content: loaderData?.product.images[0] ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-32 text-center">
      <h1 className="font-display text-3xl">Product not found</h1>
      <Link to="/products" className="mt-4 inline-block text-primary underline">Back to shop</Link>
    </div>
  ),
  errorComponent: () => <div className="p-12 text-center">Something went wrong.</div>,
  component: PDP,
});

function PDP() {
  const { product } = Route.useLoaderData();
  const router = useRouter();
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(product.sizes?.[0]);
  const [color, setColor] = useState(product.colors?.[0]?.name);
  const [qty, setQty] = useState(1);
  const addToCart = useStore((s) => s.addToCart);
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const saved = wishlist.includes(product.id);

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  const handleAdd = (goToCart?: boolean) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size,
      color,
      quantity: qty,
    });
    if (goToCart) {
      router.navigate({ to: "/cart" });
    } else {
      toast.success("Added to cart", {
        description: `${product.name}${size ? ` · ${size}` : ""}${color ? ` · ${color}` : ""}`,
        action: { label: "View cart", onClick: () => router.navigate({ to: "/cart" }) },
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link> / <Link to="/products" className="hover:text-foreground">Shop</Link> / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-xl bg-secondary">
            <img src={product.images[activeImg]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((src: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "h-20 w-20 overflow-hidden rounded-lg border-2 transition",
                    i === activeImg ? "border-foreground" : "border-transparent opacity-70",
                  )}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{product.brand}</p>
          <h1 className="mt-2 font-display text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={cn("h-4 w-4", s <= Math.round(product.rating) ? "fill-primary text-primary" : "text-muted-foreground")} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating} · {product.reviews} reviews</span>
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <p className="font-display text-3xl">{money(product.price)}</p>
            {product.originalPrice && <p className="text-muted-foreground line-through">{money(product.originalPrice)}</p>}
          </div>

          <p className="mt-5 text-sm text-muted-foreground">{product.description}</p>

          {product.colors && (
            <div className="mt-7">
              <p className="text-sm font-medium">Color: <span className="text-muted-foreground">{color}</span></p>
              <div className="mt-3 flex gap-2">
                {product.colors.map((c: { name: string; hex: string }) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    aria-label={c.name}
                    className={cn(
                      "h-9 w-9 rounded-full border-2 transition",
                      color === c.name ? "border-foreground" : "border-border",
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes && (
            <div className="mt-6">
              <p className="text-sm font-medium">Size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s: string) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "min-w-12 rounded-md border px-3 py-2 text-sm",
                      size === s ? "border-foreground bg-foreground text-background" : "border-border hover:bg-accent",
                    )}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3"><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3"><Plus className="h-4 w-4" /></button>
            </div>
            <Button onClick={() => handleAdd(false)} className="flex-1 rounded-full" size="lg">Add to cart</Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleWishlist(product.id)}
              className="rounded-full h-11 w-11"
              aria-label="Wishlist"
            >
              <Heart className={cn("h-5 w-5", saved && "fill-primary text-primary")} />
            </Button>
          </div>

          <Button variant="secondary" onClick={() => handleAdd(true)} className="mt-3 w-full rounded-full" size="lg">
            Buy now
          </Button>

          <div className="mt-8 grid gap-3 rounded-xl bg-secondary/60 p-5 text-sm">
            <div className="flex items-center gap-3"><Truck className="h-4 w-4 text-primary" /> Free shipping over $80</div>
            <div className="flex items-center gap-3"><RotateCcw className="h-4 w-4 text-primary" /> 30-day returns</div>
            <div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-primary" /> Secure checkout</div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20">
        <h2 className="font-display text-2xl">Reviews</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            { name: "Jamie L.", text: "Beautifully made and exactly as pictured. The fit is spot on." },
            { name: "Morgan P.", text: "Quietly excellent. Has become my daily go-to." },
            { name: "Riley K.", text: "Worth the price. Solid construction and great materials." },
          ].map((r, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-3 w-3 fill-primary text-primary" />)}
              </div>
              <p className="mt-3 text-sm">{r.text}</p>
              <p className="mt-3 text-xs text-muted-foreground">— {r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="mt-20">
        <h2 className="font-display text-2xl">You might also like</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {related.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
