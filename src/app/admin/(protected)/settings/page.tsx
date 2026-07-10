import { getStoreSettings } from "@/lib/notify";
import { isDbConfigured } from "@/lib/prisma";
import { saveSettings } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

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

export default async function SettingsPage({ searchParams }: { searchParams: { saved?: string } }) {
  const settings = await getStoreSettings();
  const emailOk = Boolean(process.env.RESEND_API_KEY || process.env.SMTP_HOST);
  const whatsappOk = Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);

  return (
    <div className="max-w-3xl">
      <PageHeader title="Store Settings" description="Order notifications for you and your customers." />

      {searchParams.saved && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          <Icons.check className="h-4 w-4" /> Settings saved.
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

        <Button type="submit" size="lg" disabled={!isDbConfigured}>Save Settings</Button>
        {!isDbConfigured && <p className="mt-2 text-sm text-amber-600">Connect a database to save settings.</p>}
      </form>

      {/* Provider status */}
      <div className="mt-8 space-y-3 rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-gray-900">Delivery channels</h2>
        <p className="text-sm text-gray-500">
          Messages are sent through these providers, configured with environment variables (see README).
          Until connected, messages are logged to the server console.
        </p>
        <ProviderStatus label="Email" ok={emailOk} hint="Set RESEND_API_KEY (recommended) or SMTP_HOST/PORT/USER/PASS." />
        <ProviderStatus label="WhatsApp" ok={whatsappOk} hint="Set WHATSAPP_TOKEN & WHATSAPP_PHONE_NUMBER_ID (Meta WhatsApp Cloud API)." />
      </div>
    </div>
  );
}
