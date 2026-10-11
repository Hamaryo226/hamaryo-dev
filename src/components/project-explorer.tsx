import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Grid2X2,
  List,
  X,
} from "lucide-react";
import { getAllArticles } from "@/lib/articles";
import type { Article } from "@/lib/articles";

const projects = getAllArticles();
const categories = [
  { value: "all", label: "すべて" },
  { value: "personal", label: "個人開発" },
  { value: "university", label: "大学開発" },
] as const;

export function ProjectExplorer() {
  const [selected, setSelected] = useState(projects.length - 1);
  const [filter, setFilter] = useState("all");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [detail, setDetail] = useState<Article>(projects[0]);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const active = projects[selected];
  const techStack = detail.content?.["技術スタック"];
  const technologies =
    typeof techStack === "string"
      ? [techStack]
      : [...new Set(Object.values(techStack ?? {}).flat())];
  const relatedLinks = Object.entries(detail.links ?? {}).filter(([, url]) => {
    try {
      return ["https:", "http:"].includes(new URL(url).protocol);
    } catch {
      return false;
    }
  });
  function changeProject(direction: number) {
    setSelected(
      (current) => (current + direction + projects.length) % projects.length,
    );
  }
  const visible = projects.filter(
    (project) => filter === "all" || project.category === filter,
  );
  function openDetail(project: Article) {
    setDetail(project);
    dialog.current?.showModal();
  }
  return (
    <>
      <section className="showcase" aria-label="プロジェクトを切り替えて見る">
        <div className="showcase-info" key={active.slug + "-info"}>
          <span className="showcase-number">
            {String(selected + 1).padStart(2, "0")}
            <span> / {String(projects.length).padStart(2, "0")}</span>
          </span>
          <span className="space-badge">
            {active.category === "personal" ? "個人開発" : "大学開発"}
          </span>
          <h2>{active.systemname || active.title}</h2>
          <p>{active.description}</p>
          <button
            className="space-action primary"
            onClick={() => openDetail(active)}
          >
            詳細を見る <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="showcase-visual">
          <button
            className="showcase-screen"
            onTouchStart={(event) => {
              swiped.current = false;
              const touch = event.touches[0];
              touchStart.current = { x: touch.clientX, y: touch.clientY };
            }}
            onTouchCancel={() => {
              touchStart.current = null;
            }}
            onTouchEnd={(event) => {
              const start = touchStart.current;
              touchStart.current = null;
              if (!start) return;
              const touch = event.changedTouches[0];
              const dx = touch.clientX - start.x;
              const dy = touch.clientY - start.y;
              if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                swiped.current = true;
                changeProject(dx < 0 ? 1 : -1);
              }
            }}
            onClick={(event) => {
              if (swiped.current && event.detail !== 0) {
                swiped.current = false;
                return;
              }
              openDetail(active);
            }}
            aria-label={active.title + "の詳細"}
          >
            {active.thumbnail && (
              <img src={active.thumbnail} alt={active.title} />
            )}
            <span className="screen-open">
              <ArrowUpRight size={22} />
            </span>
          </button>
          <div className="showcase-controls">
            <button
              className="round-control"
              aria-label="前のプロジェクト"
              onClick={() => changeProject(-1)}
            >
              <ArrowLeft size={18} />
            </button>
            <div className="project-steps">
              {projects.map((project, index) => (
                <button
                  key={project.slug}
                  aria-label={project.systemname || project.title}
                  aria-pressed={selected === index}
                  onClick={() => setSelected(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
            <button
              className="round-control"
              aria-label="次のプロジェクト"
              onClick={() => changeProject(1)}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <span className="sr-only" aria-live="polite">
          {active.title}
        </span>
      </section>
      <section
        id="projects"
        className="explorer-section"
        aria-labelledby="project-heading"
      >
        <div className="section-heading">
          <h2 id="project-heading">
            プロジェクト <span className="count-badge">{projects.length}</span>
          </h2>
          <ArrowDown size={20} aria-hidden="true" />
        </div>
        <div className="explorer-toolbar">
          <div className="filter-bar" role="group" aria-label="カテゴリ">
            {categories.map((category) => (
              <button
                key={category.value}
                aria-pressed={filter === category.value}
                onClick={() => setFilter(category.value)}
              >
                {category.label}
              </button>
            ))}
          </div>
          <div className="layout-control" role="group" aria-label="表示形式">
            <button
              aria-label="グリッド表示"
              aria-pressed={layout === "grid"}
              onClick={() => setLayout("grid")}
            >
              <Grid2X2 size={18} />
            </button>
            <button
              aria-label="リスト表示"
              aria-pressed={layout === "list"}
              onClick={() => setLayout("list")}
            >
              <List size={18} />
            </button>
          </div>
        </div>
        <div className={"explorer-results " + layout} key={filter + layout}>
          {visible.map((project, index) => (
            <button
              className="explorer-card"
              key={project.slug}
              onClick={() => openDetail(project)}
              onPointerMove={(event) => {
                if (
                  event.pointerType !== "mouse" ||
                  window.matchMedia("(prefers-reduced-motion: reduce)").matches
                )
                  return;
                const rect = event.currentTarget.getBoundingClientRect();
                event.currentTarget.style.setProperty(
                  "--tilt-x",
                  ((event.clientY - rect.top) / rect.height) * -5 + 2.5 + "deg",
                );
                event.currentTarget.style.setProperty(
                  "--tilt-y",
                  ((event.clientX - rect.left) / rect.width) * 5 - 2.5 + "deg",
                );
              }}
              onPointerLeave={(event) => {
                event.currentTarget.style.setProperty("--tilt-x", "0deg");
                event.currentTarget.style.setProperty("--tilt-y", "0deg");
              }}
            >
              <div className="explorer-image">
                {project.thumbnail && (
                  <img src={project.thumbnail} alt="" loading="lazy" />
                )}
                <span className="project-open">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <div className="explorer-card-copy">
                <span className="explorer-meta">
                  {project.category === "personal" ? "個人開発" : "大学開発"}
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </span>
                <h3>{project.systemname || project.title}</h3>
                <p>{project.description}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="sr-only" role="status">
          {visible.length}件のプロジェクトを表示
        </p>
      </section>
      <dialog
        ref={dialog}
        className="project-dialog"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        aria-labelledby="dialog-title"
      >
        <div className="dialog-body">
          <button
            className="round-control dialog-close"
            aria-label="閉じる"
            onClick={() => dialog.current?.close()}
          >
            <X size={20} />
          </button>
          {detail.thumbnail && (
            <img className="dialog-image" src={detail.thumbnail} alt="" />
          )}
          <div className="dialog-copy">
            <span className="space-badge">
              {detail.category === "personal" ? "個人開発" : "大学開発"}
            </span>
            <h2 id="dialog-title">{detail.title}</h2>
            <p>{detail.description}</p>
            <p className="dialog-date">{detail.date}</p>
            {technologies.length > 0 && (
              <section
                className="dialog-technologies"
                aria-label="技術スタック"
              >
                <h3>技術スタック</h3>
                <ul>
                  {technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </section>
            )}
            {relatedLinks.length > 0 && (
              <section className="dialog-links" aria-label="関連リンク">
                <h3>関連リンク</h3>
                {relatedLinks.map(([label, url]) => (
                  <a
                    href={url}
                    key={label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label}
                    <ArrowUpRight size={15} />
                  </a>
                ))}
              </section>
            )}
            <Link
              to="/Project/$slug"
              params={{ slug: detail.slug }}
              className="space-action primary"
              onClick={() => dialog.current?.close()}
            >
              プロジェクトページへ <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
