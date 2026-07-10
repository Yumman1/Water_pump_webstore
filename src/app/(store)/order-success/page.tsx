import { Suspense } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

function SuccessContent({ orderNumber }: { orderNumber?: string }) {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-lg rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <Icons.check className="h-9 w-9" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Thank you for your order!</h1>
        <p className="mt-2 text-gray-600">
          Your order has been placed successfully. We&apos;ll contact you shortly to confirm delivery.
        </p>
        {orderNumber && (
          <p className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm">
            Order Number: <span className="font-bold text-gray-900">{orderNumber}</span>
          </p>
        )}
        <p className="mt-4 text-sm text-gray-500">
          Questions? Call us at{" "}
          <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} className="font-medium text-brand-600">
            {siteConfig.contact.phone}
          </a>
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <ButtonLink href="/shop">Continue Shopping</ButtonLink>
          <Link href="/" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  return (
    <Suspense>
      <SuccessContent orderNumber={searchParams.order} />
    </Suspense>
  );
}
