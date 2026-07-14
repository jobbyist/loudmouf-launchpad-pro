import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const bodySchema = z.object({
  fullName: z.string().trim().min(1).max(200),
  typedSignature: z.string().trim().min(1).max(200),
  agreementVersion: z.string().trim().min(1).max(50),
  signatureHash: z.string().trim().regex(/^[a-f0-9]{64}$/i),
  ipAddress: z.string().trim().max(64).nullable().optional(),
  userAgent: z.string().trim().max(512).optional(),
  acceptedAt: z.string().datetime(),
  acceptanceStatements: z.array(z.string().max(500)).max(20),
});

export const Route = createFileRoute("/api/public/record-signature")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const raw = await request.json();
          const parsed = bodySchema.safeParse(raw);
          if (!parsed.success) {
            return new Response(JSON.stringify({ error: "invalid_payload" }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }
          const data = parsed.data;
          // Server-side IP takes precedence (client IP claim is best-effort only).
          const fwd = request.headers.get("x-forwarded-for") ?? "";
          const serverIp = fwd.split(",")[0].trim() || data.ipAddress || null;

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { error } = await supabaseAdmin.from("member_signatures").insert({
            full_name: data.fullName,
            typed_signature: data.typedSignature,
            agreement_version: data.agreementVersion,
            signature_hash: data.signatureHash,
            ip_address: serverIp,
            user_agent: data.userAgent ?? request.headers.get("user-agent") ?? null,
            acceptance_statements: data.acceptanceStatements,
            accepted_at: data.acceptedAt,
          });
          if (error) {
            return new Response(JSON.stringify({ error: "insert_failed" }), {
              status: 500,
              headers: { "content-type": "application/json" },
            });
          }
          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch {
          return new Response(JSON.stringify({ error: "server_error" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
