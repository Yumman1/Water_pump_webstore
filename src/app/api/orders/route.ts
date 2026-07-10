import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, isDbConfigured } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { generateOrderNumber } from "@/lib/utils";

const orderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(6),
  address: z.string().min(3),
  city: z.string().min(2),
  notes: z.string().optional(),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER"]).default("COD"),
  couponCode: z.string().optional(),
  items: z
    .array(z.object({ productId: z.string(), quantity: z.number().int().positive() }))
    .min(1),
});

export async function POST(req: Request) {
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

  // --- Demo mode: no database configured -----------------------------------
  if (!isDbConfigured) {
    return NextResponse.json({
      orderNumber: generateOrderNumber(),
      demo: true,
      message:
        "Order received (demo mode). Connect a database to persist orders and manage inventory.",
    });
  }

  try {
    // Load real products & validate stock.
    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "One or more products are unavailable." }, { status: 400 });
    }

    const lineItems = data.items.map((i) => {
      const p = products.find((x) => x.id === i.productId)!;
      if (p.stock < i.quantity) {
        throw new Error(`Insufficient stock for ${p.name}.`);
      }
      return { product: p, quantity: i.quantity, lineTotal: p.price * i.quantity };
    });

    const subtotal = lineItems.reduce((s, l) => s + l.lineTotal, 0);

    // Optional coupon.
    let discount = 0;
    let appliedCoupon: string | undefined;
    if (data.couponCode) {
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

    const shipping = subtotal >= siteConfig.shipping.freeShippingThreshold ? 0 : siteConfig.shipping.flatRate;
    const tax = Math.round(subtotal * siteConfig.taxRate);
    const total = Math.max(0, subtotal - discount) + shipping + tax;
    const orderNumber = generateOrderNumber();

    // Create order + decrement stock atomically.
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
          items: {
            create: lineItems.map((l) => ({
              productId: l.product.id,
              name: l.product.name,
              sku: l.product.sku,
              price: l.product.price,
              quantity: l.quantity,
            })),
          },
        },
      });

      // Decrement stock + log inventory movement.
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

    return NextResponse.json({ orderNumber: order.orderNumber, id: order.id });
  } catch (e) {
    console.error("[orders] create failed:", e);
    return NextResponse.json(
      { error: (e as Error).message ?? "Could not place order. Please try again." },
      { status: 400 }
    );
  }
}
