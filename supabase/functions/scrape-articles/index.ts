import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Cannabis culture sources
const SOURCES = [
  { name: 'Cannabis Culture', url: 'https://www.cannabisculture.com/' },
  { name: 'High Times', url: 'https://hightimes.com/' },
  { name: 'Leafly', url: 'https://www.leafly.com/news' },
  { name: 'MG Magazine', url: 'https://mgmagazine.com/' },
];

// South African sources (25% of content)
const SA_SOURCES = [
  { name: 'Dagga Magazine', url: 'https://daggamagazine.co.za/' },
  { name: 'Cannabis SA', url: 'https://www.cannafinder.com/news/' },
];

interface Article {
  title: string;
  summary: string;
  excerpt: string;
  content: string;
  sourceUrl: string;
  sourceName: string;
  readingTime: number;
}

async function scrapeWithFirecrawl(url: string): Promise<any> {
  const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify({
      url,
      pageOptions: {
        onlyMainContent: true,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Firecrawl error: ${response.statusText}`);
  }

  return await response.json();
}

function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function generateSummary(content: string): Promise<string> {
  // Use OpenAI/Anthropic API or simple extraction
  // For now, extract first 1000-1500 words
  const words = content.split(/\s+/);
  const targetWords = Math.min(words.length, 1200);
  return words.slice(0, targetWords).join(' ') + '...';
}

function extractExcerpt(content: string): string {
  const words = content.split(/\s+/);
  return words.slice(0, 50).join(' ') + '...';
}

async function scrapeAndSaveArticle(source: { name: string; url: string }, supabase: any): Promise<boolean> {
  try {
    console.log(`Scraping ${source.name}...`);
    
    const data = await scrapeWithFirecrawl(source.url);
    
    if (!data.data || !data.data.content) {
      console.error(`No content found for ${source.name}`);
      return false;
    }

    const content = data.data.content;
    const title = data.data.title || `Latest from ${source.name}`;
    
    const summary = await generateSummary(content);
    const excerpt = extractExcerpt(content);
    const readingTime = calculateReadingTime(summary);
    const slug = generateSlug(title);

    const article: Article = {
      title,
      summary,
      excerpt,
      content,
      sourceUrl: source.url,
      sourceName: source.name,
      readingTime,
    };

    // Check if article already exists
    const { data: existing } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      console.log(`Article already exists: ${title}`);
      return false;
    }

    // Insert article
    const { error } = await supabase
      .from('articles')
      .insert({
        title: article.title,
        summary: article.summary,
        excerpt: article.excerpt,
        content: article.content,
        source_url: article.sourceUrl,
        source_name: article.sourceName,
        reading_time: article.readingTime,
        slug,
        thumbnail_url: `/images/newsroom/${slug}-thumbnail.png`,
      });

    if (error) {
      console.error(`Error saving article: ${error.message}`);
      return false;
    }

    console.log(`Successfully saved article: ${title}`);
    return true;
  } catch (error) {
    console.error(`Error scraping ${source.name}:`, error);
    return false;
  }
}

Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);

  // Randomly select 1-2 sources (25% chance for SA source)
  const useSASource = Math.random() < 0.25;
  const sourcePool = useSASource ? [...SOURCES, ...SA_SOURCES] : SOURCES;
  const selectedSources = sourcePool.sort(() => Math.random() - 0.5).slice(0, Math.random() < 0.5 ? 1 : 2);

  const results = await Promise.all(selectedSources.map(source => scrapeAndSaveArticle(source, supabase)));
  
  return new Response(JSON.stringify({ success: true, scraped: results.filter(Boolean).length }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
