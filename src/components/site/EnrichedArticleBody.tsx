import type { ReactNode } from "react";
import Markdown from "markdown-to-jsx";
import { InlineTextLink, ProductTeaserCard, RelatedArticleLink } from "./ContentLinks";
import { autoLinkMarkdown, pickProductTeaser } from "@/lib/internal-links";

const markdownOptions = {
  overrides: {
    a: { component: InlineTextLink },
  },
};

export interface RelatedArticleRef {
  slug: string;
  title: string;
}

/**
 * Renders a Newsroom article body paragraph-by-paragraph, automatically
 * weaving in internal links: keyword links to commerce pages, one product
 * teaser card, and — when a sibling article is available — a "Continue
 * Reading" link into the Newsroom's internal link graph.
 */
export function EnrichedArticleBody({
  markdown,
  slug,
  relatedArticle,
}: {
  markdown: string;
  slug: string;
  relatedArticle?: RelatedArticleRef | null;
}) {
  const linked = autoLinkMarkdown(markdown);
  const paragraphs = linked.split(/\n{2,}/).filter((p) => p.trim().length > 0);
  const productId = pickProductTeaser(slug);

  const productAt = paragraphs.length >= 3 ? Math.max(1, Math.floor(paragraphs.length * 0.4)) : -1;
  const relatedAt =
    relatedArticle && paragraphs.length >= 4
      ? Math.max(productAt + 1, Math.floor(paragraphs.length * 0.75))
      : -1;

  const nodes: ReactNode[] = [];
  paragraphs.forEach((chunk, i) => {
    nodes.push(
      <Markdown key={`md-${i}`} options={markdownOptions}>
        {chunk}
      </Markdown>,
    );
    if (i === productAt - 1) {
      nodes.push(<ProductTeaserCard key="product-teaser" id={productId} />);
    }
    if (relatedArticle && i === relatedAt - 1) {
      nodes.push(
        <RelatedArticleLink
          key="related-article"
          href={`/newsroom/${relatedArticle.slug}`}
          title={relatedArticle.title}
        />,
      );
    }
  });

  return <>{nodes}</>;
}
