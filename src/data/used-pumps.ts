/**
 * USED PUMPS sub-categories. These map onto existing product categories but
 * filter to condition = USED. Add more here if you sell other used types.
 */
export type UsedCategory = {
  slug: string; // used in /used-pumps/[slug]
  label: string;
  categorySlug: string; // maps to a real product category
  description: string;
};

export const usedCategories: UsedCategory[] = [
  {
    slug: "submersible",
    label: "Used Submersible Pumps",
    categorySlug: "submersible-pumps",
    description: "Tested & refurbished submersible pumps for borewells at budget-friendly prices.",
  },
  {
    slug: "centrifugal",
    label: "Used Centrifugal Pumps",
    categorySlug: "centrifugal-pumps",
    description: "Serviced second-hand centrifugal pumps for water transfer and irrigation.",
  },
];

export function getUsedCategory(slug: string): UsedCategory | undefined {
  return usedCategories.find((c) => c.slug === slug);
}
