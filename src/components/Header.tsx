import { Link, useRouter } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { useStore, cartCount } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/products", label: "Shop", search: {} },
  { to: "/products", label: "Footwear", search: { category: "Footwear" } },
  { to: "/products", label: "Bags", search: { category: "Bags" } },
  { to: "/products", label: "Apparel", search: { category: "Apparel" } },
];

export function Header() {
  const cart = useStore((s) => s.cart);
  const user = useStore((s) => s.user);
  const router = useRouter();
  const [q, setQ] = useState("");
  const count = cartCount(cart);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.navigate({ to: "/products", search: { q } as never });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="mt-8 flex flex-col gap-1">
              {nav.map((n, i) => (
                <Link
                  key={i}
                  to={n.to}
                  search={n.search as never}
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
          atelier<span className="text-primary">.</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-6 md:flex">
          {nav.map((n, i) => (
            <Link
              key={i}
              to={n.to}
              search={n.search as never}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={onSearch} className="ml-auto hidden flex-1 max-w-md md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products..."
              className="pl-9 bg-secondary/50 border-transparent"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <Link to="/account/wishlist" className="rounded-md p-2 hover:bg-accent" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            to={user ? "/account" : "/auth"}
            className="rounded-md p-2 hover:bg-accent"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link to="/cart" className="relative rounded-md p-2 hover:bg-accent" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
