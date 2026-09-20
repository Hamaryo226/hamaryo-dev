import { Link } from "@tanstack/react-router";
import type { Article } from "@/lib/articles";

/** プロジェクトカード。ホームの抜粋と /Project の一覧で共用する。 */
export function ProjectCard({ article }: { article: Article }) {
  return (
    <Link
      to="/Project/$slug"
      params={{ slug: article.slug }}
      className="group block h-full rounded-xl border bg-card overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {article.thumbnail && (
        <div className="relative w-full h-40 bg-muted overflow-hidden">
          <img
            src={article.thumbnail}
            alt={article.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              article.category === "university"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            }`}
          >
            {article.category === "university" ? "大学開発" : "個人開発"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {article.date}
          </span>
        </div>
        <h3 className="font-semibold text-sm line-clamp-2 mb-1">
          {article.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {article.description}
        </p>
      </div>
    </Link>
  );
}
