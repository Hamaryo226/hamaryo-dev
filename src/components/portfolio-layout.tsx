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
      <header className="mx-auto w-full max-w-[640px] px-5 sm:px-6">
        <div className="flex items-center justify-between gap-3 py-5 sm:py-6">
          <Link
            to="/"
            aria-label="ホーム"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <span
              aria-hidden="true"
              className="size-5 bg-current [mask-image:url('/icon/site-symbol.svg')] [mask-repeat:no-repeat] [mask-size:contain]"
            />
          </Link>
          <nav
            aria-label="メインナビゲーション"
            className="ml-auto flex flex-wrap items-center gap-3 text-[11px] sm:gap-5"
          >
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-sm py-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4"
                activeProps={{
                  className: "text-foreground",
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
        className="mx-auto w-full max-w-[640px] flex-1 px-5 outline-none sm:px-6"
      >
        {children}
      </main>
      <footer className="mx-auto mt-16 w-full max-w-[640px] px-5 pb-7 sm:mt-20 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] text-muted-foreground">
          <p>© {new Date().getFullYear()}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/About" className="hover:text-foreground">
              About
            </Link>
            <Link to="/Info" className="hover:text-foreground">
              サイト情報
            </Link>
            <a
              href="https://github.com/Hamaryo226"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              GitHub <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
