import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCategories, getFeaturedProducts } from "@/lib/data";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/button";
import { ProductGrid } from "@/components/store/ProductGrid";
import { Icons, type IconName } from "@/components/ui/icons";
import { services } from "@/data/services";
import { HeroMedia } from "@/components/store/HeroMedia";
import { ShowcaseVideo } from "@/components/store/ShowcaseVideo";
import { Reveal } from "@/components/store/Reveal";
import { Certifications } from "@/components/store/Certifications";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: siteConfig.seo.homeTitle,
  description: siteConfig.seo.homeDescription,
  path: "/",
});

export default async function HomePage() {
  const [categories, featured] = await Promise.all([getCategories(), getFeaturedProducts(8)]);

  return (
    <div>
      {/* Hero: full-bleed video behind the transparent header, dark-tinted */}
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <HeroMedia />
        {/* Dark tint over the ENTIRE video so all text (nav + hero) is legible */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/70 via-brand-900/20 to-brand-900/80" />

        <div className="container relative z-10 flex min-h-[88vh] max-w-3xl flex-col justify-center pb-16 pt-40 md:min-h-[92vh] md:pt-48">
          <span className="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
            <Icons.shield className="h-3.5 w-3.5" /> {siteConfig.tagline}
          </span>
          <h1 className="animate-fade-up delay-100 mt-4 text-4xl font-extrabold leading-tight drop-shadow-lg sm:text-5xl md:text-6xl">
            {siteConfig.hero.heading}
          </h1>
          <p className="animate-fade-up delay-200 mt-5 max-w-xl text-lg text-white/90 drop-shadow md:text-xl">
            {siteConfig.hero.subheading}
          </p>
          <div className="animate-fade-up delay-300 mt-8 flex flex-wrap gap-3">
            <ButtonLink href={siteConfig.hero.ctaHref} size="lg" variant="accent" className="shadow-lg transition-transform hover:scale-105">
              {siteConfig.hero.ctaLabel}
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="outline" className="border-white/50 bg-white/10 text-white shadow-lg backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/20">
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

      <Certifications className="border-b bg-gray-50 py-12" />

      {/* SEO-rich intro — visible, readable, keyword-natural */}
      <section className="border-b bg-white py-10">
        <div className="container max-w-3xl text-center">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Genuine Jawed Pumps &amp; Motors — Online Across Pakistan
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
            {siteConfig.legalName} is your official source for{" "}
            <strong>Jawed copper motors</strong>, <strong>monoblock pressure pumps</strong>,{" "}
            <strong>bearing pumps</strong> and matched motor-pump sets. Trusted by homes, farms and
            industry since {siteConfig.seo.foundingDate}, with nationwide delivery, cash on delivery
            and expert support on every water lifting challenge.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-500">Solutions for every water lifting and pressure need</p>
          </div>
          <Link href="/shop" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 12).map((c, i) => (
            <Reveal key={c.id} delay={(i % 6) * 60}>
            <Link
              href={`/category/${c.slug}`}
              className="card-hover group flex h-full flex-col items-center gap-3 rounded-xl border bg-white p-4 text-center"
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
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container py-6 pb-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500">Trusted picks for homes, farms and industry</p>
          </div>
          <Link href="/shop" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all →
          </Link>
        </div>
        <Reveal>
          <ProductGrid products={featured} />
        </Reveal>
      </section>

      {/* Video showcase */}
      {siteConfig.showcase.enabled && siteConfig.showcase.clips.length > 0 && (
        <section className="border-t bg-gray-50">
          <div className="container py-12">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">{siteConfig.showcase.heading}</h2>
              <p className="text-gray-500">{siteConfig.showcase.subheading}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {siteConfig.showcase.clips.map((clip, i) => (
                <Reveal key={clip.title} delay={i * 90}>
                  <ShowcaseVideo clip={clip} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services teaser */}
      <section className="border-t bg-white">
        <div className="container py-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Our Services</h2>
              <p className="text-gray-500">Pump installation at checkout, deep well boring and expert support</p>
            </div>
            <Link href="/services" className="text-sm font-medium text-brand-600 hover:text-brand-700">View all →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="card-hover group flex flex-col overflow-hidden rounded-xl border bg-white"
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
            <h2 className="text-2xl font-bold text-white">Not sure which solution you need?</h2>
            <p className="text-brand-100">Tell us your water challenge. Our experts will recommend the right pump, motor or complete system.</p>
          </div>
          <ButtonLink href="/contact" size="lg" variant="accent" className="shrink-0">
            Talk to an Expert
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
