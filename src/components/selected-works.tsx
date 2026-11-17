import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { archivedWorks } from "@/lib/archived-works";
import type { PortfolioWork } from "@/lib/archived-works";
import "./selected-works.css";

const works = {
  taikodive: {
    name: "TaikoDive",
    intro: "譜面を読み、曲に合わせて太鼓を打つリズムゲーム。",
    chapters: [
      [
        "一曲を遊ぶ",
        "TJA形式の譜面を読み込み、曲を選んで演奏する。連打や分岐で表情が変わる譜面に挑み、リザルトで一曲を振り返る。リプレイを残せば、自分の演奏をもう一度見返せる。",
      ],
      [
        "本体とランチャー",
        "演奏を担うWindows版はC#とDxLibDotNetで制作。別アプリのランチャーが本体の取得や楽曲の管理を担う。",
      ],
      [
        "開発中のテーマ",
        "Raylibを使うC++版への移行では、長い曲の後半まで描画と音声が揃うかが検証テーマの一つ。選曲・演奏・リザルトの流れを、C#版と照らし合わせている。",
      ],
    ],
    source: "https://github.com/Hamaryo226/TaikoDive-Launcher",
    sourceLabel: "ランチャーのソースコード",
  },
  "better-tello-gui": {
    name: "Better Tello GUI",
    intro: "ブロックを組んで、複数のドローンを同時に飛ばす。",
    chapters: [
      [
        "動きを組む",
        "離陸、移動、着陸。機体ごとの動きをブロックで組み合わせ、飛ばしたい手順を目で追える形にする。",
      ],
      [
        "ブロックからPythonへ",
        "Scratch形式のプロジェクトからブロックを読み取り、Pythonで扱える飛行命令に変換する。画面上で組んだ動きと、実行される指示がここでつながる。",
      ],
      [
        "複数機を動かす",
        "Windows PCに複数のWi-Fiアダプターをつなぎ、それぞれを1機のTelloに対応させる。機体ごとの通信経路を分け、ひとつのプログラムから動きを指示する。",
      ],
    ],
    source: "https://github.com/sakurai-lab-07/Better-Tello-GUI",
    sourceLabel: "プロジェクトのソースコード",
  },
  ...archivedWorks,
} as const satisfies Record<string, PortfolioWork>;
export type WorkSlug = keyof typeof works;
const order = Object.keys(works) as WorkSlug[];

function WorkFigure({ slug }: { slug: WorkSlug }) {
  if (slug in archivedWorks) {
    const work: PortfolioWork = works[slug];
    return (
      <figure className="work-figure archive-print">
        <img
          src={work.image}
          alt={work.name + "のプロジェクト画像"}
          loading="lazy"
          width="1920"
          height="1080"
        />
      </figure>
    );
  }
  return (
    <figure className="work-figure">
      {slug === "taikodive" ? (
        <div className="work-print taiko-print">
          <img
            src="/img/works/taiko-demo.webp"
            alt="TaikoDiveの楽曲紹介例。中央にメイン曲、その下に4曲が並ぶ"
            width="1280"
            height="720"
            loading="lazy"
          />
        </div>
      ) : (
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
      )}
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
              <h2 id={"title-" + slug}>{works[slug].name}</h2>
              <p className="work-lead">{works[slug].intro}</p>
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

export function WorkDetail({ slug }: { slug: WorkSlug }) {
  const work: PortfolioWork = works[slug];
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
            {works[next].name} <ArrowRight size={16} />
          </a>
        </nav>
      </article>
    </main>
  );
}
