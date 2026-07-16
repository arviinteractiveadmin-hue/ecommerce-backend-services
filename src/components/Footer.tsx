import { Link } from "@tanstack/react-router";

type FooterLink = {
  label: string;
  to?: string;
  search?: Record<string, string>;
  href?: string;
};

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Footwear", to: "/products", search: { category: "Footwear" } },
      { label: "Bags", to: "/products", search: { category: "Bags" } },
      { label: "Apparel", to: "/products", search: { category: "Apparel" } },
      { label: "Accessories", to: "/products", search: { category: "Accessories" } },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping", to: "/contact" },
      { label: "Returns", to: "/account/returns" },
      { label: "Order Tracking", to: "/account/orders" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Journal", href: "#" },
      { label: "Stores", href: "#" },
      { label: "Sustainability", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
];

const linkClass = "text-sm text-muted-foreground hover:text-foreground";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-display text-xl font-semibold">atelier.</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Considered objects for daily wear. Built to be kept.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.to ? (
                    <Link to={l.to} search={l.search as never} className={linkClass}>
                      {l.label}
                    </Link>
                  ) : (
                    <a className={linkClass} href={l.href ?? "#"}>
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 sm:flex-row sm:px-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Atelier. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Crafted with care.</p>
        </div>
      </div>
    </footer>
  );
}
