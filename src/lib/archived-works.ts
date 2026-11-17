import strolly from "../content/articles/strolly.json";
import watermark from "../content/articles/dw.json";
import frailty from "../content/articles/fcs.json";
import notes from "../content/articles/sds.json";

export interface PortfolioWork {
  name: string;
  intro: string;
  chapters: ReadonlyArray<readonly [string, string]>;
  image?: string;
  source?: string;
  sourceLabel?: string;
}

export const archivedWorks = {
  strolly: {
    name: strolly.systemname,
    intro: strolly.intro.headline,
    image: strolly.thumbnail,
    chapters: [
      ["散歩と音楽", strolly.intro.lead],
      ...strolly.sections.flatMap((section) =>
        (section.items ?? []).map((item) => [item.title, item.body] as const),
      ),
    ],
  },
  "drop-watermark": {
    name: watermark.systemname,
    intro: "写真の下に、撮影に使ったカメラと設定を添える。",
    image: watermark.thumbnail,
    chapters: [
      ["写真の仕上がり", watermark.description],
      [
        "実装",
        "PythonとPillowを使い、写真と撮影情報を一枚の画像にまとめます。",
      ],
    ],
    source: watermark.links.GitHub,
    sourceLabel: "ソースコード",
  },
  fcs: {
    name: frailty.systemname,
    intro: "フレイルチェック教室の運営と、参加者のチェックを支援する。",
    image: frailty.thumbnail,
    chapters: [
      [
        "制作の背景",
        "横須賀市のフレイルチェック教室では、運営するボランティアの人数や経験に差があります。教室の管理とチェックの進行を支えるWebシステムを開発しました。",
      ],
      ["プロジェクトの目標", frailty.content.目標],
      [
        "実装",
        "Djangoを使って教室を管理し、Web Speech APIで音声認識を取り入れました。",
      ],
    ],
    source: frailty.links["プロジェクト演習2024"],
    sourceLabel: "大学のプロジェクト紹介",
  },
  sds: {
    name: notes.systemname,
    intro: "講義動画の音声とスライドから、授業を読み返せるノートを作る。",
    image: notes.thumbnail,
    chapters: [
      ["制作の目的", notes.content.目的],
      [
        "動画からノートへ",
        "講義動画から音声とスライドを抽出し、授業の内容を文字と資料で確認できるようにする、大学の開発プロジェクトです。",
      ],
      [
        "実装",
        "PHPとJavaScriptで画面を作り、画像処理にOpenCV、文字認識にTesseract OCRを使っています。",
      ],
    ],
    source: notes.links["プロジェクト演習2023"],
    sourceLabel: "大学のプロジェクト紹介",
  },
} as const satisfies Record<string, PortfolioWork>;

export type ArchiveSlug = keyof typeof archivedWorks;
export function isArchiveSlug(value: string): value is ArchiveSlug {
  return Object.hasOwn(archivedWorks, value);
}
