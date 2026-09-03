import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/data";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatCurrency } from "@/lib/format";
import {
  breadcrumbJsonLd,
  itemListJsonLd,
  localBusinessJsonLd,
  pageMetadata,
  absoluteUrl,
  faqPageJsonLd,
} from "@/lib/seo";

export const revalidate = 60;

const PATH = "/water-pump-price-in-pakistan";

export const metadata: Metadata = pageMetadata({
  title: "Water Pump Price in Pakistan (2026) | Official PKR List | Jawed Pumps",
  description:
    "Current water pump price in Pakistan for copper motors, monoblock pressure pumps, bearing pumps and complete sets. Official Jawed PKR prices with nationwide delivery and cash on delivery.",
  path: PATH,
});

export default async function WaterPumpPriceInPakistanPage() {
  const [categories, { products }] = await Promise.all([
    getCategories(),
    getProducts({ pageSize: 200, sort: "name-asc", condition: "NEW" }),
  ]);

  const priced = products.filter((p) => p.price > 0);
  const minPrice = priced.length ? Math.min(...priced.map((p) => p.price)) : 0;
  const maxPrice = priced.length ? Math.max(...priced.map((p) => p.price)) : 0;

  const byCategory = categories.map((cat) => ({
    category: cat,
    products: priced.filter((p) => p.category?.slug === cat.slug),
  }));

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Water Pump Price in Pakistan", path: PATH },
  ];

  const listItems = priced.map((p) => ({
    name: p.name,
    url: absoluteUrl(`/product/${p.slug}`),
  }));

  const faqs = [
    {
      question: "What is the water pump price in Pakistan?",
      answer: `Water pump price in Pakistan at Jawed Pumps currently ranges from ${formatCurrency(minPrice)} to ${formatCurrency(maxPrice)}, depending on motor HP, pump type and whether you buy a motor, a pump or a complete set. All prices below are in PKR and include genuine warranty.`,
    },
    {
      question: "How much does a 1HP water pump cost in Pakistan?",
      answer:
        "A 1HP Jawed copper motor and matching bearing or monoblock pump is priced individually on this list. Open the 1HP product for the live PKR price, cash on delivery and Karachi installation options.",
    },
    {
      question: "Where can I buy a water pump online in Pakistan?",
      answer:
        "You can buy genuine Jawed water pumps online from jawedpumps.com with nationwide delivery from Karachi and cash on delivery on eligible orders.",
    },
  ];

  return (
    <article className="container py-10">
      <JsonLd
        data={[
          breadcrumbJsonLd(breadcrumbs),
          localBusinessJsonLd(),
          itemListJsonLd(listItems, "Water Pump Price in Pakistan"),
          faqPageJsonLd(faqs),
        ]}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-600">
          Home
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-700">Water Pump Price in Pakistan</span>
      </nav>

      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">Water Pump Price in Pakistan</h1>
        <p className="mt-3 text-gray-600">
          Looking up the <strong>water pump price in Pakistan</strong>? This is the official Jawed Pumps PKR
          list for copper motors, monoblock pressure pumps, bearing (donkey) pumps and complete motor-pump
          sets. Prices are updated from our Karachi store and apply to orders across Pakistan, with cash on
          delivery on eligible checkouts.
        </p>
        <p className="mt-3 text-gray-600">
          Typical water pump price in Pakistan here runs from <strong>{formatCurrency(minPrice)}</strong> to{" "}
          <strong>{formatCurrency(maxPrice)}</strong>. Choose a product below for the latest price, stock and
          delivery options.
        </p>
      </header>

      <div className="mt-10 space-y-12">
        {byCategory.map(({ category, products: catProducts }) =>
          catProducts.length > 0 ? (
            <section key={category.slug} aria-labelledby={`price-${category.slug}`}>
              <h2 id={`price-${category.slug}`} className="text-xl font-bold text-gray-900">
                <Link href={`/category/${category.slug}`} className="hover:text-brand-600">
                  {category.name} prices in Pakistan
                </Link>
              </h2>
              <p className="mt-1 text-sm text-gray-500">{category.description}</p>
              <div className="mt-4 overflow-x-auto rounded-xl border">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="border-b bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Price in Pakistan (PKR)</th>
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
                            Buy {product.name} — {formatCurrency(product.price)}
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

      <section className="mt-12 max-w-3xl" aria-labelledby="price-faqs">
        <h2 id="price-faqs" className="text-xl font-bold text-gray-900">
          Water pump price in Pakistan — FAQs
        </h2>
        <dl className="mt-4 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question}>
              <dt className="font-semibold text-gray-900">{faq.question}</dt>
              <dd className="mt-1 text-gray-600">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

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
