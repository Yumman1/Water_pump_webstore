import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminCoupon } from "@/lib/admin-coupons";
import { saveCoupon } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/ui";
import { CouponForm } from "@/components/admin/CouponForm";

export const dynamic = "force-dynamic";

export default async function EditCouponPage({ params }: { params: { id: string } }) {
  const coupon = await getAdminCoupon(params.id);
  if (!coupon) notFound();

  const action = saveCoupon.bind(null, coupon.id);

  return (
    <div className="max-w-xl">
      <PageHeader title={`Edit ${coupon.code}`} description="Update coupon rules." />
      <CouponForm action={action} coupon={coupon} />
      <Link href="/admin/coupons" className="mt-4 inline-block text-sm text-gray-500 hover:text-brand-600">
        ← Back to coupons
      </Link>
    </div>
  );
}
