import { getStoreSettings } from "@/lib/notify";
import { isDbConfigured } from "@/lib/prisma";
import { saveSettings, savePromoSettings, testNotificationChannels, addDeliveryCity, deleteDeliveryCity } from "@/app/admin/actions";
import { getPromoPopupConfig } from "@/lib/promo";
import { getDeliveryCities } from "@/lib/delivery-cities";
import { siteConfig } from "@/config/site";
import { formatCurrency } from "@/lib/format";
import { getWhatsAppWebhookUrl, isWhatsAppConfigured } from "@/lib/whatsapp";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { TestNotificationsButton } from "@/components/admin/TestNotificationsButton";

export const dynamic = "force-dynamic";

const inputClass = "h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

function ProviderStatus({ label, ok, hint }: { label: string; ok: boolean; hint: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white ${ok ? "bg-green-500" : "bg-gray-300"}`}>
        {ok ? "✓" : ""}
      </span>
      <span>
        <span className="font-medium text-gray-800">{label}: </span>
        <span className={ok ? "text-green-700" : "text-gray-500"}>{ok ? "Connected" : "Not configured"}</span>
        <span className="block text-xs text-gray-400">{hint}</span>
      </span>
    </div>
  );
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { saved?: string; promoSaved?: string; citiesSaved?: string };
}) {
  const settings = await getStoreSettings();
  const promo = await getPromoPopupConfig();
  const deliveryCities = await getDeliveryCities();
  const testNotify = testNotificationChannels;
  const emailOk = Boolean(process.env.RESEND_API_KEY || process.env.SMTP_HOST);
  const whatsappOk = isWhatsAppConfigured();
  const webhookUrl = getWhatsAppWebhookUrl();
  const templatesOk = Boolean(process.env.WHATSAPP_TEMPLATE_ORDER_CONFIRM);
  const uploadOk = Boolean(
    (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  return (
    <div className="max-w-3xl">
      <PageHeader title="Store Settings" description="Order notifications for you and your customers." />

      {searchParams.saved && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          <Icons.check className="h-4 w-4" /> Settings saved.
        </div>
      )}

      {searchParams.citiesSaved && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          <Icons.check className="h-4 w-4" /> Delivery city saved.
        </div>
      )}

      <form action={saveSettings} className="space-y-6">
        <div className="space-y-4 rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900">Notify me of new orders</h2>
          <p className="text-sm text-gray-500">Whenever a customer places an order, we&apos;ll alert you here.</p>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Your email address</label>
            <input name="ownerNotifyEmail" type="email" defaultValue={settings.ownerNotifyEmail ?? ""} placeholder="owner@yourstore.com" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Your WhatsApp number</label>
            <input name="ownerNotifyWhatsapp" defaultValue={settings.ownerNotifyWhatsapp ?? ""} placeholder="+92 3XX XXXXXXX" className={inputClass} />
          </div>
        </div>

        <div className="space-y-4 rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900">Customer order confirmations</h2>
          <p className="text-sm text-gray-500">
            Automatically send a confirmation to the customer (using the email &amp; phone from checkout) when they place an order,
            and again when you dispatch it.
          </p>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="notifyCustomerEmail" defaultChecked={settings.notifyCustomerEmail} className="h-4 w-4" />
            Send confirmation email to customer
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="notifyCustomerWhatsapp" defaultChecked={settings.notifyCustomerWhatsapp} className="h-4 w-4" />
            Send confirmation WhatsApp to customer
          </label>
        </div>

        <div className="space-y-4 rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900">Delivery & installation fees</h2>
          <p className="text-sm text-gray-500">
            These amounts apply on the cart and checkout. Leave delivery at 0 for free shipping always.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Delivery fee (PKR)</label>
              <input
                name="shippingFlatRate"
                type="number"
                min={0}
                step={1}
                required
                defaultValue={settings.shippingFlatRate}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-400">Used for {siteConfig.delivery.serviceCity} orders when the free-delivery threshold is not met.</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Free delivery over (PKR)</label>
              <input
                name="freeShippingThreshold"
                type="number"
                min={0}
                step={1}
                required
                defaultValue={settings.freeShippingThreshold}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-400">Orders at or above this amount get free delivery.</p>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Installation &amp; removal fee (PKR)</label>
              <input
                name="installationFee"
                type="number"
                min={0}
                step={1}
                required
                defaultValue={settings.installationFee}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-400">
                Charged in {siteConfig.delivery.serviceCity} when the customer chooses installation without warranty.
              </p>
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" disabled={!isDbConfigured}>Save Settings</Button>
        {!isDbConfigured && <p className="mt-2 text-sm text-amber-600">Connect a database to save settings.</p>}
      </form>

      <div className="mt-8 space-y-4 rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-gray-900">Delivery cities (outside {siteConfig.delivery.serviceCity})</h2>
        <p className="text-sm text-gray-500">
          Customers pick a city at checkout. {siteConfig.delivery.serviceCity} gets installation options. Other cities
          use these fees (warranty replacements are free delivery).
        </p>
        <p className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-900">
          <strong>{siteConfig.delivery.serviceCity}</strong> is always on checkout for installation and removal. Do not
          add it here.
        </p>
        {deliveryCities.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-2">City</th>
                  <th className="px-4 py-2">Delivery fee</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {deliveryCities.map((c) => (
                  <tr key={c.id ?? c.name}>
                    <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3">{formatCurrency(c.fee)}</td>
                    <td className="px-4 py-3 text-right">
                      {c.id && isDbConfigured ? (
                        <ConfirmButton
                          action={deleteDeliveryCity.bind(null, c.id!)}
                          label="Remove"
                          confirmText={`Remove ${c.name}?`}
                        />
                      ) : (
                        <span className="text-xs text-gray-400">Demo defaults</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No outside cities configured yet.</p>
        )}
        <form action={addDeliveryCity} className="grid gap-3 border-t pt-4 sm:grid-cols-[1fr_160px_auto] sm:items-end">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">City name</label>
            <input name="cityName" required placeholder="Lahore" className={inputClass} disabled={!isDbConfigured} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Delivery fee (PKR)</label>
            <input name="cityFee" type="number" min={0} step={1} required defaultValue={2500} className={inputClass} disabled={!isDbConfigured} />
          </div>
          <Button type="submit" disabled={!isDbConfigured}>Add city</Button>
        </form>
        {!isDbConfigured && <p className="text-sm text-amber-600">Connect a database to manage delivery cities.</p>}
      </div>

      <form action={savePromoSettings} className="mt-8 space-y-6">
        <div className="space-y-4 rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900">Homepage promo popup</h2>
          <p className="text-sm text-gray-500">
            Shown once per visit when customers land on the store. Link a coupon code to checkout.
          </p>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="promoEnabled" defaultChecked={promo.enabled} className="h-4 w-4" />
            Show promo popup on homepage
          </label>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Badge (optional)</label>
            <input name="promoBadge" defaultValue={promo.badge ?? ""} className={inputClass} placeholder="Limited Time Offer" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Heading</label>
            <input name="promoHeading" defaultValue={promo.heading} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="promoMessage"
              rows={3}
              defaultValue={promo.message}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Coupon code</label>
              <input name="promoCouponCode" defaultValue={promo.couponCode ?? ""} className={inputClass} placeholder="WELCOME10" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">CTA button label</label>
              <input name="promoCtaLabel" defaultValue={promo.ctaLabel} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">CTA link</label>
            <input name="promoCtaHref" defaultValue={promo.ctaHref} className={inputClass} placeholder="/deals" />
          </div>
          <ImageUploadField
            name="promoImage"
            label="Popup image"
            hint="Upload or paste a URL. Shown on the left side of the popup on desktop."
            defaultValue={promo.image}
            folder="promo"
          />
        </div>
        <Button type="submit" size="lg" disabled={!isDbConfigured}>
          Save Promo Popup
        </Button>
        {!isDbConfigured && <p className="text-sm text-amber-600">Connect a database to save promo settings.</p>}
      </form>

      {/* Provider status */}
      <div className="mt-8 space-y-3 rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-gray-900">Delivery channels</h2>
        <p className="text-sm text-gray-500">
          Messages are sent through these providers, configured with environment variables (see README).
          Until connected, messages are logged to the server console.
        </p>
        <ProviderStatus label="Email" ok={emailOk} hint="Outlook: SMTP_HOST=smtp.office365.com, SMTP_USER=jawedmotors@outlook.com, SMTP_PASS=app password. See docs/NOTIFICATIONS_SETUP.md." />
        <ProviderStatus label="WhatsApp Business API" ok={whatsappOk} hint="Set WHATSAPP_TOKEN & WHATSAPP_PHONE_NUMBER_ID in Vercel. See docs/NOTIFICATIONS_SETUP.md." />
        <ProviderStatus
          label="WhatsApp message templates"
          ok={templatesOk}
          hint={
            templatesOk
              ? "Approved templates configured — automated order messages will deliver outside the 24h window."
              : "Optional but recommended: set WHATSAPP_TEMPLATE_* env vars after Meta approves your templates."
          }
        />
        <ProviderStatus
          label="Image uploads"
          ok={uploadOk}
          hint="Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. Create a public bucket named store-assets in Supabase Storage."
        />
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-900">WhatsApp Business webhook</h3>
          <p className="mt-1 text-xs text-gray-500">
            Paste this URL in Meta Developer Console → WhatsApp → Configuration → Webhook callback URL.
            Subscribe to <strong>messages</strong>. Set <code className="rounded bg-gray-100 px-1">WHATSAPP_VERIFY_TOKEN</code> in
            Vercel to match your Verify token. Set <code className="rounded bg-gray-100 px-1">WHATSAPP_AUTO_REPLY=true</code> to
            auto-reply when customers message you.
          </p>
          <p className="mt-2 break-all rounded-lg bg-gray-50 px-3 py-2 font-mono text-xs text-gray-800">{webhookUrl}</p>
        </div>
        <div className="border-t pt-4">
          <p className="mb-2 text-sm text-gray-600">
            Sends a test message to <strong>{settings.ownerNotifyEmail || "owner email"}</strong>
            {settings.ownerNotifyWhatsapp ? ` and ${settings.ownerNotifyWhatsapp}` : ""}. Customer order emails
            and WhatsApp always use the address and phone from each order at checkout.
          </p>
          <TestNotificationsButton action={testNotify} disabled={!emailOk && !whatsappOk} />
        </div>
      </div>
    </div>
  );
}
