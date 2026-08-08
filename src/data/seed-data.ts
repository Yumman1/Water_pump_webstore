/**
 * ============================================================================
 *  JAWED PRODUCT CATALOG
 * ============================================================================
 *  Single source of truth for the storefront catalog. Used to seed the database
 *  (`npm run db:seed`) AND as a read-only fallback so the storefront renders
 *  without a database.
 *
 *  Category slugs here must match the ones referenced in src/config/menu.ts.
 *  Product `brand` values should match a brand in src/config/menu.ts to appear
 *  on that brand's page.
 */

export type SeedCategory = {
  name: string;
  slug: string;
  description: string;
  image: string;
  sortOrder: number;
};

export type SeedProduct = {
  name: string;
  slug: string;
  sku: string;
  brand: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  stock: number;
  lowStockThreshold: number;
  weightKg?: number;
  condition?: "NEW" | "USED";
  featured: boolean;
  active: boolean;
  images: string[];
  tags: string[];
  specs: Record<string, string>;
};

const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/800`;

const PRICE_NOTE =
  "Contact us for the current price — rates may vary with stock and configuration.";

export const categories: SeedCategory[] = [
  {
    name: "Copper Motors",
    slug: "copper-motors",
    description: "100% copper winding motors for reliable pump duty — light to full-load heavy duty.",
    image: img("cat-copper-motors"),
    sortOrder: 1,
  },
  {
    name: "Monoblock Pressure Pumps",
    slug: "monoblock-pressure-pumps",
    description: "Jawed and Premium monoblock pressure pumps for homes, farms and light commercial use.",
    image: img("cat-monoblock"),
    sortOrder: 2,
  },
  {
    name: "Bearing Pumps",
    slug: "bearing-pumps",
    description: "Steel-plate bearing pumps across GD models — Jawed and Premium lines.",
    image: img("cat-bearing"),
    sortOrder: 3,
  },
  {
    name: "Complete Sets",
    slug: "complete-sets",
    description: "Matched copper motor + bearing pump sets ready for installation.",
    image: img("cat-complete-sets"),
    sortOrder: 4,
  },
];

type ProductInput = {
  name: string;
  slug: string;
  sku: string;
  brand: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  featured?: boolean;
  tags: string[];
  specs: Record<string, string>;
  imageSeed: string;
  stock?: number;
};

function product(p: ProductInput): SeedProduct {
  return {
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    brand: p.brand,
    categorySlug: p.categorySlug,
    shortDescription: p.shortDescription,
    description: `${p.description}\n\n${PRICE_NOTE}`,
    price: 0,
    stock: p.stock ?? 20,
    lowStockThreshold: 3,
    featured: p.featured ?? false,
    active: true,
    images: [img(p.imageSeed), img(`${p.imageSeed}-b`)],
    tags: p.tags,
    specs: p.specs,
  };
}

export const products: SeedProduct[] = [
  // --- Copper Motors ---
  product({
    name: "0.5HP Copper Motor",
    slug: "0-5hp-copper-motor",
    sku: "JW-CM-05",
    brand: "Jawed",
    categorySlug: "copper-motors",
    shortDescription: "0.5HP copper winding motor for light pump duty.",
    description:
      "Compact 0.5HP copper motor built for everyday water-pump applications. Copper winding delivers efficient running and long service life when paired with a matching bearing or monoblock pump.",
    featured: true,
    tags: ["copper", "motor", "0.5hp"],
    specs: { Power: "0.5 HP", Winding: "100% Copper", Brand: "Jawed", Warranty: "As per dealer policy" },
    imageSeed: "cm-05",
  }),
  product({
    name: "1HP J Copper Motor",
    slug: "1hp-j-copper-motor",
    sku: "JW-CM-1J",
    brand: "Jawed",
    categorySlug: "copper-motors",
    shortDescription: "1HP J-series copper motor for standard pump sets.",
    description:
      "1HP J copper motor suited to common bearing-pump combinations (GD45000, GD7000, GD22000 and similar). Solid copper winding for dependable duty cycles.",
    featured: true,
    tags: ["copper", "motor", "1hp", "j-series"],
    specs: { Power: "1 HP", Series: "J", Winding: "100% Copper", Brand: "Jawed", Warranty: "As per dealer policy" },
    imageSeed: "cm-1j",
  }),
  product({
    name: "1HP S Copper Motor Heavy Duty",
    slug: "1hp-s-copper-motor-heavy-duty",
    sku: "JW-CM-1S",
    brand: "Jawed",
    categorySlug: "copper-motors",
    shortDescription: "1HP S-series heavy-duty copper motor.",
    description:
      "Heavy-duty 1HP S copper motor for tougher pumping loads. Ideal pairing with GD25000 / GD26000 class bearing pumps where continuous or demanding duty is expected.",
    tags: ["copper", "motor", "1hp", "s-series", "heavy-duty"],
    specs: {
      Power: "1 HP",
      Series: "S",
      Duty: "Heavy Duty",
      Winding: "100% Copper",
      Brand: "Jawed",
      Warranty: "As per dealer policy",
    },
    imageSeed: "cm-1s",
  }),
  product({
    name: "1HP Full Load Heavy Duty Copper Motor",
    slug: "1hp-full-load-heavy-duty-copper-motor",
    sku: "JW-CM-1FL",
    brand: "Jawed",
    categorySlug: "copper-motors",
    shortDescription: "1HP full-load heavy-duty copper motor for high-demand sets.",
    description:
      "Full-load heavy-duty 1HP copper motor engineered for pairing with 2HP class bearing pumps (GD50000). Built for sustained load and professional installations.",
    featured: true,
    tags: ["copper", "motor", "1hp", "full-load", "heavy-duty"],
    specs: {
      Power: "1 HP",
      Duty: "Full Load Heavy Duty",
      Winding: "100% Copper",
      Brand: "Jawed",
      Warranty: "As per dealer policy",
    },
    imageSeed: "cm-1fl",
  }),

  // --- Monoblock Pressure Pumps ---
  product({
    name: "0.5HP Monoblock Pressure Pump Jawed",
    slug: "0-5hp-monoblock-pressure-pump-jawed",
    sku: "JW-MB-05",
    brand: "Jawed",
    categorySlug: "monoblock-pressure-pumps",
    shortDescription: "0.5HP Jawed monoblock pressure pump for home boosting.",
    description:
      "Compact Jawed 0.5HP monoblock pressure pump for residential pressure boosting — showers, taps and rooftop tanks.",
    featured: true,
    tags: ["monoblock", "pressure", "0.5hp", "jawed"],
    specs: { Power: "0.5 HP", Type: "Monoblock Pressure Pump", Brand: "Jawed", Warranty: "As per dealer policy" },
    imageSeed: "mb-jw-05",
  }),
  product({
    name: "1HP Monoblock Pressure Pump Jawed",
    slug: "1hp-monoblock-pressure-pump-jawed",
    sku: "JW-MB-1",
    brand: "Jawed",
    categorySlug: "monoblock-pressure-pumps",
    shortDescription: "1HP Jawed monoblock pressure pump for homes and small farms.",
    description:
      "1HP Jawed monoblock pressure pump delivering stronger flow and head for larger homes, gardens and light commercial pressure needs.",
    tags: ["monoblock", "pressure", "1hp", "jawed"],
    specs: { Power: "1 HP", Type: "Monoblock Pressure Pump", Brand: "Jawed", Warranty: "As per dealer policy" },
    imageSeed: "mb-jw-1",
  }),
  product({
    name: "2HP Monoblock Pressure Pump Jawed (Steel Impeller)",
    slug: "2hp-monoblock-pressure-pump-jawed-steel-impeller",
    sku: "JW-MB-2",
    brand: "Jawed",
    categorySlug: "monoblock-pressure-pumps",
    shortDescription: "2HP Jawed monoblock with steel impeller for heavy pressure duty.",
    description:
      "2HP Jawed monoblock pressure pump fitted with a steel impeller for durability under higher pressure and abrasive duty compared with standard plastic impellers.",
    featured: true,
    tags: ["monoblock", "pressure", "2hp", "jawed", "steel-impeller"],
    specs: {
      Power: "2 HP",
      Type: "Monoblock Pressure Pump",
      Impeller: "Steel",
      Brand: "Jawed",
      Warranty: "As per dealer policy",
    },
    imageSeed: "mb-jw-2",
  }),
  product({
    name: "0.5HP Monoblock Pressure Pump Premium",
    slug: "0-5hp-monoblock-pressure-pump-premium",
    sku: "PR-MB-05",
    brand: "Premium",
    categorySlug: "monoblock-pressure-pumps",
    shortDescription: "0.5HP Premium monoblock pressure pump.",
    description:
      "Premium-line 0.5HP monoblock pressure pump for residential boosting where higher finish and performance are preferred.",
    tags: ["monoblock", "pressure", "0.5hp", "premium"],
    specs: { Power: "0.5 HP", Type: "Monoblock Pressure Pump", Brand: "Premium", Warranty: "As per dealer policy" },
    imageSeed: "mb-pr-05",
  }),
  product({
    name: "1HP Monoblock Pressure Pump Premium",
    slug: "1hp-monoblock-pressure-pump-premium",
    sku: "PR-MB-1",
    brand: "Premium",
    categorySlug: "monoblock-pressure-pumps",
    shortDescription: "1HP Premium monoblock pressure pump.",
    description:
      "Premium 1HP monoblock pressure pump for stronger domestic and light commercial pressure boosting.",
    tags: ["monoblock", "pressure", "1hp", "premium"],
    specs: { Power: "1 HP", Type: "Monoblock Pressure Pump", Brand: "Premium", Warranty: "As per dealer policy" },
    imageSeed: "mb-pr-1",
  }),

  // --- Bearing Pumps ---
  product({
    name: "2HP Bearing Pump Premium GD50000 (Steel Plate)",
    slug: "2hp-bearing-pump-premium-gd50000",
    sku: "PR-BP-GD50",
    brand: "Premium",
    categorySlug: "bearing-pumps",
    shortDescription: "2HP Premium GD50000 bearing pump with steel plate.",
    description:
      "Premium GD50000 2HP bearing pump with steel-plate construction. High-capacity unit typically paired with a full-load heavy-duty copper motor.",
    featured: true,
    tags: ["bearing", "2hp", "gd50000", "premium", "steel-plate"],
    specs: {
      Power: "2 HP",
      Model: "GD50000",
      Construction: "Steel Plate",
      Brand: "Premium",
      Warranty: "As per dealer policy",
    },
    imageSeed: "bp-pr-gd50",
  }),
  product({
    name: "2HP Bearing Pump Jawed GD50000 (Steel Plate)",
    slug: "2hp-bearing-pump-jawed-gd50000",
    sku: "JW-BP-GD50",
    brand: "Jawed",
    categorySlug: "bearing-pumps",
    shortDescription: "2HP Jawed GD50000 bearing pump with steel plate.",
    description:
      "Jawed GD50000 2HP bearing pump with steel-plate body for heavy agricultural and industrial water transfer when matched with a full-load motor.",
    featured: true,
    tags: ["bearing", "2hp", "gd50000", "jawed", "steel-plate"],
    specs: {
      Power: "2 HP",
      Model: "GD50000",
      Construction: "Steel Plate",
      Brand: "Jawed",
      Warranty: "As per dealer policy",
    },
    imageSeed: "bp-jw-gd50",
  }),
  product({
    name: "1HP Bearing Pump GD25000 (Steel Plate)",
    slug: "1hp-bearing-pump-gd25000",
    sku: "JW-BP-GD25",
    brand: "Jawed",
    categorySlug: "bearing-pumps",
    shortDescription: "1HP GD25000 steel-plate bearing pump.",
    description:
      "GD25000 1HP bearing pump with steel-plate construction. Commonly paired with the 1HP S copper motor for a balanced heavy-duty set.",
    tags: ["bearing", "1hp", "gd25000", "steel-plate"],
    specs: {
      Power: "1 HP",
      Model: "GD25000",
      Construction: "Steel Plate",
      Brand: "Jawed",
      Warranty: "As per dealer policy",
    },
    imageSeed: "bp-gd25",
  }),
  product({
    name: "1HP Bearing Pump GD26000 (Steel Plate)",
    slug: "1hp-bearing-pump-gd26000",
    sku: "JW-BP-GD26",
    brand: "Jawed",
    categorySlug: "bearing-pumps",
    shortDescription: "1HP GD26000 steel-plate bearing pump.",
    description:
      "GD26000 1HP bearing pump with steel-plate construction — a strong match for the 1HP S copper motor set.",
    tags: ["bearing", "1hp", "gd26000", "steel-plate"],
    specs: {
      Power: "1 HP",
      Model: "GD26000",
      Construction: "Steel Plate",
      Brand: "Jawed",
      Warranty: "As per dealer policy",
    },
    imageSeed: "bp-gd26",
  }),
  product({
    name: "1HP Bearing Pump GD22000 (Steel Plate)",
    slug: "1hp-bearing-pump-gd22000",
    sku: "JW-BP-GD22",
    brand: "Jawed",
    categorySlug: "bearing-pumps",
    shortDescription: "1HP GD22000 steel-plate bearing pump.",
    description:
      "GD22000 1HP bearing pump with steel-plate construction. Popular pairing with the 1HP J copper motor.",
    tags: ["bearing", "1hp", "gd22000", "steel-plate"],
    specs: {
      Power: "1 HP",
      Model: "GD22000",
      Construction: "Steel Plate",
      Brand: "Jawed",
      Warranty: "As per dealer policy",
    },
    imageSeed: "bp-gd22",
  }),
  product({
    name: "1HP Bearing Pump GD7000 (Steel Plate)",
    slug: "1hp-bearing-pump-gd7000",
    sku: "JW-BP-GD7",
    brand: "Jawed",
    categorySlug: "bearing-pumps",
    shortDescription: "1HP GD7000 steel-plate bearing pump.",
    description:
      "GD7000 1HP bearing pump with steel-plate construction for everyday agricultural and domestic pumping sets.",
    tags: ["bearing", "1hp", "gd7000", "steel-plate"],
    specs: {
      Power: "1 HP",
      Model: "GD7000",
      Construction: "Steel Plate",
      Brand: "Jawed",
      Warranty: "As per dealer policy",
    },
    imageSeed: "bp-gd7",
  }),
  product({
    name: "1HP Bearing Cut-Size Pump GD45000",
    slug: "1hp-bearing-cut-size-pump-gd45000",
    sku: "JW-BP-GD45",
    brand: "Jawed",
    categorySlug: "bearing-pumps",
    shortDescription: "1HP cut-size GD45000 bearing pump.",
    description:
      "Cut-size GD45000 1HP bearing pump — compact footprint for installations where space is limited, typically matched with a 1HP J copper motor.",
    tags: ["bearing", "1hp", "gd45000", "cut-size"],
    specs: {
      Power: "1 HP",
      Model: "GD45000",
      Type: "Cut-Size",
      Brand: "Jawed",
      Warranty: "As per dealer policy",
    },
    imageSeed: "bp-gd45",
  }),
  product({
    name: "0.5HP / Inchi Bearing Jawed Pump",
    slug: "0-5hp-inchi-bearing-jawed-pump",
    sku: "JW-BP-INCHI-05",
    brand: "Jawed",
    categorySlug: "bearing-pumps",
    shortDescription: "0.5HP Inchi Jawed bearing pump.",
    description:
      "0.5HP / Inchi Jawed bearing pump for lighter duty sets — pairs with the 0.5HP copper motor as a complete package.",
    tags: ["bearing", "0.5hp", "inchi", "jawed"],
    specs: {
      Power: "0.5 HP",
      Type: "Inchi Bearing",
      Brand: "Jawed",
      Warranty: "As per dealer policy",
    },
    imageSeed: "bp-inchi-05",
  }),

  // --- Complete Sets ---
  product({
    name: "0.5HP Copper Motor + 0.5HP Inchi Bearing Jawed Pump Set",
    slug: "set-0-5hp-copper-inchi-bearing",
    sku: "JW-SET-05",
    brand: "Jawed",
    categorySlug: "complete-sets",
    shortDescription: "Matched 0.5HP motor + Inchi bearing pump set.",
    description:
      "Complete Jawed set: 0.5HP copper motor paired with the 0.5HP / Inchi Jawed bearing pump — ready for light domestic or small farm installations.",
    featured: true,
    tags: ["set", "0.5hp", "copper", "bearing", "jawed"],
    specs: {
      Motor: "0.5HP Copper Motor",
      Pump: "0.5HP / Inchi Bearing Jawed Pump",
      Brand: "Jawed",
      Warranty: "As per dealer policy",
    },
    imageSeed: "set-05",
  }),
  product({
    name: "1HP J Copper Motor + GD45000 Bearing Pump Set",
    slug: "set-1hp-j-gd45000",
    sku: "JW-SET-1J-GD45",
    brand: "Jawed",
    categorySlug: "complete-sets",
    shortDescription: "1HP J motor with cut-size GD45000 bearing pump.",
    description:
      "Complete set combining the 1HP J copper motor with the GD45000 cut-size bearing pump for a compact, efficient package.",
    tags: ["set", "1hp", "gd45000", "jawed"],
    specs: {
      Motor: "1HP J Copper Motor",
      Pump: "1HP Bearing Cut-Size Pump GD45000",
      Brand: "Jawed",
      Warranty: "As per dealer policy",
    },
    imageSeed: "set-1j-gd45",
  }),
  product({
    name: "1HP J Copper Motor + GD7000 Bearing Pump Set",
    slug: "set-1hp-j-gd7000",
    sku: "JW-SET-1J-GD7",
    brand: "Jawed",
    categorySlug: "complete-sets",
    shortDescription: "1HP J motor with GD7000 steel-plate bearing pump.",
    description:
      "Complete Jawed set: 1HP J copper motor + GD7000 steel-plate bearing pump for everyday agricultural and domestic pumping.",
    tags: ["set", "1hp", "gd7000", "jawed"],
    specs: {
      Motor: "1HP J Copper Motor",
      Pump: "1HP Bearing Pump GD7000 (Steel Plate)",
      Brand: "Jawed",
      Warranty: "As per dealer policy",
    },
    imageSeed: "set-1j-gd7",
  }),
  product({
    name: "1HP J Copper Motor + GD22000 Pump Set",
    slug: "set-1hp-j-gd22000",
    sku: "JW-SET-1J-GD22",
    brand: "Jawed",
    categorySlug: "complete-sets",
    shortDescription: "1HP J motor with GD22000 steel-plate bearing pump.",
    description:
      "Complete set: 1HP J copper motor matched with the GD22000 steel-plate bearing pump.",
    tags: ["set", "1hp", "gd22000", "jawed"],
    specs: {
      Motor: "1HP J Copper Motor",
      Pump: "1HP Bearing Pump GD22000 (Steel Plate)",
      Brand: "Jawed",
      Warranty: "As per dealer policy",
    },
    imageSeed: "set-1j-gd22",
  }),
  product({
    name: "1HP S Copper Motor + GD25000 Bearing Pump Set",
    slug: "set-1hp-s-gd25000",
    sku: "JW-SET-1S-GD25",
    brand: "Jawed",
    categorySlug: "complete-sets",
    shortDescription: "1HP S heavy-duty motor with GD25000 bearing pump.",
    description:
      "Heavy-duty Jawed set: 1HP S copper motor paired with the GD25000 steel-plate bearing pump.",
    tags: ["set", "1hp", "s-series", "gd25000", "jawed"],
    specs: {
      Motor: "1HP S Copper Motor Heavy Duty",
      Pump: "1HP Bearing Pump GD25000 (Steel Plate)",
      Brand: "Jawed",
      Warranty: "As per dealer policy",
    },
    imageSeed: "set-1s-gd25",
  }),
  product({
    name: "1HP S Copper Motor + GD26000 Bearing Pump Set",
    slug: "set-1hp-s-gd26000",
    sku: "JW-SET-1S-GD26",
    brand: "Jawed",
    categorySlug: "complete-sets",
    shortDescription: "1HP S heavy-duty motor with GD26000 bearing pump.",
    description:
      "Heavy-duty Jawed set: 1HP S copper motor paired with the GD26000 steel-plate bearing pump.",
    tags: ["set", "1hp", "s-series", "gd26000", "jawed"],
    specs: {
      Motor: "1HP S Copper Motor Heavy Duty",
      Pump: "1HP Bearing Pump GD26000 (Steel Plate)",
      Brand: "Jawed",
      Warranty: "As per dealer policy",
    },
    imageSeed: "set-1s-gd26",
  }),
  product({
    name: "1HP Jawed Full Load HD Copper Motor + 2HP Jawed GD50000 Set",
    slug: "set-1hp-full-load-jawed-gd50000",
    sku: "JW-SET-1FL-GD50",
    brand: "Jawed",
    categorySlug: "complete-sets",
    shortDescription: "Full-load 1HP Jawed motor + 2HP Jawed GD50000 pump.",
    description:
      "Top Jawed complete set: 1HP Full Load Heavy Duty copper motor with the 2HP Jawed GD50000 steel-plate bearing pump for high-demand installations.",
    featured: true,
    tags: ["set", "full-load", "gd50000", "jawed", "2hp"],
    specs: {
      Motor: "1HP Full Load Heavy Duty Copper Motor (Jawed)",
      Pump: "2HP Bearing Pump Jawed GD50000 (Steel Plate)",
      Brand: "Jawed",
      Warranty: "As per dealer policy",
    },
    imageSeed: "set-jw-gd50",
  }),
  product({
    name: "1HP Premium Full Load HD Copper Motor + 2HP Premium GD50000 Set",
    slug: "set-1hp-full-load-premium-gd50000",
    sku: "PR-SET-1FL-GD50",
    brand: "Premium",
    categorySlug: "complete-sets",
    shortDescription: "Full-load Premium motor + 2HP Premium GD50000 pump.",
    description:
      "Premium complete set: 1HP Full Load Heavy Duty copper motor with the 2HP Premium GD50000 steel-plate bearing pump for maximum capacity and finish.",
    featured: true,
    tags: ["set", "full-load", "gd50000", "premium", "2hp"],
    specs: {
      Motor: "1HP Premium Full Load Heavy Duty Copper Motor",
      Pump: "2HP Bearing Pump Premium GD50000 (Steel Plate)",
      Brand: "Premium",
      Warranty: "As per dealer policy",
    },
    imageSeed: "set-pr-gd50",
  }),
];
