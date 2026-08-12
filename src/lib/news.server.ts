// Server-only Firecrawl + Gemini pipeline for the LOUDMOUF newsroom.
// Called from /api/public/hooks/scrape-articles.

import { supabaseAdmin } from "@/integrations/supabase/client.server";

const FIRECRAWL_V2 = "https://api.firecrawl.dev/v2";
const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const CANNABIS_QUERIES = [
  "South Africa cannabis policy 2026",
  "cannabis science research terpenes",
  "cannabis private club South Africa",
  "cannabis wellness lifestyle",
  "cannabis industry news",
];

interface FirecrawlSearchResult {
  url: string;
  title?: string;
  description?: string;
  markdown?: string;
}

async function firecrawlSearch(query: string, limit = 3): Promise<FirecrawlSearchResult[]> {
  const key = process.env.FIRECRAWL_API_KEY!;
  const res = await fetch(`${FIRECRAWL_V2}/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      limit,
      tbs: "qdr:w",
      scrapeOptions: { formats: ["markdown"] },
    }),
  });
  if (!res.ok) throw new Error(`Firecrawl search failed [${res.status}]: ${await res.text()}`);
  const data = (await res.json()) as { data?: { web?: FirecrawlSearchResult[] } | FirecrawlSearchResult[] };
  const results = Array.isArray(data.data)
    ? data.data
    : (data.data?.web ?? []);
  return results;
}

async function firecrawlScrape(url: string): Promise<{ markdown?: string; metadata?: { title?: string; ogImage?: string; description?: string } }> {
  const key = process.env.FIRECRAWL_API_KEY!;
  const res = await fetch(`${FIRECRAWL_V2}/scrape`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true,
    }),
  });
  if (!res.ok) throw new Error(`Firecrawl scrape failed [${res.status}]`);
  const data = (await res.json()) as { data?: { markdown?: string; metadata?: Record<string, string> } };
  return data.data ?? {};
}

async function generateSummary(title: string, url: string, markdown: string): Promise<string> {
  const key = process.env.LOVABLE_API_KEY!;
  const prompt = `You are LOUDMOUF™ Newsroom's senior editor. Write a substantial editorial summary (1000-1500 words) of the following cannabis-related article for a South African private lifestyle club audience.

Rules:
- Write in flowing paragraphs separated by blank lines.
- Warm, informed, culturally aware tone.
- Include practical context for SA members where relevant (CfPPA, POPIA, local landscape).
- Attribute claims to the original source.
- Do NOT copy full sentences verbatim; paraphrase and add editorial framing.
- End with a short "What this means for the Collective" paragraph.

ARTICLE TITLE: ${title}
ORIGINAL URL: ${url}

ARTICLE CONTENT:
${markdown.slice(0, 12000)}`;

  const res = await fetch(AI_GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Gemini summary failed [${res.status}]: ${await res.text()}`);
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty summary from Gemini");
  return content;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function excerptFrom(summary: string): string {
  const first = summary.split(/\n+/).find((p) => p.trim().length > 40) ?? summary;
  return first.trim().slice(0, 260);
}

function sourceLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host.split(".").slice(0, -1).join(".").toUpperCase() || host.toUpperCase();
  } catch {
    return "External";
  }
}

function coverFor(title: string, index: number): string {
  // Branded gradient placeholder thumbnail (deterministic per article).
  const seed = encodeURIComponent(title.slice(0, 60));
  const palettes = ["FFD400,FF3D8B,0033A0", "FF3D8B,FFD400,111827", "0033A0,FF3D8B,FFD400"];
  const p = palettes[index % palettes.length];
  return `https://og.tailgraph.com/og?title=${seed}&titleFontSize=80&fontFamily=Anton&titleColor=%23111&bgColor=%23FFD400&bgGradient=${p}&logoText=LOUDMOUF&logoColor=%23111`;
}

export interface ScrapedArticle {
  slug: string;
  title: string;
  source: string;
  sourceUrl: string;
  summary: string;
  excerpt: string;
  wordCount: number;
  cover: string;
}

export async function runNewsroomScrape(maxArticles = 4): Promise<{
  inserted: number;
  skipped: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let inserted = 0;
  let skipped = 0;

  const query = CANNABIS_QUERIES[Math.floor(Math.random() * CANNABIS_QUERIES.length)];

  let results: FirecrawlSearchResult[] = [];
  try {
    results = await firecrawlSearch(query, Math.min(maxArticles + 2, 6));
  } catch (e) {
    errors.push(`search: ${(e as Error).message}`);
    return { inserted, skipped, errors };
  }

  let processed = 0;
  for (const r of results) {
    if (processed >= maxArticles) break;
    if (!r.url) continue;
    const slug = slugify(r.title ?? r.url);
    if (!slug) continue;

    const { data: existing } = await supabaseAdmin
      .from("newsroom_articles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existing) {
      skipped++;
      continue;
    }

    try {
      const markdown = r.markdown ?? (await firecrawlScrape(r.url)).markdown;
      if (!markdown || markdown.length < 400) {
        errors.push(`${slug}: content too short`);
        continue;
      }
      const summary = await generateSummary(r.title ?? "Untitled", r.url, markdown);
      const wordCount = summary.trim().split(/\s+/).length;
      const cover = coverFor(r.title ?? "LOUDMOUF Newsroom", processed);

      const { error: insErr } = await supabaseAdmin.from("newsroom_articles").insert({
        slug,
        title: (r.title ?? "Untitled").slice(0, 300),
        source: sourceLabel(r.url),
        source_url: r.url,
        cover,
        excerpt: excerptFrom(summary),
        summary_md: summary,
        word_count: wordCount,
        status: "published",
      });
      if (insErr) {
        errors.push(`${slug}: insert ${insErr.message}`);
        continue;
      }
      inserted++;
      processed++;
    } catch (e) {
      errors.push(`${slug}: ${(e as Error).message}`);
    }
  }

  return { inserted, skipped, errors };
}
