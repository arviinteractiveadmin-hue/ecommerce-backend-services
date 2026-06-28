import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/mock-products";
import { money } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const wishlist = useStore((s) => s.wishlist);
  const toggle = useStore((s) => s.toggleWishlist);
  const saved = wishlist.includes(product.id);

  return (
    <div className="group">
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        className="relative block overflow-hidden rounded-lg bg-secondary"
      >
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        {product.originalPrice && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
            Sale
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className="absolute right-3 top-3 rounded-full bg-background/80 p-2 backdrop-blur transition hover:bg-background"
          aria-label="Save to wishlist"
        >
          <Heart className={cn("h-4 w-4", saved && "fill-primary text-primary")} />
        </button>
      </Link>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.brand}</p>
          <Link to="/products/$id" params={{ id: product.id }} className="mt-0.5 block text-sm font-medium hover:underline">
            {product.name}
          </Link>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">{money(product.price)}</p>
          {product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through">{money(product.originalPrice)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
