import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Loader2, Brain, Lock } from "lucide-react";

export default function CreateOpportunity() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tier } = useSubscription();
  const isPaid = tier === "pro" || tier === "elite";
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [form, setForm] = useState({
    title: "", description: "", investment_type: "buy", property_type: "residential",
    city: "", address: "", country: "Iraq", entry_price: 0, currency: "USD",
    estimated_dev_cost: 0, expected_revenue: 0, land_area: 0, built_area: 0,
    bedrooms: 0, bathrooms: 0, floors: 1, timeline_months: 12,
    risk_level: "medium", zoning: "", legal_status: "", permit_status: "",
  });

  const update = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    if (!user || !form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const { data, error } = await (supabase.from("opportunities") as any).insert({
      ...form,
      user_id: user.id,
      location: { lat: 0, lng: 0 },
    }).select("id").single();

    if (error) {
      toast.error("Failed to create opportunity");
      console.error(error);
    } else {
      toast.success("Opportunity created!");
      navigate(`/developer/opportunities/${data.id}`);
    }
    setSaving(false);
  };

  const handleAIGenerate = async () => {
    if (!isPaid) {
      toast.error("Upgrade to Pro or Elite to use AI-powered opportunity analysis.");
      navigate("/pricing");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Please add a title first");
      return;
    }
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("opportunity-ai", {
        body: { type: "full_analysis", opportunity: form },
      });
      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
      } else {
        setAiResult(data.analysis);
        toast.success("🧠 AI Analysis complete!");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /></Button>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">New Opportunity</h1>
          <p className="text-sm text-muted-foreground">Create an investment opportunity workspace</p>
        </div>
      </div>

      {/* AI Generate Banner */}
      <div className={`rounded-xl border p-4 flex items-center justify-between ${isPaid ? "border-dashed border-primary/30 bg-primary/5" : "border-border bg-card"}`}>
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              AI-Powered Analysis
              {!isPaid && <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-bold flex items-center gap-1"><Lock className="w-3 h-3" /> PRO</span>}
            </p>
            <p className="text-xs text-muted-foreground">
              {isPaid
                ? "Fill in basic info, then generate full AI analysis & presentation"
                : "Upgrade to generate full AI-powered investment analysis"}
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
            <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Analyzing...</>
          ) : isPaid ? (
            <><Brain className="w-4 h-4 mr-1" /> Generate</>
          ) : (
            <><Lock className="w-4 h-4 mr-1" /> Upgrade</>
          )}
        </Button>
      </div>

      {/* AI Results */}
      {aiResult && (
        <div className="rounded-xl bg-card border border-primary/20 p-5 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> AI Analysis Results</h3>
          {aiResult.summary && <p className="text-sm text-foreground">{aiResult.summary}</p>}
          {aiResult.recommendation && (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold ${
              aiResult.recommendation === "BUY" ? "bg-success/10 text-success" :
              aiResult.recommendation === "HOLD" ? "bg-warning/10 text-warning" :
              "bg-destructive/10 text-destructive"
            }`}>
              Recommendation: {aiResult.recommendation}
            </div>
          )}
          {aiResult.financials && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(aiResult.financials).slice(0, 8).map(([k, v]) => (
                <div key={k} className="p-3 rounded-lg bg-secondary/30 text-center">
                  <p className="text-xs text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1")}</p>
                  <p className="text-sm font-bold text-foreground mt-1">{typeof v === "number" ? v.toLocaleString() : String(v)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="rounded-xl bg-card border border-border p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Title *</Label>
            <Input placeholder="e.g. Baghdad Residential Tower" value={form.title} onChange={(e) => update("title", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea placeholder="Describe this investment opportunity..." value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} />
          </div>

          <div>
            <Label>Investment Type</Label>
            <Select value={form.investment_type} onValueChange={(v) => update("investment_type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy & Hold</SelectItem>
                <SelectItem value="develop">Develop</SelectItem>
                <SelectItem value="flip">Flip</SelectItem>
                <SelectItem value="rent">Rental</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Property Type</Label>
            <Select value={form.property_type} onValueChange={(v) => update("property_type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="mixed_use">Mixed Use</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>City</Label>
            <Input placeholder="Baghdad" value={form.city} onChange={(e) => update("city", e.target.value)} />
          </div>
          <div>
            <Label>Address</Label>
            <Input placeholder="Street address..." value={form.address} onChange={(e) => update("address", e.target.value)} />
          </div>

          <div>
            <Label>Entry Price ($)</Label>
            <Input type="number" value={form.entry_price} onChange={(e) => update("entry_price", +e.target.value)} />
          </div>
          <div>
            <Label>Estimated Dev Cost ($)</Label>
            <Input type="number" value={form.estimated_dev_cost} onChange={(e) => update("estimated_dev_cost", +e.target.value)} />
          </div>
          <div>
            <Label>Expected Revenue ($)</Label>
            <Input type="number" value={form.expected_revenue} onChange={(e) => update("expected_revenue", +e.target.value)} />
          </div>
          <div>
            <Label>Currency</Label>
            <Select value={form.currency} onValueChange={(v) => update("currency", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="IQD">IQD (Iraqi Dinar)</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Land Area (m²)</Label>
            <Input type="number" value={form.land_area} onChange={(e) => update("land_area", +e.target.value)} />
          </div>
          <div>
            <Label>Built Area (m²)</Label>
            <Input type="number" value={form.built_area} onChange={(e) => update("built_area", +e.target.value)} />
          </div>
          <div>
            <Label>Floors</Label>
            <Input type="number" value={form.floors} onChange={(e) => update("floors", +e.target.value)} />
          </div>
          <div>
            <Label>Timeline (months)</Label>
            <Input type="number" value={form.timeline_months} onChange={(e) => update("timeline_months", +e.target.value)} />
          </div>

          <div>
            <Label>Risk Level</Label>
            <Select value={form.risk_level} onValueChange={(v) => update("risk_level", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Zoning</Label>
            <Input placeholder="e.g. Residential R2" value={form.zoning} onChange={(e) => update("zoning", e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving} className="bg-gradient-gold text-primary-foreground shadow-gold">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Create Opportunity
          </Button>
        </div>
      </div>
    </div>
  );
}
