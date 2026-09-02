import Link from "next/link";
import { getCategories } from "@/lib/data";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/ui/icons";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

export async function SiteFooter() {
  const categories = await getCategories();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t bg-gray-900 text-gray-300">
      <div className="container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="[&_img]:h-10 [&_img]:max-w-[180px] sm:[&_img]:h-11 sm:[&_img]:max-w-[220px]" />
          <p className="mt-3 text-sm leading-relaxed text-gray-400">{siteConfig.description}</p>
          <SocialLinks variant="footer" />
        </div>

        <div>
          <h4 className="font-semibold text-white">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/shop" className="text-gray-400 hover:text-white">All Products</Link></li>
            {categories.slice(0, 4).map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} className="text-gray-400 hover:text-white">{c.name}</Link>
              </li>
            ))}
            <li><Link href="/deals" className="text-gray-400 hover:text-white">Special Offers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Company</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/services" className="text-gray-400 hover:text-white">Services</Link></li>
            <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            <li><Link href="/shipping" className="text-gray-400 hover:text-white">Shipping & Returns</Link></li>
            <li><Link href="/admin" className="text-gray-400 hover:text-white">Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Get in touch</h4>
          <ul className="mt-3 space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <Icons.phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} className="hover:text-white">{siteConfig.contact.phone}</a>
            </li>
            <li className="flex items-start gap-2">
              <Icons.whatsapp className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
              <span>{siteConfig.contact.whatsapp}</span>
            </li>
            <li>
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white">
                {siteConfig.contact.email}
              </a>
            </li>
            <li>{siteConfig.contact.address}</li>
            <li>{siteConfig.contact.manufacturing}</li>
            <li>{siteConfig.contact.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-sm text-gray-500 sm:flex-row">
          <p>© {year} {siteConfig.legalName}. All rights reserved.</p>
          <p>Cash on Delivery • Nationwide Shipping</p>
        </div>
      </div>
    </footer>
  );
}
