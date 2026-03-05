import { useState } from "react";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import PropertyCardSkeleton from "@/components/skeletons/PropertyCardSkeleton";
import EmptyState from "@/components/EmptyState";
import { mockProperties } from "@/data/mockData";
import heroImg from "@/assets/hero-property.jpg";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const cities = ["all", "Erbil", "Baghdad", "Basra", "Sulaymaniyah"];
  const types = ["all", "Villa", "Apartment", "Commercial", "Penthouse"];

  const filtered = mockProperties.filter((p) => {
    const matchCity = selectedCity === "all" || p.city === selectedCity;
    const matchType = selectedType === "all" || p.propertyType === selectedType;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchType && matchSearch;
  });

  return (
    <div className="-m-4 lg:-m-6">
      {/* Hero */}
      <div className="relative h-64 lg:h-80 overflow-hidden">
        <img src={heroImg} alt="TerraVista Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-gradient-gold mb-2">
            Discover Premium Properties
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Iraq's trusted real estate marketplace — powered by TerraScore™ AI valuation and TerraOffer™ serious buyer engine.
          </p>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        {/* Search bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, city, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Cities" : c}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All Types" : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span> properties found
          </p>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors">
            <SlidersHorizontal className="w-3 h-3" /> Filters
          </button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No properties found"
            description="Try adjusting your filters or search query to find more properties."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
