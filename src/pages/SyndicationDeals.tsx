import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Filter, TrendingUp } from "lucide-react";
import InvestmentScore, { type InvestmentScoreInput } from "@/components/InvestmentScore";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

interface Deal {
  id: string;
  title: string;
  image: string;
  city: string;
  propertyType: string;
  status: "open" | "closing_soon" | "funded";
  riskLevel: "low" | "medium" | "high";
  targetRaise: number;
  currentRaise: number;
  roi: number;
  irr: number;
  holdPeriod: string;
  minInvestment: number;
  scoreInput: InvestmentScoreInput;
}

const MOCK_DEALS: Deal[] = [
  {
    id: "syn-1", title: "Ankawa Residential Tower", image: property1, city: "Erbil", propertyType: "Apartment",
    status: "open", riskLevel: "low", targetRaise: 2_500_000, currentRaise: 1_800_000,
    roi: 18, irr: 14, holdPeriod: "3 years", minInvestment: 25_000,
    scoreInput: { listPrice: 2_500_000, aiValuation: 2_900_000, rentalYield: 8.5, city: "Erbil", propertyType: "Apartment", developerRating: 4.2 },
  },
  {
    id: "syn-2", title: "Baghdad Commercial Hub", image: property2, city: "Baghdad", propertyType: "Commercial",
    status: "closing_soon", riskLevel: "medium", targetRaise: 5_000_000, currentRaise: 4_200_000,
    roi: 22, irr: 16, holdPeriod: "5 years", minInvestment: 50_000,
    scoreInput: { listPrice: 5_000_000, aiValuation: 5_800_000, rentalYield: 7.2, city: "Baghdad", propertyType: "Commercial", developerRating: 3.8 },
  },
  {
    id: "syn-3", title: "Sulaymaniyah Villa Compound", image: property3, city: "Sulaymaniyah", propertyType: "Villa",
    status: "open", riskLevel: "low", targetRaise: 1_200_000, currentRaise: 600_000,
    roi: 15, irr: 12, holdPeriod: "4 years", minInvestment: 10_000,
    scoreInput: { listPrice: 1_200_000, aiValuation: 1_450_000, rentalYield: 7.0, city: "Sulaymaniyah", propertyType: "Villa", developerRating: 4.0 },
  },
];

const STATUS_LABELS: Record<string, string> = { open: "Open", closing_soon: "Closing Soon", funded: "Funded" };
const STATUS_COLORS: Record<string, string> = {
  open: "bg-green-500/10 text-green-600", closing_soon: "bg-yellow-500/10 text-yellow-600", funded: "bg-muted text-muted-foreground",
};

export default function SyndicationDeals() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return MOCK_DEALS.filter((d) => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (riskFilter !== "all" && d.riskLevel !== riskFilter) return false;
      return true;
    });
  }, [statusFilter, riskFilter]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Syndication Deals</h1>
        <p className="text-sm text-muted-foreground mt-1">Co-invest in institutional-quality real estate opportunities</p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {["all", "open", "closing_soon", "funded"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}>
            {s === "all" ? "All Status" : STATUS_LABELS[s]}
          </button>
        ))}
        <span className="w-px h-5 bg-border" />
        {["all", "low", "medium", "high"].map((r) => (
          <button key={r} onClick={() => setRiskFilter(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              riskFilter === r ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}>
            {r === "all" ? "All Risk" : `${r.charAt(0).toUpperCase() + r.slice(1)} Risk`}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((deal) => {
          const progress = Math.round((deal.currentRaise / deal.targetRaise) * 100);
          return (
            <Link to={`/buyer/syndication/${deal.id}`} key={deal.id}
              className="rounded-xl bg-card border border-border overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold ${STATUS_COLORS[deal.status]}`}>
                  {STATUS_LABELS[deal.status]}
                </span>
                <div className="absolute top-3 right-3">
                  <InvestmentScore input={deal.scoreInput} compact />
                </div>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-foreground">{deal.title}</h3>
                <p className="text-xs text-muted-foreground">{deal.city} · {deal.propertyType}</p>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>${deal.currentRaise.toLocaleString()} raised</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">ROI</p>
                    <p className="text-sm font-bold text-foreground">{deal.roi}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">IRR</p>
                    <p className="text-sm font-bold text-foreground">{deal.irr}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hold</p>
                    <p className="text-sm font-bold text-foreground">{deal.holdPeriod}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">Min. investment: <span className="font-medium text-foreground">${deal.minInvestment.toLocaleString()}</span></p>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <TrendingUp className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No deals match your filters.</p>
        </div>
      )}
    </div>
  );
}
