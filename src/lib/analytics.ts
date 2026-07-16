import { supabase } from "@/integrations/supabase/client";

let sessionId: string | null = null;
function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  if (sessionId) return sessionId;
  try {
    const existing = window.sessionStorage.getItem("loudmouf-session-id");
    if (existing) {
      sessionId = existing;
      return existing;
    }
    const fresh = crypto.randomUUID();
    window.sessionStorage.setItem("loudmouf-session-id", fresh);
    sessionId = fresh;
    return fresh;
  } catch {
    return "anon";
  }
}

export async function trackEvent(
  eventName: string,
  properties: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;
  try {
    const path = window.location.pathname + window.location.search;
    const { data: userData } = await supabase.auth.getUser();
    await supabase.from("analytics_events").insert({
      event_name: eventName.slice(0, 100),
      user_id: userData.user?.id ?? null,
      session_id: getSessionId(),
      path: path.slice(0, 500),
      properties,
    });
  } catch {
    /* analytics failures are non-fatal */
  }
}
