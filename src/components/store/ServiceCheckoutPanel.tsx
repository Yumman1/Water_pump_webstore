import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import type { Service } from "@/data/services";

/** Sidebar for services that are added on the cart / checkout flow. */
export function ServiceCheckoutPanel({ service }: { service: Service }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-brand-600">
        <Icons.cart className="h-5 w-5" />
        <p className="text-sm font-semibold uppercase tracking-wide">Available at checkout</p>
      </div>
      <h2 className="mt-3 text-lg font-bold text-gray-900">How to add this service</h2>
      <ol className="mt-4 space-y-3 text-sm text-gray-700">
        {(service.checkoutSteps ?? []).map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {i + 1}
            </span>
            <span className="leading-relaxed [&_strong]:font-semibold [&_strong]:text-gray-900">{stepWithBold(step)}</span>
          </li>
        ))}
      </ol>
      <div className="mt-6 space-y-3">
        <ButtonLink href="/shop" size="lg" className="w-full">
          Shop motors &amp; pumps
        </ButtonLink>
        <ButtonLink href="/cart" variant="outline" size="lg" className="w-full">
          Go to cart
        </ButtonLink>
      </div>
      <p className="mt-4 text-xs text-gray-500">
        Need help choosing?{" "}
        <Link href="/contact" className="font-medium text-brand-600 hover:text-brand-700">
          Contact us
        </Link>
        {" "}or call before you order.
      </p>
    </div>
  );
}

/** Turn **bold** markers in step strings into styled spans (no markdown parser needed). */
function stepWithBold(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i}>{part}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
