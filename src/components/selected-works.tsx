import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { works } from "@/lib/works";
import type { PortfolioWork } from "@/lib/works";
import "./selected-works.css";

const order = Array.from(works.keys());
function WorkFigure({ slug }: { slug: string }) {
  if (slug !== "better-tello-gui") {
    const work: PortfolioWork = works.get(slug)!;
    const image = slug === "taikodive" ? "/thum/taikodive.webp" : work.image;
    if (!image) return null;
    return (
      <figure className="work-figure archive-print">
        <img
          src={image}
          alt={
            slug === "taikodive"
              ? "TaikoDiveのロゴと、C#やDxLibなどの技術アイコン"
              : work.name + "のプロジェクト画像"
          }
          loading="lazy"
          width="1920"
          height="1080"
        />
      </figure>
    );
  }
  return (
    <figure className="work-figure">
      <div
        className="work-print tello-print"
        role="img"
        aria-label="ブロックで組んだ離陸・移動・着陸の指示をPythonに変換し、Tello AとTello Bに送る例"
      >
        <div className="flow-graphic" aria-hidden="true">
          <div className="flow-stack">
            <span>離陸する</span>
            <span>前に進む</span>
            <span>着陸する</span>
          </div>
          <i className="flow-wire" />
          <b>Python</b>
          <div className="flow-pair">
            <span>Tello A</span>
            <span>Tello B</span>
          </div>
        </div>
      </div>
    </figure>
  );
}

export function WorksHome() {
  return (
    <main className="folio">
      <section
        className="folio-wrap"
        id="works"
        aria-labelledby="works-heading"
      >
        <h1 className="section-title" id="works-heading">
          Works
        </h1>
        {order.map((slug) => (
          <a
            key={slug}
            className="work-row"
            href={"/works/" + slug}
            aria-labelledby={"title-" + slug}
          >
            <div className="work-info">
              <h2 id={"title-" + slug}>{works.get(slug)!.name}</h2>
              <p className="work-lead">{works.get(slug)!.intro}</p>
            </div>
            <WorkFigure slug={slug} />
          </a>
        ))}
      </section>
      <section
        className="folio-wrap folio-about"
        id="about"
        aria-labelledby="about-heading"
      >
        <div className="about-text">
          <h2 className="section-title" id="about-heading">
            About
          </h2>
          <p>
            hamaryoです。音楽ゲームを作ったり、ブロックでドローンを飛ばす仕組みを考えたりしています。
          </p>
          <a className="folio-link" href="https://github.com/Hamaryo226">
            GitHub <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="folio-portraits">
          <img
            src="/img/works/cat.webp"
            width="440"
            height="440"
            alt="恐竜のフードとゴーグルを着けた猫のSNSアイコン"
            loading="lazy"
          />
          <img
            src="/img/works/portrait.webp"
            width="440"
            height="440"
            alt="オレンジの縁光と白い帽子が特徴のSNSアイコン"
            loading="lazy"
          />
        </div>
      </section>
    </main>
  );
}

export function WorkDetail({ slug }: { slug: string }) {
  const work: PortfolioWork = works.get(slug)!;
  const next = order[(order.indexOf(slug) + 1) % order.length];
  return (
    <main className="folio detail-page">
      <article className="folio-wrap">
        <a className="folio-link detail-back" href="/works">
          <ArrowLeft size={16} /> 作品一覧へ
        </a>
        <header className="detail-head">
          <h1>{work.name}</h1>
          <p className="work-lead">{work.intro}</p>
        </header>
        <WorkFigure slug={slug} />
        <div className="work-chapters">
          {work.chapters.map(([title, content]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{content}</p>
            </section>
          ))}
        </div>
        {work.source && (
          <a className="folio-link" href={work.source}>
            {work.sourceLabel}
            <ArrowUpRight size={17} />
          </a>
        )}
        <nav className="detail-nav" aria-label="作品ナビゲーション">
          <a href="/works">作品一覧へ</a>
          <a href={"/works/" + next}>
            {works.get(next)!.name} <ArrowRight size={16} />
          </a>
        </nav>
      </article>
    </main>
  );
}
