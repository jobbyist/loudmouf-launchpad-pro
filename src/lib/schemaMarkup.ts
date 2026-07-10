/**
 * Google Schema Markup Generator for Articles
 * Dynamically injects structured data for SEO
 */

export interface ArticleSchemaData {
  title: string;
  description: string;
  publishedDate: string;
  modifiedDate?: string;
  author?: string;
  imageUrl?: string;
  url: string;
}

export function generateArticleSchema(data: ArticleSchemaData): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.imageUrl || 'https://loudmouf.co.za/images/ad-creative.png',
    datePublished: data.publishedDate,
    dateModified: data.modifiedDate || data.publishedDate,
    author: {
      '@type': 'Organization',
      name: data.author || 'LOUDMOUF™ Collective',
      url: 'https://loudmouf.co.za',
    },
    publisher: {
      '@type': 'Organization',
      name: 'LOUDMOUF™',
      logo: {
        '@type': 'ImageObject',
        url: 'https://loudmouf.co.za/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
  };

  return JSON.stringify(schema);
}

export function injectArticleSchema(data: ArticleSchemaData): void {
  if (typeof document === 'undefined') return;

  // Remove existing schema if present
  const existing = document.querySelector('script[type="application/ld+json"][data-article-schema]');
  if (existing) {
    existing.remove();
  }

  // Create and inject new schema
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-article-schema', 'true');
  script.textContent = generateArticleSchema(data);
  document.head.appendChild(script);
}

export function getSchemaMetaTags(data: ArticleSchemaData) {
  return [
    { property: 'og:type', content: 'article' },
    { property: 'article:published_time', content: data.publishedDate },
    { property: 'article:modified_time', content: data.modifiedDate || data.publishedDate },
  ];
}
