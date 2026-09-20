// 記事データを統合管理
import fcsData from "../content/articles/fcs.json";
import sdsData from "../content/articles/sds.json";
import dwData from "../content/articles/dw.json";
import lyraData from "../content/articles/lyra.json";
import museData from "../content/articles/muse.json";
import health2bpmData from "../content/articles/health2bpm.json";
import orderManager2Data from "../content/articles/order-manager2.json";

export type Article = {
  slug: string;
  category: "university" | "personal";
  /** ホームに代表作として載せるか */
  featured?: boolean;
  /** 本文が書きかけかどうか。記事に「作成途中」バナーとバッジを出す */
  wip?: boolean;
  thumbnail?: string;
  title: string;
  systemname: string;
  date: string;
  description: string;
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
export const articles: Article[] = [
  {
    ...fcsData,
    slug: "fcs",
    category: "university",
    featured: true,
    wip: true,
  },
  {
    ...sdsData,
    slug: "sds",
    category: "university",
    featured: true,
    wip: true,
  },
  {
    ...orderManager2Data,
    slug: "order-manager2",
    category: "university",
    wip: true,
  },
  {
    ...dwData,
    slug: "drop-watermark",
    category: "personal",
    featured: true,
    wip: true,
  },
  { ...lyraData, slug: "lyra", category: "personal", wip: true },
  { ...museData, slug: "muse", category: "personal", wip: true },
  { ...health2bpmData, slug: "health2bpm", category: "personal", wip: true },
];

// slugから記事を取得
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

// すべての記事を取得
export function getAllArticles(): Article[] {
  return articles;
}

// ホームに載せる代表作を取得
// フォールバックは持たせていない。featured をすべて外すとホームのプロジェクト欄が空になる
export function getFeaturedArticles(): Article[] {
  return articles.filter((article) => article.featured);
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
