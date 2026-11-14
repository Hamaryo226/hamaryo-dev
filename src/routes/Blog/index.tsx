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
      <header className="pt-10 pb-8 sm:pt-14">
        <h1 className="text-xl font-medium tracking-tight">ブログ</h1>
        <p className="mt-4 text-[13px] leading-7 text-muted-foreground">
          技術記事や開発の記録、その他の考えを投稿しています。
        </p>
      </header>
      <section aria-label="記事一覧" className="border-t">
        {blogs.map((blog) => (
          <Link
            key={blog.slug}
            to="/Blog/$slug"
            params={{ slug: blog.slug }}
            className="group grid min-w-0 grid-cols-[1fr_20px] items-center gap-3 border-b border-border/50 py-5 outline-offset-4 sm:grid-cols-[1fr_96px_16px] sm:gap-4 sm:py-6"
          >
            <div
              className={`min-w-0 ${!blog.thumbnail ? "sm:col-span-2" : ""}`}
            >
              <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                <time className="font-mono">{blog.date}</time>
                {blog.tags?.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <h2 className="text-sm font-medium leading-6 group-hover:underline group-hover:underline-offset-4">
                {blog.title}
              </h2>
              <p className="mt-2 text-[12px] leading-6 text-muted-foreground">
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
            <ArrowUpRight
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
          </Link>
        ))}
      </section>
    </PortfolioLayout>
  );
}
