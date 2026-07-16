import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { z } from "zod";
import { useProducts, useCategories } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { ProductFilters } from "@/lib/api";

const search = z
  .object({
    q: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    sort: z.enum(["featured", "price-asc", "price-desc", "rating"]).optional(),
  })
  .optional();

export const Route = createFileRoute("/products")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Shop — Atelier" },
      { name: "description", content: "Browse the full collection of footwear, bags, apparel and accessories." },
    ],
  }),
  component: ProductsPage,
});

const SORT_MAP: Record<string, ProductFilters["sort"]> = {
  featured: "newest",
  "price-asc": "price_asc",
  "price-desc": "price_desc",
  rating: "rating",
};

function ProductSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="aspect-[4/5] rounded-lg bg-secondary" />
      <div className="h-3 w-1/2 rounded bg-secondary" />
      <div className="h-4 w-3/4 rounded bg-secondary" />
    </div>
  );
}

function ProductsPage() {
  const sp = Route.useSearch();
  const nav = Route.useNavigate();
  const [maxPrice, setMaxPrice] = useState(400);
  const [selBrands, setSelBrands] = useState<string[]>([]);
  const [q, setQ] = useState(sp?.q ?? "");

  const categorySlug = sp?.category?.toLowerCase().replace(/\s+/g, "-");

  const { data, isLoading } = useProducts({
    search: sp?.q,
    category: categorySlug,
    sort: SORT_MAP[sp?.sort ?? "featured"],
    maxPrice: maxPrice < 400 ? maxPrice : undefined,
    limit: 40,
  });

  const { data: categories } = useCategories();

  const products = data?.products ?? [];

  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))), [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selBrands.length) list = list.filter((p) => selBrands.includes(p.brand));
    if (sp?.brand) list = list.filter((p) => p.brand === sp.brand);
    return list;
  }, [products, selBrands, sp?.brand]);

  const setCat = (c: string | undefined) =>
    nav({ search: (prev: any) => ({ ...prev, category: c }) as never });

  const Filters = (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-semibold">Category</p>
        <div className="space-y-2">
          <button
            onClick={() => setCat(undefined)}
            className={`block text-sm ${!sp?.category ? "text-foreground font-medium" : "text-muted-foreground"}`}
          >
            All
          </button>
          {categories?.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCat(c.name)}
              className={`block text-sm ${sp?.category === c.name ? "text-foreground font-medium" : "text-muted-foreground"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm font-semibold">Price up to ${maxPrice}</p>
        <Slider value={[maxPrice]} min={20} max={400} step={10} onValueChange={(v) => setMaxPrice(v[0])} />
      </div>
      {brands.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-semibold">Brand</p>
          <div className="space-y-2">
            {brands.map((b) => (
              <label key={b} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={selBrands.includes(b)}
                  onCheckedChange={(v) =>
                    setSelBrands((prev) => (v ? [...prev, b] : prev.filter((x) => x !== b)))
                  }
                />
                {b}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <Link to="/" className="text-xs text-muted-foreground hover:underline">← Home</Link>
        <h1 className="font-display text-4xl">{sp?.category ?? "All products"}</h1>
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading…" : `${filtered.length} items`}
        </p>
      </div>

      <div className="mt-8 flex gap-4">
        {/* Desktop filters */}
        <aside className="hidden w-60 shrink-0 md:block">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              nav({ search: (prev: any) => ({ ...prev, q }) as never });
            }}
            className="mb-6"
          >
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." />
          </form>
          {Filters}
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto p-6">
                <h3 className="font-display text-xl">Filters</h3>
                <div className="mt-6">{Filters}</div>
              </SheetContent>
            </Sheet>
            {sp?.q && (
              <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs">
                "{sp.q}"
                <button
                  onClick={() => {
                    setQ("");
                    nav({ search: (prev: any) => ({ ...prev, q: undefined }) as never });
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <Select
              value={sp?.sort ?? "featured"}
              onValueChange={(v) => nav({ search: (prev: any) => ({ ...prev, sort: v }) as never })}
            >
              <SelectTrigger className="ml-auto w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Newest</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-16 text-center">
              <p className="font-medium">No products match those filters.</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting price or brand.</p>
            </div>
          ) : (
            <Reveal className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
