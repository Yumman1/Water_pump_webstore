/**
 * Storefront data-access layer.
 *
 * When a database is configured (DATABASE_URL set) it reads live data via
 * Prisma. Otherwise, or if the database is temporarily unreachable, it falls
 * back to the bundled demo catalog so the storefront always renders. This is
 * what lets you deploy to Vercel first and connect a database later.
 */
import { prisma, isDbConfigured } from "@/lib/prisma";
import { categories as seedCategories, products as seedProducts } from "@/data/seed-data";
import type { Category, Product, ProductQuery } from "@/lib/types";
import { cleanCopy, cleanSpecs } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Fallback: normalize the bundled seed data into UI shapes.
// ---------------------------------------------------------------------------
function seedCategoryToCategory(c: (typeof seedCategories)[number]): Category {
  return {
    id: `cat-${c.slug}`,
    name: cleanCopy(c.name),
    slug: c.slug,
    description: cleanCopy(c.description),
    image: c.image,
    sortOrder: c.sortOrder,
    productCount: seedProducts.filter((p) => p.categorySlug === c.slug && p.active).length,
  };
}

function resolveVideo(p: { video?: string | null; specs?: Record<string, string> | null }): string | null {
  if (p.video) return p.video;
  const fromSpecs = p.specs?.Video ?? p.specs?.video;
  return fromSpecs || null;
}

function seedProductToProduct(p: (typeof seedProducts)[number]): Product {
  const cat = seedCategories.find((c) => c.slug === p.categorySlug);
  return {
    id: `prod-${p.slug}`,
    name: cleanCopy(p.name),
    slug: p.slug,
    sku: p.sku,
    brand: p.brand ? cleanCopy(p.brand) : p.brand,
    description: cleanCopy(p.description),
    shortDescription: cleanCopy(p.shortDescription),
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? null,
    cost: p.cost ?? null,
    stock: p.stock,
    lowStockThreshold: p.lowStockThreshold,
    weightKg: p.weightKg ?? null,
    condition: p.condition ?? "NEW",
    featured: p.featured,
    active: p.active,
    images: p.images,
    tags: p.tags,
    specs: cleanSpecs(p.specs),
    video: resolveVideo(p),
    categoryId: `cat-${p.categorySlug}`,
    category: cat ? { id: `cat-${cat.slug}`, name: cleanCopy(cat.name), slug: cat.slug } : null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbProductToProduct(p: any): Product {
  const specs = cleanSpecs((p.specs as Record<string, string>) ?? {});
  return {
    id: p.id,
    name: cleanCopy(p.name),
    slug: p.slug,
    sku: p.sku,
    brand: p.brand ? cleanCopy(p.brand) : p.brand,
    description: cleanCopy(p.description),
    shortDescription: p.shortDescription ? cleanCopy(p.shortDescription) : p.shortDescription,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    cost: p.cost,
    stock: p.stock,
    lowStockThreshold: p.lowStockThreshold,
    weightKg: p.weightKg,
    condition: p.condition ?? "NEW",
    featured: p.featured,
    active: p.active,
    images: p.images ?? [],
    tags: p.tags ?? [],
    specs,
    video: resolveVideo({ video: p.video, specs }),
    categoryId: p.categoryId,
    category: p.category
      ? { id: p.category.id, name: cleanCopy(p.category.name), slug: p.category.slug }
      : null,
  };
}

/** Should we attempt the DB, or go straight to demo data? */
async function useDb(): Promise<boolean> {
  return isDbConfigured;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  if (await useDb()) {
    try {
      const cats = await prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { products: { where: { active: true } } } } },
      });
      return cats.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image,
        sortOrder: c.sortOrder,
        productCount: c._count.products,
      }));
    } catch (e) {
      console.warn("[data] getCategories DB error, using demo data:", (e as Error).message);
    }
  }
  return seedCategories.map(seedCategoryToCategory).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const all = await getCategories();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function getProducts(
  query: ProductQuery = {}
): Promise<{ products: Product[]; total: number }> {
  const {
    categorySlug,
    search,
    sort = "newest",
    featured,
    condition,
    brand,
    onSale,
    minPrice,
    maxPrice,
    page = 1,
    pageSize = 12,
  } = query;

  if (await useDb()) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = { active: true };
      if (categorySlug) where.category = { slug: categorySlug };
      if (featured !== undefined) where.featured = featured;
      if (condition) where.condition = condition;
      if (brand) where.brand = { equals: brand, mode: "insensitive" };
      if (onSale) where.compareAtPrice = { not: null };
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { brand: { contains: search, mode: "insensitive" } },
          { tags: { has: search.toLowerCase() } },
        ];
      }
      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
      }

      const orderBy =
        sort === "price-asc"
          ? { price: "asc" as const }
          : sort === "price-desc"
            ? { price: "desc" as const }
            : sort === "name-asc"
              ? { name: "asc" as const }
              : { createdAt: "desc" as const };

      const [rows, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          include: { category: true },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.product.count({ where }),
      ]);
      return { products: rows.map(dbProductToProduct), total };
    } catch (e) {
      console.warn("[data] getProducts DB error, using demo data:", (e as Error).message);
    }
  }

  // Fallback: filter/sort in memory.
  let list = seedProducts.filter((p) => p.active).map(seedProductToProduct);
  if (categorySlug) list = list.filter((p) => p.category?.slug === categorySlug);
  if (featured !== undefined) list = list.filter((p) => p.featured === featured);
  if (condition) list = list.filter((p) => p.condition === condition);
  if (brand) list = list.filter((p) => (p.brand ?? "").toLowerCase() === brand.toLowerCase());
  if (onSale) list = list.filter((p) => p.compareAtPrice != null && p.compareAtPrice > p.price);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.brand ?? "").toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }
  if (minPrice !== undefined) list = list.filter((p) => p.price >= minPrice);
  if (maxPrice !== undefined) list = list.filter((p) => p.price <= maxPrice);

  list.sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const total = list.length;
  const start = (page - 1) * pageSize;
  return { products: list.slice(start, start + pageSize), total };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (await useDb()) {
    try {
      const p = await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
      });
      return p ? dbProductToProduct(p) : null;
    } catch (e) {
      console.warn("[data] getProductBySlug DB error, using demo data:", (e as Error).message);
    }
  }
  const p = seedProducts.find((x) => x.slug === slug);
  return p ? seedProductToProduct(p) : null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const { products } = await getProducts({ featured: true, pageSize: limit });
  return products;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const { products } = await getProducts({
    categorySlug: product.category?.slug,
    condition: product.condition,
    pageSize: limit + 1,
  });
  return products.filter((p) => p.id !== product.id).slice(0, limit);
}

/** Products currently on sale (have a compare-at price higher than price). */
export async function getDealsProducts(limit = 24): Promise<Product[]> {
  const { products } = await getProducts({ onSale: true, pageSize: limit });
  return products.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
}

export async function getAllProductSlugs(): Promise<string[]> {
  if (await useDb()) {
    try {
      const rows = await prisma.product.findMany({ select: { slug: true } });
      return rows.map((r) => r.slug);
    } catch {
      /* fall through */
    }
  }
  return seedProducts.map((p) => p.slug);
}
