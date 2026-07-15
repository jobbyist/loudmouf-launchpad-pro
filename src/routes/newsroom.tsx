import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Newsroom } from "@/components/site/Newsroom";

export const Route = createFileRoute("/newsroom")({
  head: () => ({
    meta: [
      { title: "LOUDMOUF™ Newsroom — Cannabis Signal & Long-Form Summaries" },
      {
        name: "description",
        content:
          "Curated long-form summaries of cannabis coverage that shapes the LOUDMOUF™ Collective — law, science and product innovation, always linked to the original source.",
      },
      { property: "og:title", content: "LOUDMOUF™ Newsroom" },
      {
        property: "og:description",
        content:
          "Long-form cannabis summaries curated for the LOUDMOUF™ Collective.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewsroomPage,
});

function NewsroomPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="pt-32">
        <Newsroom />
      </main>
      <Footer />
    </div>
  );
}
