import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { ProjectMark } from "@/components/project-card";
import { getProjectPresentation, platforms } from "@/config/portfolio";
import type { Article } from "@/lib/articles";

export function ProjectDisclosure({
  article,
  initiallyOpen = false,
}: {
  article: Article;
  initiallyOpen?: boolean;
}) {
  const { platform, appIcon, tags } = getProjectPresentation(article);
  const image =
    appIcon ??
    (article.thumbnail === "/thum/0.jpg" ? undefined : article.thumbnail);
  return (
    <details
      aria-label={`${article.systemname}の紹介`}
      open={initiallyOpen}
      className="group/project py-3"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-md py-1 focus-visible:outline-2 focus-visible:outline-offset-4 [&::-webkit-details-marker]:hidden">
        <ProjectMark article={article} />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium leading-6">
            {article.systemname}
          </h3>
          <p className="text-[11px] text-muted-foreground">
            {platform ? platforms[platform] : "プロジェクト"} /{" "}
            {article.category === "personal" ? "個人開発" : "大学開発"}
          </p>
        </div>
        <span className="hidden font-mono text-[10px] text-muted-foreground sm:block">
          {article.date}
        </span>
        <ChevronDown
          className="size-3 shrink-0 text-muted-foreground transition-transform group-open/project:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </summary>
      <div className="pb-4 pl-11 pt-3">
        <p className="text-[13px] leading-7 text-muted-foreground">
          {article.description}
        </p>
        <p className="mt-2 font-mono text-[10px] leading-6 text-muted-foreground">
          {tags.join(" / ")}
        </p>
        {image && (
          <div className="mt-4 aspect-[16/10] overflow-hidden rounded-lg bg-muted">
            <img
              src={image}
              alt={
                appIcon
                  ? `${article.systemname}のアプリアイコン`
                  : article.title
              }
              width={appIcon ? 1024 : 1920}
              height={appIcon ? 1024 : 1080}
              loading={initiallyOpen ? "eager" : "lazy"}
              className={`h-full w-full ${appIcon ? "object-cover object-bottom" : "object-contain"}`}
            />
          </div>
        )}
        <Link
          to="/Project/$slug"
          params={{ slug: article.slug }}
          className="mt-4 inline-flex items-center gap-1 rounded-sm text-[11px] text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          {article.systemname}の詳細を見る{" "}
          <ArrowUpRight className="size-3" aria-hidden="true" />
        </Link>
      </div>
    </details>
  );
}
