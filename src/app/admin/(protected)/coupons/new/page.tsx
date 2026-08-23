import Link from "next/link";
import { saveCoupon } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { CouponForm } from "@/components/admin/CouponForm";

export default function NewCouponPage() {
  const action = saveCoupon.bind(null, null);

  return (
    <div className="max-w-xl">
      <PageHeader title="New Coupon" description="Create a promo code for checkout." />
      <CouponForm action={action} />
      <Link href="/admin/coupons" className="mt-4 inline-block text-sm text-gray-500 hover:text-brand-600">
        ← Back to coupons
      </Link>
    </div>
  );
}
