// Deterministic, automated internal-linking for Newsroom article bodies.
// Runs at render time against every article the Firecrawl + Gemini pipeline
// produces (see src/lib/news.server.ts), so deep links to the commerce pages
// and sibling articles are added without any manual editing.
import type { ProductTeaserId } from "@/components/site/ContentLinks";

interface KeywordLinkTarget {
  pattern: RegExp;
  href: string;
}

// First-match-wins, one link per target, capped by `maxLinks` below.
const KEYWORD_LINKS: KeywordLinkTarget[] = [
  { pattern: /\bLOUDMOUF™? Membership\b/i, href: "/membership" },
  { pattern: /\bmembership tiers?\b/i, href: "/membership" },
  { pattern: /\bprivate lifestyle club\b/i, href: "/membership" },
  { pattern: /\bherbal tinctures?\b/i, href: "/herbal-tinctures" },
  { pattern: /\bcannabis pouches?\b/i, href: "/store" },
  {
    pattern: /\breferral program\b|\bpartner program\b|\bambassadors?\b/i,
    href: "/partner-program",
  },
];

const MARKDOWN_LINK_RE = /\[[^\]]*\]\([^)]*\)/g;

/**
 * Turns the first mention of a handful of brand/product keywords into real
 * markdown links, skipping any text that's already part of a markdown link.
 * Capped at `maxLinks` total insertions so an article never turns into a
 * wall of links.
 */
export function autoLinkMarkdown(markdown: string, maxLinks = 3): string {
  const existingLinks = markdown.match(MARKDOWN_LINK_RE) ?? [];
  const segments = markdown.split(MARKDOWN_LINK_RE);
  const usedHrefs = new Set<string>();
  let remaining = maxLinks;

  const linkedSegments = segments.map((segment) => {
    if (remaining <= 0) return segment;
    let result = segment;
    for (const target of KEYWORD_LINKS) {
      if (remaining <= 0) break;
      if (usedHrefs.has(target.href)) continue;
      const match = result.match(target.pattern);
      if (!match || match.index === undefined) continue;
      const matched = match[0];
      result =
        result.slice(0, match.index) +
        `[${matched}](${target.href})` +
        result.slice(match.index + matched.length);
      usedHrefs.add(target.href);
      remaining--;
    }
    return result;
  });

  let out = "";
  linkedSegments.forEach((segment, i) => {
    out += segment;
    if (i < existingLinks.length) out += existingLinks[i];
  });
  return out;
}

const PRODUCT_ROTATION: ProductTeaserId[] = ["tinctures", "membership", "store", "partners"];

/** Deterministic per-slug pick so a given article always features the same product. */
export function pickProductTeaser(slug: string): ProductTeaserId {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return PRODUCT_ROTATION[hash % PRODUCT_ROTATION.length];
}
