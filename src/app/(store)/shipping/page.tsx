import type { Metadata } from "next";
import { formatCurrency } from "@/lib/format";
import { getPricingConfig } from "@/lib/pricing";

export const metadata: Metadata = { title: "Shipping & Returns" };
export const dynamic = "force-dynamic";

export default async function ShippingPage() {
  const pricing = await getPricingConfig();

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shipping &amp; Returns</h1>
          <p className="mt-2 text-gray-600">Everything you need to know about delivery and returns.</p>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">Shipping</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-600">
            <li>Nationwide delivery across Pakistan.</li>
            <li>Flat shipping rate of {formatCurrency(pricing.shippingFlatRate)} per order.</li>
            <li>Free shipping on orders over {formatCurrency(pricing.freeShippingThreshold)}.</li>
            <li>Orders are typically dispatched within 1–2 business days.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">Returns &amp; Warranty</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-600">
            <li>All products carry the manufacturer&apos;s warranty.</li>
            <li>Damaged or defective items can be reported within 7 days of delivery.</li>
            <li>Contact our support team to initiate a return or warranty claim.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-600">
            <li>Cash on Delivery (COD) available nationwide.</li>
            <li>Bank transfer accepted — details shared after order placement.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
