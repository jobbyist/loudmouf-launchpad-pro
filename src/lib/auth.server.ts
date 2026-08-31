// Server-only auth helper for raw HTTP route handlers (createFileRoute().server.handlers),
// which receive a plain fetch Request and are NOT covered by the
// requireSupabaseAuth server-function middleware (integrations/supabase/auth-middleware.ts) —
// that middleware only wraps createServerFn() calls. Callers must send the
// user's Supabase access token as `Authorization: Bearer <token>` (see
// LoudAI.tsx's DefaultChatTransport `headers` resolver for the client side).
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/** Resolves the authenticated user's id from a request's Bearer token, or null. */
export async function getUserIdFromRequest(request: Request): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token || token.split(".").length !== 3) return null;

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    console.error("[auth] Missing SUPABASE_URL/SUPABASE_PUBLISHABLE_KEY");
    return null;
  }

  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims?.sub) return null;
  return data.claims.sub;
}
