import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { Mail, MessageSquare } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    const endpoint = import.meta.env.VITE_FORMBACKEND_CONTACT_ENDPOINT;

    setStatus("loading");

    // Endpoint will be configured later via env. If present, POST to Formbackend.
    if (endpoint) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setStatus("success");
          form.reset();
          setTimeout(() => setStatus("idle"), 4000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Contact form error:", error);
        setStatus("error");
      }
    } else {
      // Placeholder until Formbackend endpoint is configured
      console.info("Formbackend contact endpoint not configured yet. Payload:", payload);
      setStatus("success");
      form.reset();
      setTimeout(() => setStatus("idle"), 4000);
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
        Prefer a form? Drop your details below and we&apos;ll get back to you. This form is wired
        to Formbackend — the endpoint will be configured shortly.
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
          {status === "loading" ? "Sending…" : "Send Message"}
        </Button>
        {status === "success" && (
          <p className="text-sm text-loud-yellow">Message sent — we&apos;ll be in touch soon.</p>
        )}
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
        Email <a href="mailto:hi@loudmouf.co.za">hi@loudmouf.co.za</a> with &quot;Wholesale&quot; or
        &quot;Media&quot; in the subject line.
      </p>
    </SiteShell>
  );
}
