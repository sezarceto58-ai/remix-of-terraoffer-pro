import { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface InvestmentScoreInput {
  listPrice: number;
  aiValuation: number;
  rentalYield?: number; // annual %
  city: string;
  propertyType: string;
  developerRating?: number; // 0-5
}

interface Props {
  input: InvestmentScoreInput;
  compact?: boolean;
}

const CITY_GROWTH: Record<string, number> = {
  erbil: 85, baghdad: 62, sulaymaniyah: 74, basra: 52,
};

const TYPE_LIQUIDITY: Record<string, number> = {
  apartment: 78, villa: 65, commercial: 55, land: 40,
  townhouse: 70, penthouse: 60, office: 50, warehouse: 35,
};

function clamp(v: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, v));
}

function computeScore(input: InvestmentScoreInput) {
  const discount = ((input.aiValuation - input.listPrice) / input.aiValuation) * 100;
  const priceScore = clamp(50 + discount * 5);

  const yieldPct = input.rentalYield ?? 6;
  const yieldScore = clamp(((yieldPct - 4) / 6) * 100);

  const growthScore = CITY_GROWTH[input.city.toLowerCase()] ?? 60;
  const liquidityScore = TYPE_LIQUIDITY[input.propertyType.toLowerCase()] ?? 55;
  const devScore = ((input.developerRating ?? 3.5) / 5) * 100;

  const total = Math.round(
    priceScore * 0.30 +
    yieldScore * 0.25 +
    growthScore * 0.20 +
    liquidityScore * 0.15 +
    devScore * 0.10
  );

  return {
    total: clamp(total),
    factors: [
      { label: "Price Discount", score: Math.round(priceScore), weight: 30 },
      { label: "Rental Yield", score: Math.round(yieldScore), weight: 25 },
      { label: "Location Growth", score: Math.round(growthScore), weight: 20 },
      { label: "Liquidity Risk", score: Math.round(liquidityScore), weight: 15 },
      { label: "Developer Rep.", score: Math.round(devScore), weight: 10 },
    ],
  };
}

function getGrade(score: number) {
  if (score >= 90) return { grade: "A+", rec: "Strong Buy", color: "text-green-500" };
  if (score >= 80) return { grade: "A", rec: "Buy", color: "text-green-500" };
  if (score >= 70) return { grade: "B+", rec: "Buy", color: "text-emerald-500" };
  if (score >= 60) return { grade: "B", rec: "Hold", color: "text-yellow-500" };
  if (score >= 45) return { grade: "C", rec: "Caution", color: "text-orange-500" };
  return { grade: "D", rec: "Avoid", color: "text-red-500" };
}

export default function InvestmentScore({ input, compact }: Props) {
  const { total, factors } = useMemo(() => computeScore(input), [input]);
  const { grade, rec, color } = getGrade(total);

  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-card border border-border text-xs font-bold ${color}`}>
            {grade} · {total}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">{rec}</p>
          <p className="text-xs text-muted-foreground">Investment Score: {total}/100</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Investment Score</h3>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${color}`}>{total}</span>
          <span className={`text-sm font-semibold ${color}`}>{grade}</span>
        </div>
      </div>

      <p className={`text-sm font-medium ${color}`}>Recommendation: {rec}</p>

      <div className="space-y-2">
        {factors.map((f) => (
          <div key={f.label}>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{f.label} ({f.weight}%)</span>
              <span>{f.score}/100</span>
            </div>
            <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${f.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
