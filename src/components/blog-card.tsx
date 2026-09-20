import { Link } from "@tanstack/react-router";
import type { Blog } from "@/lib/blogs";

/** ブログカード。ホームの抜粋と /Blog の一覧で共用する。 */
export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link
      to="/Blog/$slug"
      params={{ slug: blog.slug }}
      className="group block h-full rounded-xl border bg-card overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {blog.thumbnail && (
        <div className="relative w-full h-40 bg-muted overflow-hidden">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {blog.tags &&
            blog.tags.length > 0 &&
            blog.tags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {tag}
              </span>
            ))}
          <span className="text-[11px] text-muted-foreground ml-auto">
            {blog.date}
          </span>
        </div>
        <h2 className="font-semibold text-sm line-clamp-2 mb-1">
          {blog.title}
        </h2>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {blog.description}
        </p>
      </div>
    </Link>
  );
}
