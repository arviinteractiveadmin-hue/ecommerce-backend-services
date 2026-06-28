export const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export const newOrderId = () =>
  "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
