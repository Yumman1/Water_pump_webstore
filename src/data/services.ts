/**
 * SERVICES - edit to match the services your business offers.
 * Images live under /public/services/.
 * Each service gets its own page at /services/[slug] with a request form.
 *
 * Installation & removal is offered at checkout (not as a standalone service page).
 */
export type Service = {
  slug: string;
  title: string;
  image: string;
  short: string;
  description: string;
  features: string[];
  priceFrom?: string;
};

export const services: Service[] = [
  {
    slug: "fountain-setup",
    title: "Fountain Setup",
    image: "/services/fountain-setup.png",
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
    image: "/services/swimming-pool-maintenance.png",
    short: "Keep your pool clean, safe and crystal clear year-round.",
    description:
      "Complete swimming pool care including cleaning, water balancing, filtration and pump servicing. One-time cleanups or regular maintenance contracts available.",
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
    image: "/services/deep-well-boring.png",
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
