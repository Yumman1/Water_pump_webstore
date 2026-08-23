import type { AdminCoupon } from "@/lib/admin-coupons";
import { Button } from "@/components/ui/button";

const inputClass =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

export function CouponForm({
  action,
  coupon,
}: {
  action: (formData: FormData) => void;
  coupon?: AdminCoupon | null;
}) {
  const expiresValue = coupon?.expiresAt
    ? new Date(coupon.expiresAt).toISOString().slice(0, 16)
    : "";

  return (
    <form action={action} className="space-y-4 rounded-xl border bg-white p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Code *</label>
        <input
          name="code"
          required
          defaultValue={coupon?.code}
          className={`${inputClass} font-mono uppercase`}
          placeholder="WELCOME10"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Type *</label>
          <select name="type" defaultValue={coupon?.type ?? "PERCENTAGE"} className={inputClass}>
            <option value="PERCENTAGE">Percentage off</option>
            <option value="FIXED">Fixed amount off</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Value *</label>
          <input
            name="value"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={coupon?.value ?? 10}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-gray-400">Percent (e.g. 10) or fixed PKR amount.</p>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Minimum subtotal (PKR)</label>
        <input
          name="minSubtotal"
          type="number"
          min={0}
          step="1"
          defaultValue={coupon?.minSubtotal ?? 0}
          className={inputClass}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Expires (optional)</label>
          <input name="expiresAt" type="datetime-local" defaultValue={expiresValue} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Usage limit (optional)</label>
          <input
            name="usageLimit"
            type="number"
            min={1}
            step="1"
            defaultValue={coupon?.usageLimit ?? ""}
            className={inputClass}
            placeholder="Unlimited"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked={coupon?.active ?? true} className="h-4 w-4" />
        Active (customers can use this code)
      </label>
      <Button type="submit" size="lg">
        {coupon ? "Save Coupon" : "Create Coupon"}
      </Button>
    </form>
  );
}
