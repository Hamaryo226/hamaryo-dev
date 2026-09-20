import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { BackButton } from "@/components/back-button";
import { ModeToggle } from "@/components/mode-toggle";
import { PageFooterNav } from "@/components/page-footer-nav";
import { pageTitle, seo } from "@/config/site";
import usesData from "../../content/uses.json";

export const Route = createFileRoute("/Uses/")({
  head: () => ({
    meta: seo({
      title: pageTitle("Uses"),
      description: "普段の開発と作業に使っているアプリ・技術・環境。",
      path: "/Uses",
    }),
  }),
  component: UsesPage,
});

type Uses = {
  note?: string;
  groups?: Array<{
    name: string;
    items: Array<{ name: string; description?: string; url?: string }>;
  }>;
};

const uses: Uses = usesData;

function UsesPage() {
  // items が空のグループは見出しだけ残っても情報にならないので出さない
  const groups = uses.groups?.filter((group) => group.items.length > 0) ?? [];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-background to-muted/20">
      <main className="mx-auto w-full max-w-screen-lg px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <BackButton href="/" label="ホームに戻る" />
          <ModeToggle />
        </div>

        <header className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Uses
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {uses.note ?? "普段の開発と作業に使っているものです。"}
          </p>
        </header>

        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.name}>
              <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold md:text-2xl">
                <span className="h-7 w-1 rounded-full bg-primary" />
                {group.name}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-xl border bg-card p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                          aria-label={`${item.name} の公式サイト`}
                        >
                          <ArrowUpRight className="size-4" />
                        </a>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <PageFooterNav />
      </main>
    </div>
  );
}
