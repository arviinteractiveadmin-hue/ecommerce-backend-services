# E-Commerce Site Plan (Mock Data)

Building all 15 screens from the flowchart as a TanStack Start app with localStorage-backed cart/wishlist/orders. No backend — all products and orders are mock data.

## Design Direction

Distinct, not the wireframe's purple/white. Going with a warm editorial feel:
- Palette: warm off-white `#FAF7F2`, ink `#1A1A1A`, accent terracotta `#C2410C`, soft sage `#84A98C`
- Type: Fraunces (display headings) + Inter (body) via @fontsource
- Generous whitespace, large product imagery, subtle hover lifts, no gradients

## Routes (src/routes/)

```
index.tsx                  1. Home (hero, categories, featured, best sellers)
products.tsx               2+3. Browse/PLP (search, category/price/brand filters, sort, grid)
products.$id.tsx           4. PDP (gallery, variants, qty, add-to-cart, reviews)
cart.tsx                   6. View Cart (items, qty, coupon, summary)
checkout.address.tsx       7. Checkout address form
checkout.payment.tsx       8. Payment method selection
checkout.confirmation.tsx  9. Order confirmation success
account.tsx                10. Account layout (sidebar + Outlet)
account.index.tsx          Account overview
account.orders.tsx         10.2 My Orders list
account.orders.$id.tsx     12. Order tracking (timeline)
account.wishlist.tsx       10.3 Wishlist
account.settings.tsx       10.4/11. Profile/Addresses/Password/Prefs (tabs)
account.returns.tsx        13. Return / Refund request
auth.tsx                   10.1 Login / Register (tabs) + forgot password
```

Shared header with logo, search, cart badge, account, wishlist. Mobile-responsive (15. covered by responsive layout throughout).

## State & Data

- `src/lib/mock-products.ts` — ~20 products with images (Unsplash URLs), categories, prices, variants
- `src/lib/store.ts` — Zustand store persisted to localStorage for: cart, wishlist, user (fake auth), orders, addresses
- Add-to-cart triggers a toast with "Continue shopping" / "View cart" matching the decision diamond
- "Place order" generates an order id, pushes into orders, navigates to confirmation

## Components

- `Header`, `Footer`, `ProductCard`, `FilterSidebar`, `QuantityStepper`, `CartLineItem`, `OrderTimeline`, `EmptyState`, `AccountSidebar`
- Reuse shadcn: button, input, card, tabs, sheet (mobile filters), dialog, badge, separator, sonner (toasts), accordion (FAQ/filters)

## Flowchart coverage check

Home → Browse → PLP → PDP → Add to Cart → (Add more? Yes→PLP / No→View Cart) → Checkout → Payment → Confirmation ✓
Account hub → Login/Register, My Orders, Wishlist, Settings ✓
Additional flows: Forgot password (in auth), Order tracking (account.orders.$id), Return/Refund (account.returns), Wishlist→Cart (button on wishlist) ✓
Mobile responsive via Tailwind breakpoints throughout ✓

## Out of scope

Real payment processing, real auth, server persistence. All "submit" actions update local store and show success UI.
