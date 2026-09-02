import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/data";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatCurrency } from "@/lib/format";
import { breadcrumbJsonLd, itemListJsonLd, localBusinessJsonLd, pageMetadata, absoluteUrl } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Jawed Water Pump Price List | Javed Motor Pump Prices Karachi",
  description:
    "Official Jawed Engineering Pumps price list for copper motors, monoblock pumps, bearing pumps and complete sets. Updated PKR prices with nationwide delivery from Karachi, Pakistan.",
  path: "/prices/jawed-water-pump-price-list",
});

export default async function PriceListPage() {
  const [categories, { products }] = await Promise.all([
    getCategories(),
    getProducts({ pageSize: 200, sort: "name-asc", condition: "NEW" }),
  ]);

  const byCategory = categories.map((cat) => ({
    category: cat,
    products: products.filter((p) => p.category?.slug === cat.slug),
  }));

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Price List", path: "/prices/jawed-water-pump-price-list" },
  ];

  const listItems = products.map((p) => ({
    name: p.name,
    url: absoluteUrl(`/product/${p.slug}`),
  }));

  return (
    <article className="container py-10">
      <JsonLd
        data={[
          breadcrumbJsonLd(breadcrumbs),
          localBusinessJsonLd(),
          itemListJsonLd(listItems, "Jawed Water Pump Price List"),
        ]}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-600">
          Home
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-700">Price List</span>
      </nav>

      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">Jawed Water Pump Price List</h1>
        <p className="mt-3 text-gray-600">
          Official PKR prices for Jawed Engineering Pumps — copper winding motors, monoblock pressure pumps,
          bearing (donkey) pumps and matched motor-pump sets. Javed water pump quality with delivery across
          Karachi and Pakistan.
        </p>
      </header>

      <div className="mt-10 space-y-12">
        {byCategory.map(({ category, products: catProducts }) =>
          catProducts.length > 0 ? (
            <section key={category.slug} aria-labelledby={`price-${category.slug}`}>
              <h2 id={`price-${category.slug}`} className="text-xl font-bold text-gray-900">
                <Link href={`/category/${category.slug}`} className="hover:text-brand-600">
                  {category.name}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-gray-500">{category.description}</p>
              <div className="mt-4 overflow-x-auto rounded-xl border">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="border-b bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Price (PKR)</th>
                      <th className="px-4 py-3 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {catProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                        <td className="px-4 py-3 text-gray-500">{product.sku}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(product.price)}</td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/product/${product.slug}`}
                            className="font-medium text-brand-600 hover:text-brand-700"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null
        )}
      </div>

      <aside className="mt-12 rounded-xl border bg-brand-50/60 p-6 text-sm text-brand-900">
        <h2 className="font-semibold">Need help choosing?</h2>
        <p className="mt-2">
          Prices include genuine Jawed warranty. For installation in Karachi or delivery to other cities,{" "}
          <Link href="/contact" className="font-medium underline hover:text-brand-700">
            contact our team
          </Link>{" "}
          or browse the{" "}
          <Link href="/shop" className="font-medium underline hover:text-brand-700">
            full shop
          </Link>
          .
        </p>
      </aside>
    </article>
  );
}
