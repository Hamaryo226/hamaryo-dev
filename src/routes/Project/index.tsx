import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getAllArticles } from "@/lib/articles";
import { ProjectCard } from "@/components/project-card";
import { pageTitle, seo } from "@/config/site";

export const Route = createFileRoute("/Project/")({
  head: () => ({
    meta: seo({
      title: pageTitle("Projects"),
      description: "制作したプロジェクトの一覧です。",
      path: "/Project",
    }),
  }),
  component: ProjectPage,
});
const filters = [
  { value: "all", label: "すべて" },
  { value: "personal", label: "個人開発" },
  { value: "university", label: "大学開発" },
] as const;
function ProjectPage() {
  const [filter, setFilter] = useState<string>("all");
  const projects = getAllArticles();
  const visible = projects.filter(
    (article) => filter === "all" || article.category === filter,
  );
  return (
    <main className="space-main page-content">
      <header className="page-heading">
        <h1>
          プロジェクト<span className="count-badge">{projects.length}</span>
        </h1>
        <p>制作したプロジェクトの一覧です。</p>
      </header>
      <div
        className="filter-bar"
        role="group"
        aria-label="プロジェクトのカテゴリ"
      >
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
            <span>
              {item.value === "all"
                ? projects.length
                : projects.filter((article) => article.category === item.value)
                    .length}
            </span>
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {visible.length}件のプロジェクトを表示
      </p>
      <section
        aria-label="プロジェクト一覧"
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((article) => (
          <ProjectCard key={article.slug} article={article} />
        ))}
      </section>
    </main>
  );
}
