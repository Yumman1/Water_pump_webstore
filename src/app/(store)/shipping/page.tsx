import type { Metadata } from "next";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { getPricingConfig } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Shipping & Returns | Jawed Pumps Pakistan",
  description:
    "Nationwide delivery on Jawed pumps and motors across Pakistan. Free shipping on large orders, cash on delivery available.",
  path: "/shipping",
});
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
            <li>Orders are typically dispatched within 1 to 2 business days.</li>
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
            <li>Bank transfer accepted. Details shared after order placement.</li>
          </ul>
        </section>

        <section className="rounded-xl border bg-gray-50 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Related pages</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="font-medium text-brand-600 hover:text-brand-700">
                Browse all Jawed pumps and motors
              </Link>
            </li>
            <li>
              <Link href="/water-pump-price-in-pakistan" className="font-medium text-brand-600 hover:text-brand-700">
                Water pump price in Pakistan
              </Link>
            </li>
            <li>
              <Link href="/contact" className="font-medium text-brand-600 hover:text-brand-700">
                Contact support for delivery questions
              </Link>
            </li>
            <li>
              <Link href="/services/pump-installation-removal" className="font-medium text-brand-600 hover:text-brand-700">
                Pump installation &amp; removal (Karachi)
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
