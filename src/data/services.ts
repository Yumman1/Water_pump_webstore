/**
 * SERVICES  —  edit to match the services your business offers.
 * Each service gets its own page at /services/[slug] with a request form.
 */
export type Service = {
  slug: string;
  title: string;
  emoji: string;
  short: string;
  description: string;
  features: string[];
  priceFrom?: string;
};

export const services: Service[] = [
  {
    slug: "plumbing-service",
    title: "Plumbing Service",
    emoji: "🔧",
    short: "Professional plumbing for homes, offices and commercial spaces.",
    description:
      "Our experienced plumbers handle everything from leak repairs and pipe fittings to complete water-supply installations. Fast, clean and reliable work with genuine parts.",
    features: [
      "Leak detection & repair",
      "Pipe fitting & replacement",
      "Water tank & supply line installation",
      "Tap, valve & fixture fitting",
      "Emergency call-outs",
    ],
    priceFrom: "Rs 1,500",
  },
  {
    slug: "pump-installation-removal",
    title: "Pump Installation & Removal",
    emoji: "⚙️",
    short: "Expert installation, replacement and removal of all pump types.",
    description:
      "We install, replace and remove submersible, centrifugal, solar and pressure pumps safely and correctly. Includes wiring, pipe connections, testing and commissioning.",
    features: [
      "Submersible & borewell pump installation",
      "Surface & monoblock pump setup",
      "Solar pump installation & panel wiring",
      "Old pump removal & disposal",
      "On-site testing & commissioning",
    ],
    priceFrom: "Rs 3,000",
  },
  {
    slug: "fountain-setup",
    title: "Fountain Setup",
    emoji: "⛲",
    short: "Design and installation of decorative water fountains.",
    description:
      "Transform your garden, lawn or lobby with a custom water fountain. We handle design, pump selection, plumbing, nozzles and lighting for a stunning result.",
    features: [
      "Custom fountain design",
      "Pump & nozzle selection",
      "Plumbing & water recirculation",
      "LED lighting integration",
      "Maintenance guidance",
    ],
    priceFrom: "Rs 10,000",
  },
  {
    slug: "swimming-pool-maintenance",
    title: "Swimming Pool Maintenance",
    emoji: "🏊",
    short: "Keep your pool clean, safe and crystal clear year-round.",
    description:
      "Complete swimming pool care — cleaning, water balancing, filtration and pump servicing. One-time cleanups or regular maintenance contracts available.",
    features: [
      "Pool cleaning & vacuuming",
      "Water testing & chemical balancing",
      "Filter & pump servicing",
      "Tile & surface cleaning",
      "Scheduled maintenance plans",
    ],
    priceFrom: "Rs 5,000",
  },
  {
    slug: "deep-well-boring",
    title: "Deep Well Boring",
    emoji: "🕳️",
    short: "Professional borehole drilling for reliable groundwater.",
    description:
      "We drill deep wells and boreholes for domestic, agricultural and commercial water supply using modern rigs. Includes site survey, drilling, casing and pump installation.",
    features: [
      "Site survey & water-table assessment",
      "Borehole drilling (various depths)",
      "Casing & development",
      "Submersible pump installation",
      "Water yield testing",
    ],
    priceFrom: "Request a quote",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
