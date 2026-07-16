import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { useCartSync } from "@/hooks/useCartSync";
import { ArticleModal } from "@/components/site/ArticleModal";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-loud-yellow">404</h1>
        <h2 className="mt-4 font-display uppercase text-2xl text-white">Page not found</h2>
        <p className="mt-2 text-sm text-white/60">
          You wandered off the loud path. Let's get you back.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-full bg-loud-yellow px-6 py-3 text-xs font-semibold uppercase tracking-widest text-black"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display uppercase text-2xl text-white">Something loud went wrong</h1>
        <p className="mt-2 text-sm text-white/60">Try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center rounded-full bg-loud-yellow px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-black"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LOUDMOUF™ — Private Lifestyle Club · Big Taste. Zero Smoke." },
      {
        name: "description",
        content:
          "LOUDMOUF™ is South Africa's Private Lifestyle Club for premium cannabis pouches. Standard R99 or Premium R149 monthly membership. 18+ Members only.",
      },
      { name: "author", content: "LOUDMOUF™" },
      { name: "theme-color", content: "#0D0D0D" },
      { property: "og:title", content: "LOUDMOUF™ — Private Lifestyle Club" },
      {
        property: "og:description",
        content:
          "South Africa's Private Lifestyle Club for premium cannabis pouches. 18+ Members only.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "LOUDMOUF" },
      { property: "og:url", content: "https://loudmouf.co.za/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@loudmoufza" },
      { name: "twitter:title", content: "LOUDMOUF™ — Private Lifestyle Club" },
      {
        name: "twitter:description",
        content:
          "South Africa's Private Lifestyle Club for premium cannabis pouches. 18+ Members only.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Scripts />
        <Analytics />
        <ArticleModal />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useCartSync();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" theme="dark" />
    </QueryClientProvider>
  );
}
