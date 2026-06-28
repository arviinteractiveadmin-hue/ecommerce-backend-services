import { Link, useRouterState, useRouter } from "@tanstack/react-router";
import { LogOut, MapPin, Package, RotateCcw, Settings, ShoppingBag, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const items = [
  { to: "/account", label: "Overview", icon: User, exact: true },
  { to: "/account/orders", label: "My Orders", icon: Package },
  { to: "/account/wishlist", label: "Wishlist", icon: ShoppingBag },
  { to: "/account/returns", label: "Returns", icon: RotateCcw },
  { to: "/account/settings", label: "Settings", icon: Settings },
];

export function AccountSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const user = useStore((s) => s.user);
  const signOut = useStore((s) => s.signOut);

  return (
    <aside className="md:sticky md:top-24 md:self-start">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.name ?? "Guest"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email ?? "Not signed in"}</p>
          </div>
        </div>
      </div>
      <nav className="mt-3 flex flex-col gap-1">
        {items.map((it) => {
          const active = it.exact ? path === it.to : path.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent text-foreground",
              )}
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
        <div className="my-2 border-t border-border" />
        <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent">
          <MapPin className="h-4 w-4" />
          Continue shopping
        </Link>
        {user && (
          <button
            onClick={() => {
              signOut();
              router.navigate({ to: "/" });
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-accent"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        )}
      </nav>
    </aside>
  );
}
