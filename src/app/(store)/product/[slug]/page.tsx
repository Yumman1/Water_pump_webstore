import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { ProductDetailClient } from "@/components/store/ProductDetailClient";
import { ProductGrid } from "@/components/store/ProductGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import {
  breadcrumbJsonLd,
  localBusinessJsonLd,
  pageMetadata,
  productJsonLd,
} from "@/lib/seo";
import {
  productImageAlt,
  productPageDescription,
  productPageTitle,
} from "@/lib/seo-content";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };

  return pageMetadata({
    title: productPageTitle(product),
    description: productPageDescription(product),
    path: `/product/${product.slug}`,
    image: product.images[0] ?? product.video ?? siteConfig.seo.ogImage,
  });
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product || !product.active) notFound();

  const related = await getRelatedProducts(product, 4);
  const specs = Object.entries(product.specs ?? {}).filter(
    ([k]) => k.toLowerCase() !== "video"
  );

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    ...(product.category
      ? [{ name: product.category.name, path: `/category/${product.category.slug}` }]
      : []),
    { name: product.name, path: `/product/${product.slug}` },
  ];

  const imageAlts = product.images.map((_, i) => productImageAlt(product, i));

  return (
    <article className="container py-8">
      <JsonLd
        data={[productJsonLd(product), breadcrumbJsonLd(breadcrumbs), localBusinessJsonLd()]}
      />

      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-600">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-600">
          Shop
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/category/${product.category.slug}`} className="hover:text-brand-600">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <ProductDetailClient product={product} imageAlts={imageAlts} />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section>
          <h2 className="text-lg font-bold text-gray-900">Description</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-600">{product.description}</p>
        </section>
        {specs.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900">Specifications</h2>
            <table className="mt-3 w-full overflow-hidden rounded-lg border text-sm">
              <caption className="sr-only">{product.name} specifications</caption>
              <tbody>
                {specs.map(([k, v], i) => (
                  <tr key={k} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                    <th scope="row" className="w-1/2 border-r px-4 py-2 text-left font-medium text-gray-600">
                      {k}
                    </th>
                    <td className="px-4 py-2 text-gray-900">{String(v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-14" aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-6 text-xl font-bold text-gray-900">
            Related Products
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </article>
  );
}
