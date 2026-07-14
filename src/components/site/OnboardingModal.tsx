import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { verifySAID, type SAIDInfo } from "@/lib/verifynow";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createSignatureRecord } from "@/lib/signature";
import { MEMBERSHIP_AGREEMENT_VERSION } from "@/lib/launch";
import { z } from "zod";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  said: string;
  tier: "standard" | "premium" | "";
  consent: boolean;
  typedSignature: string;
}

const TIERS: Array<{
  id: "standard" | "premium";
  name: string;
  sub: string;
  price: string;
  accent: string;
}> = [
  {
    id: "standard",
    name: "Standard Membership",
    sub: "Enter the Collective · portal, tracker, community.",
    price: "R99 / month",
    accent: "from-loud-yellow/20 to-transparent border-loud-yellow/40",
  },
  {
    id: "premium",
    name: "Premium Membership",
    sub: "Rewards Card · loyalty · cashback · priority.",
    price: "R149 / month",
    accent:
      "from-loud-pink/25 via-loud-yellow/10 to-[color:var(--loud-blue-bright)]/20 border-loud-pink/40",
  },
];

const STEP_TITLES = [
  "Welcome to the Collective",
  "How can we reach you?",
  "Verify your identity",
  "Choose your tier",
  "Membership agreement",
  "Digital signature",
  "You're in",
];

export function OnboardingModal() {
  const { onboardingOpen, setOnboardingOpen, closeOnboarding, openCart, setMemberVerified } =
    useUIStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    said: "",
    tier: "",
    consent: false,
    typedSignature: "",
  });
  const [signing, setSigning] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [saidInfo, setSaidInfo] = useState<SAIDInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset when opened fresh
  useEffect(() => {
    if (onboardingOpen) {
      setStep(0);
      setSaidInfo(null);
      setError(null);
    }
  }, [onboardingOpen]);

  const progressPct = useMemo(() => ((step + 1) / STEP_TITLES.length) * 100, [step]);

  function update<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setError(null);
  }

  function validateStep(): string | null {
    if (step === 0) {
      const s = z
        .object({
          firstName: z.string().trim().min(1, "First name is required").max(80),
          lastName: z.string().trim().min(1, "Last name is required").max(80),
        })
        .safeParse(form);
      return s.success ? null : s.error.issues[0].message;
    }
    if (step === 1) {
      const s = z
        .object({
          email: z.string().trim().email("Enter a valid email"),
          mobile: z
            .string()
            .trim()
            .regex(/^(\+?27|0)[6-8][0-9]{8}$/, "Enter a valid SA mobile number"),
        })
        .safeParse(form);
      return s.success ? null : s.error.issues[0].message;
    }
    if (step === 2) {
      if (!/^\d{13}$/.test(form.said)) return "SA ID must be 13 digits";
      if (!saidInfo?.valid) return "Please verify your ID before continuing";
      return null;
    }
    if (step === 3) {
      return form.tier ? null : "Please select a membership tier";
    }
    if (step === 4) {
      return form.consent ? null : "You must accept the Membership Agreement to continue";
    }
    if (step === 5) {
      const expected = `${form.firstName} ${form.lastName}`.trim().toLowerCase();
      const typed = form.typedSignature.trim().toLowerCase();
      if (!typed) return "Please type your full name to sign";
      if (typed !== expected) return "Your signature must match your full name exactly";
      return null;
    }
    return null;
  }

  async function runVerification() {
    setVerifying(true);
    setError(null);
    try {
      const info = await verifySAID(form.said, form.firstName, form.lastName);
      setSaidInfo(info);
      if (!info.valid) setError(info.reason ?? "Verification failed");
    } catch (e) {
      setError("Could not reach VerifyNow. Please try again.");
    } finally {
      setVerifying(false);
    }
  }

  function next() {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    if (step < STEP_TITLES.length - 1) setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  function finish() {
    setMemberVerified(true);
    // Persist an obfuscated summary so we can pre-fill Shopify checkout later.
    try {
      window.localStorage.setItem(
        "loudmouf-member-profile",
        JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          mobile: form.mobile,
          tier: form.tier,
          saidMasked: form.said.slice(0, 6) + "*******",
          verifiedAt: new Date().toISOString(),
        }),
      );
    } catch {
      // ignore
    }
    toast.success("Welcome to the Collective", {
      description: "Your membership is active. Continuing to your cart.",
    });
    closeOnboarding();
    // Small delay so the dialog exit animation finishes before the drawer slides in.
    setTimeout(() => openCart(), 250);
  }

  return (
    <Dialog open={onboardingOpen} onOpenChange={setOnboardingOpen}>
      <DialogContent className="max-w-xl bg-loud-ink border-white/10 p-0 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none gradient-loud opacity-10" />

          <div className="relative px-6 pt-6 pb-4 border-b border-white/10">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-white/50">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-loud-yellow" />
                Membership onboarding
              </span>
              <span>
                Step {step + 1} / {STEP_TITLES.length}
              </span>
            </div>
            <DialogTitle className="display mt-3 text-3xl sm:text-4xl text-white">
              {STEP_TITLES[step]}
            </DialogTitle>
            <div className="mt-3">
              <Progress value={progressPct} className="h-1 bg-white/10" />
            </div>
          </div>

          <div className="relative px-6 py-6 min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="space-y-4"
              >
                {step === 0 && (
                  <>
                    <p className="text-sm text-white/70">
                      LOUDMOUF™ is a private members-only lifestyle club. Tell us who's joining —
                      this must match your South African ID.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label
                          htmlFor="fn"
                          className="text-xs uppercase tracking-widest text-white/60"
                        >
                          First name
                        </Label>
                        <Input
                          id="fn"
                          value={form.firstName}
                          onChange={(e) => update("firstName", e.target.value)}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                          placeholder="Kagiso"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="ln"
                          className="text-xs uppercase tracking-widest text-white/60"
                        >
                          Last name
                        </Label>
                        <Input
                          id="ln"
                          value={form.lastName}
                          onChange={(e) => update("lastName", e.target.value)}
                          className="mt-1 bg-white/5 border-white/10 text-white"
                          placeholder="Mokoena"
                        />
                      </div>
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <p className="text-sm text-white/70">
                      We'll send your membership confirmation and drop invites here. Kept private,
                      never shared.
                    </p>
                    <div>
                      <Label
                        htmlFor="em"
                        className="text-xs uppercase tracking-widest text-white/60"
                      >
                        Email
                      </Label>
                      <Input
                        id="em"
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className="mt-1 bg-white/5 border-white/10 text-white"
                        placeholder="you@domain.co.za"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="mb"
                        className="text-xs uppercase tracking-widest text-white/60"
                      >
                        Mobile
                      </Label>
                      <Input
                        id="mb"
                        type="tel"
                        value={form.mobile}
                        onChange={(e) => update("mobile", e.target.value)}
                        className="mt-1 bg-white/5 border-white/10 text-white"
                        placeholder="082 123 4567"
                      />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <p className="text-sm text-white/70">
                      Membership requires SA ID verification via VerifyNow — this confirms you're
                      18+ and legally eligible.
                    </p>
                    <div>
                      <Label
                        htmlFor="said"
                        className="text-xs uppercase tracking-widest text-white/60"
                      >
                        SA ID number
                      </Label>
                      <div className="mt-1 flex gap-2">
                        <Input
                          id="said"
                          inputMode="numeric"
                          maxLength={13}
                          value={form.said}
                          onChange={(e) => {
                            update("said", e.target.value.replace(/\D/g, "").slice(0, 13));
                            setSaidInfo(null);
                          }}
                          className="bg-white/5 border-white/10 text-white font-mono tabular-nums tracking-wider"
                          placeholder="13 digits"
                        />
                        <Button
                          type="button"
                          onClick={runVerification}
                          disabled={verifying || form.said.length !== 13}
                          className="bg-white text-black hover:bg-white/90 uppercase text-xs tracking-widest font-semibold"
                        >
                          {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                        </Button>
                      </div>
                    </div>

                    {saidInfo && (
                      <div
                        className={cn(
                          "rounded-xl border p-3 text-xs",
                          saidInfo.valid
                            ? "border-loud-yellow/30 bg-loud-yellow/5 text-white"
                            : "border-loud-pink/40 bg-loud-pink/5 text-white/90",
                        )}
                      >
                        {saidInfo.valid ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-loud-yellow font-semibold uppercase tracking-widest">
                              <ShieldCheck className="h-3.5 w-3.5" /> Verified · VerifyNow
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-white/70">
                              <div>
                                <span className="text-white/40 block text-[10px] uppercase tracking-widest">
                                  DOB
                                </span>
                                {saidInfo.dob}
                              </div>
                              <div>
                                <span className="text-white/40 block text-[10px] uppercase tracking-widest">
                                  Age
                                </span>
                                {saidInfo.age}
                              </div>
                              <div>
                                <span className="text-white/40 block text-[10px] uppercase tracking-widest">
                                  Status
                                </span>
                                {saidInfo.citizenship === "SA" ? "SA Citizen" : "PR"}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p>{saidInfo.reason}</p>
                        )}
                      </div>
                    )}
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">
                      Encrypted transit · POPIA compliant · never shared
                    </p>
                  </>
                )}

                {step === 3 && (
                  <div className="space-y-2">
                    <p className="text-sm text-white/70">
                      Select the monthly contribution tier that fits your lifestyle. You can change
                      it later in the member portal.
                    </p>
                    {TIERS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => update("tier", t.id)}
                        className={cn(
                          "w-full text-left rounded-2xl border bg-gradient-to-br p-4 transition",
                          t.accent,
                          form.tier === t.id ? "ring-2 ring-white/40" : "hover:border-white/30",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-display text-lg text-white leading-none">{t.name}</p>
                            <p className="text-[11px] uppercase tracking-widest text-white/60 mt-1">
                              {t.sub}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-white">{t.price}</p>
                            {form.tier === t.id && (
                              <span className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-loud-yellow">
                                <Check className="h-3 w-3" /> Selected
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-3 text-sm text-white/70">
                    <p>
                      By joining you agree to the LOUDMOUF™ Membership Agreement, our Community
                      Guidelines and the Private-Use Mandate: allocations are for your personal,
                      non-commercial use only.
                    </p>
                    <ul className="space-y-1.5 text-xs">
                      <li className="flex gap-2">
                        <Check className="h-4 w-4 text-loud-yellow flex-shrink-0" /> I am 18 years
                        or older and legally competent.
                      </li>
                      <li className="flex gap-2">
                        <Check className="h-4 w-4 text-loud-yellow flex-shrink-0" /> I delegate my
                        private cultivation rights to LOUDMOUF™ under the Mandate framework.
                      </li>
                      <li className="flex gap-2">
                        <Check className="h-4 w-4 text-loud-yellow flex-shrink-0" /> I will consume
                        only in private, in accordance with SA law.
                      </li>
                    </ul>
                    <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => update("consent", e.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-loud-yellow"
                      />
                      <span className="text-xs text-white/80">
                        I accept the Membership Agreement, Community Guidelines and consent to my
                        personal data being processed for verification and fulfilment purposes.
                      </span>
                    </label>
                  </div>
                )}

                {step === 5 && (
                  <div className="text-center py-8">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full gradient-loud">
                      <Check className="h-8 w-8 text-black" />
                    </div>
                    <h3 className="display mt-5 text-3xl text-white">Welcome, {form.firstName}.</h3>
                    <p className="mt-2 text-sm text-white/60 max-w-sm mx-auto">
                      Your Collective membership is active. Continue to your cart to secure your
                      first monthly allocation.
                    </p>
                  </div>
                )}

                {error && step !== 5 && <p className="text-xs text-loud-pink">{error}</p>}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative px-6 pb-6 pt-2 flex items-center justify-between border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={back}
              disabled={step === 0 || step === STEP_TITLES.length - 1}
              className="text-white/60 hover:text-white uppercase text-xs tracking-widest"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            {step < STEP_TITLES.length - 1 ? (
              <Button
                type="button"
                onClick={next}
                className="bg-white text-black hover:bg-white/90 uppercase text-xs tracking-widest font-semibold px-6"
              >
                Continue <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={finish}
                className="cta-gradient text-black hover:opacity-90 uppercase text-xs tracking-widest font-semibold px-6"
              >
                Go to my cart <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
