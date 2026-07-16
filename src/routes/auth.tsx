import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · LOUDMOUF™ Collective" },
      { name: "description", content: "Sign in or create your LOUDMOUF™ member account to access your dashboard, allocation tracker and rewards." },
      { property: "og:title", content: "Sign in · LOUDMOUF™ Collective" },
      { property: "og:description", content: "Access your LOUDMOUF™ Collective member portal." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/member-dashboard" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { first_name: firstName, last_name: lastName },
          },
        });
        if (error) throw error;
        trackEvent("auth_signup", { email });
        toast.success("Account created", { description: "Check your email to confirm." });
        navigate({ to: "/member-dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        trackEvent("auth_signin", { email });
        navigate({ to: "/member-dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-md px-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-loud-yellow">
            Member Portal Access
          </p>
          <h1 className="display mt-3 text-4xl sm:text-5xl text-white">
            {mode === "signin" ? "Sign in." : "Join the Collective."}
          </h1>
          <p className="mt-3 text-sm text-white/60">
            {mode === "signin"
              ? "Access your dashboard, allocation tracker and rewards."
              : "Create your member account. Then complete onboarding to activate your membership."}
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs uppercase tracking-widest text-white/60">
                    First name
                  </Label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="mt-1 bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-widest text-white/60">
                    Last name
                  </Label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="mt-1 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            )}
            <div>
              <Label className="text-xs uppercase tracking-widest text-white/60">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-white/60">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="mt-1 bg-white/5 border-white/10 text-white"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-white/90 uppercase text-xs tracking-widest font-semibold"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === "signin" ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-white/60">
            {mode === "signin" ? "New here? " : "Already a member? "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-loud-yellow hover:underline uppercase tracking-widest font-semibold"
            >
              {mode === "signin" ? "Create an account" : "Sign in instead"}
            </button>
          </p>

          <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-white/40">
            By continuing you agree to our{" "}
            <Link to="/terms" className="hover:text-white">
              Membership Agreement
            </Link>{" "}
            &{" "}
            <Link to="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
