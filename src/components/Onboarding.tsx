import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  User, Search, Sparkles, ChevronRight, ChevronLeft,
  Building2, TrendingUp, Shield,
} from "lucide-react";

interface OnboardingProps {
  open: boolean;
  onComplete: (preferences?: Record<string, any>) => void;
}

const cities = ["Erbil", "Baghdad", "Basra", "Sulaymaniyah"];
const propertyTypes = ["Villa", "Apartment", "Commercial", "Penthouse", "Land"];
const projectTypes = ["Residential", "Commercial", "Mixed-Use"];

const featureSlides: Record<string, { icon: typeof Building2; title: string; desc: string }[]> = {
  buyer: [
    { icon: Search, title: "TerraScore™ AI Valuation", desc: "Every property has an AI-powered investment score to help you make smarter decisions." },
    { icon: Shield, title: "TerraOffer™ Serious Buyer Engine", desc: "Submit verified offers that sellers take seriously — backed by deposit proof." },
    { icon: TrendingUp, title: "Investor Intelligence", desc: "AI-powered market analysis, ROI predictions, and neighborhood growth data." },
  ],
  seller: [
    { icon: Building2, title: "AI-Powered Listings", desc: "Create professional listings with AI-generated descriptions and pricing recommendations." },
    { icon: TrendingUp, title: "Seller Analytics", desc: "Track views, leads, and offer activity on all your listings in real-time." },
    { icon: Shield, title: "Verified Offer Inbox", desc: "Receive only serious offers with seriousness scores and buyer verification." },
  ],
  developer: [
    { icon: Search, title: "AI Land Analysis", desc: "Get instant feasibility reports with unit mix, pricing, and ROI projections." },
    { icon: Building2, title: "Opportunity Feed", desc: "Discover and manage investment opportunities with timeline tracking." },
    { icon: TrendingUp, title: "Portfolio Insights", desc: "Monitor all your development projects with AI-powered performance analysis." },
  ],
};

export default function Onboarding({ open, onComplete }: OnboardingProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  // Step 1 state
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || "");
  const [phone, setPhone] = useState("");

  // Role
  const role = (user?.user_metadata?.role as string) || "buyer";

  // Step 2 state — buyer
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [budget, setBudget] = useState([50000, 500000]);
  const [minBedrooms, setMinBedrooms] = useState(1);

  // Step 2 state — seller
  const [serviceCities, setServiceCities] = useState<string[]>([]);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [agencyName, setAgencyName] = useState("");

  // Step 2 state — developer
  const [primaryProjectType, setPrimaryProjectType] = useState("Residential");
  const [typicalLandSize, setTypicalLandSize] = useState([500]);

  const toggleItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  };

  const buildPreferences = () => {
    if (role === "buyer") {
      return { preferred_cities: selectedCities, property_types: selectedTypes, budget_min: budget[0], budget_max: budget[1], min_bedrooms: minBedrooms };
    }
    if (role === "seller") {
      return { service_cities: serviceCities, license_number: licenseNumber, agency_name: agencyName };
    }
    return { primary_project_type: primaryProjectType, typical_land_size: typicalLandSize[0] };
  };

  const handleFinish = async () => {
    // Update profile name/phone
    if (user) {
      await (supabase as any)
        .from("profiles")
        .update({ display_name: displayName, phone })
        .eq("user_id", user.id);
    }
    onComplete(buildPreferences());
    const dashboardPath = role === "seller" ? "/seller" : role === "developer" ? "/developer" : "/buyer";
    navigate(dashboardPath);
  };

  const slides = featureSlides[role] || featureSlides.buyer;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg [&>button]:hidden" onPointerDownOutside={(e) => e.preventDefault()}>
        {/* Progress */}
        <div className="flex gap-1.5 mb-2">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        {step === 0 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Complete Your Profile
              </DialogTitle>
              <DialogDescription>Tell us about yourself to personalize your experience.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Display Name</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" className="mt-1" />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+964 ..." className="mt-1" />
              </div>
              <div>
                <Label>Your Role</Label>
                <div className="mt-1">
                  <Badge variant="outline" className="capitalize text-primary border-primary/30 bg-primary/10">
                    {role}
                  </Badge>
                </div>
              </div>
            </div>
            <Button onClick={() => setStep(1)} className="w-full mt-6 bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-90">
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </>
        )}

        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" /> Set Your Preferences
              </DialogTitle>
              <DialogDescription>Help us show you the most relevant content.</DialogDescription>
            </DialogHeader>
            <div className="space-y-5 mt-4 max-h-[50vh] overflow-y-auto pr-1">
              {role === "buyer" && (
                <>
                  <div>
                    <Label className="mb-2 block">Preferred Cities</Label>
                    <div className="flex flex-wrap gap-2">
                      {cities.map((c) => (
                        <button
                          key={c}
                          onClick={() => toggleItem(selectedCities, c, setSelectedCities)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                            selectedCities.includes(c) ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary text-muted-foreground border-border hover:border-primary/20"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Property Types</Label>
                    <div className="flex flex-wrap gap-2">
                      {propertyTypes.map((t) => (
                        <button
                          key={t}
                          onClick={() => toggleItem(selectedTypes, t, setSelectedTypes)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                            selectedTypes.includes(t) ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary text-muted-foreground border-border hover:border-primary/20"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Budget Range: ${budget[0].toLocaleString()} – ${budget[1].toLocaleString()}</Label>
                    <Slider
                      min={10000} max={2000000} step={10000}
                      value={budget}
                      onValueChange={setBudget}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Minimum Bedrooms: {minBedrooms}</Label>
                    <Slider min={1} max={10} step={1} value={[minBedrooms]} onValueChange={(v) => setMinBedrooms(v[0])} />
                  </div>
                </>
              )}

              {role === "seller" && (
                <>
                  <div>
                    <Label className="mb-2 block">Service Area Cities</Label>
                    <div className="flex flex-wrap gap-2">
                      {cities.map((c) => (
                        <button
                          key={c}
                          onClick={() => toggleItem(serviceCities, c, setServiceCities)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                            serviceCities.includes(c) ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary text-muted-foreground border-border hover:border-primary/20"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Agent License Number (optional)</Label>
                    <Input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="License #" className="mt-1" />
                  </div>
                  <div>
                    <Label>Agency Name</Label>
                    <Input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="Your agency" className="mt-1" />
                  </div>
                </>
              )}

              {(role === "developer" || role !== "buyer" && role !== "seller") && role === "developer" && (
                <>
                  <div>
                    <Label className="mb-2 block">Primary Project Type</Label>
                    <div className="flex flex-wrap gap-2">
                      {projectTypes.map((t) => (
                        <button
                          key={t}
                          onClick={() => setPrimaryProjectType(t)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                            primaryProjectType === t ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary text-muted-foreground border-border hover:border-primary/20"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Typical Land Size: {typicalLandSize[0].toLocaleString()} m²</Label>
                    <Slider min={100} max={50000} step={100} value={typicalLandSize} onValueChange={setTypicalLandSize} />
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep(0)} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button onClick={() => setStep(2)} className="flex-1 bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-90">
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> You're All Set!
              </DialogTitle>
              <DialogDescription>Here's what you can do with TerraVista.</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div className="rounded-xl bg-secondary p-6 text-center space-y-3">
                {(() => {
                  const slide = slides[slideIndex];
                  const SlideIcon = slide.icon;
                  return (
                    <>
                      <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto">
                        <SlideIcon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{slide.title}</h3>
                      <p className="text-sm text-muted-foreground">{slide.desc}</p>
                    </>
                  );
                })()}
                <div className="flex justify-center gap-1.5 pt-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlideIndex(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === slideIndex ? "bg-primary" : "bg-muted-foreground/30"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button onClick={handleFinish} className="flex-1 bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-90">
                Go to Dashboard 🚀
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
