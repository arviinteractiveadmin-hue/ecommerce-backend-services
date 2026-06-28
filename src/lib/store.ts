import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
};

export type Address = {
  fullName: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
};

export type Order = {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "Placed" | "Shipped" | "Out for Delivery" | "Delivered";
  address: Address;
  paymentMethod: string;
};

export type User = {
  name: string;
  email: string;
};

type Store = {
  user: User | null;
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  addresses: Address[];
  signIn: (u: User) => void;
  signOut: () => void;
  addToCart: (item: CartItem) => void;
  updateQty: (productId: string, size: string | undefined, color: string | undefined, q: number) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  addAddress: (a: Address) => void;
  placeOrder: (o: Order) => void;
};

const sameLine = (a: CartItem, productId: string, size?: string, color?: string) =>
  a.productId === productId && a.size === size && a.color === color;

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      cart: [],
      wishlist: [],
      orders: [],
      addresses: [],
      signIn: (u) => set({ user: u }),
      signOut: () => set({ user: null }),
      addToCart: (item) =>
        set((s) => {
          const existing = s.cart.find((c) => sameLine(c, item.productId, item.size, item.color));
          if (existing) {
            return {
              cart: s.cart.map((c) =>
                sameLine(c, item.productId, item.size, item.color)
                  ? { ...c, quantity: c.quantity + item.quantity }
                  : c,
              ),
            };
          }
          return { cart: [...s.cart, item] };
        }),
      updateQty: (productId, size, color, q) =>
        set((s) => ({
          cart: s.cart
            .map((c) => (sameLine(c, productId, size, color) ? { ...c, quantity: Math.max(0, q) } : c))
            .filter((c) => c.quantity > 0),
        })),
      removeFromCart: (productId, size, color) =>
        set((s) => ({ cart: s.cart.filter((c) => !sameLine(c, productId, size, color)) })),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (productId) =>
        set((s) => ({
          wishlist: s.wishlist.includes(productId)
            ? s.wishlist.filter((id) => id !== productId)
            : [...s.wishlist, productId],
        })),
      addAddress: (a) => set((s) => ({ addresses: [...s.addresses, a] })),
      placeOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
    }),
    { name: "atelier-store" },
  ),
);

export const cartTotal = (cart: CartItem[]) =>
  cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

export const cartCount = (cart: CartItem[]) => cart.reduce((sum, c) => sum + c.quantity, 0);
