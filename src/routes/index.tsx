import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, FolderOpen, Layers, NotebookText } from "lucide-react";
import { PortfolioLayout } from "@/components/portfolio-layout";
import { ProjectDisclosure } from "@/components/project-disclosure";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getFeaturedProjects,
  getProjectPresentation,
} from "@/config/portfolio";
import { SITE_DESCRIPTION, SITE_NAME, seo } from "@/config/site";
import { getAllArticles } from "@/lib/articles";
import { getAllBlogs } from "@/lib/blogs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: seo({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/" }),
  }),
  component: Home,
});

function Home() {
  const articles = getAllArticles();
  const blogs = getAllBlogs();
  const featured = getFeaturedProjects();
  const platformCount = new Set(
    articles.flatMap((article) => {
      const platform = getProjectPresentation(article).platform;
      return platform ? [platform] : [];
    }),
  ).size;
  const stats = [
    { label: "プロジェクト", value: articles.length, icon: FolderOpen },
    { label: "ブログ記事", value: blogs.length, icon: NotebookText },
    { label: "プラットフォーム", value: platformCount, icon: Layers },
  ] as const;

  return (
    <PortfolioLayout>
      <section className="pt-10 sm:pt-14" aria-labelledby="profile-heading">
        <div className="flex items-center gap-3">
          <Avatar className="size-12 border border-border/60">
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/52881627?v=4"
              alt=""
            />
            <AvatarFallback>H</AvatarFallback>
          </Avatar>
          <div>
            <h1
              id="profile-heading"
              className="text-lg font-medium tracking-tight"
            >
              Hamaryo
            </h1>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              システムエンジニア / プログラマー
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-4 text-[13px] leading-7 text-muted-foreground">
          <p>
            Webアプリケーション、iOSアプリ、PC向けのツールを制作しています。大学でのシステム開発と個人開発の成果を、このサイトにまとめています。
          </p>
          <p>
            音楽と移動を記録する
            <Link
              to="/Project/$slug"
              params={{ slug: "strolly" }}
              className="text-foreground/80 underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              Strolly
            </Link>
            、リズムゲームの
            <Link
              to="/Project/$slug"
              params={{ slug: "taikodive" }}
              className="text-foreground/80 underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              TaikoDive
            </Link>
            、写真を扱う
            <Link
              to="/Project/$slug"
              params={{ slug: "drop-watermark" }}
              className="text-foreground/80 underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              Drop-Watermark
            </Link>
            などを制作しています。開発の記録や、普段使うアプリの話はブログに掲載しています。
          </p>
        </div>
        <dl className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col rounded-xl bg-muted/50 p-3 sm:p-4"
            >
              <dt className="order-last mt-1 text-[10px] text-muted-foreground">
                {stat.label}
              </dt>
              <dd>
                <stat.icon
                  className="mb-3 size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="text-lg font-medium tabular-nums">
                  {stat.value}
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px]">
          <Link
            to="/About"
            className="rounded-full bg-foreground px-3 py-1.5 text-background transition-opacity hover:opacity-80"
          >
            プロフィール
          </Link>
          <a
            href="https://github.com/Hamaryo226"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub <ArrowUpRight className="size-3" aria-hidden="true" />
          </a>
          <a
            href="https://www.instagram.com/ryota_ztts"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            Instagram <ArrowUpRight className="size-3" aria-hidden="true" />
          </a>
        </div>
      </section>
      <section
        id="selected-work"
        aria-labelledby="selected-work-heading"
        className="mt-14 scroll-mt-8"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2
            id="selected-work-heading"
            className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground"
          >
            PROJECTS / {String(featured.length).padStart(2, "0")}
          </h2>
          <Link
            to="/Project"
            className="text-[10px] text-muted-foreground hover:text-foreground"
          >
            すべて見る
          </Link>
        </div>
        <div>
          {featured.map((article, index) => (
            <ProjectDisclosure
              key={article.slug}
              article={article}
              initiallyOpen={index === 0}
            />
          ))}
        </div>
      </section>
      <section aria-labelledby="notes-heading" className="mt-12">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2
            id="notes-heading"
            className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground"
          >
            NOTES / {String(blogs.length).padStart(2, "0")}
          </h2>
          <Link
            to="/Blog"
            className="text-[10px] text-muted-foreground hover:text-foreground"
          >
            ブログ一覧
          </Link>
        </div>
        {blogs.slice(0, 3).map((blog) => (
          <Link
            key={blog.slug}
            to="/Blog/$slug"
            params={{ slug: blog.slug }}
            className="group flex items-start justify-between gap-4 py-3"
          >
            <h3 className="text-[13px] font-normal leading-6 text-foreground/85 group-hover:underline group-hover:underline-offset-4">
              {blog.title}
            </h3>
            <span className="mt-1 shrink-0 font-mono text-[9px] text-muted-foreground">
              {blog.date}
            </span>
          </Link>
        ))}
      </section>
    </PortfolioLayout>
  );
}
