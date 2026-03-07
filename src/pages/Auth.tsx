import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { lovable } from "@/integrations/lovable/index";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<"login" | "signup" | "forgot">(
    searchParams.get("tab") === "signup" ? "signup" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"buyer" | "seller" | "developer">("buyer");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const redirectByRole = async (userId: string) => {
    try {
      const redirect = searchParams.get("redirect");
      const { data: { user } } = await supabase.auth.getUser();
      const metaRole = user?.user_metadata?.role;
      const fallbackRole = metaRole === "seller" ? "seller" : metaRole === "developer" ? "developer" : "buyer";

      const { data: roleRow } = await (supabase
        .from("user_roles" as any)
        .select("role")
        .eq("user_id", userId)
        .maybeSingle() as any);

      let resolvedRole = roleRow?.role as "buyer" | "seller" | "developer" | "admin" | undefined;

      if (!resolvedRole) {
        const { data: insertedRole } = await (supabase
          .from("user_roles" as any)
          .insert({ user_id: userId, role: fallbackRole })
          .select("role")
          .maybeSingle() as any);

        resolvedRole = insertedRole?.role as "buyer" | "seller" | "admin" | undefined;
      }

      if (redirect && redirect.startsWith("/")) {
        navigate(redirect);
        return;
      }

      navigate(
        resolvedRole === "seller" ? "/seller" :
        resolvedRole === "developer" ? "/developer" :
        resolvedRole === "admin" ? "/admin" : "/buyer"
      );
    } catch {
      navigate("/buyer");
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) redirectByRole(session.user.id);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) redirectByRole(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Weak password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName, role },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email ✉️", description: "We sent you a confirmation link to verify your account." });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Reset failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email sent", description: "Check your inbox for a password reset link." });
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: "Google sign-in failed", description: String(error), variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-gold opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(42_90%_55%/0.15),transparent_60%)]" />
        <div className="relative z-10 text-center px-12 max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-8 shadow-gold">
            <Building2 className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-display font-bold mb-4 text-gradient-gold leading-tight">TerraVista</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Your premium real estate platform for buying, selling, and investing across Iraq & Kurdistan with confidence.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            <div className="p-3 rounded-xl bg-card/50 border border-border backdrop-blur-sm">
              <p className="text-2xl font-bold text-foreground">AI</p>
              <p className="text-xs text-muted-foreground">Powered</p>
            </div>
            <div className="p-3 rounded-xl bg-card/50 border border-border backdrop-blur-sm">
              <p className="text-2xl font-bold text-foreground">24/7</p>
              <p className="text-xs text-muted-foreground">Support</p>
            </div>
            <div className="p-3 rounded-xl bg-card/50 border border-border backdrop-blur-sm">
              <p className="text-2xl font-bold text-foreground">100%</p>
              <p className="text-xs text-muted-foreground">Secure</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold text-gradient-gold">TerraVista</span>
          </div>

          <h2 className="text-2xl font-display font-bold mb-1 text-foreground">
            {tab === "login" ? "Welcome back" : tab === "signup" ? "Create account" : "Reset password"}
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            {tab === "login"
              ? "Sign in to access your dashboard."
              : tab === "signup"
              ? "Get started with TerraVista for free."
              : "Enter your email to receive a reset link."}
          </p>

          {tab === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                <button type="button" onClick={() => setTab("login")} className="text-primary hover:underline font-medium">Back to sign in</button>
              </p>
            </form>
          )}

          {tab !== "forgot" && (
            <>
              <form onSubmit={tab === "login" ? handleLogin : handleSignup} className="space-y-4">
                {tab === "signup" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="name" placeholder="Your name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="pl-10" required />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>I want to</Label>
                      <RadioGroup value={role} onValueChange={(v) => setRole(v as any)} className="grid grid-cols-3 gap-2">
                        {([
                          { value: "buyer", label: "Buy", emoji: "🏠" },
                          { value: "seller", label: "Sell", emoji: "📋" },
                          { value: "developer", label: "Develop", emoji: "🏗️" },
                        ] as const).map((r) => (
                          <label
                            key={r.value}
                            htmlFor={`role-${r.value}`}
                            className={`flex flex-col items-center gap-1 rounded-xl border p-3 cursor-pointer transition-all ${
                              role === r.value ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/30"
                            }`}
                          >
                            <RadioGroupItem value={r.value} id={`role-${r.value}`} className="sr-only" />
                            <span className="text-lg">{r.emoji}</span>
                            <span className="text-xs font-medium text-foreground">{r.label}</span>
                          </label>
                        ))}
                      </RadioGroup>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {tab === "login" && (
                      <button type="button" onClick={() => setTab("forgot")} className="text-xs text-primary hover:underline">Forgot password?</button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required minLength={6} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-90" disabled={loading}>
                  {loading ? "Please wait..." : tab === "login" ? "Sign In" : "Create Account"}
                </Button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button type="button" variant="outline" className="w-full" disabled={loading} onClick={handleGoogleSignIn}>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                {tab === "login" ? (
                  <>Don't have an account?{" "}<button onClick={() => setTab("signup")} className="text-primary hover:underline font-medium">Sign up</button></>
                ) : (
                  <>Already have an account?{" "}<button onClick={() => setTab("login")} className="text-primary hover:underline font-medium">Sign in</button></>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
