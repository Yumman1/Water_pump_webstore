/**
 * ============================================================================
 *  SHOP MEGA-MENU  —  the categorized dropdown shown under "Shop"
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
  { label: "Hyundai", slug: "hyundai" },
  { label: "Taifu", slug: "taifu" },
  { label: "Happy", slug: "happy" },
  { label: "Espa", slug: "espa" },
  { label: "LEO", slug: "leo" },
  { label: "ASTRO", slug: "astro" },
  { label: "PUMPCO", slug: "pumpco" },
  { label: "Ingco", slug: "ingco" },
  { label: "Pedrollo", slug: "pedrollo" },
  { label: "Leverage", slug: "leverage" },
  { label: "K.E Pioneer", slug: "ke-pioneer" },
  { label: "Ocean Pumps", slug: "ocean-pumps" },
  { label: "Shahzad Pumps", slug: "shahzad-pumps" },
];

export function getBrandBySlug(slug: string) {
  return brands.find((b) => b.slug === slug);
}

const cat = (label: string, slug: string): MenuItem => ({ label, href: `/category/${slug}` });

// Category groups (also used to build the Shop page sidebar).
export const categoryGroups: MenuGroup[] = [
  {
    title: "Water Pumps",
    items: [
      cat("Centrifugal Pumps", "centrifugal-pumps"),
      cat("Circulating Pumps", "circulating-pumps"),
      cat("Solar Pumps", "solar-pumps"),
      cat("Pressure Pumps", "pressure-pumps"),
      cat("Self-Priming Pumps", "self-priming-pumps"),
      cat("Submersible Pumps and Motors", "submersible-pumps"),
      cat("Submersible Sewage Pumps", "submersible-sewage-pumps"),
      cat("High Pressure Washers", "high-pressure-washers"),
      cat("Swimming Pool Pumps", "swimming-pool-pumps"),
      cat("Chemical Dosing Pumps", "chemical-dosing-pumps"),
      cat("Fountain Pumps", "fountain-pumps"),
      cat("Gear Pumps", "gear-pumps"),
    ],
  },
  {
    title: "Pressure & Expansion Tanks",
    items: [cat("Pressure Tanks", "pressure-tanks")],
  },
  {
    title: "Seals",
    items: [cat("Pump Seals", "pump-seals"), cat("Mechanical Seals", "mechanical-seals")],
  },
  {
    title: "Pump Control Switches",
    items: [
      cat("Pressure Switches", "pressure-switches"),
      cat("Float Switches", "float-switches"),
      cat("Automatic Pump Control Switch", "automatic-pump-control-switch"),
      cat("Pressure Drives", "pressure-drives"),
    ],
  },
  {
    title: "Motors",
    items: [cat("Induction Motors", "induction-motors"), cat("Submersible Motors", "submersible-motors")],
  },
  {
    title: "Accessories",
    items: [cat("Pump Accessories", "pump-accessories")],
  },
];

// The Brands column, rendered alongside the category groups in the mega-menu.
export const brandGroup: MenuGroup = {
  title: "Brands",
  items: brands.map((b) => ({ label: b.label, href: `/brand/${b.slug}` })),
};
