import { notFound } from "next/navigation";
import { getAdminCategories, getAdminProduct } from "@/lib/admin-data";
import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/ProductForm";
import { saveProduct } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    getAdminProduct(params.id),
    getAdminCategories(),
  ]);
  if (!product) notFound();

  const action = saveProduct.bind(null, product.id);

  return (
    <div>
      <PageHeader title="Edit Product" description={product.name} />
      <ProductForm action={action} categories={categories} product={product} />
    </div>
  );
}
