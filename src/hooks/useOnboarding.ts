import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useOnboarding() {
  const { user, loading: authLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) {
      setLoading(false);
      return;
    }

    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", user.id)
        .single();

      if (data && !(data as any).onboarding_completed) {
        setShowOnboarding(true);
      }
      setLoading(false);
    })();
  }, [user, authLoading]);

  const completeOnboarding = async (preferences?: Record<string, any>) => {
    if (!user) return;
    await supabase
      .from("profiles")
      .update({
        onboarding_completed: true,
        user_preferences: preferences || {},
      } as any)
      .eq("user_id", user.id);
    setShowOnboarding(false);
  };

  return { showOnboarding, loading, completeOnboarding };
}
