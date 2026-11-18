import { catalog } from "./catalog";
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

export const articles = catalog.articles;

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
