import { formatCurrency } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

const VIEW_LABELS = [
  "front view",
  "side angle",
  "detail close-up",
  "motor and pump assembly",
  "packaging view",
  "gallery image",
];

/** Descriptive alt text with Jawed / Javed spelling variants for image SEO. */
export function productImageAlt(product: Product, index = 0): string {
  const view = VIEW_LABELS[index] ?? `image ${index + 1}`;
  const category = product.category?.name?.toLowerCase() ?? "water pump";
  return `Jawed ${product.name} (${view}) — Javed ${category} for home and bore use in Karachi, Pakistan`;
}

export function productPageTitle(product: Product): string {
  const price = formatCurrency(product.price);
  const power = product.specs?.Power;
  const specPart = power ? ` | ${power}` : "";
  return `${product.name} | ${price}${specPart} | Jawed Pumps Karachi`;
}

export function productPageDescription(product: Product): string {
  const price = formatCurrency(product.price);
  const summary =
    product.shortDescription ??
    `Genuine ${product.name} from Jawed Engineering Pumps with nationwide delivery.`;
  const copper =
    product.specs?.["Winding Material"]?.includes("Copper") ||
    product.name.toLowerCase().includes("copper")
      ? "100% copper winding for efficient, reliable duty. "
      : "";
  return (
    `Buy ${product.name} in Karachi & across Pakistan. ${summary} ${copper}` +
    `Best water pump for home, bore and farm use. Javed motor pump quality at ${price}. ` +
    `Cash on delivery & expert support from Jawed Pumps since 1980.`
  );
}

export function categoryPageTitle(category: Category): string {
  return `${category.name} Price in Pakistan | Jawed Pumps`;
}

export function categoryPageDescription(category: Category): string {
  const base =
    category.description ??
    `Shop ${category.name} from Jawed Engineering Pumps in Karachi.`;
  return (
    `${base} Compare ${category.name.toLowerCase()} water pump price in Pakistan, ` +
    `with genuine Jawed copper winding options, nationwide shipping and cash on delivery.`
  );
}

export type FaqItem = { question: string; answer: string };

export const CATEGORY_FAQS: Record<string, FaqItem[]> = {
  "copper-motors": [
    {
      question: "Which Jawed copper motor is best for home use?",
      answer:
        "For typical homes, the 0.5HP or 1HP Jawed copper motor with 100% copper winding is ideal for light to medium pressure and overhead tank filling. Match motor HP to your pump and floor height.",
    },
    {
      question: "Are Jawed motors 100% copper winding?",
      answer:
        "Yes. Jawed copper motors in this range use 100% copper winding for cooler running, better efficiency and longer service life compared to aluminium winding alternatives.",
    },
    {
      question: "Which pump is best for low electricity consumption?",
      answer:
        "A correctly sized Jawed copper motor paired with the right pump avoids overloading. 0.5HP suits light domestic duty; 1HP J series covers most home and small farm needs without excess power draw.",
    },
  ],
  "monoblock-pressure-pumps": [
    {
      question: "What is a monoblock pressure pump used for?",
      answer:
        "Monoblock pressure pumps combine motor and pump in one unit for boosting water to overhead tanks, bathrooms and kitchens. Jawed monoblock pumps suit homes, farms and light commercial pressure systems.",
    },
    {
      question: "Which Jawed monoblock pump is best for home use?",
      answer:
        "0.5HP suits small homes and single-storey tanks; 1HP covers multi-storey houses and higher head. Choose Jawed for genuine copper winding and local warranty support in Karachi.",
    },
    {
      question: "Can I use a monoblock pump for bore water?",
      answer:
        "Monoblock pumps are designed for pressure boosting from storage or suction lines, not deep bore suction. For bore applications, pair a Jawed copper motor with a bearing pump from our catalog.",
    },
  ],
  "bearing-pumps": [
    {
      question: "Which bearing pump is best for bore and deep well?",
      answer:
        "Jawed GD series bearing pumps (GD25000, GD7000, GD45000) suit 30–60 feet bore suction depending on model. Match with a 1HP Jawed copper motor for a complete donkey pump set.",
    },
    {
      question: "What is the difference between monoblock and bearing pumps?",
      answer:
        "Monoblock units are self-contained pressure boosters. Bearing pumps use a separate motor and belt drive, ideal for deeper suction from wells and bores — common as donkey pump setups in Pakistan.",
    },
    {
      question: "Do Jawed bearing pumps work with non-Jawed motors?",
      answer:
        "Yes. Jawed bearing pumps can pair with compatible HP-rated motors. For warranty and balanced performance, we recommend matched Jawed motor and pump complete sets.",
    },
  ],
  "complete-sets": [
    {
      question: "Why buy a complete motor and pump set?",
      answer:
        "Complete sets from Jawed Pumps are HP-matched for correct flow, suction and motor load — ready to install with one warranty contact and no compatibility guesswork.",
    },
    {
      question: "Which complete set is best for agricultural use?",
      answer:
        "1HP J or S series motor sets with GD25000 or GD7000 bearing pumps handle typical farm bore and irrigation duty. For heavier head, consider full-load 1HP with 2HP class bearing pumps.",
    },
    {
      question: "Is installation included with complete sets?",
      answer:
        "Installation and removal is available at checkout for Karachi customers. Outside Karachi, nationwide delivery applies with optional warranty replacement support.",
    },
  ],
};

export function getCategoryFaqs(slug: string): FaqItem[] {
  return CATEGORY_FAQS[slug] ?? [
    {
      question: "Does Jawed Pumps deliver across Pakistan?",
      answer:
        "Yes. Jawed Pumps & Motors delivers nationwide from Karachi with city-based delivery fees and cash on delivery on eligible orders.",
    },
    {
      question: "Are Jawed products genuine with warranty?",
      answer:
        "All Jawed catalog products are genuine with manufacturer warranty. Jawed Engineering Pumps has served Pakistan since 1980.",
    },
  ];
}
