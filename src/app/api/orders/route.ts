import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, isDbConfigured } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { generateOrderNumber } from "@/lib/utils";
import { notifyNewOrder } from "@/lib/notify";
import { products as seedProducts } from "@/data/seed-data";
import { getPricingConfig } from "@/lib/pricing";
import { getDeliveryCities } from "@/lib/delivery-cities";
import { computeCheckoutTotals, isServiceCity } from "@/lib/delivery";

const orderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(6),
  address: z.string().min(3),
  city: z.string().min(2),
  notes: z.string().optional(),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER"]).default("COD"),
  couponCode: z.string().optional(),
  installationType: z.enum(["NONE", "WARRANTY", "PAID"]).default("NONE"),
  replacementSerial: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        underWarranty: z.boolean().optional().default(false),
      })
    )
    .min(1),
});

/** Simple in-memory rate limit for guest checkout (per serverless isolate). */
const orderHits = new Map<string, { count: number; resetAt: number }>();
const ORDER_RATE_LIMIT = 8;
const ORDER_RATE_WINDOW_MS = 60_000;

function clientKey(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function allowOrder(req: Request): boolean {
  const key = clientKey(req);
  const now = Date.now();
  const row = orderHits.get(key);
  if (!row || row.resetAt < now) {
    orderHits.set(key, { count: 1, resetAt: now + ORDER_RATE_WINDOW_MS });
    return true;
  }
  if (row.count >= ORDER_RATE_LIMIT) return false;
  row.count += 1;
  return true;
}

export async function POST(req: Request) {
  if (!allowOrder(req)) {
    return NextResponse.json(
      { error: "Too many orders from this network. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }
  const data = parsed.data;
  const pricing = await getPricingConfig();
  const deliveryCities = await getDeliveryCities();

  if (!isServiceCity(data.city, siteConfig.delivery.serviceCity) && data.installationType === "PAID") {
    return NextResponse.json(
      { error: `Installation and removal is only available in ${siteConfig.delivery.serviceCity}.` },
      { status: 400 }
    );
  }

  if (data.installationType === "WARRANTY" && !data.replacementSerial?.trim()) {
    return NextResponse.json(
      { error: "Serial number is required for warranty claims." },
      { status: 400 }
    );
  }

  const isWarrantyCheckout = data.installationType === "WARRANTY";

  // --- Demo mode: no database configured -----------------------------------
  if (!isDbConfigured) {
    const orderNumber = generateOrderNumber();
    const demoItems = data.items.map((i) => {
      const p = seedProducts.find((sp) => `prod-${sp.slug}` === i.productId);
      const listPrice = p?.price ?? 0;
      const underWarranty = isWarrantyCheckout || !!i.underWarranty;
      const price = underWarranty ? 0 : listPrice;
      return {
        name: p?.name ?? "Item",
        quantity: i.quantity,
        price,
        listPrice,
        underWarranty,
      };
    });
    const subtotal = demoItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const totals = computeCheckoutTotals({
      city: data.city,
      productsSubtotal: subtotal,
      installationType: data.installationType,
      pricing,
      deliveryCities,
    });
    const installationType = totals.effectiveInstallationType;
    const installationFee = totals.installationFee;
    const shipping = totals.shipping;
    const replacementSerial =
      installationType === "WARRANTY" ? data.replacementSerial?.trim() ?? null : null;
    const tax = Math.round(totals.productsCharge * siteConfig.taxRate);
    const total = Math.max(0, totals.productsCharge) + shipping + tax + installationFee;

    await notifyNewOrder({
      orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      address: data.address,
      city: data.city,
      total,
      paymentMethod: data.paymentMethod,
      installationType,
      installationFee,
      replacementSerial,
      items: demoItems,
    });

    return NextResponse.json({
      orderNumber,
      demo: true,
      installationType,
      installationFee,
      replacementSerial,
      total,
      message:
        "Order received (demo mode). Connect a database to persist orders and manage inventory.",
    });
  }

  try {    /** Resolve legacy demo cart IDs (`prod-{slug}`) to live DB products. */
    async function resolveProductId(productId: string): Promise<string> {
      if (!productId.startsWith("prod-")) return productId;
      const slug = productId.slice("prod-".length);
      const bySlug = await prisma.product.findUnique({ where: { slug } });
      if (!bySlug) throw new Error(`Product "${slug}" is no longer available.`);
      return bySlug.id;
    }

    const resolvedItems = await Promise.all(
      data.items.map(async (i) => ({
        ...i,
        productId: await resolveProductId(i.productId),
      }))
    );

    const productIds = resolvedItems.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "One or more products are unavailable." }, { status: 400 });
    }

    const lineItems = resolvedItems.map((i) => {
      const p = products.find((x) => x.id === i.productId)!;
      if (p.stock < i.quantity) {
        throw new Error(`Insufficient stock for ${p.name}.`);
      }
      const underWarranty = isWarrantyCheckout || !!i.underWarranty;
      const listPrice = p.price;
      const price = underWarranty ? 0 : p.price;
      return {
        product: p,
        quantity: i.quantity,
        underWarranty,
        listPrice,
        price,
        lineTotal: price * i.quantity,
      };
    });

    const subtotal = lineItems.reduce((s, l) => s + l.lineTotal, 0);

    let discount = 0;
    let appliedCoupon: string | undefined;
    if (data.couponCode && !isWarrantyCheckout) {
      const coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode.toUpperCase() } });
      if (
        coupon &&
        coupon.active &&
        subtotal >= coupon.minSubtotal &&
        (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
        (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit)
      ) {
        discount = coupon.type === "PERCENTAGE" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
        appliedCoupon = coupon.code;
      }
    }

    const productsSubtotal = Math.max(0, subtotal - discount);
    const totals = computeCheckoutTotals({
      city: data.city,
      productsSubtotal,
      installationType: data.installationType,
      pricing,
      deliveryCities,
    });
    const installationType = totals.effectiveInstallationType;
    const installationFee = totals.installationFee;
    const shipping = totals.shipping;
    const replacementSerial =
      installationType === "WARRANTY" ? data.replacementSerial?.trim() ?? null : null;
    const tax = Math.round(totals.productsCharge * siteConfig.taxRate);
    const total = totals.productsCharge + shipping + tax + installationFee;
    const orderNumber = generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: { email: data.customerEmail.toLowerCase() },
        update: { name: data.customerName, phone: data.customerPhone, address: data.address, city: data.city },
        create: {
          name: data.customerName,
          email: data.customerEmail.toLowerCase(),
          phone: data.customerPhone,
          address: data.address,
          city: data.city,
        },
      });

      const created = await tx.order.create({
        data: {
          orderNumber,
          customerName: data.customerName,
          customerEmail: data.customerEmail.toLowerCase(),
          customerPhone: data.customerPhone,
          address: data.address,
          city: data.city,
          notes: data.notes,
          customerId: customer.id,
          subtotal,
          shipping,
          tax,
          discount,
          total,
          paymentMethod: data.paymentMethod,
          couponCode: appliedCoupon,
          installationType,
          installationFee,
          replacementSerial,
          items: {
            create: lineItems.map((l) => ({
              productId: l.product.id,
              name: l.product.name,
              sku: l.product.sku,
              price: l.price,
              listPrice: l.listPrice,
              quantity: l.quantity,
              underWarranty: l.underWarranty,
            })),
          },
        },
      });

      for (const l of lineItems) {
        const newStock = l.product.stock - l.quantity;
        await tx.product.update({ where: { id: l.product.id }, data: { stock: newStock } });
        await tx.inventoryLog.create({
          data: {
            productId: l.product.id,
            change: -l.quantity,
            reason: `Order ${orderNumber}`,
            newStock,
          },
        });
      }

      if (appliedCoupon) {
        await tx.coupon.update({ where: { code: appliedCoupon }, data: { usageCount: { increment: 1 } } });
      }

      return created;
    });

    try {
      await notifyNewOrder({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        address: order.address,
        city: order.city,
        total: order.total,
        paymentMethod: order.paymentMethod,
        installationType,
        installationFee,
        replacementSerial,
        items: lineItems.map((l) => ({
          name: l.product.name,
          quantity: l.quantity,
          price: l.price,
          listPrice: l.listPrice,
          underWarranty: l.underWarranty,
        })),
      });
    } catch (e) {
      console.warn("[orders] notification failed:", (e as Error).message);
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      id: order.id,
      installationType,
      installationFee,
      replacementSerial,
      total: order.total,
    });
  } catch (e) {
    console.error("[orders] create failed:", e);
    return NextResponse.json(
      { error: (e as Error).message ?? "Could not place order. Please try again." },
      { status: 400 }
    );
  }
}
