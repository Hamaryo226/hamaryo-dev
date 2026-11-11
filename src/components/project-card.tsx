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

const tones = {
  green: "bg-[#e8eee5] text-[#24533e] dark:bg-[#20342a] dark:text-[#c4e2bb]",
  violet: "bg-[#ece9f3] text-[#50416e] dark:bg-[#2c263a] dark:text-[#d7c8f0]",
  blue: "bg-[#e6ecf0] text-[#365466] dark:bg-[#20303b] dark:text-[#bcd7e6]",
  amber: "bg-[#f1eade] text-[#71562b] dark:bg-[#382f20] dark:text-[#e8d5a7]",
};
const icons = { web: Globe, apple: Smartphone, desktop: Monitor, bot: Bot };

export function ProjectCard({
  article,
  headingLevel = 2,
}: {
  article: Article;
  headingLevel?: 2 | 3;
}) {
  const { platform, tags, tone, appIcon } = getProjectPresentation(article);
  const Icon = platform ? icons[platform] : Code2;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const hasCover = article.thumbnail && article.thumbnail !== "/thum/0.jpg";

  return (
    <Link
      to="/Project/$slug"
      params={{ slug: article.slug }}
      className="group block min-w-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <div
        className={`relative mb-5 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-xl ${tones[tone]}`}
      >
        {appIcon ? (
          <img
            src={appIcon}
            alt={`${article.systemname}のアプリアイコン`}
            width={1024}
            height={1024}
            loading="lazy"
            className="size-32 rounded-[22%] shadow-sm sm:size-40"
          />
        ) : hasCover ? (
          <img
            src={article.thumbnail}
            alt=""
            width={1920}
            height={1080}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full p-7 sm:p-9">
            <Icon className="mb-5 size-7 opacity-70" aria-hidden="true" />
            <span className="block break-words text-2xl font-semibold tracking-tight sm:text-3xl">
              {article.systemname}
            </span>
            <span className="mt-3 block font-mono text-xs opacity-70">
              {tags.slice(0, 2).join(" / ")}
            </span>
          </div>
        )}
      </div>
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>{platform ? platforms[platform] : "プロジェクト"}</span>
        <span aria-hidden="true">/</span>
        <span>{article.category === "personal" ? "個人開発" : "大学開発"}</span>
      </div>
      <div className="flex items-start justify-between gap-3">
        <Heading className="text-xl font-semibold tracking-tight group-hover:underline group-hover:underline-offset-4">
          {article.systemname}
        </Heading>
        <ArrowUpRight
          className="mt-1 size-5 shrink-0 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">
        {article.description}
      </p>
      <ul aria-label="使用技術" className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded-md border px-2 py-1 font-mono text-[10px] text-muted-foreground"
          >
            {tag}
          </li>
        ))}
      </ul>
    </Link>
  );
}
