/**
 * サイト全体のメタ情報。
 *
 * 旧 src/config/metadata.ts の移植版。baseUrl は旧実装では
 * "https://ryota-space.vercel.app" のまま残っていたが、実際の公開先である
 * hamaryo.dev に修正している。
 */

export const SITE_URL = "https://hamaryo.dev";
export const SITE_NAME = "ryota-space";
export const SITE_DESCRIPTION = "Ryota's personal space";
export const SITE_OG_IMAGE = "/icon/og.webp";

/**
 * サイト全体を検索エンジンから除外するかどうか。
 *
 * 旧実装では layout.tsx の `robots: { index: false, follow: false }` と
 * robots.ts の `disallow: '/'` によりサイト全体が noindex になっていた。
 * その挙動をそのまま引き継いでいる。
 *
 * 検索エンジンにインデックスさせたくなったら、この値を false にして
 * public/robots.txt の Disallow 行も併せて外すこと。
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
