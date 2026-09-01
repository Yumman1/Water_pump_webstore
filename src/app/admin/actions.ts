"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma, isDbConfigured } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";
import { notifyDispatch, notifyCancellation, getStoreSettings, sendEmail, sendWhatsApp } from "@/lib/notify";
import { siteConfig } from "@/config/site";

async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("Not authenticated.");
  if (!isDbConfigured) {
    throw new Error("No database connected. Set DATABASE_URL and run migrations to enable editing.");
  }
}

function revalidateStoreCatalog() {
  revalidateTag("products");
  revalidateTag("categories");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/shop/browse");
}

function str(fd: FormData, key: string): string {
  return (fd.get(key) as string | null)?.trim() ?? "";
}
function num(fd: FormData, key: string): number {
  const v = parseFloat(str(fd, key));
  return Number.isFinite(v) ? v : 0;
}
function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on" || fd.get(key) === "true";
}

/** Parse "Key: Value" lines into an object. */
function parseSpecs(raw: string): Record<string, string> {
  const specs: Record<string, string> = {};
  raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((line) => {
      const idx = line.indexOf(":");
      if (idx > 0) specs[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    });
  return specs;
}

function parseList(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export async function saveProduct(id: string | null, fd: FormData) {
  await requireAdmin();
  const name = str(fd, "name");
  const slug = str(fd, "slug") || slugify(name);

  const brandSelect = str(fd, "brandSelect");
  const brandCustom = str(fd, "brandCustom");
  const brand =
    brandSelect === "__custom"
      ? brandCustom || null
      : brandSelect || null;

  const specs = parseSpecs(str(fd, "specs"));
  // Dedicated video field is stored in specs so no schema migration is required.
  delete specs.Video;
  delete specs.video;
  const video = str(fd, "video");
  if (video) specs.Video = video;

  const data = {
    name,
    slug,
    sku: str(fd, "sku"),
    brand,
    description: str(fd, "description"),
    shortDescription: str(fd, "shortDescription") || null,
    price: num(fd, "price"),
    compareAtPrice: str(fd, "compareAtPrice") ? num(fd, "compareAtPrice") : null,
    cost: str(fd, "cost") ? num(fd, "cost") : null,
    stock: Math.round(num(fd, "stock")),
    lowStockThreshold: Math.round(num(fd, "lowStockThreshold")) || 5,
    weightKg: str(fd, "weightKg") ? num(fd, "weightKg") : null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    condition: (str(fd, "condition") === "USED" ? "USED" : "NEW") as any,
    featured: bool(fd, "featured"),
    active: str(fd, "active") !== "false",
    images: parseList(str(fd, "images")),
    tags: parseList(str(fd, "tags")),
    specs,
    categoryId: str(fd, "categoryId"),
  };

  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    await prisma.product.create({ data });
  }
  revalidatePath("/admin/products");
  revalidateStoreCatalog();
  revalidatePath(`/product/${slug}`);
  redirect("/admin/products");
}

export async function toggleProductActive(id: string) {
  await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Product not found.");
  await prisma.product.update({
    where: { id },
    data: { active: !product.active },
  });
  revalidatePath("/admin/products");
  revalidateStoreCatalog();
  revalidatePath(`/product/${product.slug}`);
}

export async function toggleProductFeatured(id: string) {
  await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Product not found.");
  await prisma.product.update({
    where: { id },
    data: { featured: !product.featured },
  });
  revalidatePath("/admin/products");
  revalidateStoreCatalog();
  revalidatePath(`/product/${product.slug}`);
}

export async function updateProductTags(id: string, tagsRaw: string) {
  await requireAdmin();
  const product = await prisma.product.update({
    where: { id },
    data: { tags: parseList(tagsRaw) },
  });
  revalidatePath("/admin/products");
  revalidateStoreCatalog();
  revalidatePath(`/product/${product.slug}`);
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidateStoreCatalog();
}

export async function adjustStock(productId: string, change: number, reason: string) {
  await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found.");
  const newStock = Math.max(0, product.stock + change);
  await prisma.product.update({ where: { id: productId }, data: { stock: newStock } });
  await prisma.inventoryLog.create({
    data: { productId, change, reason: reason || "Manual adjustment", newStock },
  });
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  revalidateStoreCatalog();
}

export async function setStock(productId: string, newStock: number, reason: string) {
  await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found.");
  const target = Math.max(0, Math.round(newStock));
  const change = target - product.stock;
  await prisma.product.update({ where: { id: productId }, data: { stock: target } });
  await prisma.inventoryLog.create({
    data: { productId, change, reason: reason || "Stock set", newStock: target },
  });
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  revalidateStoreCatalog();
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
export async function updateOrder(id: string, fd: FormData) {
  await requireAdmin();
  await prisma.order.update({
    where: { id },
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: str(fd, "status") as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paymentStatus: str(fd, "paymentStatus") as any,
    },
  });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

/** Mark an order as dispatched (SHIPPED) and notify the customer. */
export async function dispatchOrder(id: string) {
  await requireAdmin();
  const order = await prisma.order.update({
    where: { id },
    data: { status: "SHIPPED" },
    include: { items: true },
  });
  try {
    await notifyDispatch({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      address: order.address,
      city: order.city,
      total: order.total,
      paymentMethod: order.paymentMethod,
      items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
    });
  } catch (e) {
    console.warn("[dispatch] notification failed:", (e as Error).message);
  }
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

function orderNotifyPayload(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  total: number;
  paymentMethod: string;
  installationType?: string | null;
  installationFee?: number | null;
  replacementSerial?: string | null;
  items: {
    name: string;
    quantity: number;
    price: number;
    listPrice?: number | null;
    underWarranty?: boolean;
  }[];
}) {
  return {
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    address: order.address,
    city: order.city,
    total: order.total,
    paymentMethod: order.paymentMethod,
    installationType: order.installationType,
    installationFee: order.installationFee,
    replacementSerial: order.replacementSerial,
    items: order.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      price: i.price,
      listPrice: i.listPrice,
      underWarranty: i.underWarranty,
    })),
  };
}

/** Cancel an order, restore stock, and notify the customer. */
export async function cancelOrder(id: string) {
  await requireAdmin();
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) throw new Error("Order not found.");
  if (order.status === "CANCELLED") throw new Error("This order is already cancelled.");

  await prisma.$transaction(async (tx) => {
    await tx.order.update({ where: { id }, data: { status: "CANCELLED" } });
    for (const item of order.items) {
      if (!item.productId) continue;
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product) continue;
      const newStock = product.stock + item.quantity;
      await tx.product.update({ where: { id: item.productId }, data: { stock: newStock } });
      await tx.inventoryLog.create({
        data: {
          productId: item.productId,
          change: item.quantity,
          reason: `Cancelled order ${order.orderNumber}`,
          newStock,
        },
      });
    }
  });

  try {
    await notifyCancellation(orderNotifyPayload(order));
  } catch (e) {
    console.warn("[cancel] notification failed:", (e as Error).message);
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/inventory");
}

/** Permanently delete an order record (does not send notifications). */
export async function deleteOrder(id: string) {
  await requireAdmin();
  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  redirect("/admin/orders");
}

/** Send a test email + WhatsApp to owner contacts (Admin → Settings). */
export async function testNotificationChannels() {
  await requireAdmin();
  const settings = await getStoreSettings();
  const email = settings.ownerNotifyEmail;
  const phone = settings.ownerNotifyWhatsapp;
  if (!email && !phone) {
    throw new Error("Set owner email or WhatsApp in Settings first.");
  }

  const tasks: Promise<void>[] = [];
  if (email) {
    tasks.push(
      sendEmail({
        to: email,
        subject: "Test: Jawed Pumps notifications are working",
        html: `<p>If you received this, email is configured correctly for order alerts and customer cancellations.</p>`,
      })
    );
  }
  if (phone) {
    tasks.push(
      sendWhatsApp({
        to: phone,
        text: `✅ Test from ${siteConfig.name}: WhatsApp notifications are configured. Customer order updates will go to the phone number on each order.`,
      })
    );
  }
  await Promise.allSettled(tasks);
  revalidatePath("/admin/settings");
}

// ---------------------------------------------------------------------------
// Store settings (notification email / WhatsApp)
// ---------------------------------------------------------------------------
export async function saveSettings(fd: FormData) {
  await requireAdmin();
  const data = {
    ownerNotifyEmail: str(fd, "ownerNotifyEmail") || null,
    ownerNotifyWhatsapp: str(fd, "ownerNotifyWhatsapp") || null,
    notifyCustomerEmail: bool(fd, "notifyCustomerEmail"),
    notifyCustomerWhatsapp: bool(fd, "notifyCustomerWhatsapp"),
    shippingFlatRate: Math.max(0, num(fd, "shippingFlatRate")),
    freeShippingThreshold: Math.max(0, num(fd, "freeShippingThreshold")),
    installationFee: Math.max(0, num(fd, "installationFee")),
  };
  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/shipping");
  revalidatePath("/api/pricing");
  redirect("/admin/settings?saved=1");
}

export async function addDeliveryCity(fd: FormData) {
  await requireAdmin();
  const name = str(fd, "cityName");
  const fee = Math.max(0, num(fd, "cityFee"));
  if (!name) throw new Error("City name is required.");
  if (name.trim().toLowerCase() === siteConfig.delivery.serviceCity.trim().toLowerCase()) {
    throw new Error(`${siteConfig.delivery.serviceCity} is the installation service city and is always on checkout.`);
  }
  await prisma.deliveryCity.upsert({
    where: { name: name.trim() },
    update: { fee },
    create: { name: name.trim(), fee },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/checkout");
  revalidatePath("/api/pricing");
  redirect("/admin/settings?citiesSaved=1");
}

export async function deleteDeliveryCity(id: string) {
  await requireAdmin();
  await prisma.deliveryCity.delete({ where: { id } });
  revalidatePath("/admin/settings");
  revalidatePath("/checkout");
  revalidatePath("/api/pricing");
}

export async function savePromoSettings(fd: FormData) {
  await requireAdmin();
  const data = {
    promoEnabled: bool(fd, "promoEnabled"),
    promoBadge: str(fd, "promoBadge") || null,
    promoHeading: str(fd, "promoHeading") || null,
    promoMessage: str(fd, "promoMessage") || null,
    promoCouponCode: str(fd, "promoCouponCode") || null,
    promoCtaLabel: str(fd, "promoCtaLabel") || null,
    promoCtaHref: str(fd, "promoCtaHref") || null,
    promoImage: str(fd, "promoImage") || null,
  };
  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });
  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?promoSaved=1");
}

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------
export async function saveCoupon(id: string | null, fd: FormData) {
  await requireAdmin();
  const code = str(fd, "code").toUpperCase();
  const type = str(fd, "type") === "FIXED" ? "FIXED" : "PERCENTAGE";
  const expiresRaw = str(fd, "expiresAt");
  const usageLimitRaw = str(fd, "usageLimit");

  const data = {
    code,
    type: type as "PERCENTAGE" | "FIXED",
    value: num(fd, "value"),
    minSubtotal: Math.max(0, num(fd, "minSubtotal")),
    active: bool(fd, "active"),
    expiresAt: expiresRaw ? new Date(expiresRaw) : null,
    usageLimit: usageLimitRaw ? Math.round(num(fd, "usageLimit")) : null,
  };

  if (id) {
    await prisma.coupon.update({ where: { id }, data });
  } else {
    await prisma.coupon.create({ data });
  }
  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function toggleCouponActive(id: string) {
  await requireAdmin();
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) throw new Error("Coupon not found.");
  await prisma.coupon.update({ where: { id }, data: { active: !coupon.active } });
  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(id: string) {
  await requireAdmin();
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/coupons");
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export async function saveCategory(id: string | null, fd: FormData) {
  await requireAdmin();
  const name = str(fd, "name");
  const data = {
    name,
    slug: str(fd, "slug") || slugify(name),
    description: str(fd, "description") || null,
    image: str(fd, "image") || null,
    sortOrder: Math.round(num(fd, "sortOrder")),
  };
  if (id) {
    await prisma.category.update({ where: { id }, data });
  } else {
    await prisma.category.create({ data });
  }
  revalidatePath("/admin/categories");
  revalidateStoreCatalog();
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidateStoreCatalog();
}
