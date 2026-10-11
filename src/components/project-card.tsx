import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Code2 } from "lucide-react";
import type { Article } from "@/lib/articles";

export function ProjectCard({ article }: { article: Article }) {
  return (
    <Link
      to="/Project/$slug"
      params={{ slug: article.slug }}
      className="project-card group"
    >
      <div className="project-image">
        {article.thumbnail ? (
          <img src={article.thumbnail} alt="" loading="lazy" />
        ) : (
          <Code2 size={40} />
        )}
        <span className="project-open" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="space-badge">
            {article.category === "university" ? "大学開発" : "個人開発"}
          </span>
          <span>{article.date}</span>
        </div>
        <h3 className="text-lg font-semibold tracking-tight">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted-foreground">
          {article.description}
        </p>
      </div>
    </Link>
  );
}
