import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PortfolioLayout } from "@/components/portfolio-layout";
import { ProjectCard } from "@/components/project-card";
import {
  getFeaturedProjects,
  getProjectPresentation,
} from "@/config/portfolio";
import { SITE_DESCRIPTION, SITE_NAME, seo } from "@/config/site";
import { getAllBlogs } from "@/lib/blogs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: seo({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/" }),
  }),
  component: Home,
});

function Home() {
  const [featured, ...projects] = getFeaturedProjects();
  const blogs = getAllBlogs().slice(0, 2);
  return (
    <PortfolioLayout>
      <h1 className="sr-only">プロジェクトとブログ</h1>
      <section
        id="selected-work"
        aria-labelledby="selected-work-heading"
        className="scroll-mt-8 pt-8 sm:pt-12"
      >
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted-foreground">01</span>
            <h2 id="selected-work-heading" className="text-lg font-semibold">
              注目のプロジェクト
            </h2>
          </div>
          <Link
            to="/Project"
            className="inline-flex items-center gap-2 rounded-sm text-xs text-muted-foreground hover:text-foreground"
          >
            すべての作品 <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <Link
          to="/Project/$slug"
          params={{ slug: featured.slug }}
          className="group grid overflow-hidden rounded-2xl border bg-card text-card-foreground focus-visible:outline-2 focus-visible:outline-offset-4 md:grid-cols-2"
        >
          <div className="flex flex-col items-start justify-center p-7 sm:p-10 lg:p-12">
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground">
              FEATURED / iOS APP
            </p>
            <h3 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
              {featured.systemname}
            </h3>
            <p className="mt-5 max-w-xs text-sm leading-8 text-muted-foreground">
              {featured.description}
            </p>
            <ul
              aria-label="使用技術"
              className="mt-6 flex flex-wrap gap-2 text-[10px] text-muted-foreground"
            >
              {getProjectPresentation(featured).tags.map((tag) => (
                <li key={tag} className="rounded-full border px-3 py-1">
                  {tag}
                </li>
              ))}
            </ul>
            <span className="mt-10 inline-flex items-center gap-3 border-b pb-2 text-sm">
              プロジェクトを読む{" "}
              <ArrowUpRight
                className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
          <div className="relative aspect-square overflow-hidden border-t bg-muted md:border-t-0 md:border-l">
            <img
              src={getProjectPresentation(featured).appIcon}
              alt="Strollyのアプリアイコン"
              width={1024}
              height={1024}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </Link>
        <div className="mt-9 grid gap-10 sm:grid-cols-2 sm:gap-7">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              article={project}
              headingLevel={3}
            />
          ))}
        </div>
      </section>
      <section aria-labelledby="notes-heading" className="mt-16 sm:mt-24">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted-foreground">02</span>
            <h2 id="notes-heading" className="text-lg font-semibold">
              最近の記事
            </h2>
          </div>
          <Link
            to="/Blog"
            className="inline-flex items-center gap-2 rounded-sm text-xs text-muted-foreground hover:text-foreground"
          >
            ブログ一覧 <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        {blogs.map((blog) => (
          <Link
            key={blog.slug}
            to="/Blog/$slug"
            params={{ slug: blog.slug }}
            className="group grid items-center gap-3 border-b py-6 sm:grid-cols-[145px_1fr_24px] sm:gap-6"
          >
            <span className="font-mono text-xs text-muted-foreground">
              {blog.date}
            </span>
            <h3 className="text-sm font-medium leading-7 group-hover:underline group-hover:underline-offset-4 sm:text-base">
              {blog.title}
            </h3>
            <ArrowUpRight
              className="hidden size-5 sm:block"
              aria-hidden="true"
            />
          </Link>
        ))}
      </section>
    </PortfolioLayout>
  );
}
