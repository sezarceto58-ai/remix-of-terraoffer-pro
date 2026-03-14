import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, DollarSign, Users, Calendar, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvestmentScore, { type InvestmentScoreInput } from "@/components/InvestmentScore";
import { trackSyndicationView, trackInvestmentIntent } from "@/services/dataMoat";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import property1 from "@/assets/property-1.jpg";

// Mock deal data — in production, fetch by ID
const MOCK_DEAL = {
  id: "syn-1",
  title: "Ankawa Residential Tower",
  image: property1,
  city: "Erbil",
  district: "Ankawa",
  propertyType: "Apartment",
  description: "A 12-story luxury residential tower in the heart of Ankawa, Erbil's most sought-after district. The project features 96 premium apartments, ground-floor retail, and rooftop amenities including an infinity pool and sky lounge.",
  highlights: [
    "Prime Ankawa location with 95% occupancy in comparable buildings",
    "Pre-sold 40% of units during soft launch",
    "Experienced developer with 8 completed projects",
    "Below-market entry price due to early-stage investment",
  ],
  targetRaise: 2_500_000,
  currentRaise: 1_800_000,
  roi: 18,
  irr: 14,
  holdPeriod: "3 years",
  minInvestment: 25_000,
  maxInvestment: 500_000,
  quarterlyYield: 2.1,
  totalUnits: 96,
  status: "open" as const,
  riskLevel: "low" as const,
  scoreInput: {
    listPrice: 2_500_000,
    aiValuation: 2_900_000,
    rentalYield: 8.5,
    city: "Erbil",
    propertyType: "Apartment",
    developerRating: 4.2,
  } satisfies InvestmentScoreInput,
  investors: [
    { id: "inv-1", label: "Investor A", amount: 500_000, date: "2026-01-15" },
    { id: "inv-2", label: "Investor B", amount: 250_000, date: "2026-02-01" },
    { id: "inv-3", label: "Investor C", amount: 150_000, date: "2026-02-10" },
    { id: "inv-4", label: "Investor D", amount: 100_000, date: "2026-02-20" },
  ],
  timeline: [
    { quarter: "Q2 2026", event: "Construction Phase I", yield: null },
    { quarter: "Q4 2026", event: "Construction Phase II", yield: null },
    { quarter: "Q2 2027", event: "First unit deliveries", yield: 2.1 },
    { quarter: "Q4 2027", event: "Full occupancy target", yield: 2.1 },
    { quarter: "Q2 2028", event: "Stabilized returns", yield: 2.5 },
    { quarter: "Q4 2028", event: "Exit / refinance window", yield: null },
  ],
};

export default function SyndicationDealDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [investAmount, setInvestAmount] = useState<number>(MOCK_DEAL.minInvestment);
  const [showConfirm, setShowConfirm] = useState(false);

  const deal = MOCK_DEAL; // In production, fetch by id

  useEffect(() => {
    if (id) trackSyndicationView(id);
  }, [id]);

  const progress = Math.round((deal.currentRaise / deal.targetRaise) * 100);
  const annualIncome = Math.round(investAmount * (deal.quarterlyYield / 100) * 4);
  const totalReturn = Math.round(investAmount * (1 + deal.roi / 100));
  const netProfit = totalReturn - investAmount;

  const handleConfirmInvest = () => {
    trackInvestmentIntent(deal.id, investAmount);
    toast({ title: "✅ Investment intent registered", description: `$${investAmount.toLocaleString()} commitment submitted.` });
    setShowConfirm(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link to="/buyer/syndication" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to deals
      </Link>

      {/* Hero */}
      <div className="rounded-xl overflow-hidden relative aspect-[2.5/1]">
        <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">{deal.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{deal.city} · {deal.propertyType}</p>
        </div>
      </div>

      {/* Funding bar */}
      <div className="rounded-xl bg-card border border-border p-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">${deal.currentRaise.toLocaleString()} raised of ${deal.targetRaise.toLocaleString()}</span>
          <span className="font-bold text-foreground">{progress}%</span>
        </div>
        <div className="h-3 rounded-full bg-muted/30 overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4 text-center">
          <div><p className="text-xs text-muted-foreground">ROI</p><p className="font-bold text-foreground">{deal.roi}%</p></div>
          <div><p className="text-xs text-muted-foreground">IRR</p><p className="font-bold text-foreground">{deal.irr}%</p></div>
          <div><p className="text-xs text-muted-foreground">Hold</p><p className="font-bold text-foreground">{deal.holdPeriod}</p></div>
          <div><p className="text-xs text-muted-foreground">Min</p><p className="font-bold text-foreground">${deal.minInvestment.toLocaleString()}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
              <TabsTrigger value="investors">Investors</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="score">Deal Score</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="rounded-xl bg-card border border-border p-5">
                <h3 className="font-semibold text-foreground mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{deal.description}</p>
              </div>
              <div className="rounded-xl bg-card border border-border p-5">
                <h3 className="font-semibold text-foreground mb-3">Highlights</h3>
                <ul className="space-y-2">
                  {deal.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">✓</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="financials" className="space-y-4">
              <div className="rounded-xl bg-card border border-border p-5">
                <h3 className="font-semibold text-foreground mb-4">Return Calculator</h3>
                <label className="text-sm text-muted-foreground">Investment Amount ($)</label>
                <input
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(Math.max(deal.minInvestment, Math.min(deal.maxInvestment, Number(e.target.value))))}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm"
                />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="rounded-lg bg-secondary p-3 text-center">
                    <p className="text-xs text-muted-foreground">Annual Income</p>
                    <p className="text-lg font-bold text-green-600">${annualIncome.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-3 text-center">
                    <p className="text-xs text-muted-foreground">Total Return</p>
                    <p className="text-lg font-bold text-foreground">${totalReturn.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-3 text-center">
                    <p className="text-xs text-muted-foreground">Net Profit</p>
                    <p className="text-lg font-bold text-green-600">${netProfit.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="investors">
              <div className="rounded-xl bg-card border border-border p-5">
                <h3 className="font-semibold text-foreground mb-3">Co-Investors ({deal.investors.length})</h3>
                <div className="space-y-3">
                  {deal.investors.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{inv.label}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">${inv.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{inv.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline">
              <div className="rounded-xl bg-card border border-border p-5">
                <h3 className="font-semibold text-foreground mb-4">Distribution Schedule</h3>
                <div className="space-y-4">
                  {deal.timeline.map((t, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-20 shrink-0">
                        <p className="text-xs font-medium text-primary">{t.quarter}</p>
                      </div>
                      <div className="flex-1 pb-4 border-l-2 border-border pl-4 relative">
                        <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-primary" />
                        <p className="text-sm text-foreground">{t.event}</p>
                        {t.yield && <p className="text-xs text-green-600 mt-1">Quarterly yield: {t.yield}%</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="score">
              <InvestmentScore input={deal.scoreInput} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Invest CTA */}
        <div>
          <div className="rounded-xl bg-card border border-border p-5 sticky top-20 space-y-4">
            <h3 className="font-semibold text-foreground">Invest in This Deal</h3>
            <div>
              <label className="text-xs text-muted-foreground">Amount ($)</label>
              <input
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(Math.max(deal.minInvestment, Math.min(deal.maxInvestment, Number(e.target.value))))}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Min ${deal.minInvestment.toLocaleString()} — Max ${deal.maxInvestment.toLocaleString()}
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Annual Income</span><span className="text-green-600 font-medium">${annualIncome.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total Return</span><span className="font-medium text-foreground">${totalReturn.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Net Profit</span><span className="text-green-600 font-medium">${netProfit.toLocaleString()}</span></div>
            </div>

            {!showConfirm ? (
              <button onClick={() => setShowConfirm(true)}
                className="w-full py-3 rounded-xl bg-gradient-gold text-primary-foreground font-semibold text-sm shadow-gold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <DollarSign className="w-4 h-4" /> Invest in This Deal
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-center">Confirm your ${investAmount.toLocaleString()} investment?</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setShowConfirm(false)} className="py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium">Cancel</button>
                  <button onClick={handleConfirmInvest} className="py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Confirm</button>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-border">
              <InvestmentScore input={deal.scoreInput} compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
