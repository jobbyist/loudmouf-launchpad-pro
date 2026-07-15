import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, MessageCircle, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";

const STARTERS = [
  "Explain Membership",
  "Compare Yield Profiles",
  "How does verification work?",
  "When is the launch?",
];

const DISMISS_KEY = "loudmouf-loud-ai-dismissed";

const transport = new DefaultChatTransport({ api: "/api/chat" });

function messageText(m: UIMessage) {
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
}

export function LoudAI() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    id: "loud-ai",
    transport,
  });

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY) === "1") setHidden(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  function dismiss() {
    setOpen(false);
    setHidden(true);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    await sendMessage({ text });
  }

  async function sendStarter(text: string) {
    await sendMessage({ text });
  }

  const busy = status === "submitted" || status === "streaming";

  if (hidden) {
    return (
      <button
        onClick={() => {
          setHidden(false);
          try {
            window.sessionStorage.removeItem(DISMISS_KEY);
          } catch {
            /* ignore */
          }
        }}
        aria-label="Show LOUD AI"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 rounded-l-lg border border-r-0 border-white/10 bg-loud-ink/80 backdrop-blur-xl px-1.5 py-2 text-white/50 hover:text-white shadow-lg"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    );
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
            </div>

            <form onSubmit={submit} className="border-t border-white/10 p-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the Collective concierge…"
                className="flex-1 rounded-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-loud-yellow/40"
                disabled={busy}
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
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
      <div className="relative flex flex-col items-stretch">
        <button
          onClick={dismiss}
          aria-label="Dismiss LOUD AI"
          className="absolute -top-2 -left-2 grid h-5 w-5 place-items-center rounded-full border border-white/15 bg-loud-ink text-white/50 hover:text-white shadow"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
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
    </div>
  );
}
