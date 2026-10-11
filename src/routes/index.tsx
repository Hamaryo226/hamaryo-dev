import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Github, Instagram } from "lucide-react";
import { ProjectExplorer } from "@/components/project-explorer";
import { SITE_DESCRIPTION, SITE_NAME, seo } from "@/config/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: seo({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/" }),
  }),
  component: Home,
});
function Home() {
  return (
    <main className="space-main">
      <section className="compact-intro" aria-labelledby="intro-title">
        <div>
          <h1 id="intro-title">Hamaryo</h1>
          <p>システムエンジニア / プログラマー</p>
        </div>
        <a href="#projects" className="space-action">
          プロジェクト一覧 <ArrowRight size={16} />
        </a>
      </section>
      <ProjectExplorer />
      <section className="connect-panel" aria-labelledby="connect-title">
        <div>
          <h2
            id="connect-title"
            className="text-2xl font-semibold tracking-tight"
          >
            リンク
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            className="space-action"
            href="https://github.com/Hamaryo226"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={16} />
            GitHub
            <ArrowUpRight size={14} />
          </a>
          <a
            className="space-action"
            href="https://www.instagram.com/ryota_ztts"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={16} />
            Instagram
            <ArrowUpRight size={14} />
          </a>
        </div>
      </section>
    </main>
  );
}
