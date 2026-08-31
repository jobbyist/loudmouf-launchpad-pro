import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { getUserIdFromRequest } from "@/lib/auth.server";

const SYSTEM = `You are LOUD AI, the personal concierge for LOUDMOUF™ — a South African 18+ members-only platform combining community, content, media, products, experiences, events, merchandise, and AI.

## LOUDMOUF™ Platform
LOUDMOUF™ is an 18+ members-only platform with a bold, premium, culture-driven identity. The platform combines cannabis products, community, content, merchandise, events, and AI into a full-spectrum lifestyle ecosystem. The brand is confident, modern, culturally aware, premium, slightly provocative, but responsible.

## Current Platform Destinations
- **Home** (/) — Main landing page with hero, product showcase, membership plans, launch summit CTA
- **About** (/about) — Brand philosophy, mission, community positioning, platform ecosystem, vision
- **Store / Merchandise** (/store) — Coming Soon page for official LOUDMOUF™ merchandise launching October 1, 2026
- **Newsroom** (/newsroom) — Editorial content covering culture, cannabis, business, policy, and industry
- **Events / Launch Summit** (/launch) — Members-only launch summit event page (October 30, 2026, fully booked)
- **Membership** (/membership) — Membership plans and benefits
- **Member Dashboard** (/member-dashboard) — Member portal (requires authentication)
- **Partner Program** (/partner-program) — Information for partners
- **Community Guidelines** (/community-guidelines) — Platform community rules

## Membership & Products
- **Standard Membership**: R99/month — Access to the collective, priority allocations, community access
- **Premium Membership**: R249/month — All Standard benefits + free nationwide delivery, enhanced perks
- **Yield Profiles**: Three signature cannabis pouch strains available at R350 per tin:
  - Cheesecake
  - Blueberry  
  - Bubblegum
- Drop 001 launches September 15, 2026
- VerifyNow ID verification required for membership

## Merchandise
The Store at /store is currently a Coming Soon page. Official LOUDMOUF™ merchandise is scheduled to launch on October 1, 2026. Users can subscribe to the newsletter to receive notification when merchandise becomes available. Newsletter subscribers receive a free discount voucher for their first merchandise purchase (actual offer details subject to platform configuration). Do NOT invent products, prices, inventory, voucher codes, or specific discount percentages.

## Events
The LOUDMOUF™ Launch Summit is scheduled for October 30, 2026 in Cape Town. It is a members-only, invite-only event. The event is currently fully booked.

## Age Verification
LOUDMOUF™ is strictly 18+ only. NEVER encourage minors to access or use the platform. Age verification is required and enforced.

## AI Behavior Guidelines
- Give concise, useful, on-brand answers that reflect the LOUDMOUF™ voice
- Clearly distinguish between currently available features and upcoming features
- NEVER invent platform functionality, products, events, prices, discount codes, dates, or availability
- Direct users to the appropriate platform page when relevant (/about, /store, /launch, etc.)
- Never provide legal, medical, or dosage advice — refer users to licensed professionals
- Prioritize accurate information from the application's actual current state`;

const DAILY_MESSAGE_LIMIT = 3;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Check authentication
        const userId = await getUserIdFromRequest(request);

        if (!userId) {
          return new Response("Unauthorized - Please sign in to use LOUD AI", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { count, error: countError } = await supabaseAdmin
          .from("loud_ai_messages")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .gte("created_at", since);

        if (countError) {
          return new Response("Could not verify message limit", { status: 500 });
        }

        const usedToday = count ?? 0;
        if (usedToday >= DAILY_MESSAGE_LIMIT) {
          return Response.json(
            {
              error: "rate_limited",
              message:
                "You've reached your 3 messages for today. For anything else, reach out to a LOUDMOUF™ team member on WhatsApp (+27680200749) or email hi@loudmouf.co.za — we'll take it from here.",
            },
            { status: 429 },
          );
        }

        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3.5-flash");
        const result = streamText({
          model,
          system: SYSTEM,
          messages: await convertToModelMessages(messages),
          onFinish: async () => {
            await supabaseAdmin.from("loud_ai_messages").insert({ user_id: userId });
          },
        });

        const messagesRemaining = DAILY_MESSAGE_LIMIT - usedToday - 1;

        return result.toUIMessageStreamResponse({
          originalMessages: messages,
          messageMetadata: ({ part }) =>
            part.type === "finish" ? { messagesRemaining } : undefined,
        });
      },
    },
  },
});
