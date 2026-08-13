import { Suspense } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { formatCurrency } from "@/lib/format";
import { getPricingConfig } from "@/lib/pricing";

function installLabel(type?: string) {
  if (type === "WARRANTY") return "Installation & removal under warranty";
  if (type === "PAID") return "Installation & removal without warranty";
  if (type === "NONE") return "No installation & removal";
  return null;
}

async function SuccessContent({
  orderNumber,
  install,
  fee,
  serial,
  total,
}: {
  orderNumber?: string;
  install?: string;
  fee?: string;
  serial?: string;
  total?: string;
}) {
  const pricing = await getPricingConfig();
  const installText = installLabel(install);
  const feeNum = fee != null && fee !== "" ? Number(fee) : null;
  const totalNum = total != null && total !== "" ? Number(total) : null;

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

        {(installText || serial || totalNum != null) && (
          <div className="mt-4 rounded-lg border bg-white px-4 py-3 text-left text-sm text-gray-700">
            <p className="font-semibold text-gray-900">Order slip</p>
            {installText && (
              <p className="mt-2">
                Installation: <span className="font-medium">{installText}</span>
                {feeNum != null && (
                  <>
                    {" "}
                    —{" "}
                    {install === "WARRANTY" ? (
                      <>
                        <span className="text-gray-400 line-through">{formatCurrency(pricing.installationFee)}</span>{" "}
                        {formatCurrency(0)}
                      </>
                    ) : (
                      formatCurrency(feeNum)
                    )}
                  </>
                )}
              </p>
            )}
            {serial && (
              <p className="mt-1">
                Replacement serial: <span className="font-medium">{serial}</span>
              </p>
            )}
            {totalNum != null && !Number.isNaN(totalNum) && (
              <p className="mt-2 font-semibold text-gray-900">Total: {formatCurrency(totalNum)}</p>
            )}
          </div>
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
  searchParams: { order?: string; install?: string; fee?: string; serial?: string; total?: string };
}) {
  return (
    <Suspense>
      <SuccessContent
        orderNumber={searchParams.order}
        install={searchParams.install}
        fee={searchParams.fee}
        serial={searchParams.serial}
        total={searchParams.total}
      />
    </Suspense>
  );
}
