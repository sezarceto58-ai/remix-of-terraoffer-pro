import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Shield, Target, DoorOpen, BarChart3, AlertTriangle } from "lucide-react";

export default function FeasibilityTab({ r }: { r: any }) {
  const f = r.feasibility || {};
  const fc = f.forecasting || {};

  return (
    <div className="space-y-5">
      {/* Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Investment", value: `$${(f.total_investment || 0).toLocaleString()}`, color: "text-foreground" },
          { label: "Projected Revenue", value: `$${(f.projected_revenue || 0).toLocaleString()}`, color: "text-green-500" },
          { label: "Net Profit", value: `$${(f.net_profit || 0).toLocaleString()}`, color: "text-green-600" },
          { label: "ROI", value: `${f.roi_pct || 0}%`, color: "text-primary" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl bg-card border border-border p-4 text-center">
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "IRR", value: `${f.irr_pct || 0}%` },
          { label: "Cap Rate", value: `${f.cap_rate_pct || 0}%` },
          { label: "Cash-on-Cash", value: `${f.cash_on_cash_return_pct || 0}%` },
          { label: "Payback", value: `${f.payback_years || 0} yrs` },
          { label: "Breakeven", value: `${f.breakeven_units || 0} units / ${f.breakeven_months || 0} mo` },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl bg-card border border-border p-3 text-center">
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <p className="text-sm font-bold text-foreground">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Cost Breakdown */}
      <div className="rounded-xl bg-card border border-border p-5 space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Cost Breakdown</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><p className="text-xs text-muted-foreground">Construction</p><p className="text-sm font-bold text-foreground">${(f.total_construction_cost || 0).toLocaleString()}</p></div>
          <div><p className="text-xs text-muted-foreground">Land</p><p className="text-sm font-bold text-foreground">${(f.land_cost_estimate || 0).toLocaleString()}</p></div>
          <div><p className="text-xs text-muted-foreground">Soft Costs</p><p className="text-sm font-bold text-foreground">${(f.soft_costs || 0).toLocaleString()}</p></div>
        </div>
      </div>

      {/* Timeline */}
      {f.timeline?.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Project Timeline</h4>
          <div className="space-y-3">
            {f.timeline.map((phase: any, i: number) => (
              <div key={i} className="rounded-lg border border-border p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-medium text-foreground">{phase.phase}</h5>
                  <Badge variant="secondary" className="text-xs">Month {phase.start_month}–{phase.end_month}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{phase.description}</p>
                <p className="text-xs text-foreground font-medium">Cost: ${(phase.cost || 0).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SWOT */}
      {f.swot && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><Shield className="w-4 h-4" /> SWOT Analysis</h4>
          <div className="grid grid-cols-2 gap-4">
            {(["strengths", "weaknesses", "opportunities", "threats"] as const).map((key) => {
              const colors = { strengths: "text-green-500", weaknesses: "text-destructive", opportunities: "text-primary", threats: "text-orange-500" };
              return (
                <div key={key} className="space-y-2">
                  <h5 className={`text-xs font-semibold uppercase ${colors[key]}`}>{key}</h5>
                  <ul className="space-y-1">{f.swot[key]?.map((item: string, i: number) => (
                    <li key={i} className="text-xs text-muted-foreground">• {item}</li>
                  ))}</ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Risk Assessment */}
      {f.risk_assessment?.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Risk Assessment</h4>
          <div className="space-y-3">
            {f.risk_assessment.map((risk: any, i: number) => (
              <div key={i} className="rounded-lg border border-border p-3 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-foreground">{risk.risk}</span>
                  <Badge variant={risk.probability === "high" ? "destructive" : "secondary"} className="text-xs">P: {risk.probability}</Badge>
                  <Badge variant={risk.impact === "high" ? "destructive" : "outline"} className="text-xs">I: {risk.impact}</Badge>
                </div>
                <p className="text-xs text-muted-foreground"><span className="font-medium">Mitigation:</span> {risk.mitigation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Positioning */}
      {f.market_positioning && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><Target className="w-4 h-4" /> Market Positioning</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{f.market_positioning}</p>
        </div>
      )}

      {/* Exit Strategies */}
      {f.exit_strategies?.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><DoorOpen className="w-4 h-4" /> Exit Strategies</h4>
          <div className="grid md:grid-cols-2 gap-3">
            {f.exit_strategies.map((es: any, i: number) => (
              <div key={i} className="rounded-lg border border-border p-3 space-y-1">
                <h5 className="text-sm font-medium text-foreground">{es.strategy}</h5>
                <div className="flex gap-3 text-xs">
                  <span className="text-muted-foreground">Timeline: <span className="text-foreground font-medium">{es.timeline_years} yrs</span></span>
                  <span className="text-muted-foreground">Return: <span className="text-green-500 font-medium">{es.expected_return_pct}%</span></span>
                </div>
                <p className="text-xs text-muted-foreground">{es.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Forecasting */}
      {fc && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Forecasting Models</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "5-Year ROI", value: `${fc.roi_5yr || 0}%` },
              { label: "10-Year Growth", value: `${fc.asset_growth_10yr_pct || 0}%` },
              { label: "Monthly Rental", value: `$${(fc.rental_income_monthly || 0).toLocaleString()}` },
              { label: "Rental Yield", value: `${fc.rental_yield_pct || 0}%` },
            ].map((kpi) => (
              <div key={kpi.label} className="text-center">
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-lg font-bold text-foreground">{kpi.value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center"><p className="text-xs text-muted-foreground">Resale Value (5yr)</p><p className="text-sm font-bold text-foreground">${(fc.resale_value_5yr || 0).toLocaleString()}</p></div>
            <div className="text-center"><p className="text-xs text-muted-foreground">Resale Value (10yr)</p><p className="text-sm font-bold text-foreground">${(fc.resale_value_10yr || 0).toLocaleString()}</p></div>
          </div>

          {/* Scenario Testing */}
          {fc.scenarios?.length > 0 && (
            <div className="space-y-3 mt-2">
              <h5 className="text-xs font-semibold text-foreground uppercase">Scenario Testing</h5>
              {fc.scenarios.map((s: any, i: number) => (
                <div key={i} className="rounded-lg border border-border p-3 space-y-1">
                  <h6 className="text-sm font-medium text-foreground">{s.name}</h6>
                  <div className="flex gap-4 text-xs flex-wrap">
                    <span className="text-muted-foreground">ROI Impact: <span className={`font-medium ${s.impact_on_roi_pct < 0 ? "text-destructive" : "text-green-500"}`}>{s.impact_on_roi_pct > 0 ? "+" : ""}{s.impact_on_roi_pct}%</span></span>
                    <span className="text-muted-foreground">IRR Impact: <span className={`font-medium ${s.impact_on_irr_pct < 0 ? "text-destructive" : "text-green-500"}`}>{s.impact_on_irr_pct > 0 ? "+" : ""}{s.impact_on_irr_pct}%</span></span>
                    <span className="text-muted-foreground">Profit Δ: <span className={`font-medium ${s.net_profit_change < 0 ? "text-destructive" : "text-green-500"}`}>${(s.net_profit_change || 0).toLocaleString()}</span></span>
                  </div>
                  <p className="text-xs text-muted-foreground">{s.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
