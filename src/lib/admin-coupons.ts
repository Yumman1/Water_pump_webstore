import { prisma, isDbConfigured } from "@/lib/prisma";

export type AdminCoupon = {
  id: string;
  code: string;
  type: string;
  value: number;
  minSubtotal: number;
  active: boolean;
  expiresAt: Date | null;
  usageLimit: number | null;
  usageCount: number;
};

export async function getAdminCoupons(): Promise<AdminCoupon[]> {
  if (!isDbConfigured) return [];
  try {
    return await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export async function getAdminCoupon(id: string): Promise<AdminCoupon | null> {
  if (!isDbConfigured) return null;
  try {
    return await prisma.coupon.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export async function getPromoSettingsForAdmin() {
  if (!isDbConfigured) return null;
  try {
    return await prisma.storeSettings.findUnique({ where: { id: 1 } });
  } catch {
    return null;
  }
}
