import { createFileRoute } from "@tanstack/react-router";
import { getAllBlogs } from "@/lib/blogs";
import { BackButton } from "@/components/back-button";
import { BlogCard } from "@/components/blog-card";
import { ModeToggle } from "@/components/mode-toggle";
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
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-background to-muted/20">
      <main className="mx-auto w-full max-w-screen-lg px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <BackButton href="/" label="ホームに戻る" />
          <div>
            <ModeToggle />
          </div>
        </div>

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            ブログ
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            技術記事や開発の記録、その他の考えを投稿しています。
          </p>
        </header>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
