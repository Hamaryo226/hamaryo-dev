import { createFileRoute } from "@tanstack/react-router";
import { getArticlesByCategory } from "@/lib/articles";
import { BackButton } from "@/components/back-button";
import { ProjectCard } from "@/components/project-card";
import { ModeToggle } from "@/components/mode-toggle";
import { pageTitle, seo } from "@/config/site";

export const Route = createFileRoute("/Project/")({
  head: () => ({
    meta: seo({
      title: pageTitle("Projects"),
      description: "プロジェクト一覧ページです。",
      path: "/Project",
    }),
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const universityProjects = getArticlesByCategory("university");
  const personalProjects = getArticlesByCategory("personal");

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <main className="mx-auto w-full max-w-screen-lg px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <BackButton href="/" label="ホームに戻る" />
          <div>
            <ModeToggle />
          </div>
        </div>

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            プロジェクト
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            制作したプロジェクトの一覧です。
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center gap-3">
            <span className="w-1 h-7 bg-primary rounded-full" />
            大学開発
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {universityProjects.map((article) => (
              <ProjectCard key={article.slug} article={article} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center gap-3">
            <span className="w-1 h-7 bg-primary rounded-full" />
            個人開発
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personalProjects.map((article) => (
              <ProjectCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
