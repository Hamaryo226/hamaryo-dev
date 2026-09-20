import { Link, createFileRoute } from "@tanstack/react-router";

import { BackButton } from "@/components/back-button";
import { ModeToggle } from "@/components/mode-toggle";
import { PageFooterNav } from "@/components/page-footer-nav";
import { pageTitle, seo } from "@/config/site";
import nowData from "../../content/now.json";

export const Route = createFileRoute("/Now/")({
  head: () => ({
    meta: seo({
      title: pageTitle("Now"),
      description: "いま作っているもの、学んでいること、最近の更新。",
      path: "/Now",
    }),
  }),
  component: NowPage,
});

type NowItem = {
  title: string;
  description: string;
  /** 内部ページへのリンク。/Project/xxx のようなパス */
  link?: { text: string; url: string };
};

type Now = {
  /** 最終更新。ページ冒頭に出す */
  updated?: string;
  note?: string;
  sections?: Array<{ heading: string; items: NowItem[] }>;
};

const now: Now = nowData;

function NowPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-background to-muted/20">
      <main className="mx-auto w-full max-w-screen-lg px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <BackButton href="/" label="ホームに戻る" />
          <ModeToggle />
        </div>

        <header className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Now</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            いま作っているもの、学んでいること、最近の更新です。
          </p>
          {now.updated && (
            <p className="mt-3 font-mono text-xs text-muted-foreground">
              最終更新: {now.updated}
            </p>
          )}
          {now.note && (
            <p className="mt-6 leading-relaxed whitespace-pre-line">
              {now.note}
            </p>
          )}
        </header>

        {now.sections?.map((section) => (
          <section key={section.heading} className="mb-12">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold md:text-2xl">
              <span className="h-7 w-1 rounded-full bg-primary" />
              {section.heading}
            </h2>
            <div className="space-y-4">
              {section.items.map((item) => (
                <div key={item.title} className="rounded-xl border bg-card p-5">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  {item.link && (
                    <Link
                      to={item.link.url}
                      className="mt-3 inline-flex text-sm text-primary transition-opacity hover:opacity-70"
                    >
                      {item.link.text} →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        <PageFooterNav />
      </main>
    </div>
  );
}
