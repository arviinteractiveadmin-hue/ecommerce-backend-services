export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  images: string[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  description: string;
  featured?: boolean;
  bestseller?: boolean;
};

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const products: Product[] = [
  {
    id: "runner-01",
    name: "Drift Runner",
    brand: "Atelier Move",
    category: "Footwear",
    price: 189,
    originalPrice: 220,
    rating: 4.7,
    reviews: 184,
    images: [img("1542291026-7eec264c27ff"), img("1600185365483-26d7a4cc7519"), img("1606107557195-0e29a4b5b4aa")],
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: [{ name: "Bone", hex: "#E8E0D4" }, { name: "Ink", hex: "#1A1A1A" }, { name: "Clay", hex: "#C2410C" }],
    description: "A weightless trainer with a contoured midsole and breathable knit upper. Designed for daily wear.",
    featured: true,
    bestseller: true,
  },
  {
    id: "loafer-02",
    name: "Marlowe Loafer",
    brand: "Hessian & Co.",
    category: "Footwear",
    price: 245,
    rating: 4.8,
    reviews: 92,
    images: [img("1614252369475-531eba835eb1"), img("1533867617858-e7b97e060509")],
    sizes: ["7", "8", "9", "10", "11"],
    colors: [{ name: "Cognac", hex: "#8B4513" }, { name: "Black", hex: "#0E0E0E" }],
    description: "Hand-finished leather loafer with a softly tapered last.",
    featured: true,
  },
  {
    id: "tote-01",
    name: "Field Tote",
    brand: "North Cargo",
    category: "Bags",
    price: 158,
    rating: 4.6,
    reviews: 211,
    images: [img("1591561954557-26941169b49e"), img("1548036328-c9fa89d128fa")],
    colors: [{ name: "Sand", hex: "#D6C5A8" }, { name: "Olive", hex: "#5A6A3A" }],
    description: "Heavyweight waxed canvas tote with leather handles and an interior zip pocket.",
    bestseller: true,
    featured: true,
  },
  {
    id: "backpack-01",
    name: "Quartz Backpack",
    brand: "North Cargo",
    category: "Bags",
    price: 198,
    originalPrice: 230,
    rating: 4.5,
    reviews: 76,
    images: [img("1553062407-98eeb64c6a62"), img("1581605405669-fcdf81165afa")],
    colors: [{ name: "Stone", hex: "#9B9789" }, { name: "Black", hex: "#0E0E0E" }],
    description: "A laptop-ready backpack in recycled ripstop with quick-access top pocket.",
  },
  {
    id: "tee-01",
    name: "Heavyweight Crew",
    brand: "Folded Goods",
    category: "Apparel",
    price: 58,
    rating: 4.4,
    reviews: 312,
    images: [img("1521572163474-6864f9cf17ab"), img("1583743814966-8936f5b7be1a")],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [{ name: "Cream", hex: "#F0E9D6" }, { name: "Charcoal", hex: "#36383B" }, { name: "Rust", hex: "#A0431A" }],
    description: "A 280gsm garment-dyed cotton tee with a relaxed, boxy fit.",
    bestseller: true,
  },
  {
    id: "jacket-01",
    name: "Coast Overshirt",
    brand: "Hessian & Co.",
    category: "Apparel",
    price: 215,
    rating: 4.9,
    reviews: 64,
    images: [img("1591047139829-d91aecb6caea"), img("1551488831-00ddcb6c6bd3")],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Pine", hex: "#3A4A3A" }, { name: "Ecru", hex: "#E8DFC9" }],
    description: "A boxy overshirt in brushed cotton twill. Wear open or buttoned.",
    featured: true,
  },
  {
    id: "cap-01",
    name: "Six-Panel Cap",
    brand: "Folded Goods",
    category: "Accessories",
    price: 42,
    rating: 4.3,
    reviews: 188,
    images: [img("1588850561407-ed78c282e89b"), img("1521369909029-2afed882baee")],
    colors: [{ name: "Ecru", hex: "#E8DFC9" }, { name: "Black", hex: "#0E0E0E" }, { name: "Clay", hex: "#C2410C" }],
    description: "An unstructured, washed-cotton cap with a curved brim.",
  },
  {
    id: "wallet-01",
    name: "Bifold Wallet",
    brand: "Hessian & Co.",
    category: "Accessories",
    price: 88,
    rating: 4.6,
    reviews: 54,
    images: [img("1627123424574-724758594e93"), img("1606760227091-3dd870d97f1d")],
    colors: [{ name: "Cognac", hex: "#8B4513" }, { name: "Black", hex: "#0E0E0E" }],
    description: "Slim bifold in vegetable-tanned leather that patinas over time.",
  },
  {
    id: "boot-01",
    name: "Mesa Boot",
    brand: "Hessian & Co.",
    category: "Footwear",
    price: 320,
    rating: 4.8,
    reviews: 128,
    images: [img("1520639888713-7851133b1ed0"), img("1542838132-92c53300491e")],
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: [{ name: "Tan", hex: "#B97A57" }, { name: "Black", hex: "#0E0E0E" }],
    description: "A blake-stitched chukka with a stacked leather heel.",
    bestseller: true,
  },
  {
    id: "scarf-01",
    name: "Wool Scarf",
    brand: "Folded Goods",
    category: "Accessories",
    price: 72,
    rating: 4.5,
    reviews: 39,
    images: [img("1601925260368-ae2f83cf8b7f")],
    colors: [{ name: "Camel", hex: "#C2A074" }, { name: "Navy", hex: "#1A2A44" }],
    description: "A soft, lambswool scarf woven in Scotland.",
  },
  {
    id: "trouser-01",
    name: "Pleated Trouser",
    brand: "Folded Goods",
    category: "Apparel",
    price: 168,
    rating: 4.4,
    reviews: 71,
    images: [img("1624378439575-d8705ad7ae80")],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [{ name: "Stone", hex: "#9B9789" }, { name: "Black", hex: "#0E0E0E" }],
    description: "Single-pleat trouser in wool-blend twill with a tapered leg.",
  },
  {
    id: "crossbody-01",
    name: "Pocket Crossbody",
    brand: "North Cargo",
    category: "Bags",
    price: 128,
    rating: 4.2,
    reviews: 47,
    images: [img("1559563458-527698bf5295")],
    colors: [{ name: "Black", hex: "#0E0E0E" }, { name: "Olive", hex: "#5A6A3A" }],
    description: "A compact crossbody with magnetic closure and adjustable strap.",
  },
];

export const categories = [
  { slug: "footwear", name: "Footwear", image: img("1542291026-7eec264c27ff", 600) },
  { slug: "bags", name: "Bags", image: img("1591561954557-26941169b49e", 600) },
  { slug: "apparel", name: "Apparel", image: img("1591047139829-d91aecb6caea", 600) },
  { slug: "accessories", name: "Accessories", image: img("1588850561407-ed78c282e89b", 600) },
];

export const brands = Array.from(new Set(products.map((p) => p.brand)));

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}
