import { TrendingUp, DollarSign, BarChart3, Calculator, AlertTriangle } from "lucide-react";
import StatsCard from "@/components/StatsCard";

const portfolioItems = [
  { name: "Erbil Villa Portfolio", value: 1240000, roi: 12.4, irr: 8.2, risk: "low" },
  { name: "Baghdad Commercial", value: 890000, roi: 9.1, irr: 6.8, risk: "medium" },
  { name: "Basra Residential Block", value: 560000, roi: 15.3, irr: 11.1, risk: "medium" },
  { name: "Sulaymaniyah Mixed-Use", value: 340000, roi: 7.8, irr: 5.4, risk: "high" },
];

const riskColors: Record<string, string> = {
  low: "text-success bg-success/10",
  medium: "text-warning bg-warning/10",
  high: "text-destructive bg-destructive/10",
};

const marketCompare = [
  { city: "Baghdad", avgPrice: 1850, growth: 4.2, demand: "High" },
  { city: "Erbil", avgPrice: 2200, growth: 7.8, demand: "Very High" },
  { city: "Basra", avgPrice: 1400, growth: 3.1, demand: "Medium" },
  { city: "Sulaymaniyah", avgPrice: 1650, growth: 5.5, demand: "High" },
];

export default function InvestorTools() {
  const totalValue = portfolioItems.reduce((s, i) => s + i.value, 0);
  const avgROI = (portfolioItems.reduce((s, i) => s + i.roi, 0) / portfolioItems.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Investor Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-1">Portfolio analytics, ROI/IRR, and market intelligence.</p>
        <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
          ⭐ Elite
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Portfolio Value" value={`$${(totalValue / 1e6).toFixed(1)}M`} change="+8.3% YoY" icon={DollarSign} trend="up" />
        <StatsCard title="Avg ROI" value={`${avgROI}%`} change="+1.2%" icon={TrendingUp} trend="up" />
        <StatsCard title="Properties" value={portfolioItems.length} icon={BarChart3} />
        <StatsCard title="Risk Score" value="Medium" icon={AlertTriangle} trend="neutral" />
      </div>

      {/* Portfolio */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-foreground">Portfolio Holdings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Value</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">ROI</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">IRR</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Risk</th>
              </tr>
            </thead>
            <tbody>
              {portfolioItems.map((item) => (
                <tr key={item.name} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="px-5 py-4 font-medium text-foreground">{item.name}</td>
                  <td className="px-5 py-4 text-right text-foreground">${item.value.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right text-success font-medium">{item.roi}%</td>
                  <td className="px-5 py-4 text-right text-foreground">{item.irr}%</td>
                  <td className="px-5 py-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${riskColors[item.risk]}`}>
                      {item.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Compare */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-foreground">Multi-Market Compare</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">City</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg $/m²</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Growth</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Demand</th>
              </tr>
            </thead>
            <tbody>
              {marketCompare.map((m) => (
                <tr key={m.city} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="px-5 py-4 font-medium text-foreground">{m.city}</td>
                  <td className="px-5 py-4 text-right text-foreground">${m.avgPrice}</td>
                  <td className="px-5 py-4 text-right text-success font-medium">+{m.growth}%</td>
                  <td className="px-5 py-4 text-right text-muted-foreground">{m.demand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
