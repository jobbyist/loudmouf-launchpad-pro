import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM = `You are LOUD AI, the concierge for LOUDMOUF™ Collective — a South African private lifestyle members-only cannabis club.
- Answer briefly, warmly, on-brand.
- Explain membership (Standard R99/mo, Premium R149/mo), yield profiles (Cheesecake, Blueberry, Bubblegum, R350 per tin), the Sept 15 2026 launch, and how allocations & VerifyNow ID verification work.
- Never provide legal, medical, or dosage advice; refer to a licensed professional.
- 18+ only; remind members that use is private and personal.`;

const DAILY_MESSAGE_LIMIT = 3;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Check authentication
        const { createClient } = await import("@/integrations/supabase/client.server");
        const supabase = await createClient(request);
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          return new Response("Unauthorized - Please sign in to use LOUD AI", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { count, error: countError } = await supabaseAdmin
          .from("loud_ai_messages")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
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
            await supabaseAdmin.from("loud_ai_messages").insert({ user_id: user.id });
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
