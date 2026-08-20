/**
 * ============================================================================
 *  SHOP MEGA-MENU  -  the categorized dropdown shown under "Shop"
 * ============================================================================
 *  Organised into columns/groups exactly like a pump storefront. Category
 *  items link to /category/[slug]; brand items link to /brand/[slug].
 *
 *  Add / rename / reorder freely. Category slugs must match the categories in
 *  src/data/seed-data.ts (or the categories you create in the admin dashboard).
 */

export type MenuItem = { label: string; href: string };
export type MenuGroup = { title: string; items: MenuItem[] };

// Brands (used both in the mega-menu and for /brand/[slug] pages).
export const brands: { label: string; slug: string }[] = [
  { label: "Jawed", slug: "jawed" },
  { label: "Premium", slug: "premium" },
  { label: "Imported", slug: "imported" },
];

export function getBrandBySlug(slug: string) {
  return brands.find((b) => b.slug === slug);
}

const cat = (label: string, slug: string): MenuItem => ({ label, href: `/category/${slug}` });

// Category groups (also used to build the Shop page sidebar).
export const categoryGroups: MenuGroup[] = [
  {
    title: "Products",
    items: [
      cat("Copper Motors", "copper-motors"),
      cat("Monoblock Pressure Pumps", "monoblock-pressure-pumps"),
      cat("Bearing Pumps", "bearing-pumps"),
      cat("Complete Sets", "complete-sets"),
    ],
  },
];

// The Brands column, rendered alongside the category groups in the mega-menu.
export const brandGroup: MenuGroup = {
  title: "Brands",
  items: brands.map((b) => ({ label: b.label, href: `/brand/${b.slug}` })),
};
