import Link from "next/link";
import type { Category, Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { brands } from "@/config/menu";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ProductMediaPreview } from "@/components/admin/ProductMediaPreview";

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
  const specsText = p
    ? Object.entries(p.specs ?? {})
        .filter(([k]) => k.toLowerCase() !== "video")
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")
    : "";
  const brandOptions = brands.map((b) => b.label);
  const brandValue = p?.brand ?? "";
  const brandIsCustom = Boolean(brandValue && !brandOptions.includes(brandValue));
  const isActive = p ? p.active : true;

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
            <textarea
              name="description"
              required
              rows={6}
              defaultValue={p?.description}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </Field>
        </div>

        <div className="space-y-4 rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900">Media & Details</h2>
          {p && <ProductMediaPreview product={p} />}
          <ImageUploadField
            name="images"
            label="Product images"
            hint="One URL per line. First image is the main photo. Products with only a video (e.g. copper motors) use the video as the cover on the shop."
            defaultValue={p?.images.join("\n") ?? ""}
            folder="products"
            multiline
          />
          <Field label="Video URL" hint="Optional looping cover video (shown on cards and product page). Example: /products/my-pump/video.mp4">
            <input name="video" defaultValue={p?.video ?? ""} className={inputClass} placeholder="/products/.../video.mp4" />
          </Field>
          <Field label="Tags" hint="Comma-separated, e.g. monoblock, pressure, 1hp">
            <input name="tags" defaultValue={p?.tags.join(", ")} className={inputClass} />
          </Field>
          <Field label="Specifications" hint="One per line as 'Key: Value', e.g. Power: 1 HP">
            <textarea
              name="specs"
              rows={5}
              defaultValue={specsText}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none"
              placeholder={"Power: 1 HP\nMax Head: 30 m"}
            />
          </Field>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="space-y-4 rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900">Storefront visibility</h2>
          <p className="text-xs text-gray-500">Hidden products stay in admin but do not appear in the shop, category pages, or search.</p>
          <div className="grid gap-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 has-[:checked]:border-green-500 has-[:checked]:bg-green-50">
              <input type="radio" name="active" value="true" defaultChecked={isActive} className="mt-0.5 h-4 w-4" />
              <span>
                <span className="block text-sm font-medium text-gray-900">Visible</span>
                <span className="block text-xs text-gray-500">Show this product on the website</span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 has-[:checked]:border-gray-500 has-[:checked]:bg-gray-50">
              <input type="radio" name="active" value="false" defaultChecked={!isActive} className="mt-0.5 h-4 w-4" />
              <span>
                <span className="block text-sm font-medium text-gray-900">Hidden</span>
                <span className="block text-xs text-gray-500">Keep in catalog but hide from customers</span>
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900">Organization</h2>
          <Field label="Category *">
            <select name="categoryId" required defaultValue={p?.categoryId ?? ""} className={inputClass}>
              <option value="" disabled>
                Select category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Brand" hint="Pick a store brand, or type a custom name below.">
            <select name="brandSelect" defaultValue={brandIsCustom ? "__custom" : brandValue} className={inputClass}>
              <option value="">No brand</option>
              {brandOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
              <option value="__custom">Custom…</option>
            </select>
          </Field>
          <Field label="Custom brand name">
            <input
              name="brandCustom"
              defaultValue={brandIsCustom ? brandValue : ""}
              className={inputClass}
              placeholder="Only used when Brand is Custom"
            />
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
        </div>

        <div className="space-y-4 rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900">Pricing &amp; Sale</h2>
          <Field label="Price *" hint="Use 0 if customers should contact you for price.">
            <input name="price" type="number" step="0.01" required defaultValue={p?.price} className={inputClass} />
          </Field>
          <Field
            label="Original / Compare-at Price"
            hint="Set higher than Price to show a SALE badge. Leave blank for no sale."
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
          <Button type="submit" size="lg" className="flex-1">
            {p ? "Save Changes" : "Create Product"}
          </Button>
          <Link
            href="/admin/products"
            className="inline-flex h-12 items-center rounded-lg border px-4 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
