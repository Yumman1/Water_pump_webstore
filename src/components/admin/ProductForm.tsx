import Link from "next/link";
import type { Category, Product } from "@/lib/types";
import { Button } from "@/components/ui/button";

const inputClass =
  "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export function ProductForm({
  action,
  categories,
  product,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  product?: Product | null;
}) {
  const p = product;
  const specsText = p ? Object.entries(p.specs ?? {}).map(([k, v]) => `${k}: ${v}`).join("\n") : "";

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Main */}
      <div className="space-y-6">
        <div className="space-y-4 rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900">General</h2>
          <Field label="Product Name *">
            <input name="name" required defaultValue={p?.name} className={inputClass} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Slug" hint="Leave blank to auto-generate from name.">
              <input name="slug" defaultValue={p?.slug} className={inputClass} placeholder="auto" />
            </Field>
            <Field label="SKU *">
              <input name="sku" required defaultValue={p?.sku} className={inputClass} />
            </Field>
          </div>
          <Field label="Short Description">
            <input name="shortDescription" defaultValue={p?.shortDescription ?? ""} className={inputClass} />
          </Field>
          <Field label="Description *">
            <textarea name="description" required rows={6} defaultValue={p?.description} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" />
          </Field>
        </div>

        <div className="space-y-4 rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900">Media & Details</h2>
          <Field label="Image URLs" hint="One URL per line (or comma-separated). First image is the main photo.">
            <textarea name="images" rows={3} defaultValue={p?.images.join("\n")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" placeholder="https://..." />
          </Field>
          <Field label="Tags" hint="Comma-separated, e.g. solar, irrigation">
            <input name="tags" defaultValue={p?.tags.join(", ")} className={inputClass} />
          </Field>
          <Field label="Specifications" hint="One per line as 'Key: Value', e.g. Power: 1 HP">
            <textarea name="specs" rows={5} defaultValue={specsText} className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none" placeholder={"Power: 1 HP\nMax Head: 30 m"} />
          </Field>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="space-y-4 rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900">Organization</h2>
          <Field label="Category *">
            <select name="categoryId" required defaultValue={p?.categoryId ?? ""} className={inputClass}>
              <option value="" disabled>Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Brand">
            <input name="brand" defaultValue={p?.brand ?? ""} className={inputClass} />
          </Field>
          <Field label="Condition">
            <select name="condition" defaultValue={p?.condition ?? "NEW"} className={inputClass}>
              <option value="NEW">New</option>
              <option value="USED">Used / Refurbished</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={p?.featured} className="h-4 w-4" />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={p ? p.active : true} className="h-4 w-4" />
            Active (visible in store)
          </label>
        </div>

        <div className="space-y-4 rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900">Pricing &amp; Sale</h2>
          <Field label="Price *" hint="The price the customer pays (the sale price if on sale).">
            <input name="price" type="number" step="0.01" required defaultValue={p?.price} className={inputClass} />
          </Field>
          <Field
            label="Original / Compare-at Price"
            hint="🏷️ To put this item ON SALE, set this HIGHER than the price. The old price is struck through and a red SALE badge appears. Leave blank for no sale."
          >
            <input name="compareAtPrice" type="number" step="0.01" defaultValue={p?.compareAtPrice ?? ""} className={inputClass} />
          </Field>
          <Field label="Cost" hint="Your cost (for profit tracking, not shown to customers).">
            <input name="cost" type="number" step="0.01" defaultValue={p?.cost ?? ""} className={inputClass} />
          </Field>
        </div>

        <div className="space-y-4 rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900">Inventory</h2>
          <Field label="Stock Quantity *">
            <input name="stock" type="number" required defaultValue={p?.stock ?? 0} className={inputClass} />
          </Field>
          <Field label="Low Stock Threshold">
            <input name="lowStockThreshold" type="number" defaultValue={p?.lowStockThreshold ?? 5} className={inputClass} />
          </Field>
          <Field label="Weight (kg)">
            <input name="weightKg" type="number" step="0.1" defaultValue={p?.weightKg ?? ""} className={inputClass} />
          </Field>
        </div>

        <div className="flex gap-2">
          <Button type="submit" size="lg" className="flex-1">{p ? "Save Changes" : "Create Product"}</Button>
          <Link href="/admin/products" className="inline-flex h-12 items-center rounded-lg border px-4 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
