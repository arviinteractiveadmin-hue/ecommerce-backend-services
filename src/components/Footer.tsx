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
        {[
          { title: "Shop", links: ["Footwear", "Bags", "Apparel", "Accessories"] },
          { title: "Help", links: ["Shipping", "Returns", "Order Tracking", "Contact"] },
          { title: "Company", links: ["Journal", "Stores", "Sustainability", "Careers"] },
        ].map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <a className="text-sm text-muted-foreground hover:text-foreground" href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 sm:flex-row sm:px-6">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Atelier. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Crafted with care.</p>
        </div>
      </div>
    </footer>
  );
}
