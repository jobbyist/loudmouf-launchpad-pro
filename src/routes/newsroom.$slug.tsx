import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { useUIStore } from "@/stores/uiStore";

export const Route = createFileRoute("/newsroom/$slug")({
  loader: async ({ params }) => {
    return { slug: params.slug };
  },
  component: ArticleRedirect,
});

function ArticleRedirect() {
  const { slug } = Route.useLoaderData();
  const openArticleModal = useUIStore((s) => s.openArticleModal);

  useEffect(() => {
    openArticleModal(slug);
    // Optionally redirect back or stay
  }, [slug, openArticleModal]);

  return null; // Modal handles rendering, keep route for SEO/indexing
}
