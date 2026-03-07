import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, Plus, ImagePlus, DollarSign, MapPin, Maximize, Tag,
  Brain, Loader2, Sparkles, TrendingUp, Shield, Users, Leaf,
  CheckCircle, XCircle, AlertTriangle, Target, BarChart3,
  ChevronDown, ChevronUp, Lock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";

const propertyTypes = ["Apartment", "Villa", "Penthouse", "Commercial", "Land", "Townhouse"];
const cities = ["Erbil", "Baghdad", "Basra", "Sulaymaniyah", "Duhok", "Kirkuk"];
const featureOptions = [
  "Swimming Pool", "Garden", "Smart Home", "Security System", "Garage",
  "Balcony", "Parking", "Gym Access", "24/7 Security", "Elevator",
  "Conference Room", "Fiber Internet", "Terrace", "Premium Finishes",
  "Private Elevator", "360° Virtual Tour",
];

export default function CreateProperty() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tier } = useSubscription();
  const isPaid = tier === "pro" || tier === "elite";

  const [form, setForm] = useState({
    title: "", titleAr: "", price: "", currency: "USD" as "USD" | "IQD",
    type: "sale" as "sale" | "rent", propertyType: "Apartment", city: "Erbil",
    district: "", bedrooms: "3", bathrooms: "2", area: "", description: "",
    features: [] as string[],
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleFeature = (f: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter((x) => x !== f) : [...prev.features, f],
    }));
  };

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handlePublish = () => {
    if (!form.title || !form.price || !form.district || !form.area) {
      toast({ title: "Missing fields", description: "Please fill in title, price, district, and area.", variant: "destructive" });
      return;
    }
    toast({ title: "Listing published! 🎉", description: `${form.title} is now live on the marketplace.` });
    setTimeout(() => navigate("/seller/listings"), 1500);
  };

  const handleSaveDraft = () => {
    toast({ title: "Draft saved", description: "Your listing has been saved as a draft." });
  };

  const handleAIGenerate = async () => {
    if (!isPaid) {
      toast({ title: "Pro Feature", description: "Upgrade to Pro or Elite to use AI-Powered Listing generation.", variant: "destructive" });
      return;
    }
    if (!form.district || !form.area) {
      toast({ title: "Missing info", description: "Please fill in district and area first.", variant: "destructive" });
      return;
    }
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-property-analysis", {
        body: {
          type: "listing_assist",
          property: {
            type: form.propertyType, city: form.city, district: form.district,
            bedrooms: parseInt(form.bedrooms) || 0, bathrooms: parseInt(form.bathrooms) || 0,
            area: parseInt(form.area) || 0, features: form.features,
            condition: "new", askingPrice: parseInt(form.price) || undefined,
          },
        },
      });
      if (error) throw error;
      if (data?.error) {
        toast({ title: "AI Error", description: data.error, variant: "destructive" });
      } else {
        setAiResult(data.analysis);
        toast({ title: "🧠 Analysis complete", description: "AI listing and analysis are ready!" });
      }
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  const applyAIToForm = () => {
    if (!aiResult?.listing) return;
    setForm((prev) => ({
      ...prev,
      title: aiResult.listing.title || prev.title,
      titleAr: aiResult.listing.titleAr || prev.titleAr,
      description: aiResult.listing.description || prev.description,
    }));
    toast({ title: "Applied!", description: "AI-generated content applied to your listing form." });
  };

  const toggle = (key: string) => setExpanded(expanded === key ? null : key);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
          <Plus className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Create New Listing</h1>
          <p className="text-sm text-muted-foreground">Fill in basic details below, then generate to get full AI analysis & optimized description</p>
        </div>
      </div>

      {/* AI Generate Button */}
      <div className={`rounded-xl border p-4 flex items-center justify-between ${isPaid ? "border-dashed border-primary/30 bg-primary/5" : "border-border bg-card"}`}>
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              AI-Powered Listing
              {!isPaid && <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-bold flex items-center gap-1"><Lock className="w-3 h-3" /> PRO</span>}
            </p>
            <p className="text-xs text-muted-foreground">
              {isPaid
                ? "Fill in basic details below, then generate AI analysis & optimized copy"
                : "Upgrade to Pro to generate high-value, attractive property descriptions with AI"}
            </p>
          </div>
        </div>
        <Button
          onClick={isPaid ? handleAIGenerate : () => navigate("/pricing")}
          disabled={aiLoading}
          size="sm"
          className={isPaid ? "bg-gradient-gold text-primary-foreground hover:opacity-90 border-0" : ""}
          variant={isPaid ? "default" : "outline"}
        >
          {aiLoading ? (
            <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Generating...</>
          ) : isPaid ? (
            <><Brain className="w-4 h-4 mr-1" /> Generate</>
          ) : (
            <><Lock className="w-4 h-4 mr-1" /> Upgrade</>
          )}
        </Button>
      </div>

      {/* AI Results (inline, no separate tab) */}
      {aiResult && <AIResultsInline result={aiResult} expanded={expanded} toggle={toggle} applyAIToForm={applyAIToForm} />}

      {/* Manual Form */}
      <ManualForm
        form={form} update={update} toggleFeature={toggleFeature}
        handlePublish={handlePublish} handleSaveDraft={handleSaveDraft} toast={toast}
      />
    </div>
  );
}

/* ─── Manual Form ─── */
function ManualForm({ form, update, toggleFeature, handlePublish, handleSaveDraft, toast }: any) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-card border border-border p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <ImagePlus className="w-4 h-4 text-primary" /> Property Images
        </h2>
        <div
          className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/30 transition-colors"
          onClick={() => toast({ title: "Upload ready", description: "Image upload will be available with storage integration." })}
        >
          <ImagePlus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Drag & drop images or click to browse</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Max 10 images, 5MB each</p>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" /> Basic Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground mb-1 block">Title (English) *</label>
            <input value={form.title} onChange={(e: any) => update("title", e.target.value)} placeholder="Modern Apartment - Erbil" className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground mb-1 block">Title (Arabic)</label>
            <input value={form.titleAr} onChange={(e: any) => update("titleAr", e.target.value)} placeholder="شقة حديثة - أربيل" dir="rtl" className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Property Type</label>
            <select value={form.propertyType} onChange={(e: any) => update("propertyType", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-border">
              {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Listing Type</label>
            <div className="flex gap-2">
              {(["sale", "rent"] as const).map((t) => (
                <button key={t} onClick={() => update("type", t)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors capitalize ${form.type === t ? "bg-primary/10 text-primary border border-primary/30" : "bg-card text-muted-foreground border border-border hover:border-primary/20"}`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" /> Location
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">City</label>
            <select value={form.city} onChange={(e: any) => update("city", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-border">
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">District *</label>
            <input value={form.district} onChange={(e: any) => update("district", e.target.value)} placeholder="Dream City" className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border" />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" /> Pricing
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Price *</label>
            <input type="number" value={form.price} onChange={(e: any) => update("price", e.target.value)} placeholder="320000" className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Currency</label>
            <div className="flex gap-2">
              {(["USD", "IQD"] as const).map((c) => (
                <button key={c} onClick={() => update("currency", c)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${form.currency === c ? "bg-primary/10 text-primary border border-primary/30" : "bg-card text-muted-foreground border border-border hover:border-primary/20"}`}>{c}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Maximize className="w-4 h-4 text-primary" /> Specifications
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Bedrooms</label>
            <input type="number" value={form.bedrooms} onChange={(e: any) => update("bedrooms", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-border" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Bathrooms</label>
            <input type="number" value={form.bathrooms} onChange={(e: any) => update("bathrooms", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-border" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Area (m²) *</label>
            <input type="number" value={form.area} onChange={(e: any) => update("area", e.target.value)} placeholder="450" className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border" />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-5 space-y-4">
        <label className="text-xs text-muted-foreground mb-1 block">Description</label>
        <textarea value={form.description} onChange={(e: any) => update("description", e.target.value)} rows={4} placeholder="Describe the property in detail..." className="w-full px-3 py-2.5 rounded-lg bg-secondary text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 border border-border resize-none" />
      </div>

      <div className="rounded-xl bg-card border border-border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" /> Features
        </h2>
        <div className="flex flex-wrap gap-2">
          {featureOptions.map((f) => (
            <button key={f} onClick={() => toggleFeature(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${form.features.includes(f) ? "bg-primary/10 text-primary border border-primary/30" : "bg-card text-muted-foreground border border-border hover:border-primary/20"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handlePublish} className="flex-1 py-3 rounded-xl bg-gradient-gold text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
          Publish Listing
        </button>
        <button onClick={handleSaveDraft} className="px-6 py-3 rounded-xl border border-border text-foreground font-medium text-sm hover:bg-secondary/50 transition-colors">
          Save Draft
        </button>
      </div>
    </div>
  );
}

/* ─── AI Results Inline ─── */
function AIResultsInline({ result, expanded, toggle, applyAIToForm }: any) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">AI content ready</p>
          <p className="text-xs text-muted-foreground">Apply the generated title & description to your listing form</p>
        </div>
        <Button onClick={applyAIToForm} size="sm" variant="default">
          <Sparkles className="w-4 h-4 mr-1" /> Apply to Form
        </Button>
      </div>

      {result.listing && (
        <div className="rounded-xl bg-card border border-border p-5">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Generated Listing</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Title</p>
              <p className="text-lg font-bold text-foreground">{result.listing.title}</p>
              {result.listing.titleAr && <p className="text-sm text-muted-foreground mt-0.5 text-right" dir="rtl">{result.listing.titleAr}</p>}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{result.listing.description}</p>
            </div>
            {result.listing.highlights && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Key Highlights</p>
                <div className="flex flex-wrap gap-2">
                  {result.listing.highlights.map((h: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{h}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {result.pricing && (
        <div className="rounded-xl bg-card border border-border p-5">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4 text-warning" /> Price Recommendation</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground">Recommended</p>
              <p className="text-xl font-bold text-primary">${result.pricing.recommendedPrice?.toLocaleString()}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground">Range</p>
              <p className="text-sm font-medium text-foreground">${result.pricing.priceRange?.min?.toLocaleString()} - ${result.pricing.priceRange?.max?.toLocaleString()}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground">$/m²</p>
              <p className="text-xl font-bold text-foreground">${result.pricing.pricePerSqm?.toLocaleString()}</p>
            </div>
          </div>
          {result.pricing.reasoning && <p className="text-sm text-muted-foreground">{result.pricing.reasoning}</p>}
        </div>
      )}

      {result.tips && (
        <div className="rounded-xl bg-card border border-border p-5">
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-warning" /> Tips to Improve</h3>
          <ul className="space-y-1.5">
            {result.tips.map((t: string, i: number) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-warning font-bold">{i + 1}.</span> {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─── Shared Components ─── */
function Section({ title, icon, id, expanded, toggle, children }: {
  title: string; icon: React.ReactNode; id: string;
  expanded: string | null; toggle: (id: string) => void; children: React.ReactNode;
}) {
  const isOpen = expanded === id;
  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      <button onClick={() => toggle(id)} className="w-full flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">{icon} {title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {isOpen && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}
