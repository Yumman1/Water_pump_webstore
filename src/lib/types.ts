/** UI-facing types. Both the database and the demo-data fallback normalize to these. */

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  productCount?: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string | null;
  description: string;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  cost: number | null;
  stock: number;
  lowStockThreshold: number;
  weightKg: number | null;
  condition: "NEW" | "USED";
  featured: boolean;
  active: boolean;
  images: string[];
  tags: string[];
  specs: Record<string, string>;
  /** Looping product video shown on cards and the product page when set. */
  video: string | null;
  categoryId: string;
  category?: { id: string; name: string; slug: string } | null;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  /** Still photo for the cart thumb (local cover preferred). */
  image: string;
  /** When set, cart shows this looping cover video instead of a placeholder. */
  video?: string | null;
  quantity: number;
  stock: number;
  underWarranty?: boolean;
};

export type InstallationType = "NONE" | "WARRANTY" | "PAID";

export type ProductQuery = {
  categorySlug?: string;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "name-asc";
  featured?: boolean;
  condition?: "NEW" | "USED";
  brand?: string;
  onSale?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
};
