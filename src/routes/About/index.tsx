import { createFileRoute } from "@tanstack/react-router";

import { BackButton } from "@/components/back-button";
import { ModeToggle } from "@/components/mode-toggle";
import { PageFooterNav } from "@/components/page-footer-nav";
import { Card, CardContent } from "@/components/ui/card";
import { pageTitle, seo } from "@/config/site";
import aboutData from "../../content/about.json";

export const Route = createFileRoute("/About/")({
  head: () => ({
    meta: seo({
      title: pageTitle("About"),
      description: "取り組んでいる領域と、これまで作ってきたものの年表。",
      path: "/About",
    }),
  }),
  component: AboutPage,
});

type About = {
  /** トップの自己紹介を深掘りする本文。空なら表示しない */
  intro?: string;
  focus?: Array<{ title: string; description: string }>;
  values?: Array<{ title: string; description: string }>;
  timeline?: Array<{ period: string; title: string; description?: string }>;
};

const about: About = aboutData;

function AboutPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-background to-muted/20">
      <main className="mx-auto w-full max-w-screen-lg px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <BackButton href="/" label="ホームに戻る" />
          <ModeToggle />
        </div>

        <header className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            About
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            取り組んでいる領域と、これまで作ってきたものをまとめています。
          </p>
          {about.intro && (
            <p className="mt-6 leading-relaxed whitespace-pre-line">
              {about.intro}
            </p>
          )}
        </header>

        {about.focus && about.focus.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold md:text-2xl">
              <span className="h-7 w-1 rounded-full bg-primary" />
              取り組んでいる領域
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {about.focus.map((item) => (
                <Card key={item.title} className="rounded-xl shadow-none">
                  <CardContent className="p-5">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {about.values && about.values.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold md:text-2xl">
              <span className="h-7 w-1 rounded-full bg-primary" />
              大事にしていること
            </h2>
            <div className="space-y-4">
              {about.values.map((item) => (
                <div key={item.title} className="rounded-xl border bg-card p-5">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {about.timeline && about.timeline.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold md:text-2xl">
              <span className="h-7 w-1 rounded-full bg-primary" />
              年表
            </h2>
            <ol className="relative space-y-6 border-l pl-6">
              {about.timeline.map((item, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.9375rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
                  <p className="font-mono text-xs text-muted-foreground">
                    {item.period}
                  </p>
                  <h3 className="mt-1 font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        <PageFooterNav />
      </main>
    </div>
  );
}
