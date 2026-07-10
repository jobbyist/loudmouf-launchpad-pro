import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommunityGuidelinesProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommunityGuidelines({ isOpen, onClose }: CommunityGuidelinesProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl border border-white/10 bg-loud-ink p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="display text-3xl text-white mb-4">Community Guidelines</h2>
        <p className="text-white/70 mb-6">
          The LOUDMOUF™ Collective is a members-only community built on respect, authenticity, and quality
          conversation. Please follow these guidelines when commenting on articles.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-loud-yellow uppercase tracking-widest text-sm mb-2">1. Be Respectful</h3>
            <p className="text-white/70 text-sm">
              Treat all members with respect. No hate speech, harassment, discrimination, or personal attacks.
            </p>
          </div>

          <div>
            <h3 className="text-loud-yellow uppercase tracking-widest text-sm mb-2">2. Stay On Topic</h3>
            <p className="text-white/70 text-sm">
              Keep comments relevant to the article. Off-topic discussions may be removed.
            </p>
          </div>

          <div>
            <h3 className="text-loud-yellow uppercase tracking-widest text-sm mb-2">3. No Spam or Self-Promotion</h3>
            <p className="text-white/70 text-sm">
              Avoid excessive self-promotion, spam, or irrelevant links. Share value, not noise.
            </p>
          </div>

          <div>
            <h3 className="text-loud-yellow uppercase tracking-widest text-sm mb-2">4. Members Only</h3>
            <p className="text-white/70 text-sm">
              Comments are restricted to authenticated members of the LOUDMOUF™ Private Club. Sign in to participate.
            </p>
          </div>

          <div>
            <h3 className="text-loud-yellow uppercase tracking-widest text-sm mb-2">5. Moderation</h3>
            <p className="text-white/70 text-sm">
              All comments are subject to moderation. We reserve the right to remove content that violates these
              guidelines or is deemed inappropriate.
            </p>
          </div>

          <div>
            <h3 className="text-loud-yellow uppercase tracking-widest text-sm mb-2">6. Report Violations</h3>
            <p className="text-white/70 text-sm">
              If you see content that violates these guidelines, please report it to our moderation team.
            </p>
          </div>
        </div>

        <Button onClick={onClose} className="mt-8 w-full cta-gradient text-black">I Understand</Button>
      </div>
    </div>
  );
}
