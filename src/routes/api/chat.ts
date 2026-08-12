import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM = `You are LOUD AI, the concierge for LOUDMOUF™ Collective — a South African private lifestyle members-only cannabis club.
- Answer briefly, warmly, on-brand.
- Explain membership (Standard R99/mo, Premium R149/mo), yield profiles (Cheesecake, Blueberry, Bubblegum, R350 per tin), the Sept 15 2026 launch, and how allocations & VerifyNow ID verification work.
- Never provide legal, medical, or dosage advice; refer to a licensed professional.
- 18+ only; remind members that use is private and personal.`;

const MAX_MESSAGES = 30;
const MAX_CHARS = 8000;

// Simple in-process budget per authenticated user.
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 15;
const budget = new Map<string, { count: number; resetAt: number }>();

function overBudget(key: string) {
  const now = Date.now();
  const entry = budget.get(key);
  if (!entry || entry.resetAt < now) {
    budget.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Require a valid signed-in session before touching the paid AI gateway.
        const authHeader = request.headers.get("Authorization") ?? "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
        if (!token) return new Response("Unauthorized", { status: 401 });

        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY!,
          { auth: { persistSession: false, autoRefreshToken: false } },
        );
        const { data: userData, error: userError } = await supabase.auth.getUser(token);
        if (userError || !userData.user) return new Response("Unauthorized", { status: 401 });

        if (overBudget(userData.user.id)) {
          return new Response("Too many requests", { status: 429 });
        }

        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("Messages are required", { status: 400 });
        }
        if (messages.length > MAX_MESSAGES) {
          return new Response("Conversation too long", { status: 400 });
        }
        if (JSON.stringify(messages).length > MAX_CHARS) {
          return new Response("Message too large", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("AI is not available", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3.5-flash");
        const result = streamText({
          model,
          system: SYSTEM,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
