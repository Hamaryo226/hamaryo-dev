import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { getAllBlogs } from "@/lib/blogs";
import { PortfolioLayout } from "@/components/portfolio-layout";
import { pageTitle, seo } from "@/config/site";

export const Route = createFileRoute("/Blog/")({
  head: () => ({
    meta: seo({
      title: pageTitle("Blog"),
      description: "技術記事や開発の記録、その他の考えを投稿しています。",
      path: "/Blog",
    }),
  }),
  component: BlogPage,
});

function BlogPage() {
  const blogs = getAllBlogs();
  return (
    <PortfolioLayout>
      <header className="py-12 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          ブログ
        </h1>
        <p className="mt-5 text-sm leading-8 text-muted-foreground">
          技術記事や開発の記録、その他の考えを投稿しています。
        </p>
      </header>
      <section aria-label="記事一覧" className="border-t">
        {blogs.map((blog) => (
          <Link
            key={blog.slug}
            to="/Blog/$slug"
            params={{ slug: blog.slug }}
            className="group grid min-w-0 grid-cols-[1fr_20px] items-center gap-4 border-b py-7 outline-offset-4 sm:grid-cols-[1fr_180px_20px] sm:gap-8 sm:py-9"
          >
            <div
              className={`min-w-0 ${!blog.thumbnail ? "sm:col-span-2" : ""}`}
            >
              <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <time className="font-mono">{blog.date}</time>
                {blog.tags?.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <h2 className="text-lg font-semibold leading-8 tracking-tight group-hover:underline group-hover:underline-offset-4 sm:text-xl">
                {blog.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {blog.description}
              </p>
            </div>
            {blog.thumbnail && (
              <div className="hidden aspect-[16/10] overflow-hidden rounded-lg bg-muted sm:block">
                <img
                  src={blog.thumbnail}
                  alt=""
                  width={1920}
                  height={1080}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <ArrowUpRight className="size-5" aria-hidden="true" />
          </Link>
        ))}
      </section>
    </PortfolioLayout>
  );
}
