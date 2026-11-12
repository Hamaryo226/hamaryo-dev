import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PortfolioLayout } from "@/components/portfolio-layout";
import { ProjectCard } from "@/components/project-card";
import {
  getPortfolioProjects,
  getProjectPresentation,
  platforms,
} from "@/config/portfolio";
import type { Platform } from "@/config/portfolio";
import { pageTitle, seo } from "@/config/site";

type Category = "personal" | "university";
const categories = { personal: "個人開発", university: "大学開発" } as const;
export const Route = createFileRoute("/Project/")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { category?: Category; platform?: Platform } => ({
    category:
      search.category === "personal" || search.category === "university"
        ? search.category
        : undefined,
    platform:
      typeof search.platform === "string" &&
      Object.hasOwn(platforms, search.platform)
        ? (search.platform as Platform)
        : undefined,
  }),
  head: () => ({
    meta: seo({
      title: pageTitle("Projects"),
      description:
        "Web、iOS、デスクトップなどの制作を、分野やプラットフォームから探せます。",
      path: "/Project",
    }),
  }),
  component: ProjectPage,
});
function ProjectPage() {
  const { category, platform } = Route.useSearch();
  const navigate = Route.useNavigate();
  const projects = getPortfolioProjects();
  const filtered = projects.filter(
    (project) =>
      (!category || project.category === category) &&
      (!platform || getProjectPresentation(project).platform === platform),
  );
  return (
    <PortfolioLayout>
      <header className="py-12 sm:py-16">
        <p className="mb-5 font-mono text-xs tracking-[0.16em] text-muted-foreground">
          WORK / PROJECT ARCHIVE
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          プロジェクト
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-8 text-muted-foreground">
          WebからiOS、デスクトップまで。
          <br />
          個人開発と大学での制作を、分野ごとにまとめています。
        </p>
      </header>
      <section
        aria-label="プロジェクトの絞り込み"
        className="space-y-4 border-y py-5"
      >
        <div
          role="group"
          aria-label="制作区分"
          className="grid gap-2 sm:grid-cols-[110px_1fr] sm:items-center"
        >
          <span className="text-xs text-muted-foreground">制作区分</span>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              selected={!category}
              onClick={() =>
                navigate({
                  search: (prev) => ({ ...prev, category: undefined }),
                })
              }
            >
              すべて
            </FilterButton>
            {(Object.keys(categories) as Category[]).map((value) => (
              <FilterButton
                key={value}
                selected={category === value}
                onClick={() =>
                  navigate({ search: (prev) => ({ ...prev, category: value }) })
                }
              >
                {categories[value]}
              </FilterButton>
            ))}
          </div>
        </div>
        <div
          role="group"
          aria-label="プラットフォーム"
          className="grid gap-2 sm:grid-cols-[110px_1fr] sm:items-center"
        >
          <span className="text-xs text-muted-foreground">
            プラットフォーム
          </span>
          <div className="flex flex-wrap gap-2">
            <FilterButton
              selected={!platform}
              onClick={() =>
                navigate({
                  search: (prev) => ({ ...prev, platform: undefined }),
                })
              }
            >
              すべて
            </FilterButton>
            {(Object.keys(platforms) as Platform[]).map((value) => (
              <FilterButton
                key={value}
                selected={platform === value}
                onClick={() =>
                  navigate({ search: (prev) => ({ ...prev, platform: value }) })
                }
              >
                {platforms[value]}
              </FilterButton>
            ))}
          </div>
        </div>
      </section>
      <div className="mb-8 mt-6 flex items-center justify-between gap-3">
        <p role="status" className="text-xs text-muted-foreground">
          <span className="mr-1 font-mono text-base text-foreground">
            {String(filtered.length).padStart(2, "0")}
          </span>
          件のプロジェクト / 全{projects.length}件
        </p>
        {(category || platform) && (
          <Link
            to="/Project"
            search={{}}
            className="rounded-sm text-xs underline underline-offset-4"
          >
            絞り込みを解除
          </Link>
        )}
      </div>
      {filtered.length > 0 ? (
        <section
          aria-label="作品一覧"
          className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:gap-y-16"
        >
          {filtered.map((project) => (
            <ProjectCard key={project.slug} article={project} />
          ))}
        </section>
      ) : (
        <div className="rounded-xl border border-dashed px-6 py-16 text-center">
          <h2 className="text-lg font-semibold">
            条件に合うプロジェクトがありません
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            制作区分やプラットフォームを変更してみてください。
          </p>
          <Link
            to="/Project"
            search={{}}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm text-background"
          >
            すべて表示 <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </PortfolioLayout>
  );
}
function FilterButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`min-h-10 rounded-full px-4 py-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${selected ? "bg-foreground text-background" : "border border-transparent text-muted-foreground hover:border-border hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}
