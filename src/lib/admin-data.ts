/** Data access for the admin dashboard. Falls back to demo data when no DB. */
import { prisma, isDbConfigured } from "@/lib/prisma";
import { categories as seedCategories, products as seedProducts } from "@/data/seed-data";
import type { Category, Product } from "@/lib/types";
import { cleanCopy, cleanSpecs } from "@/lib/utils";

function seedProductsAsProducts(): Product[] {
  return seedProducts.map((p) => {
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
      video: p.video ?? p.specs.Video ?? p.specs.video ?? null,
      categoryId: `cat-${p.categorySlug}`,
      category: cat ? { id: `cat-${cat.slug}`, name: cleanCopy(cat.name), slug: cat.slug } : null,
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: any): Product {
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
    video: p.video ?? specs.Video ?? specs.video ?? null,
    categoryId: p.categoryId,
    category: p.category ? { id: p.category.id, name: cleanCopy(p.category.name), slug: p.category.slug } : null,
  };
}

export async function getAdminProducts(): Promise<Product[]> {
  if (isDbConfigured) {
    try {
      const rows = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
      });
      return rows.map(mapProduct);
    } catch (e) {
      console.warn("[admin-data] products:", (e as Error).message);
    }
  }
  return seedProductsAsProducts();
}

export async function getAdminProduct(id: string): Promise<Product | null> {
  if (isDbConfigured) {
    try {
      const p = await prisma.product.findUnique({ where: { id }, include: { category: true } });
      return p ? mapProduct(p) : null;
    } catch (e) {
      console.warn("[admin-data] product:", (e as Error).message);
    }
  }
  return seedProductsAsProducts().find((p) => p.id === id) ?? null;
}

export async function getAdminCategories(): Promise<Category[]> {
  if (isDbConfigured) {
    try {
      const rows = await prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { products: true } } },
      });
      return rows.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image,
        sortOrder: c.sortOrder,
        productCount: c._count.products,
      }));
    } catch (e) {
      console.warn("[admin-data] categories:", (e as Error).message);
    }
  }
  return seedCategories.map((c) => ({
    id: `cat-${c.slug}`,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    sortOrder: c.sortOrder,
    productCount: seedProducts.filter((p) => p.categorySlug === c.slug).length,
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAdminOrders(): Promise<any[]> {
  if (isDbConfigured) {
    try {
      return await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { items: true },
      });
    } catch (e) {
      console.warn("[admin-data] orders:", (e as Error).message);
    }
  }
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAdminOrder(id: string): Promise<any | null> {
  if (isDbConfigured) {
    try {
      return await prisma.order.findUnique({ where: { id }, include: { items: true, customer: true } });
    } catch (e) {
      console.warn("[admin-data] order:", (e as Error).message);
    }
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAdminCustomers(): Promise<any[]> {
  if (isDbConfigured) {
    try {
      return await prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { orders: true } }, orders: { select: { total: true } } },
      });
    } catch (e) {
      console.warn("[admin-data] customers:", (e as Error).message);
    }
  }
  return [];
}

export type DashboardStats = {
  revenue: number;
  orderCount: number;
  productCount: number;
  customerCount: number;
  lowStockCount: number;
  pendingOrders: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentOrders: any[];
  topProducts: { name: string; sold: number }[];
  demo: boolean;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  if (isDbConfigured) {
    try {
      const [orders, productCount, customerCount, lowStock, pending, paidAgg, items] =
        await Promise.all([
          prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
          prisma.product.count(),
          prisma.customer.count(),
          prisma.product.count({ where: { stock: { lte: 5 } } }),
          prisma.order.count({ where: { status: "PENDING" } }),
          prisma.order.aggregate({
            _sum: { total: true },
            where: { status: { not: "CANCELLED" } },
          }),
          prisma.orderItem.groupBy({
            by: ["name"],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: "desc" } },
            take: 5,
          }),
        ]);
      const orderCount = await prisma.order.count();
      return {
        revenue: paidAgg._sum.total ?? 0,
        orderCount,
        productCount,
        customerCount,
        lowStockCount: lowStock,
        pendingOrders: pending,
        recentOrders: orders,
        topProducts: items.map((i) => ({ name: i.name, sold: i._sum.quantity ?? 0 })),
        demo: false,
      };
    } catch (e) {
      console.warn("[admin-data] stats:", (e as Error).message);
    }
  }

  // Demo fallback.
  const products = seedProductsAsProducts();
  return {
    revenue: 0,
    orderCount: 0,
    productCount: products.length,
    customerCount: 0,
    lowStockCount: products.filter((p) => p.stock <= p.lowStockThreshold).length,
    pendingOrders: 0,
    recentOrders: [],
    topProducts: products.slice(0, 5).map((p) => ({ name: p.name, sold: 0 })),
    demo: true,
  };
}
