import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { Mail, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — LOUDMOUF™" },
      {
        name: "description",
        content: "Get in touch with the LOUDMOUF™ team — email, WhatsApp and support hours.",
      },
      { property: "og:title", content: "Contact — LOUDMOUF™" },
      { property: "og:description", content: "Email or WhatsApp the LOUDMOUF™ team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [thankYouOpen, setThankYouOpen] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", "7c0c7e89-57cf-42b8-83a0-072a2114fa5e");
    formData.append("from_name", "LOUDMOUF Contact Form");
    formData.append("subject", (formData.get("subject") as string) || "New contact message");

    setStatus("loading");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setStatus("idle");
        form.reset();
        setThankYouOpen(true);
      } else {
        console.error("Web3Forms contact error:", data);
        setStatus("error");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("error");
    }
  }

  return (
    <SiteShell title="Get in Touch" kicker="Contact">
      <p>
        Questions about a drop, wholesale, media or an existing order? The LOUDMOUF™ team is a
        message away — usually replying within a few hours during business days.
      </p>

      <div className="not-prose mt-10 grid gap-4 sm:grid-cols-2">
        <a
          href="mailto:hi@loudmouf.co.za"
          className="glass rounded-2xl p-6 hover:border-loud-yellow/40 transition"
        >
          <Mail className="h-5 w-5 text-loud-yellow" />
          <h3 className="mt-4 font-display uppercase text-xl text-white">Email</h3>
          <p className="text-sm text-white/70 mt-1">hi@loudmouf.co.za</p>
        </a>
        <a
          href="https://wa.me/27680200749"
          className="glass rounded-2xl p-6 hover:border-loud-yellow/40 transition"
        >
          <MessageSquare className="h-5 w-5 text-loud-yellow" />
          <h3 className="mt-4 font-display uppercase text-xl text-white">WhatsApp</h3>
          <p className="text-sm text-white/70 mt-1">+27 68 020 0749</p>
        </a>
        <div className="glass rounded-2xl p-6 sm:col-span-2">
          <h3 className="mt-4 font-display uppercase text-xl text-white">Head Office</h3>
          <p className="text-sm text-white/70 mt-1">
            Gravitas Industries (Pty) Ltd t/a LOUDPACK™ · CK 2024/596436/07 · South Africa
          </p>
        </div>
      </div>

      <h2>Send us a message</h2>
      <p className="text-white/70">
        Prefer a form? Drop your details below and we'll get back to you.
      </p>

      <form onSubmit={handleSubmit} className="not-prose mt-6 space-y-5 max-w-xl">
        <div className="space-y-2">
          <Label htmlFor="contact-name" className="text-white/80">
            Name
          </Label>
          <Input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            disabled={status === "loading"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email" className="text-white/80">
            Email
          </Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            disabled={status === "loading"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-subject" className="text-white/80">
            Subject
          </Label>
          <Input
            id="contact-subject"
            name="subject"
            type="text"
            required
            placeholder="How can we help?"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            disabled={status === "loading"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-message" className="text-white/80">
            Message
          </Label>
          <Textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            placeholder="Tell us more..."
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-y"
            disabled={status === "loading"}
          />
        </div>
        <Button
          type="submit"
          className="cta-gradient text-black font-semibold uppercase tracking-widest hover:opacity-90"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            "Send Message"
          )}
        </Button>
        {status === "error" && (
          <p className="text-sm text-red-400">Something went wrong. Please try again or email us directly.</p>
        )}
      </form>

      <h2>Support Hours</h2>
      <p>
        Mon – Fri · 09:00 – 17:00 SAST. WhatsApp queries outside these hours are answered the next
        business day.
      </p>

      <h2>Wholesale & Media</h2>
      <p>
        Email <a href="mailto:hi@loudmouf.co.za">hi@loudmouf.co.za</a> with "Wholesale" or
        "Media" in the subject line.
      </p>

      <Dialog open={thankYouOpen} onOpenChange={setThankYouOpen}>
        <DialogContent className="max-w-md bg-loud-ink border-white/10">
          <DialogHeader className="items-center text-center sm:text-center">
            <CheckCircle2 className="h-12 w-12 text-loud-yellow mb-2" />
            <DialogTitle className="text-white text-2xl font-display uppercase">
              Thank you
            </DialogTitle>
            <DialogDescription className="text-white/70 text-base pt-2">
              Your message is with the LOUDMOUF™ team. We'll get back to you within a few
              business hours.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => setThankYouOpen(false)}
              className="cta-gradient text-black font-semibold uppercase tracking-widest hover:opacity-90"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SiteShell>
  );
}
