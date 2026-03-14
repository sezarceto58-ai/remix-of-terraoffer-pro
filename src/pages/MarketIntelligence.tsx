import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trackMarketIntelView } from "@/services/dataMoat";

const CITIES = ["Erbil", "Baghdad", "Basra", "Sulaymaniyah"] as const;

// Hardcoded market data — replace with API in production
const NEIGHBORHOODS: Record<string, { name: string; demand: number; yield: number; forecast12m: number }[]> = {
  Erbil: [
    { name: "Ankawa", demand: 92, yield: 8.5, forecast12m: 12 },
    { name: "Dream City", demand: 88, yield: 7.8, forecast12m: 10 },
    { name: "Empire World", demand: 85, yield: 9.2, forecast12m: 14 },
    { name: "English Village", demand: 78, yield: 6.5, forecast12m: 8 },
    { name: "Erbil Center", demand: 72, yield: 5.8, forecast12m: 6 },
  ],
  Baghdad: [
    { name: "Mansour", demand: 90, yield: 7.2, forecast12m: 9 },
    { name: "Karrada", demand: 82, yield: 6.8, forecast12m: 7 },
    { name: "Jadriya", demand: 76, yield: 7.5, forecast12m: 8 },
    { name: "Zayouna", demand: 68, yield: 5.5, forecast12m: 5 },
  ],
  Basra: [
    { name: "Times Square", demand: 74, yield: 6.0, forecast12m: 7 },
    { name: "Shatt al-Arab", demand: 70, yield: 5.5, forecast12m: 6 },
    { name: "Basra Center", demand: 62, yield: 4.8, forecast12m: 4 },
  ],
  Sulaymaniyah: [
    { name: "Sarchnar", demand: 80, yield: 7.0, forecast12m: 9 },
    { name: "Salim", demand: 74, yield: 6.2, forecast12m: 7 },
    { name: "Bakhtiari", demand: 68, yield: 5.8, forecast12m: 6 },
  ],
};

const CITY_OUTLOOK: Record<string, { yr1: number; yr3: number; yr5: number }> = {
  Erbil: { yr1: 8, yr3: 28, yr5: 48 },
  Baghdad: { yr1: 5, yr3: 18, yr5: 32 },
  Basra: { yr1: 4, yr3: 14, yr5: 24 },
  Sulaymaniyah: { yr1: 6, yr3: 22, yr5: 38 },
};

const SIGNALS: Record<string, { type: "bullish" | "bearish" | "neutral"; text: string }[]> = {
  Erbil: [
    { type: "bullish", text: "New airport terminal expansion accelerating demand in Ankawa corridor" },
    { type: "bullish", text: "Foreign direct investment up 23% YoY in Kurdistan Region" },
    { type: "neutral", text: "Building permit approvals steady at 2024 levels" },
    { type: "bearish", text: "Oversupply of luxury apartments in Empire World district" },
  ],
  Baghdad: [
    { type: "bullish", text: "Metro transit project boosting Mansour and Karrada values" },
    { type: "neutral", text: "Government infrastructure spending holding steady" },
    { type: "bearish", text: "Rental yield compression in central districts" },
    { type: "neutral", text: "New commercial zoning regulations under review" },
  ],
  Basra: [
    { type: "bullish", text: "Port modernization driving commercial real estate demand" },
    { type: "neutral", text: "Residential permits at average levels" },
    { type: "bearish", text: "Water infrastructure concerns impacting southern districts" },
    { type: "bullish", text: "Oil sector workforce housing demand increasing" },
  ],
  Sulaymaniyah: [
    { type: "bullish", text: "University expansion driving rental demand in Sarchnar" },
    { type: "bullish", text: "Tourism sector growth supporting hospitality investments" },
    { type: "neutral", text: "Stable pricing with moderate appreciation" },
    { type: "bearish", text: "Limited land availability constraining new developments" },
  ],
};

export default function MarketIntelligence() {
  const [city, setCity] = useState<string>("Erbil");
  const neighborhoods = useMemo(() => NEIGHBORHOODS[city] ?? [], [city]);
  const outlook = CITY_OUTLOOK[city];
  const signals = SIGNALS[city] ?? [];

  const handleCityChange = (c: string) => {
    setCity(c);
    trackMarketIntelView(c);
  };

  const signalColor = (t: string) =>
    t === "bullish" ? "text-green-600 bg-green-500/10" : t === "bearish" ? "text-red-500 bg-red-500/10" : "text-yellow-500 bg-yellow-500/10";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Market Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time market data and forecasts for Iraq's key cities</p>
      </div>

      {/* City selector */}
      <div className="flex gap-2">
        {CITIES.map((c) => (
          <button
            key={c}
            onClick={() => handleCityChange(c)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              city === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <Tabs defaultValue="demand" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="demand">Demand & Yield</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
          <TabsTrigger value="signals">Market Signals</TabsTrigger>
        </TabsList>

        <TabsContent value="demand" className="space-y-4">
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-3 font-medium">Neighborhood</th>
                  <th className="p-3 font-medium text-center">Demand Score</th>
                  <th className="p-3 font-medium text-center">Rental Yield</th>
                </tr>
              </thead>
              <tbody>
                {[...neighborhoods].sort((a, b) => b.demand - a.demand).map((n) => (
                  <tr key={n.name} className="border-b border-border last:border-0">
                    <td className="p-3 font-medium text-foreground">{n.name}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                        n.demand >= 80 ? "bg-green-500/10 text-green-600" : n.demand >= 60 ? "bg-yellow-500/10 text-yellow-600" : "bg-red-500/10 text-red-500"
                      }`}>
                        {n.demand}
                      </span>
                    </td>
                    <td className="p-3 text-center font-medium text-foreground">{n.yield}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl bg-card border border-border p-5">
            <h3 className="font-semibold text-foreground mb-3">Yield Ranking</h3>
            <div className="space-y-2">
              {[...neighborhoods].sort((a, b) => b.yield - a.yield).map((n) => (
                <div key={n.name} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-32 shrink-0">{n.name}</span>
                  <div className="flex-1 h-3 rounded-full bg-muted/30 overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(n.yield / 12) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-foreground w-12 text-right">{n.yield}%</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="forecasts" className="space-y-4">
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-3 font-medium">Neighborhood</th>
                  <th className="p-3 font-medium text-center">12-Month Forecast</th>
                </tr>
              </thead>
              <tbody>
                {neighborhoods.map((n) => (
                  <tr key={n.name} className="border-b border-border last:border-0">
                    <td className="p-3 font-medium text-foreground">{n.name}</td>
                    <td className="p-3 text-center">
                      <span className="text-green-600 font-medium">+{n.forecast12m}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {outlook && (
            <div className="rounded-xl bg-card border border-border p-5">
              <h3 className="font-semibold text-foreground mb-3">{city} — Long-Term Outlook</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "1 Year", value: outlook.yr1 },
                  { label: "3 Years", value: outlook.yr3 },
                  { label: "5 Years", value: outlook.yr5 },
                ].map((f) => (
                  <div key={f.label} className="rounded-lg bg-secondary p-4 text-center">
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    <p className="text-xl font-bold text-green-600">+{f.value}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="signals" className="space-y-3">
          {signals.map((s, i) => (
            <div key={i} className={`rounded-xl border border-border p-4 flex items-start gap-3 ${signalColor(s.type)}`}>
              <span className="text-lg mt-0.5">{s.type === "bullish" ? "📈" : s.type === "bearish" ? "📉" : "📊"}</span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider">{s.type}</span>
                <p className="text-sm text-foreground mt-1">{s.text}</p>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
