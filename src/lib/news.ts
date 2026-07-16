// Seeded articles have been replaced by real scraped content via the newsroom scrape hook.
// Triggered POST to /api/public/hooks/scrape-articles to populate DB with live articles.

export interface NewsArticle {
  slug: string;
  title: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  cover: string;
  excerpt: string;
  summary: string; // 1000+ words
}

export function getAllArticles(): NewsArticle[] {
  return []; // Now sourced from DB
}

export function getSeededArticles(): NewsArticle[] {
  return []; // Deprecated - real articles from scrape
}

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return undefined; // Handled by DB query
}
