import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { getProduct } from "@/lib/mock-products";
import { money } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account/wishlist")({
  component: WishlistPage,
});

function WishlistPage() {
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const addToCart = useStore((s) => s.addToCart);

  const items = wishlist.map(getProduct).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center">
        <Heart className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-4 font-medium">Your wishlist is empty</p>
        <Link to="/products" className="mt-2 inline-block text-sm text-primary underline">Find something you love</Link>
      </div>
    );
  }

  const addAll = () => {
    items.forEach((p) =>
      addToCart({ productId: p.id, name: p.name, price: p.price, image: p.images[0], quantity: 1 }),
    );
    toast.success(`Added ${items.length} item${items.length === 1 ? "" : "s"} to cart`);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">My wishlist</h2>
        <Button onClick={addAll} variant="outline" className="rounded-full">
          <ShoppingBag className="mr-2 h-4 w-4" /> Add all to cart
        </Button>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
        {items.map((p) => (
          <li key={p.id} className="relative">
            <Link to="/products/$id" params={{ id: p.id }} className="block overflow-hidden rounded-lg bg-secondary">
              <div className="aspect-[4/5]">
                <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
              </div>
            </Link>
            <button
              onClick={() => toggleWishlist(p.id)}
              className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 hover:bg-background"
              aria-label="Remove"
            ><X className="h-3.5 w-3.5" /></button>
            <p className="mt-3 text-sm font-medium">{p.name}</p>
            <p className="text-xs text-muted-foreground">{money(p.price)}</p>
            <Button
              onClick={() => {
                addToCart({ productId: p.id, name: p.name, price: p.price, image: p.images[0], quantity: 1 });
                toast.success(`${p.name} added to cart`);
              }}
              size="sm"
              variant="secondary"
              className="mt-2 w-full rounded-full"
            >Add to cart</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
