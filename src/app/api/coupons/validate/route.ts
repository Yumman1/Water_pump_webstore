import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, isDbConfigured } from "@/lib/prisma";

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().nonnegative(),
});

/** Preview whether a coupon applies for the given cart subtotal. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid coupon request" }, { status: 400 });
  }

  if (!isDbConfigured) {
    return NextResponse.json({ error: "Coupons require a connected database." }, { status: 503 });
  }

  const code = parsed.data.code.trim().toUpperCase();
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (
    !coupon ||
    !coupon.active ||
    parsed.data.subtotal < coupon.minSubtotal ||
    (coupon.expiresAt && coupon.expiresAt <= new Date()) ||
    (coupon.usageLimit != null && coupon.usageCount >= coupon.usageLimit)
  ) {
    return NextResponse.json(
      { error: "This coupon is invalid or does not apply to your order." },
      { status: 400 }
    );
  }

  const discount =
    coupon.type === "PERCENTAGE"
      ? Math.round((parsed.data.subtotal * coupon.value) / 100)
      : coupon.value;

  return NextResponse.json({
    code: coupon.code,
    discount,
    type: coupon.type,
    value: coupon.value,
    minSubtotal: coupon.minSubtotal,
  });
}
