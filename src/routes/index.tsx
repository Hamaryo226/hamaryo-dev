import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, ArrowUpRight, Music2 } from "lucide-react";
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
      <section className="relative py-14 sm:py-20 lg:py-24">
        <p className="mb-7 font-mono text-xs tracking-[0.16em] text-muted-foreground">
          HAMARYO / PERSONAL PORTFOLIO
        </p>
        <div className="grid gap-8 lg:grid-cols-[1fr_260px] lg:items-end lg:gap-16">
          <div>
            <h1 className="text-[clamp(1.9rem,6vw,5rem)] font-semibold leading-[1.3] tracking-tight">
              Webから、
              <br />
              手元のアプリまで
              <span className="text-emerald-700 dark:text-lime-300">。</span>
            </h1>
            <p className="mt-7 max-w-lg text-sm leading-8 text-muted-foreground sm:text-base">
              <span className="block">Hamaryo / システムエンジニア</span>
              <span className="block">
                Web・iOS・デスクトップの制作を紹介します。
              </span>
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href="#selected-work"
                className="inline-flex items-center gap-3 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                作品を見る <ArrowDown className="size-4" aria-hidden="true" />
              </a>
              <Link
                to="/About"
                className="inline-flex items-center gap-2 rounded-sm py-2 text-sm hover:underline hover:underline-offset-4"
              >
                プロフィール{" "}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="hidden border-l pl-6 lg:block">
            <p className="mb-5 font-mono text-[10px] tracking-widest text-muted-foreground">
              AREAS OF WORK
            </p>
            {["Web applications", "iOS & watchOS", "Desktop & tools"].map(
              (area, i) => (
                <p key={area} className="mb-3 flex items-center gap-3 text-sm">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    0{i + 1}
                  </span>
                  {area}
                </p>
              ),
            )}
          </div>
        </div>
      </section>
      <section
        id="selected-work"
        aria-labelledby="selected-work-heading"
        className="scroll-mt-8"
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
          className="group grid overflow-hidden rounded-2xl border border-[#234b3d] bg-[#173e30] text-[#f2f6ed] focus-visible:outline-2 focus-visible:outline-offset-4 md:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="flex flex-col items-start p-7 sm:p-10 lg:p-12">
            <p className="font-mono text-[10px] tracking-[0.14em] text-[#c1d6bb]">
              FEATURED / iOS APP
            </p>
            <h3 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
              {featured.systemname}
            </h3>
            <p className="mt-5 max-w-xs text-sm leading-8 text-[#d2e2cf]">
              {featured.description}
            </p>
            <ul
              aria-label="使用技術"
              className="mt-6 flex flex-wrap gap-2 text-[10px] text-[#d2e2cf]"
            >
              {getProjectPresentation(featured).tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-white/20 px-3 py-1"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <span className="mt-10 inline-flex items-center gap-3 border-b border-[#bde3aa]/50 pb-2 text-sm text-[#d7f0bd]">
              プロジェクトを読む{" "}
              <ArrowUpRight
                className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
          <StrollyArtwork />
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
      <section className="mt-16 flex flex-wrap items-center justify-between gap-6 rounded-xl bg-muted/60 p-6 sm:mt-20 sm:p-8">
        <div>
          <p className="mb-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground">
            BEHIND THE WORK
          </p>
          <h2 className="text-lg font-semibold">つくっている人について。</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            プロフィールと、これまで取り組んできた分野。
          </p>
        </div>
        <Link
          to="/About"
          className="inline-flex items-center gap-3 rounded-full border bg-background px-5 py-3 text-sm transition-colors hover:bg-muted"
        >
          About me <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>
    </PortfolioLayout>
  );
}

function StrollyArtwork() {
  return (
    <figure className="relative m-4 mt-0 flex min-h-64 items-center overflow-hidden rounded-xl bg-[#dce8d4] md:m-5 md:ml-0">
      <svg
        viewBox="0 0 520 360"
        fill="none"
        className="h-full w-full"
        aria-hidden="true"
      >
        <path
          d="M-20 80H540M-20 180H540M-20 280H540M100-20V380M240-20V380M380-20V380"
          stroke="#c6d4be"
          strokeWidth="22"
        />
        <path
          d="M-20 80H540M-20 180H540M-20 280H540M100-20V380M240-20V380M380-20V380"
          stroke="#eff4ea"
          strokeWidth="15"
        />
        <path
          d="M100 275V150Q100 130 120 130H220Q240 130 240 110V80H380V245"
          stroke="#315b42"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="100"
          cy="275"
          r="11"
          fill="#315b42"
          stroke="#f6f8f0"
          strokeWidth="5"
        />
        <circle cx="380" cy="245" r="22" fill="#315b42" opacity="0.12" />
        <circle
          cx="380"
          cy="245"
          r="10"
          fill="#315b42"
          stroke="#f6f8f0"
          strokeWidth="5"
        />
      </svg>
      <figcaption className="absolute bottom-8 left-6 right-6 flex items-center gap-3 rounded-xl border border-white/70 bg-[#f8faf3] p-4 text-[#234b37] shadow-sm sm:left-8 sm:right-8">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#e4ecd8]">
          <Music2 className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold tracking-tight">Music × Walking</p>
          <p className="mt-0.5 text-[10px] text-[#52694b]">
            Strollyのコンセプトイメージ
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
