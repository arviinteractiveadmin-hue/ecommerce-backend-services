import type {
  ApiAuthResponse,
  ApiCart,
  ApiCategory,
  ApiProduct,
  ApiProductDetail,
  ApiProductList,
  ApiResponse,
  ApiWishlistItem,
} from "./api-types";

export const API_BASE = "http://localhost:4000/api/v1";

const ACCESS_KEY = "atelier-access-token";
const REFRESH_KEY = "atelier-refresh-token";

export const tokenStorage = {
  getAccess: () => (typeof localStorage !== "undefined" ? localStorage.getItem(ACCESS_KEY) : null),
  getRefresh: () => (typeof localStorage !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

async function refreshTokens(): Promise<string | null> {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!res.ok) { tokenStorage.clear(); return null; }
    const json = (await res.json()) as ApiResponse<{ accessToken: string; refreshToken: string }>;
    if (!json.success) { tokenStorage.clear(); return null; }
    tokenStorage.set(json.data.accessToken, json.data.refreshToken);
    return json.data.accessToken;
  } catch {
    return null;
  }
}

async function apiFetch<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const token = tokenStorage.getAccess();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (res.status === 401 && retry) {
    const fresh = await refreshTokens();
    if (fresh) return apiFetch<T>(path, init, false);
  }

  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}

// ─── Products ───────────────────────────────────────────────────────────────

export type ProductFilters = {
  search?: string;
  category?: string;
  brand?: string;
  maxPrice?: number;
  featured?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "rating" | "popular" | "name";
  page?: number;
  limit?: number;
};

export function getProducts(filters: ProductFilters = {}): Promise<ApiProductList> {
  const qs = new URLSearchParams({
    page: String(filters.page ?? 1),
    limit: String(filters.limit ?? 20),
    sort: filters.sort ?? "newest",
  });
  if (filters.search) qs.set("search", filters.search);
  if (filters.category) qs.set("category", filters.category);
  if (filters.brand) qs.set("brand", filters.brand);
  if (filters.maxPrice) qs.set("maxPrice", String(filters.maxPrice));
  if (filters.featured) qs.set("featured", "true");
  return apiFetch<ApiProductList>(`/products?${qs}`);
}

export function getProduct(slug: string): Promise<ApiProductDetail> {
  return apiFetch<ApiProductDetail>(`/products/${slug}`);
}

export function getRelatedProducts(slug: string): Promise<ApiProduct[]> {
  return apiFetch<ApiProduct[]>(`/products/${slug}/related`);
}

export function getCategories(): Promise<ApiCategory[]> {
  return apiFetch<ApiCategory[]>("/categories");
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export function apiLogin(email: string, password: string): Promise<ApiAuthResponse> {
  return apiFetch<ApiAuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function apiRegister(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<ApiAuthResponse> {
  return apiFetch<ApiAuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ firstName, lastName, email, password }),
  });
}

export function apiForgotPassword(email: string): Promise<void> {
  return apiFetch<void>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// ─── Cart (requires auth) ────────────────────────────────────────────────────

export function apiGetCart(): Promise<ApiCart> {
  return apiFetch<ApiCart>("/cart");
}

export function apiAddCartItem(productId: number, quantity: number): Promise<ApiCart> {
  return apiFetch<ApiCart>("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export function apiUpdateCartItem(productId: number, quantity: number): Promise<ApiCart> {
  return apiFetch<ApiCart>(`/cart/items/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export function apiRemoveCartItem(productId: number): Promise<void> {
  return apiFetch<void>(`/cart/items/${productId}`, { method: "DELETE" });
}

export function apiClearCart(): Promise<void> {
  return apiFetch<void>("/cart", { method: "DELETE" });
}

// ─── Wishlist (requires auth) ────────────────────────────────────────────────

export function apiGetWishlist(): Promise<ApiWishlistItem[]> {
  return apiFetch<ApiWishlistItem[]>("/wishlist");
}

export function apiAddWishlistItem(productId: number): Promise<void> {
  return apiFetch<void>("/wishlist", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

export function apiRemoveWishlistItem(productId: number): Promise<void> {
  return apiFetch<void>(`/wishlist/${productId}`, { method: "DELETE" });
}
