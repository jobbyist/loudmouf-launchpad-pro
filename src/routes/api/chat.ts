import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM = `You are LOUD AI, the concierge for LOUDMOUF™ Collective — a South African private lifestyle members-only cannabis club.
- Answer briefly, warmly, on-brand.
- Explain membership (Standard R99/mo, Premium R149/mo), yield profiles (Cheesecake, Blueberry, Bubblegum, R350 per tin), the Sept 15 2026 launch, and how allocations & VerifyNow ID verification work.
- Never provide legal, medical, or dosage advice; refer to a licensed professional.
- 18+ only; remind members that use is private and personal.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
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
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
