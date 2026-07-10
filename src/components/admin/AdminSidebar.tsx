"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Icons, type IconName } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/products", label: "Products", icon: "box" },
  { href: "/admin/inventory", label: "Inventory", icon: "chart" },
  { href: "/admin/orders", label: "Orders", icon: "clipboard" },
  { href: "/admin/customers", label: "Customers", icon: "users" },
  { href: "/admin/categories", label: "Categories", icon: "tag" },
];

export function AdminSidebar({ user }: { user: { name?: string | null; email?: string | null } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {NAV.map((item) => {
        const Icon = Icons[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(item.href) ? "bg-brand-600 text-white" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile topbar */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3 lg:hidden">
        <span className="font-bold text-brand-700">{siteConfig.name} Admin</span>
        <button onClick={() => setOpen((o) => !o)} className="rounded-lg p-2 hover:bg-gray-100">
          {open ? <Icons.close /> : <Icons.menu />}
        </button>
      </div>

      {open && (
        <div className="border-b bg-white lg:hidden">
          {nav}
          <div className="p-3">
            <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
              <Icons.logout className="h-5 w-5" /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-white lg:flex">
        <div className="border-b p-4">
          <Link href="/admin" className="text-lg font-bold text-brand-700">{siteConfig.name}</Link>
          <p className="text-xs text-gray-400">Admin Dashboard</p>
        </div>
        {nav}
        <div className="border-t p-3">
          <div className="mb-2 px-3">
            <p className="truncate text-sm font-medium text-gray-900">{user.name ?? "Admin"}</p>
            <p className="truncate text-xs text-gray-400">{user.email}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
            <Icons.logout className="h-5 w-5" /> Sign Out
          </button>
          <Link href="/" className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100">
            ← View Store
          </Link>
        </div>
      </aside>
    </>
  );
}
