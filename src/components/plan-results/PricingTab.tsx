import { Badge } from "@/components/ui/badge";

export default function PricingTab({ r }: { r: any }) {
  const p = r.pricing || {};
  return (
    <div className="space-y-5">
      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Price / m²", value: p.price_per_sqm ? `$${p.price_per_sqm.toLocaleString()}` : "—" },
          { label: "Price / ft²", value: p.price_per_sqft ? `$${p.price_per_sqft.toLocaleString()}` : "—" },
          { label: "Currency", value: p.currency || "USD" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl bg-card border border-border p-4 text-center">
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <p className="text-xl font-bold text-foreground">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* By Unit Type */}
      {p.by_unit_type?.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-5">
          <h4 className="text-sm font-semibold text-foreground mb-3">Pricing by Unit Type</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 text-muted-foreground font-medium">Type</th>
                  <th className="py-2 text-right text-muted-foreground font-medium">Area (m²)</th>
                  <th className="py-2 text-right text-muted-foreground font-medium">Area (ft²)</th>
                  <th className="py-2 text-right text-muted-foreground font-medium">$/m²</th>
                  <th className="py-2 text-right text-muted-foreground font-medium">$/ft²</th>
                  <th className="py-2 text-right text-muted-foreground font-medium">Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {p.by_unit_type.map((u: any, i: number) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 text-foreground font-medium">{u.type}</td>
                    <td className="py-2 text-right text-foreground">{u.area_sqm}</td>
                    <td className="py-2 text-right text-foreground">{u.area_sqft}</td>
                    <td className="py-2 text-right text-foreground">${u.price_per_sqm?.toLocaleString()}</td>
                    <td className="py-2 text-right text-foreground">${u.price_per_sqft?.toLocaleString()}</td>
                    <td className="py-2 text-right text-foreground font-bold">${u.price_per_unit?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floor Premium */}
      {p.by_floor?.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-5">
          <h4 className="text-sm font-semibold text-foreground mb-3">Floor Premium Pricing</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 text-muted-foreground font-medium">Floor</th>
                  <th className="py-2 text-right text-muted-foreground font-medium">Premium</th>
                  <th className="py-2 text-right text-muted-foreground font-medium">$/m²</th>
                </tr>
              </thead>
              <tbody>
                {p.by_floor.map((f: any) => (
                  <tr key={f.floor} className="border-b border-border/50">
                    <td className="py-2 text-foreground">Floor {f.floor}</td>
                    <td className="py-2 text-right text-foreground">{f.premium_pct > 0 ? `+${f.premium_pct}%` : "Base"}</td>
                    <td className="py-2 text-right text-foreground font-medium">${f.price_per_sqm?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Plans */}
      {p.payment_plans?.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Payment Plans</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {p.payment_plans.map((pp: any, i: number) => (
              <div key={i} className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <h5 className="font-semibold text-foreground text-sm">{pp.name}</h5>
                  <Badge variant="secondary" className="text-xs">{pp.down_payment_pct}% down</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{pp.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Installments:</span> <span className="text-foreground font-medium">{pp.installments}</span></div>
                  <div><span className="text-muted-foreground">Duration:</span> <span className="text-foreground font-medium">{pp.duration_months} mo</span></div>
                  {pp.monthly_payment_example && (
                    <div className="col-span-2"><span className="text-muted-foreground">Monthly ~</span> <span className="text-foreground font-medium">${pp.monthly_payment_example?.toLocaleString()}</span></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
