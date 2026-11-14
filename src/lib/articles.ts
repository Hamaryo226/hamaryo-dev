// 記事データを統合管理
import fcsData from "../content/articles/fcs.json";
import sdsData from "../content/articles/sds.json";
import dwData from "../content/articles/dw.json";
import lyraData from "../content/articles/lyra.json";
import museData from "../content/articles/muse.json";
import health2bpmData from "../content/articles/health2bpm.json";
import orderManager2Data from "../content/articles/order-manager2.json";
import taikodiveData from "../content/articles/taikodive.json";
import strollyData from "../content/articles/strolly.json";

import { validateArticleCollection } from "./article-schema";
import type {
  ArticleState,
  ArticleSectionData,
  ArticleIntro,
} from "./article-schema";

export type Article = ArticleState & {
  sections?: ArticleSectionData[];
  intro?: ArticleIntro;
  slug: string;
  category: "university" | "personal";
  thumbnail?: string;
  title: string;
  systemname: string;
  date: string;
  description: string;
  // 構成図（stack-diagram スキルで生成）。ライト／ダークで別画像を持つ
  diagram?: {
    light: string;
    dark: string;
    alt: string;
    caption?: string;
  };
  content?: {
    概要?: string;
    技術スタック?: string | Record<string, string[]>;
    想定クライアント?: string;
    目的?: string;
    目標?: string;
  };
  links?: Record<string, string>;
  references?: Record<string, string>;
  code?: Record<
    string,
    {
      title: string;
      description: string;
      filename: string;
      language: string;
      code: string;
    }
  >;
};

// 記事データにslugとcategoryを追加
const articleData = [
  { ...fcsData, slug: "fcs", category: "university" },
  { ...sdsData, slug: "sds", category: "university" },
  { ...orderManager2Data, slug: "order-manager2", category: "university" },
  { ...dwData, slug: "drop-watermark", category: "personal" },
  { ...lyraData, slug: "lyra", category: "personal" },
  { ...museData, slug: "muse", category: "personal" },
  { ...health2bpmData, slug: "health2bpm", category: "personal" },
  { ...taikodiveData, slug: "taikodive", category: "personal" },
  { ...strollyData, slug: "strolly", category: "personal" },
];

// Vite imports this module during configuration, so invalid JSON fails the build.
validateArticleCollection(
  articleData.map((article) => ({
    data: article,
    slug: article.slug,
    file: `src/content/articles/${article.slug === "drop-watermark" ? "dw" : article.slug}.json`,
  })),
);
export const articles = articleData as Article[];

// slugから記事を取得
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

// すべての記事を取得
export function getAllArticles(): Article[] {
  return articles;
}

// カテゴリー別に記事を取得
export function getArticlesByCategory(
  category: "university" | "personal",
): Article[] {
  return articles.filter((article) => article.category === category);
}

// すべてのslugを取得（静的生成用）
export function getAllSlugs(): string[] {
  return articles.map((article) => article.slug);
}
