/**
 * ============================================================================
 *  DEMO CATALOG  —  REPLACE WITH YOUR REAL PRODUCTS
 * ============================================================================
 *  Single source of truth for the demo catalog. Used to seed the database
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

export const categories: SeedCategory[] = [
  // --- Water Pumps ---
  { name: "Centrifugal Pumps", slug: "centrifugal-pumps", description: "High-flow centrifugal pumps for agriculture, industry and water transfer.", image: img("cat-centrifugal"), sortOrder: 1 },
  { name: "Solar Pumps", slug: "solar-pumps", description: "Solar-powered water pumps for irrigation and off-grid supply.", image: img("cat-solar"), sortOrder: 2 },
  { name: "Submersible Pumps and Motors", slug: "submersible-pumps", description: "Deep-well and borehole submersible pumps for reliable groundwater extraction.", image: img("cat-submersible"), sortOrder: 3 },
  { name: "Pressure Pumps", slug: "pressure-pumps", description: "Boost water pressure for homes and apartments — showers, taps and geysers.", image: img("cat-pressure"), sortOrder: 4 },
  { name: "Swimming Pool Pumps", slug: "swimming-pool-pumps", description: "Circulation and filtration pumps for swimming pools.", image: img("cat-pool"), sortOrder: 5 },
  { name: "Fountain Pumps", slug: "fountain-pumps", description: "Quiet, efficient pumps for decorative fountains and water features.", image: img("cat-fountain"), sortOrder: 6 },
  { name: "Circulating Pumps", slug: "circulating-pumps", description: "Hot-water and heating circulation pumps for homes and buildings.", image: img("cat-circulating"), sortOrder: 7 },
  { name: "Self-Priming Pumps", slug: "self-priming-pumps", description: "Self-priming surface pumps that draw water without manual priming.", image: img("cat-selfprime"), sortOrder: 8 },
  { name: "Submersible Sewage Pumps", slug: "submersible-sewage-pumps", description: "Heavy-duty pumps for drainage, sewage and dirty water.", image: img("cat-sewage"), sortOrder: 9 },
  { name: "High Pressure Washers", slug: "high-pressure-washers", description: "Powerful pressure washers for cleaning vehicles, floors and equipment.", image: img("cat-washer"), sortOrder: 10 },
  { name: "Chemical Dosing Pumps", slug: "chemical-dosing-pumps", description: "Precise metering pumps for chemical dosing and treatment.", image: img("cat-dosing"), sortOrder: 11 },
  { name: "Gear Pumps", slug: "gear-pumps", description: "Positive-displacement gear pumps for oils and viscous fluids.", image: img("cat-gear"), sortOrder: 12 },
  // --- Tanks / Seals / Switches / Motors / Accessories ---
  { name: "Pressure Tanks", slug: "pressure-tanks", description: "Pressure and expansion tanks for stable water systems.", image: img("cat-tanks"), sortOrder: 13 },
  { name: "Pump Seals", slug: "pump-seals", description: "Genuine pump seals to keep your system leak-free.", image: img("cat-seals"), sortOrder: 14 },
  { name: "Mechanical Seals", slug: "mechanical-seals", description: "Durable mechanical seals for a wide range of pumps.", image: img("cat-mechseals"), sortOrder: 15 },
  { name: "Pressure Switches", slug: "pressure-switches", description: "Automatic pressure switches to control your pump.", image: img("cat-pswitch"), sortOrder: 16 },
  { name: "Float Switches", slug: "float-switches", description: "Float switches for automatic tank level control.", image: img("cat-float"), sortOrder: 17 },
  { name: "Automatic Pump Control Switch", slug: "automatic-pump-control-switch", description: "Smart automatic pump controllers with dry-run protection.", image: img("cat-autocontrol"), sortOrder: 18 },
  { name: "Pressure Drives", slug: "pressure-drives", description: "Variable-speed pressure drives for constant pressure systems.", image: img("cat-drives"), sortOrder: 19 },
  { name: "Induction Motors", slug: "induction-motors", description: "Reliable electric induction motors and monoblock units.", image: img("cat-induction"), sortOrder: 20 },
  { name: "Submersible Motors", slug: "submersible-motors", description: "Submersible electric motors for borewell pumps.", image: img("cat-submotor"), sortOrder: 21 },
  { name: "Pump Accessories", slug: "pump-accessories", description: "Controllers, pipes, foot valves and genuine spare parts.", image: img("cat-accessories"), sortOrder: 22 },
];

export const products: SeedProduct[] = [
  {
    name: "1 HP Solar Surface Water Pump",
    slug: "1hp-solar-surface-water-pump",
    sku: "SP-SOL-1HP",
    brand: "Pedrollo",
    categorySlug: "solar-pumps",
    shortDescription: "1HP DC solar surface pump with MPPT controller — ideal for small farms.",
    description:
      "Runs entirely on solar energy, delivering reliable irrigation without electricity bills. Includes an MPPT controller for maximum efficiency and dry-run protection. Perfect for small to medium farms, gardens and off-grid homes.",
    price: 78000, compareAtPrice: 92000, cost: 58000, stock: 24, lowStockThreshold: 5, weightKg: 14,
    featured: true, active: true, images: [img("solar1"), img("solar1b"), img("solar1c")],
    tags: ["solar", "irrigation", "dc", "eco"],
    specs: { Power: "1 HP (0.75 kW)", "Max Flow": "8,000 L/h", "Max Head": "30 m", "Panel Requirement": "1000 W", Controller: "MPPT with dry-run protection", Warranty: "2 years" },
  },
  {
    name: "2 HP Solar Submersible Pump",
    slug: "2hp-solar-submersible-pump",
    sku: "SP-SOL-2HP",
    brand: "Pedrollo",
    categorySlug: "solar-pumps",
    shortDescription: "2HP solar submersible pump for deep wells up to 60m.",
    description:
      "A powerful 2HP solar submersible pump engineered for deep boreholes. Stainless steel construction resists corrosion and the smart controller adjusts output to available sunlight for all-day pumping.",
    price: 165000, compareAtPrice: 189000, cost: 128000, stock: 12, lowStockThreshold: 4, weightKg: 22,
    featured: true, active: true, images: [img("solar2"), img("solar2b")],
    tags: ["solar", "submersible", "borehole"],
    specs: { Power: "2 HP (1.5 kW)", "Max Flow": "10,000 L/h", "Max Head": "60 m", "Panel Requirement": "2000 W", Material: "Stainless Steel 304", Warranty: "2 years" },
  },
  {
    name: "1.5 HP Submersible Borewell Pump",
    slug: "1-5hp-submersible-borewell-pump",
    sku: "SB-15",
    brand: "LEO",
    categorySlug: "submersible-pumps",
    shortDescription: "1.5HP 4-inch borewell submersible pump, copper winding.",
    description:
      "Fits standard 4-inch borewells and delivers steady flow from deep water tables. 100% copper winding motor ensures long life and energy efficiency.",
    price: 42000, compareAtPrice: 48000, cost: 31000, stock: 30, lowStockThreshold: 6, weightKg: 16,
    featured: true, active: true, images: [img("sub15"), img("sub15b")],
    tags: ["submersible", "borewell", "copper"],
    specs: { Power: "1.5 HP", "Outlet Size": "1.25 inch", "Max Head": "45 m", "Bore Size": "4 inch", Winding: "100% Copper", Warranty: "1 year" },
  },
  {
    name: "3 HP Submersible Pump",
    slug: "3hp-submersible-pump",
    sku: "SB-30",
    brand: "LEO",
    categorySlug: "submersible-pumps",
    shortDescription: "Heavy-duty 3HP submersible pump for deep wells and farms.",
    description:
      "Built for demanding agricultural and commercial use, this 3HP submersible pump pushes water from depths up to 90 metres with excellent flow. Thermal overload protection included.",
    price: 89000, cost: 67000, stock: 8, lowStockThreshold: 4, weightKg: 24,
    featured: false, active: true, images: [img("sub3")],
    tags: ["submersible", "agriculture", "heavy-duty"],
    specs: { Power: "3 HP", "Outlet Size": "2 inch", "Max Head": "90 m", "Max Flow": "12,000 L/h", Protection: "Thermal overload", Warranty: "1 year" },
  },
  {
    name: "0.5 HP Pressure Booster Pump",
    slug: "0-5hp-pressure-booster-pump",
    sku: "PB-05",
    brand: "Espa",
    categorySlug: "pressure-pumps",
    shortDescription: "Automatic 0.5HP pressure booster for homes and apartments.",
    description:
      "Say goodbye to weak showers. This 0.5HP automatic booster pump increases water pressure to taps, showers and geysers with a built-in flow sensor that starts and stops automatically.",
    price: 18500, compareAtPrice: 22000, cost: 12500, stock: 45, lowStockThreshold: 10, weightKg: 6,
    featured: true, active: true, images: [img("press05"), img("press05b")],
    tags: ["pressure", "booster", "home", "automatic"],
    specs: { Power: "0.5 HP", "Max Flow": "2,400 L/h", "Max Head": "18 m", Control: "Automatic flow switch", Noise: "Low-noise design", Warranty: "1 year" },
  },
  {
    name: "1 HP Pressure Booster Pump",
    slug: "1hp-pressure-booster-pump",
    sku: "PB-10",
    brand: "Espa",
    categorySlug: "pressure-pumps",
    shortDescription: "1HP pressure booster for multi-storey homes.",
    description:
      "A stronger 1HP booster for two- and three-storey homes needing consistent pressure across multiple bathrooms. Quiet, efficient and fully automatic.",
    price: 27500, cost: 19000, stock: 22, lowStockThreshold: 8, weightKg: 8,
    featured: false, active: true, images: [img("press10")],
    tags: ["pressure", "booster", "multistorey"],
    specs: { Power: "1 HP", "Max Flow": "3,600 L/h", "Max Head": "28 m", Control: "Automatic pressure switch", Warranty: "1 year" },
  },
  {
    name: "2 HP Centrifugal Pump",
    slug: "2hp-centrifugal-pump",
    sku: "CF-20",
    brand: "Hyundai",
    categorySlug: "centrifugal-pumps",
    shortDescription: "2HP high-flow centrifugal pump for water transfer.",
    description:
      "Moves large volumes of water quickly — ideal for filling tanks, irrigation channels and industrial transfer. Cast-iron body for durability.",
    price: 34000, compareAtPrice: 39000, cost: 24000, stock: 18, lowStockThreshold: 5, weightKg: 18,
    featured: true, active: true, images: [img("cf2"), img("cf2b")],
    tags: ["centrifugal", "transfer", "agriculture"],
    specs: { Power: "2 HP", "Inlet/Outlet": "2 inch / 2 inch", "Max Flow": "24,000 L/h", "Max Head": "22 m", Body: "Cast iron", Warranty: "1 year" },
  },
  {
    name: "5 HP Industrial Centrifugal Pump",
    slug: "5hp-industrial-centrifugal-pump",
    sku: "CF-50",
    brand: "Hyundai",
    categorySlug: "centrifugal-pumps",
    shortDescription: "5HP three-phase centrifugal pump for industrial use.",
    description:
      "A robust 5HP three-phase centrifugal pump for high-demand industrial and agricultural applications. Delivers exceptional flow rates with mechanical seal reliability.",
    price: 96000, cost: 72000, stock: 6, lowStockThreshold: 3, weightKg: 42,
    featured: false, active: true, images: [img("cf5")],
    tags: ["centrifugal", "industrial", "three-phase"],
    specs: { Power: "5 HP", Phase: "Three-phase 400V", "Inlet/Outlet": "3 inch / 3 inch", "Max Flow": "48,000 L/h", "Max Head": "32 m", Warranty: "1 year" },
  },
  {
    name: "1 HP Monoblock Motor Pump",
    slug: "1hp-monoblock-motor-pump",
    sku: "IM-10",
    brand: "Taifu",
    categorySlug: "induction-motors",
    shortDescription: "1HP monoblock induction motor pump — copper winding, self-priming.",
    description:
      "A dependable 1HP self-priming monoblock motor pump for domestic water supply, tank filling and small gardens. 100% copper winding for cool, efficient running.",
    price: 21000, compareAtPrice: 24500, cost: 15000, stock: 40, lowStockThreshold: 10, weightKg: 11,
    featured: true, active: true, images: [img("motor1"), img("motor1b")],
    tags: ["motor", "monoblock", "self-priming", "domestic"],
    specs: { Power: "1 HP", "Max Flow": "6,000 L/h", "Max Head": "26 m", Winding: "100% Copper", Type: "Self-priming monoblock", Warranty: "1 year" },
  },
  {
    name: "0.5 HP Water Motor",
    slug: "0-5hp-water-motor",
    sku: "IM-05",
    brand: "Taifu",
    categorySlug: "induction-motors",
    shortDescription: "Compact 0.5HP motor for tanks and small homes.",
    description:
      "An economical and compact 0.5HP water motor for small homes, tank filling and light-duty pumping. Easy to install and maintain.",
    price: 13500, cost: 9000, stock: 3, lowStockThreshold: 8, weightKg: 7,
    featured: false, active: true, images: [img("motor05")],
    tags: ["motor", "domestic", "compact"],
    specs: { Power: "0.5 HP", "Max Flow": "3,000 L/h", "Max Head": "18 m", Winding: "Copper", Warranty: "1 year" },
  },
  {
    name: "MPPT Solar Pump Controller",
    slug: "mppt-solar-pump-controller",
    sku: "AC-CTRL",
    brand: "PUMPCO",
    categorySlug: "automatic-pump-control-switch",
    shortDescription: "MPPT controller with dry-run & overload protection.",
    description:
      "MPPT solar pump controller with dry-run protection, overload cut-off and real-time performance readout. Compatible with 1–3 HP solar pumps.",
    price: 15500, cost: 10500, stock: 20, lowStockThreshold: 6, weightKg: 2,
    featured: false, active: true, images: [img("controller")],
    tags: ["accessory", "controller", "solar"],
    specs: { Compatibility: "1–3 HP solar pumps", Protection: "Dry-run, overload, over/under voltage", Display: "LCD", Warranty: "1 year" },
  },
  {
    name: "Brass Foot Valve 2 inch",
    slug: "brass-foot-valve-2-inch",
    sku: "AC-FV-2",
    brand: "Ingco",
    categorySlug: "pump-accessories",
    shortDescription: "Heavy brass foot valve with strainer — 2 inch.",
    description:
      "A durable 2-inch brass foot valve with strainer keeps your suction line primed and debris-free. Corrosion resistant and long-lasting.",
    price: 2800, cost: 1600, stock: 60, lowStockThreshold: 15, weightKg: 1,
    featured: false, active: true, images: [img("footvalve")],
    tags: ["accessory", "valve", "brass"],
    specs: { Size: "2 inch", Material: "Brass", Type: "Foot valve with strainer" },
  },
  {
    name: "Automatic Pressure Switch",
    slug: "automatic-pressure-switch",
    sku: "AC-PS-01",
    brand: "Happy",
    categorySlug: "pressure-switches",
    shortDescription: "Adjustable automatic on/off pressure switch.",
    description:
      "An adjustable automatic pressure switch that turns your pump on and off based on system pressure, protecting the motor and saving energy. Universal 1/4-inch fitting.",
    price: 1900, compareAtPrice: 2600, cost: 950, stock: 35, lowStockThreshold: 12, weightKg: 0.5,
    featured: false, active: true, images: [img("pswitch")],
    tags: ["accessory", "switch", "automatic"],
    specs: { "Pressure Range": "1.4 – 4.6 bar", Fitting: "1/4 inch", Contact: "230V / 20A" },
  },

  // --- USED / REFURBISHED ---
  {
    name: "Used 1.5 HP Submersible Pump (Refurbished)",
    slug: "used-1-5hp-submersible-pump",
    sku: "US-SB-15",
    brand: "LEO",
    categorySlug: "submersible-pumps",
    condition: "USED",
    shortDescription: "Tested & refurbished 1.5HP submersible pump — great value.",
    description:
      "A fully tested and refurbished 1.5HP submersible pump. Professionally serviced with new seals and inspected for performance. Backed by a 3-month workshop warranty — an economical choice for borewells.",
    price: 26000, compareAtPrice: 42000, cost: 15000, stock: 4, lowStockThreshold: 2, weightKg: 16,
    featured: false, active: true, images: [img("used-sub-1"), img("used-sub-1b")],
    tags: ["used", "refurbished", "submersible"],
    specs: { Power: "1.5 HP", Condition: "Refurbished — tested", "Max Head": "45 m", Warranty: "3 months (workshop)" },
  },
  {
    name: "Used 2 HP Submersible Pump",
    slug: "used-2hp-submersible-pump",
    sku: "US-SB-20",
    brand: "Pedrollo",
    categorySlug: "submersible-pumps",
    condition: "USED",
    shortDescription: "Second-hand 2HP submersible pump in good working condition.",
    description:
      "A second-hand 2HP submersible pump in good working order. Fully functional, cosmetic wear only. Ideal for budget-conscious buyers who need reliable deep-well pumping.",
    price: 62000, compareAtPrice: 95000, cost: 40000, stock: 2, lowStockThreshold: 2, weightKg: 21,
    featured: false, active: true, images: [img("used-sub-2")],
    tags: ["used", "submersible"],
    specs: { Power: "2 HP", Condition: "Used — good", "Max Head": "60 m", Warranty: "1 month" },
  },
  {
    name: "Used 2 HP Centrifugal Pump (Refurbished)",
    slug: "used-2hp-centrifugal-pump",
    sku: "US-CF-20",
    brand: "Hyundai",
    categorySlug: "centrifugal-pumps",
    condition: "USED",
    shortDescription: "Refurbished 2HP centrifugal pump — serviced & tested.",
    description:
      "This refurbished 2HP centrifugal pump has been serviced with a new mechanical seal and bearings, then performance-tested. Excellent value for water transfer and irrigation.",
    price: 21000, compareAtPrice: 34000, cost: 12000, stock: 5, lowStockThreshold: 2, weightKg: 18,
    featured: false, active: true, images: [img("used-cf-1"), img("used-cf-1b")],
    tags: ["used", "refurbished", "centrifugal"],
    specs: { Power: "2 HP", Condition: "Refurbished — tested", "Max Flow": "24,000 L/h", Warranty: "3 months (workshop)" },
  },
  {
    name: "Used 3 HP Centrifugal Pump",
    slug: "used-3hp-centrifugal-pump",
    sku: "US-CF-30",
    brand: "Hyundai",
    categorySlug: "centrifugal-pumps",
    condition: "USED",
    shortDescription: "Second-hand 3HP centrifugal pump, single-phase.",
    description:
      "A used 3HP single-phase centrifugal pump in working condition. Some cosmetic wear. Great for agricultural water transfer on a budget.",
    price: 33000, compareAtPrice: 52000, cost: 20000, stock: 3, lowStockThreshold: 2, weightKg: 26,
    featured: false, active: true, images: [img("used-cf-2")],
    tags: ["used", "centrifugal"],
    specs: { Power: "3 HP", Condition: "Used — working", Phase: "Single-phase", Warranty: "1 month" },
  },
];
