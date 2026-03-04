import { Badge } from "@/components/ui/badge";
import { MapPin, ThumbsUp, ThumbsDown, Compass, Landmark, Lightbulb, DollarSign, LayoutGrid } from "lucide-react";

export default function LandUseTab({ r, lat, lng }: { r: any; lat: number; lng: number }) {
  const lu = r.land_use || {};
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-xl bg-card border border-border p-5 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-lg font-semibold text-foreground">{lu.recommendation || "N/A"}</h3>
          {lu.confidence != null && (
            <Badge variant="secondary" className="text-xs">{(lu.confidence * 100).toFixed(0)}% confidence</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{lu.rationale}</p>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-border">
        <iframe
          title="Location Map"
          width="100%"
          height="300"
          style={{ border: 0 }}
          loading="lazy"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`}
        />
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-4">
        {lu.strengths?.length > 0 && (
          <div className="rounded-xl bg-card border border-border p-5 space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><ThumbsUp className="w-4 h-4 text-green-500" /> Strengths</h4>
            <ul className="space-y-1.5">{lu.strengths.map((s: string, i: number) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-green-500 mt-0.5">✓</span>{s}</li>
            ))}</ul>
          </div>
        )}
        {lu.weaknesses?.length > 0 && (
          <div className="rounded-xl bg-card border border-border p-5 space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><ThumbsDown className="w-4 h-4 text-destructive" /> Weaknesses</h4>
            <ul className="space-y-1.5">{lu.weaknesses.map((s: string, i: number) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-destructive mt-0.5">✗</span>{s}</li>
            ))}</ul>
          </div>
        )}
      </div>

      {/* Neighborhood */}
      {lu.neighborhood && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><Compass className="w-4 h-4" /> Neighborhood Intelligence</h4>
          {lu.neighborhood.existing_activities?.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Existing Activities & Projects</p>
              <div className="flex flex-wrap gap-2">{lu.neighborhood.existing_activities.map((a: string) => (
                <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
              ))}</div>
            </div>
          )}
          {lu.neighborhood.upcoming_projects?.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Upcoming / Future Projects</p>
              <div className="flex flex-wrap gap-2">{lu.neighborhood.upcoming_projects.map((a: string) => (
                <Badge key={a} className="text-xs bg-primary/10 text-primary border-0">{a}</Badge>
              ))}</div>
            </div>
          )}
          {lu.neighborhood.infrastructure?.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Infrastructure</p>
              <div className="flex flex-wrap gap-2">{lu.neighborhood.infrastructure.map((a: string) => (
                <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
              ))}</div>
            </div>
          )}
        </div>
      )}

      {/* Zoning */}
      {lu.zoning && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><Landmark className="w-4 h-4" /> Zoning Validation</h4>
          <p className="text-sm text-muted-foreground">{lu.zoning.validation}</p>
          {lu.zoning.allowed_uses?.length > 0 && (
            <div className="flex flex-wrap gap-2">{lu.zoning.allowed_uses.map((u: string) => (
              <Badge key={u} variant="outline" className="text-xs">{u}</Badge>
            ))}</div>
          )}
          {lu.zoning.restrictions_analysis && <p className="text-sm text-muted-foreground">{lu.zoning.restrictions_analysis}</p>}
          {lu.zoning.recommendations && <p className="text-sm text-foreground font-medium">{lu.zoning.recommendations}</p>}
        </div>
      )}

      {/* Recommendations */}
      {lu.development_recommendations?.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Development Recommendations</h4>
          <ul className="space-y-2">{lu.development_recommendations.map((r: string, i: number) => (
            <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-primary font-bold">{i + 1}.</span>{r}</li>
          ))}</ul>
        </div>
      )}

      {/* Pricing Suggestions & Unit Mix */}
      {lu.pricing_suggestions && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><DollarSign className="w-4 h-4" /> Pricing Strategy</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{lu.pricing_suggestions}</p>
        </div>
      )}
      {lu.unit_mix_optimization && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2"><LayoutGrid className="w-4 h-4" /> Unit Mix Optimization</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{lu.unit_mix_optimization}</p>
        </div>
      )}
    </div>
  );
}
