import { Badge } from "@/components/ui/badge";
import { Megaphone, Target, Rocket, Palette } from "lucide-react";

export default function MarketingTab({ r }: { r: any }) {
  const m = r.marketing || {};
  return (
    <div className="space-y-5">
      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-card border border-border p-4 text-center">
          <p className="text-xs text-muted-foreground">Timeline</p>
          <p className="text-xl font-bold text-foreground">{m.timeline_months || "—"} months</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-4 text-center col-span-2">
          <p className="text-xs text-muted-foreground">Target Audience</p>
          <p className="text-sm font-medium text-foreground mt-1">{m.target_audience || "—"}</p>
        </div>
      </div>

      {/* Channels */}
      {Array.isArray(m.channels) && m.channels.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><Megaphone className="w-4 h-4" /> Channels</h4>
          <div className="flex flex-wrap gap-2">{m.channels.map((c: string) => (
            <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
          ))}</div>
        </div>
      )}

      {/* Market Positioning */}
      {m.positioning && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><Target className="w-4 h-4" /> Market Positioning</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{m.positioning}</p>
        </div>
      )}

      {/* Smart Offers */}
      {Array.isArray(m.offers) && m.offers.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><Rocket className="w-4 h-4" /> Smart Offers & Promotions</h4>
          <div className="space-y-3">
            {m.offers.map((o: any, i: number) => (
              <div key={i} className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h5 className="font-semibold text-foreground text-sm">{o.name}</h5>
                  {o.discount_pct > 0 && <Badge className="text-xs bg-green-500/15 text-green-600 border-0">{o.discount_pct}% off</Badge>}
                  {o.expected_uptake_pct && <Badge variant="secondary" className="text-xs">{o.expected_uptake_pct}% uptake</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{o.description}</p>
                {o.conditions && <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Conditions:</span> {o.conditions}</p>}
                {o.feasibility && (
                  <div className="rounded bg-muted/50 p-2">
                    <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Feasibility:</span> {o.feasibility}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Launch & Digital Strategy */}
      {m.launch_strategy && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Launch Strategy</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{m.launch_strategy}</p>
        </div>
      )}
      {m.digital_strategy && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Digital Strategy</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{m.digital_strategy}</p>
        </div>
      )}
      {m.branding_suggestions && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><Palette className="w-4 h-4" /> Branding</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{m.branding_suggestions}</p>
        </div>
      )}
    </div>
  );
}
