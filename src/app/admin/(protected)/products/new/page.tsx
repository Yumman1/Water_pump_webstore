import { getAdminCategories } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/ProductForm";
import { saveProduct } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getAdminCategories();
  const action = saveProduct.bind(null, null);

  return (
    <div>
      <PageHeader title="Add Product" description="Create a new product listing." />
      <ProductForm action={action} categories={categories} />
    </div>
  );
}
