import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { ModeToggle } from "@/components/mode-toggle";

const navigation = [
  { to: "/Project", label: "Project" },
  { to: "/About", label: "About" },
  { to: "/Blog", label: "Blog" },
  { to: "/Info", label: "Info" },
] as const;

export function PortfolioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="portfolio-shell flex min-h-screen flex-col bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-foreground p-3 text-background focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        本文へスキップ
      </a>
      <header className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-x-6 border-b py-5 sm:py-6">
          <Link
            to="/"
            className="rounded-sm text-xl font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            hamaryo
            <span className="text-emerald-700 dark:text-lime-300">.</span>
          </Link>
          <nav
            aria-label="メインナビゲーション"
            className="order-3 mt-4 flex w-full gap-6 text-sm sm:order-none sm:mt-0 sm:ml-auto sm:w-auto sm:gap-7"
          >
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-sm py-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4"
                activeProps={{
                  className:
                    "text-foreground underline decoration-emerald-600 decoration-2 underline-offset-8 dark:decoration-lime-300",
                  "aria-current": "page",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ModeToggle />
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-5 outline-none sm:px-8"
      >
        {children}
      </main>
      <footer className="mx-auto mt-20 w-full max-w-6xl px-5 pb-6 sm:mt-28 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-5 border-t pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Hamaryo</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link to="/About" className="hover:text-foreground">
              About
            </Link>
            <Link to="/Info" className="hover:text-foreground">
              このサイトについて
            </Link>
            <a
              href="https://github.com/Hamaryo226"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              GitHub <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
