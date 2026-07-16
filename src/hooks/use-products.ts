import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getProduct,
  getProducts,
  getRelatedProducts,
  type ProductFilters,
} from "@/lib/api";
import type { ApiProduct, ApiProductDetail } from "@/lib/api-types";
import type { Product } from "@/lib/mock-products";

export function mapApiProduct(p: ApiProduct): Product {
  return {
    id: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category.name,
    price: p.price,
    rating: p.ratingAverage,
    reviews: p.ratingCount,
    images: p.images.length > 0 ? p.images.map((img) => img.url) : ["https://picsum.photos/seed/" + p.slug + "/900/900"],
    description: p.description,
    featured: p.isFeatured,
  };
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    select: (data) => ({
      products: data.items.map(mapApiProduct),
      total: data.total,
    }),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
    select: (p: ApiProductDetail) => ({
      product: mapApiProduct(p),
      reviews: p.reviews,
    }),
    enabled: !!slug,
  });
}

export function useRelatedProducts(slug: string) {
  return useQuery({
    queryKey: ["related", slug],
    queryFn: () => getRelatedProducts(slug),
    select: (data) => data.map(mapApiProduct),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });
}
