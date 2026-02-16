import { useState } from "react";
import { Building2, Plus, ImagePlus, DollarSign, MapPin, Bed, Bath, Maximize, Tag } from "lucide-react";

const propertyTypes = ["Apartment", "Villa", "Penthouse", "Commercial", "Land", "Townhouse"];
const cities = ["Erbil", "Baghdad", "Basra", "Sulaymaniyah", "Duhok", "Kirkuk"];
const featureOptions = [
  "Swimming Pool", "Garden", "Smart Home", "Security System", "Garage",
  "Balcony", "Parking", "Gym Access", "24/7 Security", "Elevator",
  "Conference Room", "Fiber Internet", "Terrace", "Premium Finishes",
  "Private Elevator", "360° Virtual Tour",
];

export default function CreateProperty() {
  const [form, setForm] = useState({
    title: "",
    titleAr: "",
    price: "",
    currency: "USD" as "USD" | "IQD",
    type: "sale" as "sale" | "rent",
    propertyType: "Apartment",
    city: "Erbil",
    district: "",
    bedrooms: "3",
    bathrooms: "2",
    area: "",
    description: "",
    features: [] as string[],
  });

  const toggleFeature = (f: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter((x) => x !== f)
        : [...prev.features, f],
    }));
  };

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Plus className="w-6 h-6 text-primary" /> Create New Listing
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in the property details below.</p>
      </div>

      <div className="space-y-5">
        {/* Images */}
        <div className="rounded-xl bg-card border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <ImagePlus className="w-4 h-4 text-primary" /> Property Images
          </h2>
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
            <ImagePlus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Drag & drop images or click to browse</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Max 10 images, 5MB each</p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" /> Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Title (English)</label>
              <input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Modern Apartment - Erbil"
                className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Title (Arabic)</label>
              <input
                value={form.titleAr}
                onChange={(e) => update("titleAr", e.target.value)}
                placeholder="شقة حديثة - أربيل"
                dir="rtl"
                className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Property Type</label>
              <select
                value={form.propertyType}
                onChange={(e) => update("propertyType", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-border"
              >
                {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Listing Type</label>
              <div className="flex gap-2">
                {(["sale", "rent"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => update("type", t)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                      form.type === t ? "bg-primary/10 text-primary border border-primary/30" : "bg-secondary text-muted-foreground border border-border"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Location
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">City</label>
              <select
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-border"
              >
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">District</label>
              <input
                value={form.district}
                onChange={(e) => update("district", e.target.value)}
                placeholder="Dream City"
                className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" /> Pricing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Price</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="320000"
                className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Currency</label>
              <div className="flex gap-2">
                {(["USD", "IQD"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => update("currency", c)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      form.currency === c ? "bg-primary/10 text-primary border border-primary/30" : "bg-secondary text-muted-foreground border border-border"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Maximize className="w-4 h-4 text-primary" /> Specifications
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Bedrooms</label>
              <input
                type="number"
                value={form.bedrooms}
                onChange={(e) => update("bedrooms", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-border"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Bathrooms</label>
              <input
                type="number"
                value={form.bathrooms}
                onChange={(e) => update("bathrooms", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-border"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Area (m²)</label>
              <input
                type="number"
                value={form.area}
                onChange={(e) => update("area", e.target.value)}
                placeholder="450"
                className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-border"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <label className="text-xs text-muted-foreground mb-1 block">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            placeholder="Describe the property in detail..."
            className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border resize-none"
          />
        </div>

        {/* Features */}
        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" /> Features
          </h2>
          <div className="flex flex-wrap gap-2">
            {featureOptions.map((f) => (
              <button
                key={f}
                onClick={() => toggleFeature(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  form.features.includes(f)
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-secondary text-muted-foreground border border-border hover:border-primary/20"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button className="flex-1 py-3 rounded-xl bg-gradient-gold text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            Publish Listing
          </button>
          <button className="px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm">
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
}
