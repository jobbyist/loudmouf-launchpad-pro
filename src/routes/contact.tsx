import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { Mail, MessageSquare, MapPin } from "lucide-react";

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
  component: () => (
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
          <MapPin className="h-5 w-5 text-loud-yellow" />
          <h3 className="mt-4 font-display uppercase text-xl text-white">Head Office</h3>
          <p className="text-sm text-white/70 mt-1">
            Gravitas Industries (Pty) Ltd t/a LOUDPACK™ · CK 2024/596436/07 · South Africa
          </p>
        </div>
      </div>

      <h2>Support Hours</h2>
      <p>
        Mon – Fri · 09:00 – 17:00 SAST. WhatsApp queries outside these hours are answered the next
        business day.
      </p>

      <h2>Wholesale & Media</h2>
      <p>
        Email <a href="mailto:hi@loudmouf.co.za">hi@loudmouf.co.za</a> with "Wholesale" or "Media"
        in the subject line.
      </p>
    </SiteShell>
  ),
});
