import { getAllArticles } from "@/lib/articles";
import type { Article } from "@/lib/articles";

export const platforms = {
  web: "Web",
  apple: "iOS / watchOS",
  desktop: "デスクトップ",
  bot: "Bot",
} as const;

export type Platform = keyof typeof platforms;

type ProjectPresentation = {
  platform?: Platform;
  tags: string[];
  tone: "green" | "violet" | "blue" | "amber";
};

// 紹介文・日付は articles のデータを使い、一覧の表示に必要な分類だけを持つ。
const presentation: Partial<Record<string, ProjectPresentation>> = {
  strolly: {
    platform: "apple",
    tags: ["SwiftUI", "MusicKit", "MapKit"],
    tone: "green",
  },
  taikodive: {
    platform: "desktop",
    tags: ["C#", ".NET", "DxLib"],
    tone: "violet",
  },
  "order-manager2": {
    platform: "web",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    tone: "blue",
  },
  fcs: {
    platform: "web",
    tags: ["Django", "Python", "音声認識"],
    tone: "green",
  },
  sds: {
    platform: "web",
    tags: ["PHP", "OpenCV", "Tesseract-OCR"],
    tone: "blue",
  },
  "drop-watermark": {
    platform: "desktop",
    tags: ["Python", "Pillow", "Exif"],
    tone: "amber",
  },
  lyra: { platform: "bot", tags: ["Python", "discord.py"], tone: "violet" },
  muse: {
    platform: "desktop",
    tags: ["React", "TypeScript", "SQLite"],
    tone: "blue",
  },
  health2bpm: {
    platform: "apple",
    tags: ["SwiftUI", "HealthKit", "Spotify API"],
    tone: "amber",
  },
};

export function getProjectPresentation(article: Article): ProjectPresentation {
  return presentation[article.slug] ?? { tags: [], tone: "blue" };
}

// 編集上の注目作品。掲載順・開発状況を日付の文字列から推測しない。
export function getFeaturedProjects(): Article[] {
  const featured = ["strolly", "taikodive", "order-manager2"];
  const articles = getAllArticles();
  return featured.flatMap((slug) =>
    articles.filter((article) => article.slug === slug),
  );
}

export function getPortfolioProjects(): Article[] {
  const featured = getFeaturedProjects();
  const slugs = new Set(featured.map((article) => article.slug));
  return [
    ...featured,
    ...getAllArticles().filter((article) => !slugs.has(article.slug)),
  ];
}
