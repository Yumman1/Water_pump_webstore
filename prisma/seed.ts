/**
 * Seeds the database with the demo catalog, an admin user, sample customers,
 * orders and a coupon. Run with:  npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { categories, products } from "../src/data/seed-data";
import { siteConfig } from "../src/config/site";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin1234";

async function main() {
  console.log("🌱 Seeding database...");

  // --- Admin user (canonical credentials) -----------------------------------
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash, role: "ADMIN", name: "Administrator" },
    create: { email: ADMIN_EMAIL, name: "Administrator", passwordHash, role: "ADMIN" },
  });
  console.log(`   ✓ Admin user: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);

  // --- Categories -----------------------------------------------------------
  const categoryIdBySlug = new Map<string, string>();
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        description: c.description,
        image: c.image,
        sortOrder: c.sortOrder,
      },
      create: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image,
        sortOrder: c.sortOrder,
      },
    });
    categoryIdBySlug.set(c.slug, cat.id);
  }
  console.log(`   ✓ ${categories.length} categories`);

  // --- Products -------------------------------------------------------------
  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.categorySlug);
    if (!categoryId) continue;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        sku: p.sku,
        brand: p.brand,
        description: p.description,
        shortDescription: p.shortDescription,
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
        specs: p.specs,
        categoryId,
      },
      create: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        brand: p.brand,
        description: p.description,
        shortDescription: p.shortDescription,
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
        specs: p.specs,
        categoryId,
      },
    });
  }
  console.log(`   ✓ ${products.length} products`);

  // --- Store settings (default) --------------------------------------------
  const promo = siteConfig.promoPopup;
  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {
      promoEnabled: promo.enabled,
      promoBadge: promo.badge ?? null,
      promoHeading: promo.heading,
      promoMessage: promo.message,
      promoCouponCode: promo.couponCode ?? null,
      promoCtaLabel: promo.ctaLabel,
      promoCtaHref: promo.ctaHref,
      promoImage: promo.image,
    },
    create: {
      id: 1,
      ownerNotifyEmail: process.env.OWNER_NOTIFY_EMAIL ?? "jawedmotors@outlook.com",
      ownerNotifyWhatsapp: process.env.OWNER_NOTIFY_WHATSAPP ?? "03053770002",
      shippingFlatRate: 500,
      freeShippingThreshold: 50000,
      installationFee: 10000,
      promoEnabled: promo.enabled,
      promoBadge: promo.badge ?? null,
      promoHeading: promo.heading,
      promoMessage: promo.message,
      promoCouponCode: promo.couponCode ?? null,
      promoCtaLabel: promo.ctaLabel,
      promoCtaHref: promo.ctaHref,
      promoImage: promo.image,
    },
  });
  console.log("   ✓ Store settings");

  for (const [i, c] of siteConfig.delivery.outsideCities.entries()) {
    await prisma.deliveryCity.upsert({
      where: { name: c.name },
      update: { fee: c.fee, sortOrder: i },
      create: { name: c.name, fee: c.fee, sortOrder: i },
    });
  }
  console.log(`   ✓ ${siteConfig.delivery.outsideCities.length} delivery cities`);

  // --- Coupon ---------------------------------------------------------------
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: { code: "WELCOME10", type: "PERCENTAGE", value: 10, minSubtotal: 10000, active: true },
  });
  console.log("   ✓ Coupon WELCOME10 (10% off orders over Rs 10,000)");

  // --- Sample customers & orders (idempotent) ------------------------------
  const sampleCustomers = [
    { name: "Ahmed Khan", email: "ahmed.khan@example.com", phone: "+92 301 1111111", city: "Lahore" },
    { name: "Sara Ali", email: "sara.ali@example.com", phone: "+92 302 2222222", city: "Karachi" },
    { name: "Bilal Hussain", email: "bilal.h@example.com", phone: "+92 303 3333333", city: "Islamabad" },
  ];

  const allProducts = await prisma.product.findMany();
  const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

  let orderSeq = 0;
  let createdOrders = 0;
  for (const c of sampleCustomers) {
    const customer = await prisma.customer.upsert({
      where: { email: c.email },
      update: {},
      create: { ...c, address: "123 Demo Street", country: "Pakistan" },
    });

    // 1-2 orders per customer.
    const orderCount = 1 + (orderSeq % 2);
    for (let o = 0; o < orderCount; o++) {
      orderSeq++;
      const orderNumber = `ORD-DEMO-${String(orderSeq).padStart(4, "0")}`;
      const existing = await prisma.order.findUnique({ where: { orderNumber } });
      if (existing) continue;

      const picks = allProducts
        .slice((orderSeq * 3) % allProducts.length, ((orderSeq * 3) % allProducts.length) + 2)
        .filter(Boolean);
      const items = picks.length ? picks : allProducts.slice(0, 1);
      const subtotal = items.reduce((s, p) => s + p.price, 0);
      const shipping = subtotal >= 50000 ? 0 : 500;
      const total = subtotal + shipping;

      await prisma.order.create({
        data: {
          orderNumber,
          customerName: c.name,
          customerEmail: c.email,
          customerPhone: c.phone,
          address: "123 Demo Street",
          city: c.city,
          country: "Pakistan",
          customerId: customer.id,
          subtotal,
          shipping,
          tax: 0,
          discount: 0,
          total,
          status: statuses[orderSeq % statuses.length],
          paymentMethod: "COD",
          paymentStatus: orderSeq % 2 === 0 ? "PAID" : "UNPAID",
          items: {
            create: items.map((p) => ({
              productId: p.id,
              name: p.name,
              sku: p.sku,
              price: p.price,
              quantity: 1,
            })),
          },
        },
      });
      createdOrders++;
    }
  }
  console.log(`   ✓ ${sampleCustomers.length} customers with ${createdOrders} new demo orders (${orderSeq} total slots)`);

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
