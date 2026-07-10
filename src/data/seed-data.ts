/**
 * ============================================================================
 *  DEMO CATALOG  —  REPLACE WITH YOUR REAL PRODUCTS
 * ============================================================================
 *  This file is the single source of truth for the demo catalog. It is used
 *  BOTH to seed the database (`npm run db:seed`) AND as a read-only fallback so
 *  the storefront still renders when no database is connected.
 *
 *  To make it your store: edit the `categories` and `products` arrays below,
 *  swap the `images` URLs for your own, then run `npm run db:seed`.
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
  featured: boolean;
  active: boolean;
  images: string[];
  tags: string[];
  specs: Record<string, string>;
};

const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/800`;

export const categories: SeedCategory[] = [
  {
    name: "Solar Pumps",
    slug: "solar-pumps",
    description:
      "Solar-powered water pumps for irrigation and off-grid supply. Save on electricity with clean energy.",
    image: img("cat-solar"),
    sortOrder: 1,
  },
  {
    name: "Submersible Pumps",
    slug: "submersible-pumps",
    description: "Deep-well and borehole submersible pumps for reliable groundwater extraction.",
    image: img("cat-submersible"),
    sortOrder: 2,
  },
  {
    name: "Pressure & Booster Pumps",
    slug: "pressure-booster-pumps",
    description: "Boost water pressure for homes and apartments — showers, taps and geysers.",
    image: img("cat-pressure"),
    sortOrder: 3,
  },
  {
    name: "Centrifugal Pumps",
    slug: "centrifugal-pumps",
    description: "High-flow centrifugal pumps for agriculture, industry and water transfer.",
    image: img("cat-centrifugal"),
    sortOrder: 4,
  },
  {
    name: "Water Motors",
    slug: "water-motors",
    description: "Durable electric motors and monoblock units for a wide range of pumping needs.",
    image: img("cat-motors"),
    sortOrder: 5,
  },
  {
    name: "Accessories & Spare Parts",
    slug: "accessories",
    description: "Controllers, pipes, foot valves, pressure switches and genuine spare parts.",
    image: img("cat-accessories"),
    sortOrder: 6,
  },
];

export const products: SeedProduct[] = [
  {
    name: "SolarMax 1HP Solar Water Pump",
    slug: "solarmax-1hp-solar-water-pump",
    sku: "SP-SOL-1HP",
    brand: "SolarMax",
    categorySlug: "solar-pumps",
    shortDescription: "1HP DC solar surface pump with MPPT controller — ideal for small farms.",
    description:
      "The SolarMax 1HP solar water pump runs entirely on solar energy, delivering reliable irrigation without electricity bills. Includes an MPPT controller for maximum efficiency and dry-run protection. Perfect for small to medium farms, gardens and off-grid homes.",
    price: 78000,
    compareAtPrice: 92000,
    cost: 58000,
    stock: 24,
    lowStockThreshold: 5,
    weightKg: 14,
    featured: true,
    active: true,
    images: [img("solarmax1"), img("solarmax1b"), img("solarmax1c")],
    tags: ["solar", "irrigation", "dc", "eco"],
    specs: {
      Power: "1 HP (0.75 kW)",
      "Max Flow": "8,000 L/h",
      "Max Head": "30 m",
      "Panel Requirement": "1000 W",
      Controller: "MPPT with dry-run protection",
      Warranty: "2 years",
    },
  },
  {
    name: "SolarMax 2HP Solar Submersible Pump",
    slug: "solarmax-2hp-solar-submersible-pump",
    sku: "SP-SOL-2HP",
    brand: "SolarMax",
    categorySlug: "solar-pumps",
    shortDescription: "2HP solar submersible pump for deep wells up to 60m.",
    description:
      "A powerful 2HP solar submersible pump engineered for deep boreholes. Stainless steel construction resists corrosion and the smart controller adjusts output to available sunlight for all-day pumping.",
    price: 165000,
    compareAtPrice: 189000,
    cost: 128000,
    stock: 12,
    lowStockThreshold: 4,
    weightKg: 22,
    featured: true,
    active: true,
    images: [img("solarmax2"), img("solarmax2b")],
    tags: ["solar", "submersible", "borehole"],
    specs: {
      Power: "2 HP (1.5 kW)",
      "Max Flow": "10,000 L/h",
      "Max Head": "60 m",
      "Panel Requirement": "2000 W",
      Material: "Stainless Steel 304",
      Warranty: "2 years",
    },
  },
  {
    name: "AquaDeep 1.5HP Submersible Borewell Pump",
    slug: "aquadeep-1-5hp-submersible-borewell-pump",
    sku: "SB-AQ-15",
    brand: "AquaDeep",
    categorySlug: "submersible-pumps",
    shortDescription: "1.5HP 4-inch borewell submersible pump, copper winding.",
    description:
      "The AquaDeep 1.5HP submersible pump fits standard 4-inch borewells and delivers steady flow from deep water tables. 100% copper winding motor ensures long life and energy efficiency.",
    price: 42000,
    compareAtPrice: 48000,
    cost: 31000,
    stock: 30,
    lowStockThreshold: 6,
    weightKg: 16,
    featured: true,
    active: true,
    images: [img("aquadeep15"), img("aquadeep15b")],
    tags: ["submersible", "borewell", "copper"],
    specs: {
      Power: "1.5 HP",
      "Outlet Size": "1.25 inch",
      "Max Head": "45 m",
      "Bore Size": "4 inch",
      Winding: "100% Copper",
      Warranty: "1 year",
    },
  },
  {
    name: "AquaDeep 3HP Submersible Pump",
    slug: "aquadeep-3hp-submersible-pump",
    sku: "SB-AQ-30",
    brand: "AquaDeep",
    categorySlug: "submersible-pumps",
    shortDescription: "Heavy-duty 3HP submersible pump for deep wells and farms.",
    description:
      "Built for demanding agricultural and commercial use, the AquaDeep 3HP submersible pump pushes water from depths up to 90 metres with excellent flow. Thermal overload protection included.",
    price: 89000,
    cost: 67000,
    stock: 8,
    lowStockThreshold: 4,
    weightKg: 24,
    featured: false,
    active: true,
    images: [img("aquadeep3")],
    tags: ["submersible", "agriculture", "heavy-duty"],
    specs: {
      Power: "3 HP",
      "Outlet Size": "2 inch",
      "Max Head": "90 m",
      "Max Flow": "12,000 L/h",
      Protection: "Thermal overload",
      Warranty: "1 year",
    },
  },
  {
    name: "PressurePro 0.5HP Booster Pump",
    slug: "pressurepro-0-5hp-booster-pump",
    sku: "PB-PP-05",
    brand: "PressurePro",
    categorySlug: "pressure-booster-pumps",
    shortDescription: "Automatic 0.5HP pressure booster for homes and apartments.",
    description:
      "Say goodbye to weak showers. The PressurePro 0.5HP automatic booster pump increases water pressure to taps, showers and geysers with a built-in flow sensor that starts and stops automatically.",
    price: 18500,
    compareAtPrice: 22000,
    cost: 12500,
    stock: 45,
    lowStockThreshold: 10,
    weightKg: 6,
    featured: true,
    active: true,
    images: [img("pressurepro05"), img("pressurepro05b")],
    tags: ["pressure", "booster", "home", "automatic"],
    specs: {
      Power: "0.5 HP",
      "Max Flow": "2,400 L/h",
      "Max Head": "18 m",
      Control: "Automatic flow switch",
      Noise: "Low-noise design",
      Warranty: "1 year",
    },
  },
  {
    name: "PressurePro 1HP Booster Pump",
    slug: "pressurepro-1hp-booster-pump",
    sku: "PB-PP-10",
    brand: "PressurePro",
    categorySlug: "pressure-booster-pumps",
    shortDescription: "1HP pressure booster for multi-storey homes.",
    description:
      "A stronger 1HP booster for two- and three-storey homes needing consistent pressure across multiple bathrooms. Quiet, efficient and fully automatic.",
    price: 27500,
    cost: 19000,
    stock: 22,
    lowStockThreshold: 8,
    weightKg: 8,
    featured: false,
    active: true,
    images: [img("pressurepro10")],
    tags: ["pressure", "booster", "multistorey"],
    specs: {
      Power: "1 HP",
      "Max Flow": "3,600 L/h",
      "Max Head": "28 m",
      Control: "Automatic pressure switch",
      Warranty: "1 year",
    },
  },
  {
    name: "FlowForce 2HP Centrifugal Pump",
    slug: "flowforce-2hp-centrifugal-pump",
    sku: "CF-FF-20",
    brand: "FlowForce",
    categorySlug: "centrifugal-pumps",
    shortDescription: "2HP high-flow centrifugal pump for water transfer.",
    description:
      "The FlowForce 2HP centrifugal pump moves large volumes of water quickly — ideal for filling tanks, irrigation channels and industrial transfer. Cast-iron body for durability.",
    price: 34000,
    compareAtPrice: 39000,
    cost: 24000,
    stock: 18,
    lowStockThreshold: 5,
    weightKg: 18,
    featured: true,
    active: true,
    images: [img("flowforce2"), img("flowforce2b")],
    tags: ["centrifugal", "transfer", "agriculture"],
    specs: {
      Power: "2 HP",
      "Inlet/Outlet": "2 inch / 2 inch",
      "Max Flow": "24,000 L/h",
      "Max Head": "22 m",
      Body: "Cast iron",
      Warranty: "1 year",
    },
  },
  {
    name: "FlowForce 5HP Industrial Centrifugal Pump",
    slug: "flowforce-5hp-industrial-centrifugal-pump",
    sku: "CF-FF-50",
    brand: "FlowForce",
    categorySlug: "centrifugal-pumps",
    shortDescription: "5HP three-phase centrifugal pump for industrial use.",
    description:
      "A robust 5HP three-phase centrifugal pump for high-demand industrial and agricultural applications. Delivers exceptional flow rates with mechanical seal reliability.",
    price: 96000,
    cost: 72000,
    stock: 6,
    lowStockThreshold: 3,
    weightKg: 42,
    featured: false,
    active: true,
    images: [img("flowforce5")],
    tags: ["centrifugal", "industrial", "three-phase"],
    specs: {
      Power: "5 HP",
      Phase: "Three-phase 400V",
      "Inlet/Outlet": "3 inch / 3 inch",
      "Max Flow": "48,000 L/h",
      "Max Head": "32 m",
      Warranty: "1 year",
    },
  },
  {
    name: "MotorTech 1HP Monoblock Water Motor",
    slug: "motortech-1hp-monoblock-water-motor",
    sku: "WM-MT-10",
    brand: "MotorTech",
    categorySlug: "water-motors",
    shortDescription: "1HP monoblock water motor — copper winding, self-priming.",
    description:
      "A dependable 1HP self-priming monoblock motor pump for domestic water supply, tank filling and small gardens. 100% copper winding for cool, efficient running.",
    price: 21000,
    compareAtPrice: 24500,
    cost: 15000,
    stock: 40,
    lowStockThreshold: 10,
    weightKg: 11,
    featured: true,
    active: true,
    images: [img("motortech1"), img("motortech1b")],
    tags: ["motor", "monoblock", "self-priming", "domestic"],
    specs: {
      Power: "1 HP",
      "Max Flow": "6,000 L/h",
      "Max Head": "26 m",
      Winding: "100% Copper",
      Type: "Self-priming monoblock",
      Warranty: "1 year",
    },
  },
  {
    name: "MotorTech 0.5HP Water Motor",
    slug: "motortech-0-5hp-water-motor",
    sku: "WM-MT-05",
    brand: "MotorTech",
    categorySlug: "water-motors",
    shortDescription: "Compact 0.5HP motor for tanks and small homes.",
    description:
      "An economical and compact 0.5HP water motor for small homes, tank filling and light-duty pumping. Easy to install and maintain.",
    price: 13500,
    cost: 9000,
    stock: 3,
    lowStockThreshold: 8,
    weightKg: 7,
    featured: false,
    active: true,
    images: [img("motortech05")],
    tags: ["motor", "domestic", "compact"],
    specs: {
      Power: "0.5 HP",
      "Max Flow": "3,000 L/h",
      "Max Head": "18 m",
      Winding: "Copper",
      Warranty: "1 year",
    },
  },
  {
    name: "SolarMax MPPT Solar Pump Controller",
    slug: "solarmax-mppt-solar-pump-controller",
    sku: "AC-SM-CTRL",
    brand: "SolarMax",
    categorySlug: "accessories",
    shortDescription: "MPPT controller with dry-run & overload protection.",
    description:
      "Replacement MPPT solar pump controller compatible with SolarMax pumps. Provides dry-run protection, overload cut-off and real-time performance readout.",
    price: 15500,
    cost: 10500,
    stock: 20,
    lowStockThreshold: 6,
    weightKg: 2,
    featured: false,
    active: true,
    images: [img("controller")],
    tags: ["accessory", "controller", "solar"],
    specs: {
      Compatibility: "SolarMax 1–3 HP",
      Protection: "Dry-run, overload, over/under voltage",
      Display: "LCD",
      Warranty: "1 year",
    },
  },
  {
    name: "Brass Foot Valve 2 inch",
    slug: "brass-foot-valve-2-inch",
    sku: "AC-FV-2",
    brand: "AquaFlow",
    categorySlug: "accessories",
    shortDescription: "Heavy brass foot valve with strainer — 2 inch.",
    description:
      "A durable 2-inch brass foot valve with strainer keeps your suction line primed and debris-free. Corrosion resistant and long-lasting.",
    price: 2800,
    cost: 1600,
    stock: 60,
    lowStockThreshold: 15,
    weightKg: 1,
    featured: false,
    active: true,
    images: [img("footvalve")],
    tags: ["accessory", "valve", "brass"],
    specs: {
      Size: "2 inch",
      Material: "Brass",
      Type: "Foot valve with strainer",
    },
  },
  {
    name: "Automatic Pressure Switch",
    slug: "automatic-pressure-switch",
    sku: "AC-PS-01",
    brand: "PressurePro",
    categorySlug: "accessories",
    shortDescription: "Adjustable automatic on/off pressure switch.",
    description:
      "An adjustable automatic pressure switch that turns your pump on and off based on system pressure, protecting the motor and saving energy. Universal 1/4-inch fitting.",
    price: 1900,
    cost: 950,
    stock: 0,
    lowStockThreshold: 12,
    weightKg: 0.5,
    featured: false,
    active: true,
    images: [img("pressureswitch")],
    tags: ["accessory", "switch", "automatic"],
    specs: {
      "Pressure Range": "1.4 – 4.6 bar",
      Fitting: "1/4 inch",
      Contact: "230V / 20A",
    },
  },
];
