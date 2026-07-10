"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { CartIcon } from "./CartIcon";
import { Icons } from "@/components/ui/icons";
import type { Category } from "@/lib/types";
import { siteConfig } from "@/config/site";

export function HeaderClient({ categories }: { categories: Category[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
    setMobileOpen(false);
  }

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

        {/* Desktop search */}
        <form onSubmit={onSearch} className="hidden flex-1 lg:flex">
          <div className="relative mx-auto w-full max-w-xl">
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
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 md:flex"
          >
            <Icons.phone className="h-4 w-4 text-brand-600" />
            {siteConfig.contact.phone}
          </a>
          <CartIcon />
        </div>
      </div>

      {/* Desktop category nav */}
      <nav className="hidden border-t bg-white lg:block">
        <div className="container flex items-center gap-1 overflow-x-auto py-2 text-sm">
          <Link href="/shop" className="whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700">
            All Products
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/about" className="whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700">
            About
          </Link>
          <Link href="/contact" className="whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700">
            Contact
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-white lg:hidden">
          <div className="container space-y-3 py-4">
            <form onSubmit={onSearch}>
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
            <div className="grid gap-1">
              <Link href="/shop" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 font-medium text-gray-800 hover:bg-gray-100">
                All Products
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {c.name}
                </Link>
              ))}
              <Link href="/about" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100">
                About
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100">
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
