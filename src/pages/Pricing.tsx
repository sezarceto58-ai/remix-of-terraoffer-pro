import { Link } from "react-router-dom";
import { useSubscription, TIERS, TierKey } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Check, Crown, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Pricing() {
  const { tier, subscribed, subscribe, manageSubscription, loading } = useSubscription();
  const { toast } = useToast();
  const [subscribing, setSubscribing] = useState<string | null>(null);

  const handleSubscribe = async (key: TierKey) => {
    if (key === "free") return;
    setSubscribing(key);
    try {
      await subscribe(TIERS[key].price_id);
    } catch (err: any) {
      toast({ title: "Checkout failed", description: err.message, variant: "destructive" });
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold mb-3">
          Choose Your <span className="text-gradient-gold">Plan</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Unlock premium features to supercharge your real estate journey.
        </p>
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
                <div className="mt-3 mb-6">
                  <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>

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
