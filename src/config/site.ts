/**
 * サイト全体のメタ情報。
 *
 * 旧 src/config/metadata.ts の移植版。baseUrl は旧実装では
 * "https://ryota-space.vercel.app" のまま残っていたが、実際の公開先である
 * hamaryo.dev に修正している。
 */

export const SITE_URL = "https://hamaryo.dev";
export const SITE_NAME = "hamaryo.dev";
export const SITE_DESCRIPTION =
  "システムエンジニア Hamaryo のポートフォリオ。開発したプロジェクトと技術記録をまとめています。";
export const SITE_OG_IMAGE = "/icon/og.webp";

/**
 * サイト全体を検索エンジンから除外するかどうか。
 *
 * 検索結果には載せず、URL を知っている人だけに見せる運用を選んでいる。
 * 旧実装から引き継いだ設定ではなく、意図して維持している方針。
 *
 * 検索エンジンにインデックスさせたくなったら、次の 2 か所を同時に変更する。
 *   1. この NOINDEX を false にする
 *   2. public/robots.txt の Disallow 行を外す
 * 加えて Search Console にサイトを登録する。
 */
// boolean 注釈は意図的。true リテラルに固定すると、これを切り替えるだけの変更でも
// 参照側が「常に真」と判定されて lint エラーになるため。
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const NOINDEX: boolean = true;

type Meta = Record<string, string>;

/**
 * 各ページの <head> に入れる meta タグを組み立てる。
 * ルートで定義済みのものと同名のタグは、こちらで上書きされる。
 */
export function seo(opts: {
  title: string;
  description?: string;
  image?: string;
  path?: string;
}): Array<Meta> {
  const title = opts.title;
  const description = opts.description ?? SITE_DESCRIPTION;
  const image = opts.image ?? SITE_OG_IMAGE;
  const url = `${SITE_URL}${opts.path ?? ""}`;

  return [
    { title },
    { name: "description", content: description },
    ...(NOINDEX
      ? [
          { name: "robots", content: "noindex, nofollow" },
          { name: "googlebot", content: "noindex, nofollow" },
        ]
      : []),
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "ja_JP" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: `${SITE_URL}${image}` },
    { property: "og:image:width", content: "1920" },
    { property: "og:image:height", content: "1080" },
    { property: "og:image:alt", content: title },
  ];
}

/** ページタイトルにサイト名を付ける（旧 createPageMetadata と同じ書式） */
export function pageTitle(title: string): string {
  return `${title}｜${SITE_NAME}`;
}
