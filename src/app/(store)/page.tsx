import Link from "next/link";
import Image from "next/image";
import { getCategories, getFeaturedProducts } from "@/lib/data";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { ProductGrid } from "@/components/store/ProductGrid";
import { Icons, type IconName } from "@/components/ui/icons";
import { services } from "@/data/services";

export const revalidate = 60;

export default async function HomePage() {
  const [categories, featured] = await Promise.all([getCategories(), getFeaturedProducts(8)]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <Image
          src={siteConfig.hero.image}
          alt=""
          fill
          priority
          className="object-cover opacity-25"
        />
        <div className="container relative grid gap-6 py-16 md:py-24 lg:w-2/3">
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            {siteConfig.hero.heading}
          </h1>
          <p className="max-w-xl text-lg text-brand-100">{siteConfig.hero.subheading}</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={siteConfig.hero.ctaHref} size="lg" variant="accent">
              {siteConfig.hero.ctaLabel}
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
              Get Expert Advice
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Trust features */}
      <section className="border-b bg-white">
        <div className="container grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {siteConfig.features.map((f) => {
            const Icon = Icons[f.icon as IconName] ?? Icons.check;
            return (
              <div key={f.title} className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Icon />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Categories */}
      <section className="container py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-500">Find the right pump for your needs</p>
          </div>
          <Link href="/shop" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 12).map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border bg-white p-4 text-center transition-shadow hover:shadow-md"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-100">
                {c.image && (
                  <Image src={c.image} alt={c.name} fill sizes="80px" className="object-cover transition-transform group-hover:scale-110" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-400">{c.productCount ?? 0} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container py-6 pb-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500">Our most popular pumps</p>
          </div>
          <Link href="/shop" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all →
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      {/* Services teaser */}
      <section className="border-t bg-white">
        <div className="container py-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Our Services</h2>
              <p className="text-gray-500">Installation, maintenance & complete water solutions</p>
            </div>
            <Link href="/services" className="text-sm font-medium text-brand-600 hover:text-brand-700">View all →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image src={s.image} alt={s.title} fill sizes="(max-width:640px) 50vw, 20vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <span className="p-3 text-center text-sm font-semibold text-gray-800 group-hover:text-brand-700">{s.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-brand-600">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white">Not sure which pump you need?</h2>
            <p className="text-brand-100">Our experts will help you choose the perfect pump for your requirements.</p>
          </div>
          <ButtonLink href="/contact" size="lg" variant="accent" className="shrink-0">
            Talk to an Expert
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
