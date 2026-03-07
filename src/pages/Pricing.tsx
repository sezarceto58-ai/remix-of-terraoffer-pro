import { useState } from "react";
import { Link } from "react-router-dom";
import { useSubscription, TIERS, TierKey } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Check, Crown, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Pricing() {
  const { tier, subscribed, subscribe, manageSubscription, loading } = useSubscription();
  const { toast } = useToast();
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  const handleSubscribe = async (key: TierKey) => {
    if (key === "free") return;
    const plan = TIERS[key];
    const priceId = billing === "annual" && plan.price_id_annual ? plan.price_id_annual : plan.price_id;
    setSubscribing(key);
    try {
      await subscribe(priceId);
    } catch (err: any) {
      toast({ title: "Checkout failed", description: err.message, variant: "destructive" });
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-display font-bold mb-3">
          Choose Your <span className="text-gradient-gold">Plan</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto mb-6">
          Unlock premium features to supercharge your real estate journey.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-card border border-border">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              billing === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
              billing === "annual" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annual
            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-success text-success-foreground text-[10px] font-bold">
              -30%
            </span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {(Object.entries(TIERS) as [TierKey, typeof TIERS[TierKey]][]).map(([key, plan]) => {
            const isCurrent = key === tier;
            const isPopular = key === "pro";
            const displayPrice = billing === "annual" && key !== "free"
              ? Math.round(plan.priceAnnual / 12)
              : plan.price;
            const totalAnnual = plan.priceAnnual;

            return (
              <div
                key={key}
                className={`relative rounded-2xl border p-8 flex flex-col ${
                  isCurrent
                    ? "border-primary bg-primary/5 shadow-lg"
                    : isPopular
                    ? "border-primary/40 shadow-md"
                    : "border-border bg-card"
                }`}
              >
                {isPopular && !isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    Most Popular
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-gold text-primary-foreground text-xs font-semibold flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Your Plan
                  </span>
                )}

                <h3 className="text-xl font-display font-bold text-foreground">{plan.name}</h3>
                <div className="mt-3 mb-2">
                  <span className="text-4xl font-bold text-foreground">${displayPrice}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                {billing === "annual" && key !== "free" && (
                  <p className="text-xs text-muted-foreground mb-4">
                    <span className="line-through">${plan.price * 12}/yr</span>{" "}
                    <span className="text-success font-semibold">${totalAnnual}/yr</span>
                  </p>
                )}
                {(billing === "monthly" || key === "free") && <div className="mb-4" />}

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button variant="outline" disabled className="w-full">
                    Current Plan
                  </Button>
                ) : key === "free" ? (
                  subscribed ? (
                    <Button variant="outline" onClick={() => manageSubscription()} className="w-full">
                      Downgrade
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="w-full">
                      Current Plan
                    </Button>
                  )
                ) : (
                  <Button
                    onClick={() => handleSubscribe(key)}
                    disabled={subscribing !== null}
                    className="w-full"
                  >
                    {subscribing === key && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {tier !== "free" ? "Switch Plan" : "Get Started"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
