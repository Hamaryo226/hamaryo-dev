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
  appIcon?: string;
  tags: string[];
};

// 紹介文・日付は articles のデータを使い、一覧の表示に必要な分類だけを持つ。
const presentation: Partial<Record<string, ProjectPresentation>> = {
  strolly: {
    platform: "apple",
    appIcon: "/img/strolly/app-icon.png",
    tags: ["SwiftUI", "MusicKit", "MapKit"],
  },
  taikodive: {
    platform: "desktop",
    tags: ["C#", ".NET", "DxLib"],
  },
  "order-manager2": {
    platform: "web",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
  },
  fcs: {
    platform: "web",
    tags: ["Django", "Python", "音声認識"],
  },
  sds: {
    platform: "web",
    tags: ["PHP", "OpenCV", "Tesseract-OCR"],
  },
  "drop-watermark": {
    platform: "desktop",
    tags: ["Python", "Pillow", "Exif"],
  },
  lyra: { platform: "bot", tags: ["Python", "discord.py"] },
  muse: {
    platform: "desktop",
    tags: ["React", "TypeScript", "SQLite"],
  },
  health2bpm: {
    platform: "apple",
    tags: ["SwiftUI", "HealthKit", "Spotify API"],
  },
};

export function getProjectPresentation(article: Article): ProjectPresentation {
  return presentation[article.slug] ?? { tags: [] };
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
