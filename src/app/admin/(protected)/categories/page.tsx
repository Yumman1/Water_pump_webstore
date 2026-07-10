import Image from "next/image";
import { getAdminCategories } from "@/lib/admin-data";
import { saveCategory, deleteCategory } from "@/app/admin/actions";
import { PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export const dynamic = "force-dynamic";

const inputClass = "h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-brand-500 focus:outline-none";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();
  const createAction = saveCategory.bind(null, null);

  return (
    <div>
      <PageHeader title="Categories" description={`${categories.length} categories.`} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* List */}
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {c.image && <Image src={c.image} alt="" fill sizes="40px" className="object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-400">/{c.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.productCount ?? 0}</td>
                  <td className="px-4 py-3 text-gray-500">{c.sortOrder}</td>
                  <td className="px-4 py-3 text-right">
                    <ConfirmButton
                      action={deleteCategory.bind(null, c.id)}
                      iconOnly
                      confirmText={`Delete "${c.name}"? Products in it will also be removed.`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create */}
        <form action={createAction} className="h-fit space-y-4 rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-gray-900">Add Category</h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Name *</label>
            <input name="name" required className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Slug</label>
            <input name="slug" placeholder="auto" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Image URL</label>
            <input name="image" className={inputClass} placeholder="https://..." />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Sort Order</label>
            <input name="sortOrder" type="number" defaultValue={categories.length + 1} className={inputClass} />
          </div>
          <Button type="submit" className="w-full">Add Category</Button>
        </form>
      </div>
    </div>
  );
}
