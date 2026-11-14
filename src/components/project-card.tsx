import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Bot,
  Code2,
  Globe,
  Monitor,
  Smartphone,
} from "lucide-react";
import type { Article } from "@/lib/articles";
import { getProjectPresentation, platforms } from "@/config/portfolio";

const icons = { web: Globe, apple: Smartphone, desktop: Monitor, bot: Bot };

export function ProjectMark({ article }: { article: Article }) {
  const { platform, appIcon } = getProjectPresentation(article);
  const Icon = platform ? icons[platform] : Code2;
  return (
    <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted/60 text-muted-foreground">
      {appIcon ? (
        <img
          src={appIcon}
          alt=""
          width={32}
          height={32}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <Icon className="size-4" aria-hidden="true" />
      )}
    </span>
  );
}

export function ProjectCard({
  article,
  headingLevel = 2,
}: {
  article: Article;
  headingLevel?: 2 | 3;
}) {
  const { platform, tags } = getProjectPresentation(article);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <Link
      to="/Project/$slug"
      params={{ slug: article.slug }}
      className="group -mx-2 flex min-w-0 items-start gap-3 rounded-lg px-2 py-5 transition-colors hover:bg-muted/30 focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <ProjectMark article={article} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <Heading className="text-sm font-medium leading-6">
            {article.systemname}
          </Heading>
          <ArrowUpRight
            className="mt-1 size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {platform ? platforms[platform] : "プロジェクト"} /{" "}
          {article.category === "personal" ? "個人開発" : "大学開発"}
        </p>
        <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
          {article.description}
        </p>
        <p className="mt-2 font-mono text-[10px] text-muted-foreground">
          {tags.join(" / ")}
        </p>
      </div>
    </Link>
  );
}
