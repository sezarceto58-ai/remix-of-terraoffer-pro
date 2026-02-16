import { useState } from "react";
import { GitCompareArrows, X, Plus, TrendingUp, MapPin, Bed, Bath, Maximize } from "lucide-react";
import { mockProperties, type Property } from "@/data/mockData";
import TerraScore from "@/components/TerraScore";

const compareFields: { label: string; key: string; format?: (v: Property) => string }[] = [
  { label: "Price", key: "price", format: (p) => `$${p.price.toLocaleString()}` },
  { label: "Price (IQD)", key: "priceIQD", format: (p) => p.priceIQD ? `${p.priceIQD.toLocaleString()} IQD` : "—" },
  { label: "Type", key: "propertyType" },
  { label: "City", key: "city" },
  { label: "District", key: "district" },
  { label: "Bedrooms", key: "bedrooms" },
  { label: "Bathrooms", key: "bathrooms" },
  { label: "Area (m²)", key: "area" },
  { label: "TerraScore", key: "terraScore" },
  { label: "AI Valuation", key: "aiValuation", format: (p) => `$${p.aiValuation.toLocaleString()}` },
  { label: "AI Confidence", key: "aiConfidence" },
  { label: "Verified", key: "verified", format: (p) => p.verified ? "✅ Yes" : "❌ No" },
  { label: "Agent", key: "agentName" },
  { label: "Views", key: "views" },
  { label: "Status", key: "status" },
];

export default function CompareListings() {
  const [selected, setSelected] = useState<string[]>(["1", "2"]);

  const selectedProperties = selected.map((id) => mockProperties.find((p) => p.id === id)).filter(Boolean) as Property[];
  const available = mockProperties.filter((p) => !selected.includes(p.id));

  const addProperty = (id: string) => {
    if (selected.length < 4) setSelected([...selected, id]);
  };

  const removeProperty = (id: string) => {
    setSelected(selected.filter((s) => s !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <GitCompareArrows className="w-6 h-6 text-primary" /> Compare Listings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Side-by-side property comparison — Elite feature.</p>
      </div>

      {/* Add property selector */}
      {selected.length < 4 && available.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground self-center">Add:</span>
          {available.map((p) => (
            <button
              key={p.id}
              onClick={() => addProperty(p.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
            >
              <Plus className="w-3 h-3" /> {p.title}
            </button>
          ))}
        </div>
      )}

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Headers */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `180px repeat(${selectedProperties.length}, 1fr)` }}>
            <div />
            {selectedProperties.map((p) => (
              <div key={p.id} className="rounded-xl bg-card border border-border p-4 relative animate-fade-in">
                <button
                  onClick={() => removeProperty(p.id)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-secondary text-muted-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
                <img src={p.image} alt={p.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                <h3 className="font-semibold text-foreground text-sm">{p.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {p.city}, {p.district}
                </p>
              </div>
            ))}
          </div>

          {/* Rows */}
          {compareFields.map((field, i) => (
            <div
              key={field.key}
              className="grid gap-4 mt-1"
              style={{ gridTemplateColumns: `180px repeat(${selectedProperties.length}, 1fr)` }}
            >
              <div className={`flex items-center px-3 py-2.5 text-xs font-medium text-muted-foreground ${i % 2 === 0 ? "bg-secondary/50 rounded-l-lg" : ""}`}>
                {field.label}
              </div>
              {selectedProperties.map((p) => {
                const val = field.format ? field.format(p) : String((p as any)[field.key]);
                const isHighest = field.key === "terraScore" &&
                  p.terraScore === Math.max(...selectedProperties.map((sp) => sp.terraScore));
                return (
                  <div
                    key={p.id}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium ${
                      isHighest ? "text-primary" : "text-foreground"
                    } ${i % 2 === 0 ? "bg-secondary/50" : ""} ${
                      i % 2 === 0 && selectedProperties.indexOf(p) === selectedProperties.length - 1 ? "rounded-r-lg" : ""
                    }`}
                  >
                    {field.key === "terraScore" ? (
                      <span className={`font-bold ${p.terraScore >= 80 ? "text-success" : p.terraScore >= 60 ? "text-warning" : "text-destructive"}`}>
                        {p.terraScore}
                      </span>
                    ) : (
                      val
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Features row */}
          <div
            className="grid gap-4 mt-1"
            style={{ gridTemplateColumns: `180px repeat(${selectedProperties.length}, 1fr)` }}
          >
            <div className="flex items-start px-3 py-2.5 text-xs font-medium text-muted-foreground bg-secondary/50 rounded-l-lg">
              Features
            </div>
            {selectedProperties.map((p, idx) => (
              <div
                key={p.id}
                className={`flex flex-wrap gap-1 px-3 py-2.5 bg-secondary/50 ${
                  idx === selectedProperties.length - 1 ? "rounded-r-lg" : ""
                }`}
              >
                {p.features.map((f) => (
                  <span key={f} className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary font-medium">
                    {f}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
