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
  /** Optional looping product video (card cover + detail gallery). */
  video?: string;
};

const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/800`;

const PRICE_NOTE =
  "Contact us for the current price. Rates may vary with stock and configuration.";

export const categories: SeedCategory[] = [
  {
    name: "Copper Motors",
    slug: "copper-motors",
    description: "100% copper winding motors for reliable pump duty, light to full-load heavy duty.",
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
    description: "Steel-plate bearing pumps across GD models. Jawed and Premium lines.",
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
  /** Real product photos under /public/products/<slug>/ (cover first). */
  images?: string[];
  stock?: number;
  video?: string;
};

function product(p: ProductInput): SeedProduct {
  const specs = p.video ? { ...p.specs, Video: p.video } : p.specs;
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
    images: p.images !== undefined ? p.images : [img(p.imageSeed), img(`${p.imageSeed}-b`)],
    tags: p.tags,
    specs,
    video: p.video,
  };
}

/** Local product media under public/products/<slug>/ */
function pm(slug: string, ...files: string[]) {
  return files.map((f) => `/products/${slug}/${f}`);
}

export const products: SeedProduct[] = [
  // --- Copper Motors ---
  product({
    name: "0.5HP Copper Motor",
    slug: "0-5hp-copper-motor",
    sku: "JW-CM-05",
    brand: "Jawed",
    categorySlug: "copper-motors",
    shortDescription: "0.5HP 100% copper motor, throws water up to 30 feet (2nd floor).",
    description:
      "Jawed 0.5HP copper motor for light domestic and small-farm pumping. Runs on 220V single-phase at 2 amp and 1450 RPM with 100% copper winding. Delivers water throw-up of about 30 feet, suitable for 2nd-floor height, and is covered by a 1-year warranty.",
    featured: true,
    tags: ["copper", "motor", "0.5hp"],
    specs: {
      Power: "0.5 HP",
      Voltage: "220 Single Phase",
      Ampere: "2",
      Speed: "1450 RPM",
      "Winding Material": "100% Copper",
      "Water Throw-up": "30 feet / 2nd floor height",
      Brand: "Jawed",
      Warranty: "1 Year",
    },
    imageSeed: "cm-05",
    video: "/videos/copper-motors/0-5hp-copper-motor.mp4",
  }),
  product({
    name: "1HP J Copper Motor",
    slug: "1hp-j-copper-motor",
    sku: "JW-CM-1J",
    brand: "Jawed",
    categorySlug: "copper-motors",
    shortDescription: "1HP J copper motor, throws water up to 55 feet (4th floor).",
    description:
      "Jawed 1HP J-series copper motor for standard pump sets (GD45000, GD7000, GD22000 and similar). Runs on 220V single-phase at 3 amp and 1450 RPM with 100% copper winding. Water throw-up reaches about 55 feet, suitable for 4th-floor height, with a 1-year warranty.",
    featured: true,
    tags: ["copper", "motor", "1hp", "j-series"],
    specs: {
      Power: "1 HP",
      Series: "J",
      Voltage: "220 Single Phase",
      Ampere: "3",
      Speed: "1450 RPM",
      "Winding Material": "100% Copper",
      "Water Throw-up": "55 feet / 4th floor height",
      Brand: "Jawed",
      Warranty: "1 Year",
    },
    imageSeed: "cm-1j",
    video: "/videos/copper-motors/1hp-j-copper-motor.mp4",
  }),
  product({
    name: "1HP S Copper Motor Heavy Duty",
    slug: "1hp-s-copper-motor-heavy-duty",
    sku: "JW-CM-1S",
    brand: "Jawed",
    categorySlug: "copper-motors",
    shortDescription: "1HP S heavy-duty copper motor, throw-up up to 70 feet.",
    description:
      "Jawed 1HP S-series heavy-duty copper motor for tougher pumping loads, including GD25000 / GD26000 class sets. Runs on 220V at 4 amp and 1450 RPM with 100% copper winding. Water throw-up up to 70 feet, backed by a 1-year warranty.",
    tags: ["copper", "motor", "1hp", "s-series", "heavy-duty"],
    specs: {
      Power: "1 HP",
      Series: "S",
      Duty: "Heavy Duty",
      Voltage: "220",
      Ampere: "4",
      Speed: "1450 RPM",
      "Winding Material": "100% Copper",
      "Water Throw-up": "Up to 70 feet",
      Brand: "Jawed",
      Warranty: "1 Year",
    },
    imageSeed: "cm-1s",
    video: "/videos/copper-motors/1hp-s-copper-motor.mp4",
  }),
  product({
    name: "1HP Full Load Heavy Duty Copper Motor",
    slug: "1hp-full-load-heavy-duty-copper-motor",
    sku: "JW-CM-1FL",
    brand: "Jawed",
    categorySlug: "copper-motors",
    shortDescription: "1HP full-load heavy-duty copper motor, throw-up up to 100 feet.",
    description:
      "Jawed 1HP full-load heavy-duty copper motor for high-demand installations and 2HP class bearing pumps (GD50000). Runs on 220V at 5 amp and 1450 RPM with 100% copper winding. Water throw-up up to 100 feet, with a 1-year warranty.",
    featured: true,
    tags: ["copper", "motor", "1hp", "full-load", "heavy-duty"],
    specs: {
      Power: "1 HP",
      Duty: "Full Load Heavy Duty",
      Voltage: "220",
      Ampere: "5",
      Speed: "1450 RPM",
      "Winding Material": "100% Copper",
      "Water Throw-up": "Up to 100 feet",
      Brand: "Jawed",
      Warranty: "1 Year",
    },
    imageSeed: "cm-1fl",
    video: "/videos/copper-motors/1hp-full-load-copper-motor.mp4",
  }),

  // --- Monoblock Pressure Pumps (video covers) ---
  product({
    name: "0.5HP Monoblock Pressure Pump Jawed",
    slug: "0-5hp-monoblock-pressure-pump-jawed",
    sku: "JW-MB-05",
    brand: "Jawed",
    categorySlug: "monoblock-pressure-pumps",
    shortDescription: "0.5HP Jawed monoblock. Tank to overhead up to 30 feet (2nd floor).",
    description:
      "Jawed 0.5HP monoblock pressure pump for residential boosting from tank to overhead tank. Capacity up to 30 feet (2nd floor height) with 100% copper winding. Ideal for showers, taps and rooftop tanks. Covered by a 1-year warranty.",
    featured: true,
    tags: ["monoblock", "pressure", "0.5hp", "jawed"],
    specs: {
      Power: "0.5 HP",
      Type: "Monoblock Pressure Pump",
      "Tank to Overhead Capacity": "Up to 30 feet / 2nd floor height",
      "Winding Material": "100% Copper",
      Brand: "Jawed",
      Warranty: "1 Year",
    },
    imageSeed: "mb-jw-05",
    images: pm("0-5hp-monoblock-pressure-pump-jawed", "cover.jpg"),
    video: "/products/0-5hp-monoblock-pressure-pump-jawed/video.mp4",
  }),
  product({
    name: "1HP Monoblock Pressure Pump Jawed",
    slug: "1hp-monoblock-pressure-pump-jawed",
    sku: "JW-MB-1",
    brand: "Jawed",
    categorySlug: "monoblock-pressure-pumps",
    shortDescription: "1HP Jawed monoblock. Tank to overhead 60 feet (4th floor).",
    description:
      "Jawed 1HP monoblock pressure pump for homes and small farms. Tank to overhead tank capacity of 60 feet (4th floor height) with 100% copper wiring. Stronger flow and head for larger homes, gardens and light commercial use. Covered by a 1-year warranty.",
    tags: ["monoblock", "pressure", "1hp", "jawed"],
    specs: {
      Power: "1 HP",
      Type: "Monoblock Pressure Pump",
      "Tank to Overhead Capacity": "60 feet / 4th floor height",
      "Winding Material": "100% Copper",
      Brand: "Jawed",
      Warranty: "1 Year",
    },
    imageSeed: "mb-jw-1",
    images: pm("1hp-monoblock-pressure-pump-jawed", "cover.jpg"),
    video: "/products/1hp-monoblock-pressure-pump-jawed/video.mp4",
  }),
  product({
    name: "2HP Monoblock Pressure Pump Jawed (Steel Impeller)",
    slug: "2hp-monoblock-pressure-pump-jawed-steel-impeller",
    sku: "JW-MB-2",
    brand: "Jawed",
    categorySlug: "monoblock-pressure-pumps",
    shortDescription: "2HP Jawed monoblock with steel impeller. Tank to overhead up to 75 feet.",
    description:
      "Jawed 2HP monoblock pressure pump with a steel impeller for heavy pressure duty. Tank to overhead tank capacity up to 75 feet with 100% copper wiring. Built for higher head and demanding installations. Covered by a 1-year warranty.",
    featured: true,
    tags: ["monoblock", "pressure", "2hp", "jawed", "steel-impeller"],
    specs: {
      Power: "2 HP",
      Type: "Monoblock Pressure Pump",
      Impeller: "Steel",
      "Tank to Overhead Capacity": "Up to 75 feet",
      "Winding Material": "100% Copper",
      Brand: "Jawed",
      Warranty: "1 Year",
    },
    imageSeed: "mb-jw-2",
    images: pm("2hp-monoblock-pressure-pump-jawed-steel-impeller", "cover.jpg"),
    video: "/products/2hp-monoblock-pressure-pump-jawed-steel-impeller/video.mp4",
  }),
  product({
    name: "0.5HP Monoblock Pressure Pump Premium",
    slug: "0-5hp-monoblock-pressure-pump-premium",
    sku: "PR-MB-05",
    brand: "Premium",
    categorySlug: "monoblock-pressure-pumps",
    shortDescription: "0.5HP Premium monoblock. Tank to overhead up to 30 feet (2nd floor).",
    description:
      "Premium 0.5HP monoblock pressure pump for residential boosting from tank to overhead tank. Capacity up to 30 feet (2nd floor height) with 100% copper winding. Suited to showers, taps and rooftop tanks. Covered by a 1-year warranty.",
    tags: ["monoblock", "pressure", "0.5hp", "premium"],
    specs: {
      Power: "0.5 HP",
      Type: "Monoblock Pressure Pump",
      "Tank to Overhead Capacity": "Up to 30 feet / 2nd floor height",
      "Winding Material": "100% Copper",
      Brand: "Premium",
      Warranty: "1 Year",
    },
    imageSeed: "mb-pr-05",
    images: pm("0-5hp-monoblock-pressure-pump-premium", "cover.jpg"),
    video: "/products/0-5hp-monoblock-pressure-pump-premium/video.mp4",
  }),
  product({
    name: "1HP Monoblock Pressure Pump Premium",
    slug: "1hp-monoblock-pressure-pump-premium",
    sku: "PR-MB-1",
    brand: "Premium",
    categorySlug: "monoblock-pressure-pumps",
    shortDescription: "1HP Premium monoblock. Tank to overhead 60 feet (4th floor).",
    description:
      "Premium 1HP monoblock pressure pump for stronger domestic and light commercial boosting. Tank to overhead tank capacity of 60 feet (4th floor height) with 100% copper wiring. Covered by a 1-year warranty.",
    tags: ["monoblock", "pressure", "1hp", "premium"],
    specs: {
      Power: "1 HP",
      Type: "Monoblock Pressure Pump",
      "Tank to Overhead Capacity": "60 feet / 4th floor height",
      "Winding Material": "100% Copper",
      Brand: "Premium",
      Warranty: "1 Year",
    },
    imageSeed: "mb-pr-1",
    images: pm("1hp-monoblock-pressure-pump-premium", "cover.jpg"),
    video: "/products/1hp-monoblock-pressure-pump-premium/video.mp4",
  }),
  product({
    name: "2HP Monoblock Pressure Pump Premium (Steel Impeller)",
    slug: "2hp-monoblock-pressure-pump-premium-steel-impeller",
    sku: "PR-MB-2",
    brand: "Premium",
    categorySlug: "monoblock-pressure-pumps",
    shortDescription: "2HP Premium monoblock with steel impeller. Tank to overhead up to 75 feet.",
    description:
      "Premium 2HP monoblock pressure pump with a steel impeller for heavy pressure duty. Tank to overhead tank capacity up to 75 feet with 100% copper wiring. Built for higher head and demanding installations. Covered by a 1-year warranty.",
    featured: true,
    tags: ["monoblock", "pressure", "2hp", "premium", "steel-impeller"],
    specs: {
      Power: "2 HP",
      Type: "Monoblock Pressure Pump",
      Impeller: "Steel",
      "Tank to Overhead Capacity": "Up to 75 feet",
      "Winding Material": "100% Copper",
      Brand: "Premium",
      Warranty: "1 Year",
    },
    imageSeed: "mb-pr-2",
    images: pm("2hp-monoblock-pressure-pump-premium-steel-impeller", "cover.jpg"),
    video: "/products/2hp-monoblock-pressure-pump-premium-steel-impeller/video.mp4",
  }),

  // --- Bearing Pumps ---
  product({
    name: "2HP Bearing Pump Premium GD50000 (Steel Plate)",
    slug: "2hp-bearing-pump-premium-gd50000",
    sku: "PR-BP-GD50",
    brand: "Premium",
    categorySlug: "bearing-pumps",
    shortDescription: "2HP Premium double-belt bearing pump. 70 feet+ deep-well suction.",
    description:
      "Premium GD50000 2HP double-belt bearing pump for suction of in-line water. Delivers 70 feet and above water suction from deep wells. Steel-plate construction for high-demand agricultural and industrial use. Covered by a 1-year warranty.",
    featured: true,
    tags: ["bearing", "2hp", "gd50000", "premium", "steel-plate", "double-belt"],
    specs: {
      Power: "2 HP",
      Model: "GD50000",
      Construction: "Steel Plate",
      Drive: "Double Belt",
      Use: "Suction of in-line water",
      "Water Suction": "70 feet+ from deep well",
      Brand: "Premium",
      Warranty: "1 Year",
    },
    imageSeed: "bp-pr-gd50",
  }),
  product({
    name: "2HP Bearing Pump Jawed GD50000 (Steel Plate)",
    slug: "2hp-bearing-pump-jawed-gd50000",
    sku: "JW-BP-GD50",
    brand: "Jawed",
    categorySlug: "bearing-pumps",
    shortDescription: "2HP Jawed double-belt bearing pump. 70 feet+ deep-well suction.",
    description:
      "Jawed GD50000 2HP double-belt bearing pump for suction of in-line water. Delivers 70 feet and above water suction from deep wells. Steel-plate body for heavy agricultural and industrial transfer with a full-load motor. Covered by a 1-year warranty.",
    featured: true,
    tags: ["bearing", "2hp", "gd50000", "jawed", "steel-plate", "double-belt"],
    specs: {
      Power: "2 HP",
      Model: "GD50000",
      Construction: "Steel Plate",
      Drive: "Double Belt",
      Use: "Suction of in-line water",
      "Water Suction": "70 feet+ from deep well",
      Brand: "Jawed",
      Warranty: "1 Year",
    },
    imageSeed: "bp-jw-gd50",
  }),
  product({
    name: "1HP Bearing Pump GD25000 (Steel Plate)",
    slug: "1hp-bearing-pump-gd25000",
    sku: "JW-BP-GD25",
    brand: "Jawed",
    categorySlug: "bearing-pumps",
    shortDescription: "1HP Jawed GD25000 double-belt pump. 30-60 feet bore suction.",
    description:
      "Jawed GD25000 1HP double-belt bearing pump for suction of in-line water. Suited to 30-60 feet suction from deep well or bore. Commonly paired with the 1HP S copper motor. Covered by a 1-year warranty.",
    tags: ["bearing", "1hp", "gd25000", "steel-plate", "double-belt"],
    specs: {
      Power: "1 HP",
      Model: "GD25000",
      Construction: "Steel Plate",
      Drive: "Double Belt",
      Use: "Suction of in-line water",
      "Water Suction": "30-60 feet from deep well or bore",
      Brand: "Jawed",
      Warranty: "1 Year",
    },
    imageSeed: "bp-gd25",
    images: pm(
      "1hp-bearing-pump-gd25000",
      "cover.png",
      "gallery-01.png",
      "gallery-02.png",
      "gallery-03.png",
      "gallery-04.png"
    ),
  }),
  product({
    name: "1HP Bearing Pump GD26000 (Steel Plate)",
    slug: "1hp-bearing-pump-gd26000",
    sku: "JW-BP-GD26",
    brand: "Jawed",
    categorySlug: "bearing-pumps",
    shortDescription: "1HP Jawed GD26000 double-belt pump. 30-60 feet bore suction.",
    description:
      "Jawed GD26000 1HP double-belt bearing pump for suction of in-line water. Suited to 30-60 feet suction from deep well or bore. A strong match for the 1HP S copper motor set. Covered by a 1-year warranty.",
    tags: ["bearing", "1hp", "gd26000", "steel-plate", "double-belt"],
    specs: {
      Power: "1 HP",
      Model: "GD26000",
      Construction: "Steel Plate",
      Drive: "Double Belt",
      Use: "Suction of in-line water",
      "Water Suction": "30-60 feet from deep well or bore",
      Brand: "Jawed",
      Warranty: "1 Year",
    },
    imageSeed: "bp-gd26",
    images: pm(
      "1hp-bearing-pump-gd26000",
      "cover.png",
      "gallery-01.png",
      "gallery-02.png",
      "gallery-03.png",
      "gallery-04.png"
    ),
  }),
  product({
    name: "1HP Bearing Pump GD22000 (Steel Plate)",
    slug: "1hp-bearing-pump-gd22000",
    sku: "JW-BP-GD22",
    brand: "Jawed",
    categorySlug: "bearing-pumps",
    shortDescription: "1HP Jawed GD22000 double-belt pump. 30-60 feet bore suction.",
    description:
      "Jawed GD22000 1HP double-belt bearing pump for suction of in-line water. Suited to 30-60 feet suction from deep well or bore. Popular pairing with the 1HP J copper motor. Covered by a 1-year warranty.",
    tags: ["bearing", "1hp", "gd22000", "steel-plate", "double-belt"],
    specs: {
      Power: "1 HP",
      Model: "GD22000",
      Construction: "Steel Plate",
      Drive: "Double Belt",
      Use: "Suction of in-line water",
      "Water Suction": "30-60 feet from deep well or bore",
      Brand: "Jawed",
      Warranty: "1 Year",
    },
    imageSeed: "bp-gd22",
  }),
  product({
    name: "1HP Bearing Pump GD7000 (Steel Plate)",
    slug: "1hp-bearing-pump-gd7000",
    sku: "JW-BP-GD7",
    brand: "Jawed",
    categorySlug: "bearing-pumps",
    shortDescription: "1HP Jawed GD7000 double-belt pump. 30-60 feet bore suction.",
    description:
      "Jawed GD7000 1HP double-belt bearing pump for suction of in-line water. Suited to 30-60 feet suction from deep well or bore for everyday agricultural and domestic sets. Covered by a 1-year warranty.",
    tags: ["bearing", "1hp", "gd7000", "steel-plate", "double-belt"],
    specs: {
      Power: "1 HP",
      Model: "GD7000",
      Construction: "Steel Plate",
      Drive: "Double Belt",
      Use: "Suction of in-line water",
      "Water Suction": "30-60 feet from deep well or bore",
      Brand: "Jawed",
      Warranty: "1 Year",
    },
    imageSeed: "bp-gd7",
    images: pm(
      "1hp-bearing-pump-gd7000",
      "cover.png",
      "gallery-01.png",
      "gallery-02.png",
      "gallery-03.png",
      "gallery-04.png"
    ),
  }),
  product({
    name: "1HP Bearing Cut-Size Pump GD45000",
    slug: "1hp-bearing-cut-size-pump-gd45000",
    sku: "JW-BP-GD45",
    brand: "Jawed",
    categorySlug: "bearing-pumps",
    shortDescription: "1HP Jawed GD45000 double-belt cut-size pump. 30-60 feet suction.",
    description:
      "Jawed GD45000 1HP cut-size double-belt bearing pump for suction of in-line water. Compact footprint with 30-60 feet suction from deep well or bore. Typically matched with a 1HP J copper motor. Covered by a 1-year warranty.",
    tags: ["bearing", "1hp", "gd45000", "cut-size", "double-belt"],
    specs: {
      Power: "1 HP",
      Model: "GD45000",
      Type: "Cut-Size",
      Drive: "Double Belt",
      Use: "Suction of in-line water",
      "Water Suction": "30-60 feet from deep well or bore",
      Brand: "Jawed",
      Warranty: "1 Year",
    },
    imageSeed: "bp-gd45",
  }),
  product({
    name: "0.5HP / Inchi Bearing Jawed Pump",
    slug: "0-5hp-inchi-bearing-jawed-pump",
    sku: "JW-BP-INCHI-05",
    brand: "Jawed",
    categorySlug: "bearing-pumps",
    shortDescription: "0.5HP / 1 inch Jawed double-belt pump. 20-25 feet boring suction.",
    description:
      "Jawed 0.5HP / 1 inch (Inchi) double-belt bearing pump for suction of in-line water. Up to 20-25 feet water suction for boring. Mainly used for in-line water suction and pairs with the 0.5HP copper motor. Covered by a 1-year warranty.",
    tags: ["bearing", "0.5hp", "inchi", "1-inch", "jawed", "double-belt"],
    specs: {
      Power: "0.5 HP",
      Type: "1 Inch / Inchi Bearing",
      Drive: "Double Belt",
      Use: "Suction of in-line water",
      "Water Suction": "Up to 20-25 feet for boring",
      Brand: "Jawed",
      Warranty: "1 Year",
    },
    imageSeed: "bp-inchi-05",
    images: pm(
      "0-5hp-inchi-bearing-jawed-pump",
      "cover.jpg",
      "gallery-01.jpg",
      "gallery-02.jpg",
      "gallery-03.jpg",
      "gallery-04.jpg"
    ),
  }),
  product({
    name: "0.5HP / Inchi Bearing Diamond Pump",
    slug: "0-5hp-inchi-bearing-diamond-pump",
    sku: "DM-BP-INCHI-05",
    brand: "Imported",
    categorySlug: "bearing-pumps",
    shortDescription: "0.5HP / 1 inch Imported double-belt pump. 20-25 feet boring suction.",
    description:
      "Imported Diamond 0.5HP / 1 inch (Inchi) double-belt bearing pump for suction of in-line water. Up to 20-25 feet water suction for boring. Mainly used for in-line water suction as an imported-line option alongside Jawed Inchi pumps. Covered by a 1-year warranty.",
    tags: ["bearing", "0.5hp", "inchi", "1-inch", "diamond", "imported", "double-belt"],
    specs: {
      Power: "0.5 HP",
      Type: "1 Inch / Inchi Bearing",
      Drive: "Double Belt",
      Use: "Suction of in-line water",
      "Water Suction": "Up to 20-25 feet for boring",
      Brand: "Diamond",
      Warranty: "1 Year",
    },
    imageSeed: "bp-diamond-05",
    images: pm(
      "0-5hp-inchi-bearing-diamond-pump",
      "cover.png",
      "gallery-01.png",
      "gallery-02.png",
      "gallery-03.png",
      "gallery-04.png"
    ),
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
      "Complete Jawed set: 0.5HP copper motor paired with the 0.5HP / Inchi Jawed bearing pump, ready for light domestic or small farm installations.",
    featured: true,
    tags: ["set", "0.5hp", "copper", "bearing", "jawed"],
    specs: {
      Motor: "0.5HP Copper Motor",
      Pump: "0.5HP / Inchi Bearing Jawed Pump",
      Brand: "Jawed",
      Warranty: "1 Year",
    },
    imageSeed: "set-05",
    images: pm(
      "set-0-5hp-copper-inchi-bearing",
      "cover.jpg",
      "gallery-01.jpg",
      "gallery-02.jpg",
      "gallery-03.jpg",
      "gallery-04.jpg"
    ),
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
      Warranty: "1 Year",
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
      Warranty: "1 Year",
    },
    imageSeed: "set-1j-gd7",
    images: pm(
      "set-1hp-j-gd7000",
      "cover.jpg",
      "gallery-01.jpg",
      "gallery-02.jpg",
      "gallery-03.jpg",
      "gallery-04.jpg"
    ),
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
      Warranty: "1 Year",
    },
    imageSeed: "set-1j-gd22",
    images: pm(
      "set-1hp-j-gd22000",
      "cover.jpg",
      "gallery-01.jpg",
      "gallery-02.jpg",
      "gallery-03.jpg"
    ),
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
      Warranty: "1 Year",
    },
    imageSeed: "set-1s-gd25",
    images: pm("set-1hp-s-gd25000", "cover.jpg", "gallery-01.jpg"),
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
      Warranty: "1 Year",
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
      Warranty: "1 Year",
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
      Warranty: "1 Year",
    },
    imageSeed: "set-pr-gd50",
    images: pm(
      "set-1hp-full-load-premium-gd50000",
      "cover.jpg",
      "gallery-01.jpg",
      "gallery-02.jpg",
      "gallery-03.jpg",
      "gallery-04.jpg"
    ),
  }),
];
