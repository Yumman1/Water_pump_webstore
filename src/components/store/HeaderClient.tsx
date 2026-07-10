"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { CartIcon } from "./CartIcon";
import { Icons } from "@/components/ui/icons";
import type { Category } from "@/lib/types";
import { siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { usedCategories } from "@/data/used-pumps";
import { categoryGroups, brandGroup } from "@/config/menu";
import { cn } from "@/lib/utils";

type DropItem = { label: string; href: string };

export function HeaderClient({ categories }: { categories: Category[] }) {
  void categories;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const usedItems: DropItem[] = [
    { label: "All Used Pumps", href: "/used-pumps" },
    ...usedCategories.map((c) => ({ label: c.label, href: `/used-pumps/${c.slug}` })),
  ];

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
    setMobileOpen(false);
  }

  const linkClass =
    "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700";
  const caret = (
    <svg className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  // ---- Shop mega-menu (categorized like a pump storefront) ----
  const megaGroups = [...categoryGroups, brandGroup];
  const ShopMega = (
    <div className="group relative">
      <Link href="/shop" className={cn(linkClass, "inline-flex items-center gap-1")}>
        Shop {caret}
      </Link>
      <div className="invisible absolute left-0 top-full z-50 w-screen max-w-5xl pt-1 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="rounded-xl border bg-white p-5 shadow-xl">
          <div className="columns-2 gap-6 md:columns-3 lg:columns-4">
            {megaGroups.map((g) => (
              <div key={g.title} className="mb-5 break-inside-avoid">
                <div className="rounded-md bg-brand-700 px-3 py-1.5 text-sm font-semibold text-white">{g.title}</div>
                <ul className="mt-2 space-y-0.5">
                  {g.items.map((it) => (
                    <li key={it.href}>
                      <Link href={it.href} className="block rounded px-3 py-1 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700">
                        {it.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ---- Used pumps dropdown ----
  const UsedDrop = (
    <div className="group relative">
      <Link href="/used-pumps" className={cn(linkClass, "inline-flex items-center gap-1")}>
        Used Pumps {caret}
      </Link>
      <div className="invisible absolute left-0 top-full z-50 min-w-[220px] pt-1 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="overflow-hidden rounded-lg border bg-white py-1 shadow-lg">
          {usedItems.map((it) => (
            <Link key={it.href} href={it.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700">
              {it.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  // ---- Services dropdown (with image thumbnails) ----
  const ServicesDrop = (
    <div className="group relative">
      <Link href="/services" className={cn(linkClass, "inline-flex items-center gap-1")}>
        Services {caret}
      </Link>
      <div className="invisible absolute left-0 top-full z-50 min-w-[300px] pt-1 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="overflow-hidden rounded-lg border bg-white py-1 shadow-lg">
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="flex items-center gap-3 px-3 py-2 hover:bg-brand-50">
              <span className="relative h-10 w-12 shrink-0 overflow-hidden rounded bg-gray-100">
                <Image src={s.image} alt="" fill sizes="48px" className="object-cover" />
              </span>
              <span className="text-sm font-medium text-gray-700">{s.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  function MobileSection({ id, label, href, items }: { id: string; label: string; href: string; items: DropItem[] }) {
    const open = openSection === id;
    return (
      <div className="border-b last:border-0">
        <div className="flex items-center">
          <Link href={href} onClick={() => setMobileOpen(false)} className="flex-1 px-3 py-2.5 font-medium text-gray-800">
            {label}
          </Link>
          <button onClick={() => setOpenSection(open ? null : id)} className="p-2.5 text-gray-500" aria-label="Expand">
            {open ? <Icons.minus className="h-4 w-4" /> : <Icons.plus className="h-4 w-4" />}
          </button>
        </div>
        {open && (
          <div className="pb-2">
            {items.map((it) => (
              <Link key={it.href} href={it.href} onClick={() => setMobileOpen(false)} className="block rounded-md px-6 py-2 text-sm text-gray-600 hover:bg-gray-100">
                {it.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  const mobileShopItems: DropItem[] = megaGroups.flatMap((g) => [
    { label: `— ${g.title} —`, href: g.items[0]?.href ?? "/shop" },
    ...g.items,
  ]);
  const mobileServiceItems: DropItem[] = services.map((s) => ({ label: s.title, href: `/services/${s.slug}` }));

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center gap-4">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menu"
        >
          {mobileOpen ? <Icons.close /> : <Icons.menu />}
        </button>

        <Logo />

        <form onSubmit={onSearch} className="hidden flex-1 lg:flex">
          <div className="relative mx-auto w-full max-w-md">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pumps, motors, accessories..."
              className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <Icons.search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1">
          <a
            href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 xl:flex"
          >
            <Icons.phone className="h-4 w-4 text-brand-600" />
            {siteConfig.contact.phone}
          </a>
          <CartIcon />
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="hidden border-t bg-white lg:block">
        <div className="container flex items-center gap-1 py-1.5">
          <Link href="/" className={linkClass}>Home</Link>
          {ShopMega}
          <Link href="/deals" className={cn(linkClass, "text-accent hover:text-accent")}>Special Offers</Link>
          {UsedDrop}
          {ServicesDrop}
          <Link href="/about" className={linkClass}>About Us</Link>
          <Link href="/contact" className={linkClass}>Contact Us</Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-white lg:hidden">
          <div className="container py-3">
            <form onSubmit={onSearch} className="mb-3">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none"
                />
                <Icons.search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </form>
            <Link href="/" onClick={() => setMobileOpen(false)} className="block border-b px-3 py-2.5 font-medium text-gray-800">Home</Link>
            <MobileSection id="shop" label="Shop" href="/shop" items={mobileShopItems} />
            <Link href="/deals" onClick={() => setMobileOpen(false)} className="block border-b px-3 py-2.5 font-medium text-accent">Special Offers &amp; Deals</Link>
            <MobileSection id="used" label="Used Pumps" href="/used-pumps" items={usedItems} />
            <MobileSection id="services" label="Services" href="/services" items={mobileServiceItems} />
            <Link href="/about" onClick={() => setMobileOpen(false)} className="block border-b px-3 py-2.5 font-medium text-gray-800">About Us</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 font-medium text-gray-800">Contact Us</Link>
          </div>
        </div>
      )}
    </header>
  );
}
