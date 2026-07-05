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
      { title: "LOUDMOUF™ — Big Taste. Zero Smoke." },
      {
        name: "description",
        content:
          "Premium South African cannabis pouches. Discreet. Potent. Unapologetic. Pre-order Drop 001 of LOUDMOUF™ now.",
      },
      { name: "author", content: "LOUDMOUF™ / Gravitas Industries (Pty) Ltd" },
      { name: "theme-color", content: "#0D0D0D" },
      { property: "og:title", content: "LOUDMOUF™ — Big Taste. Zero Smoke." },
      { property: "og:description", content: "Premium cannabis pouches infused with high-grade strains cultivated in South Africa. Available in Cheesecake, Blueberry and Bubblegum flavors." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "LOUDMOUF" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@loudmouf" },
      { name: "twitter:title", content: "LOUDMOUF™ — Big Taste. Zero Smoke." },
      { name: "description", content: "Premium cannabis pouches infused with high-grade strains cultivated in South Africa. Available in Cheesecake, Blueberry and Bubblegum flavors." },
      { name: "twitter:description", content: "Premium cannabis pouches infused with high-grade strains cultivated in South Africa. Available in Cheesecake, Blueberry and Bubblegum flavors." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/iy019M6SqjMXyibDc8dgs2v9PSx1/social-images/social-1783283660956-176D9ED6-E03B-49A6-B98A-D066E0E8E3A6.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/iy019M6SqjMXyibDc8dgs2v9PSx1/social-images/social-1783283660956-176D9ED6-E03B-49A6-B98A-D066E0E8E3A6.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
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
