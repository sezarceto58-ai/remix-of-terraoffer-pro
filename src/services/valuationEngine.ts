// Module 1 — AI Valuation Engine (client-side, no external API)

interface ValuationInput {
  city: string;
  district?: string;
  propertyType: string;
  area: number; // sqm
  price: number;
  yearBuilt?: number | null;
  features?: string[];
  verified?: boolean;
}

export interface ValuationResult {
  estimatedValue: number;
  pricePerSqm: number;
  marketPricePerSqm: number;
  vsMarketPercent: number;
  verdict: "Undervalued" | "Fair" | "Overvalued";
  verdictColor: string;
  forecast1yr: number;
  forecast3yr: number;
  forecast5yr: number;
  factors: string[];
}

const CITY_BASE_RATES: Record<string, number> = {
  erbil: 2200,
  baghdad: 1850,
  basra: 1400,
  sulaymaniyah: 1650,
};

const DISTRICT_MULTIPLIERS: Record<string, number> = {
  // Erbil
  ankawa: 1.25, "dream city": 1.30, "empire world": 1.35, "english village": 1.20,
  // Baghdad
  mansour: 1.30, karrada: 1.15, jadriya: 1.20, "green zone": 1.40,
  // Basra
  "basra times square": 1.15, "shatt al-arab": 1.10,
  // Sulaymaniyah
  sarchnar: 1.15, salim: 1.10,
};

const TYPE_MULTIPLIERS: Record<string, number> = {
  villa: 1.20, penthouse: 1.35, apartment: 1.0, townhouse: 1.10,
  commercial: 1.15, land: 0.85, warehouse: 0.75, office: 1.05,
};

const PREMIUM_FEATURES = [
  "pool", "smart home", "view", "gym", "garden", "security",
  "elevator", "parking", "balcony", "rooftop",
];

const CITY_GROWTH_RATES: Record<string, number> = {
  erbil: 0.08, baghdad: 0.05, basra: 0.04, sulaymaniyah: 0.06,
};

export function calculateValuation(input: ValuationInput): ValuationResult {
  const cityKey = input.city.toLowerCase();
  const districtKey = input.district?.toLowerCase() ?? "";
  const typeKey = input.propertyType.toLowerCase();

  const baseRate = CITY_BASE_RATES[cityKey] ?? 1600;
  const districtMult = DISTRICT_MULTIPLIERS[districtKey] ?? 1.0;
  const typeMult = TYPE_MULTIPLIERS[typeKey] ?? 1.0;

  // Age depreciation: 0.8%/yr, max 20%
  const currentYear = new Date().getFullYear();
  const age = input.yearBuilt ? Math.max(0, currentYear - input.yearBuilt) : 0;
  const ageDepreciation = Math.min(age * 0.008, 0.20);

  // Feature premiums: +2.5% per premium feature
  const matchedFeatures = (input.features ?? []).filter((f) =>
    PREMIUM_FEATURES.some((pf) => f.toLowerCase().includes(pf))
  );
  const featurePremium = matchedFeatures.length * 0.025;

  const verifiedBonus = input.verified ? 0.03 : 0;

  const marketPricePerSqm =
    baseRate * districtMult * typeMult *
    (1 - ageDepreciation) *
    (1 + featurePremium) *
    (1 + verifiedBonus);

  const estimatedValue = Math.round(marketPricePerSqm * input.area);
  const pricePerSqm = Math.round(input.price / input.area);

  const diff = estimatedValue - input.price;
  const vsMarketPercent = Math.round((diff / input.price) * 100);

  let verdict: ValuationResult["verdict"];
  let verdictColor: string;
  if (vsMarketPercent > 5) {
    verdict = "Undervalued";
    verdictColor = "text-green-600";
  } else if (vsMarketPercent < -5) {
    verdict = "Overvalued";
    verdictColor = "text-red-500";
  } else {
    verdict = "Fair";
    verdictColor = "text-yellow-500";
  }

  const growthRate = CITY_GROWTH_RATES[cityKey] ?? 0.05;
  const forecast1yr = Math.round(estimatedValue * (1 + growthRate));
  const forecast3yr = Math.round(estimatedValue * Math.pow(1 + growthRate, 3));
  const forecast5yr = Math.round(estimatedValue * Math.pow(1 + growthRate, 5));

  // Top factors
  const factors: string[] = [];
  if (districtMult > 1.1) factors.push(`Premium district (${input.district}) adds ${Math.round((districtMult - 1) * 100)}% value`);
  if (typeMult > 1.05) factors.push(`${input.propertyType} type carries a ${Math.round((typeMult - 1) * 100)}% premium`);
  if (matchedFeatures.length > 0) factors.push(`${matchedFeatures.length} premium features add ${Math.round(featurePremium * 100)}%`);
  if (ageDepreciation > 0) factors.push(`Age depreciation of ${Math.round(ageDepreciation * 100)}%`);
  if (input.verified) factors.push("Verified listing adds 3% confidence premium");
  if (factors.length === 0) factors.push("Standard market valuation applied");

  return {
    estimatedValue,
    pricePerSqm,
    marketPricePerSqm: Math.round(marketPricePerSqm),
    vsMarketPercent,
    verdict,
    verdictColor,
    forecast1yr,
    forecast3yr,
    forecast5yr,
    factors: factors.slice(0, 3),
  };
}
