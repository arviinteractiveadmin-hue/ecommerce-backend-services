export type ApiImage = {
  id: number;
  url: string;
  altText: string | null;
  position: number;
};

export type ApiCategory = {
  id: number;
  name: string;
  slug: string;
};

export type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  brand: string;
  stock: number;
  ratingAverage: number;
  ratingCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  images: ApiImage[];
  category: ApiCategory;
};

export type ApiReview = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { firstName: string; lastName: string };
};

export type ApiProductDetail = ApiProduct & {
  reviews: ApiReview[];
};

export type ApiProductList = {
  items: ApiProduct[];
  total: number;
};

export type ApiUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "CUSTOMER" | "ADMIN";
};

export type ApiAuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: ApiUser;
};

export type ApiCartItem = {
  id: number;
  quantity: number;
  product: ApiProduct;
};

export type ApiCart = {
  id: number;
  items: ApiCartItem[];
};

export type ApiWishlistItem = {
  id: number;
  product: ApiProduct;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiError = {
  success: false;
  error: { message: string; details?: unknown[] };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
