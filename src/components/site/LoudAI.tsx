import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, MessageCircle, Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { supabase } from "@/integrations/supabase/client";

const STARTERS = [
  "Explain Membership",
  "Compare Yield Profiles",
  "How does verification work?",
  "When is the launch?",
];

const ESCALATION_MESSAGE =
  "You've reached your 3 messages for today. For anything else, reach out to a LOUDMOUF™ team member on WhatsApp (+27680200749) or email hi@loudmouf.co.za — we'll take it from here.";

const transport = new DefaultChatTransport({ api: "/api/chat" });

function messageText(m: UIMessage) {
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
}

function messagesRemainingOf(m: UIMessage): number | undefined {
  const meta = m.metadata as { messagesRemaining?: number } | undefined;
  return meta?.messagesRemaining;
}

export function LoudAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    id: "loud-ai",
    transport,
    onError: (err) => {
      try {
        const parsed = JSON.parse(err.message) as { error?: string };
        if (parsed.error === "rate_limited") setLimitReached(true);
      } catch {
        // non-JSON error, ignore
      }
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const lastAssistantRemaining = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role !== "assistant") continue;
      return messagesRemainingOf(m);
    }
    return undefined;
  }, [messages]);

  useEffect(() => {
    if (lastAssistantRemaining !== undefined && lastAssistantRemaining <= 0) {
      setLimitReached(true);
    }
  }, [lastAssistantRemaining]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (limitReached) return;
    const text = input.trim();
    if (!text) return;
    setInput("");
    await sendMessage({ text });
  }

  async function sendStarter(text: string) {
    if (limitReached) return;
    await sendMessage({ text });
  }

  const busy = status === "submitted" || status === "streaming";

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="mr-2 flex h-[520px] w-[340px] flex-col rounded-2xl border border-white/10 bg-loud-ink/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-label="LOUD AI Assistant"
          >
            <div className="relative p-4 border-b border-white/10">
              <div className="absolute inset-0 pointer-events-none gradient-loud opacity-10" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full gradient-loud">
                    <Sparkles className="h-4 w-4 text-black" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">LOUD AI</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/50">
                      Member Concierge · Gemini
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close LOUD AI"
                  className="rounded-full p-1 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm"
            >
              {messages.length === 0 ? (
                <div>
                  <p className="text-white/70">
                    Hi — I'm LOUD AI, your Collective concierge. Ask me anything, or start
                    with one of these:
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendStarter(s)}
                        disabled={busy}
                        className="text-[10px] uppercase tracking-widest rounded-full border border-white/15 bg-white/5 px-2.5 py-1.5 text-white/80 hover:border-loud-yellow/40 hover:text-loud-yellow transition disabled:opacity-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={
                      m.role === "user"
                        ? "ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-loud-yellow/90 text-black px-3 py-2"
                        : "mr-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 text-white px-3 py-2"
                    }
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{messageText(m)}</p>
                  </div>
                ))
              )}
              {busy && (
                <div className="mr-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 text-white/60 px-3 py-2 text-xs">
                  LOUD AI is thinking…
                </div>
              )}
              {limitReached && (
                <div className="mr-auto max-w-[90%] rounded-2xl rounded-tl-sm border border-loud-yellow/30 bg-loud-yellow/10 text-white px-3 py-2">
                  <p className="whitespace-pre-wrap leading-relaxed">{ESCALATION_MESSAGE}</p>
                </div>
              )}
            </div>

            <form onSubmit={submit} className="border-t border-white/10 p-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  limitReached ? "Daily limit reached — see you tomorrow" : "Ask the Collective concierge…"
                }
                className="flex-1 rounded-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-loud-yellow/40 disabled:opacity-50"
                disabled={busy || limitReached}
              />
              <button
                type="submit"
                disabled={busy || limitReached || !input.trim()}
                className="grid h-9 w-9 place-items-center rounded-full cta-gradient text-black disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notch */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close LOUD AI" : "Open LOUD AI"}
        aria-expanded={open}
        className="group relative flex flex-col items-center gap-2 rounded-l-2xl border border-r-0 border-white/10 bg-loud-ink/80 backdrop-blur-xl px-2.5 py-4 shadow-2xl"
      >
        <span className="absolute inset-0 rounded-l-2xl gradient-loud opacity-20 group-hover:opacity-40 transition" />
        <span className="relative flex flex-col items-center gap-2">
          <MessageCircle className="h-4 w-4 text-loud-yellow" />
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gradient-loud"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            LOUD AI
          </span>
        </span>
      </button>
    </div>
  );
}
