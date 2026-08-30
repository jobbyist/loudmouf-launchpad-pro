// Shared product data for the Premium Herbal Tinctures collection (/herbal-tinctures).
// Imported by both the landing page and the Paystack server routes — server code
// resolves price/name from here so the client can never tamper with the charge amount.

export type TinctureTier = "morning" | "afternoon" | "night";

export interface TinctureIngredient {
  name: string;
  role: string;
}

export interface TinctureProduct {
  id: TinctureTier;
  index: string;
  daypart: string;
  strain: "Sativa" | "Hybrid" | "Indica";
  name: string;
  flavourLine: string;
  effectsLine: string;
  tagline: string;
  quote: string;
  description: string;
  potencyLabel: string;
  volumeLabel: string;
  priceZar: number;
  image: string;
  imageAlt: string;
  color: string;
  colorSoft: string;
  ingredients: TinctureIngredient[];
}

export const TINCTURE_GOLD = "#BF7826";
export const TINCTURE_INK = "#1C1A17";

export const TINCTURE_PRODUCTS: TinctureProduct[] = [
  {
    id: "morning",
    index: "01",
    daypart: "Morning / Sunrise",
    strain: "Sativa",
    name: "Goji Berry, Honey & Ginseng Extract",
    flavourLine: "Goji Berry, Honey & Ginseng",
    effectsLine: "Provides stimulating, uplifting & energy-boosting effects.",
    tagline: "Focus & Vitality",
    quote: "The loud start to the day.",
    description:
      "LOUDMOUF's flagship Sativa tincture pairs the bright, tart snap of goji berry with warm honey and ginseng extract. Built for daytime use, it's formulated as an energising, mood-lifting companion for the day ahead.",
    potencyLabel: "100mg – Sativa",
    volumeLabel: "10ml · Botanical spirit base",
    priceZar: 295,
    image: "/images/tinctures/morning-sativa.png",
    imageAlt: "LOUDMOUF Herbal Tincture — Goji Berry, Honey & Ginseng, 100mg Sativa",
    color: "#99291D",
    colorSoft: "rgba(153,41,29,0.18)",
    ingredients: [
      {
        name: "Goji Berry",
        role: "Bright, tart fruit base; antioxidant-rich, the brand's signature fruit note.",
      },
      {
        name: "Honey",
        role: "Natural sweetness and smooth mouthfeel; softens the tincture's herbal edge.",
      },
      {
        name: "Ginseng Extract",
        role: "Energising adaptogen; the functional botanical driving the “uplifting” effect.",
      },
    ],
  },
  {
    id: "afternoon",
    index: "02",
    daypart: "Afternoon",
    strain: "Hybrid",
    name: "Passionflower, Holy Basil & Moringa",
    flavourLine: "Passionflower, Holy Basil & Moringa",
    effectsLine: "Provides balancing, clarifying & stress-easing effects.",
    tagline: "Equilibrium & Clarity",
    quote: "The 3pm reset — balance, not sedation.",
    description:
      "LOUDMOUF's Hybrid tincture is the range's midday reset — moringa's deep, green-tea earthiness lifted by the peppery brightness of holy basil and a faint floral whisper of passionflower. Formulated to ease the afternoon slump without the crash.",
    potencyLabel: "100mg – Hybrid",
    volumeLabel: "10ml · Botanical spirit base",
    priceZar: 295,
    image: "/images/tinctures/afternoon-hybrid.jpg",
    imageAlt: "LOUDMOUF Herbal Tincture — Passionflower, Holy Basil & Moringa, 100mg Hybrid",
    color: "#CCCB40",
    colorSoft: "rgba(204,203,64,0.16)",
    ingredients: [
      {
        name: "Passionflower",
        role: "Faint floral note; a delicate calming botanical without heaviness.",
      },
      {
        name: "Holy Basil",
        role: "Peppery, citrusy brightness; adaptogenic herb traditionally used for balance under stress.",
      },
      {
        name: "Moringa",
        role: "Deep, green-tea earthiness; nutrient-dense botanical carrying the blend's structure.",
      },
    ],
  },
  {
    id: "night",
    index: "03",
    daypart: "Night / Sunset",
    strain: "Indica",
    name: "Soursop, Blue Chamomile & Ashwagandha",
    flavourLine: "Soursop, Blue Chamomile & Ashwaghanda",
    effectsLine: "Provides calming, relaxing & stress-relieving effects.",
    tagline: "Deep Rest & Recovery",
    quote: "The quiet close to a loud day.",
    description:
      "LOUDMOUF's Indica tincture is the range's night counterpart — soursop's tropical, creamy-tart edge softens the musky depth of ashwagandha, closing on a soothing blue chamomile finish. Built for evening use.",
    potencyLabel: "100mg – Indica",
    volumeLabel: "10ml · Botanical spirit base",
    priceZar: 295,
    image: "/images/tinctures/night-indica.jpg",
    imageAlt: "LOUDMOUF Herbal Tincture — Soursop, Blue Chamomile & Ashwagandha, 100mg Indica",
    color: "#B7BADB",
    colorSoft: "rgba(183,186,219,0.18)",
    ingredients: [
      {
        name: "Soursop",
        role: "Tropical, creamy-tart fruit base; softens the earthier notes in the blend.",
      },
      {
        name: "Blue Chamomile",
        role: "Calming floral finish; a rare extraction that lends the blend its hue.",
      },
      {
        name: "Ashwagandha",
        role: "Calming adaptogen; grounding, traditionally used to support rest and recovery.",
      },
    ],
  },
];

export function getTinctureProduct(id: string | undefined | null): TinctureProduct | undefined {
  return TINCTURE_PRODUCTS.find((p) => p.id === id);
}
