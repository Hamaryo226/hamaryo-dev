# hamaryo-dev

ポートフォリオサイト **[hamaryo.dev](https://hamaryo.dev)** のソースコード。

[Next.js 16 App Router 版（`Hamaryo226/ryota-space`）](https://github.com/Hamaryo226/ryota-space)を
**TanStack Start + shadcn/ui** で再構築したもの。デザインは旧版から忠実に移植している。

## 技術スタック

| 領域 | 採用技術 |
| --- | --- |
| フレームワーク | TanStack Start v1（TanStack Router + Vite） |
| UI | React 19 / shadcn/ui (new-york, neutral) / Radix UI |
| スタイル | Tailwind CSS v4（CSS-first、`src/styles.css`） |
| フォント | Geist / Geist Mono（`@fontsource-variable/*` でセルフホスト） |
| テーマ | next-themes（`class` 属性、system 追従） |
| アイコン | lucide-react |
| ホスティング | Cloudflare Workers（`@cloudflare/vite-plugin` + wrangler） |
| Lint / Format | ESLint（`@tanstack/eslint-config`）/ Prettier |

## 開発

```bash
npm install
npm run dev          # http://localhost:3000
```

その他のコマンド:

```bash
npm run build        # 本番ビルド（全ページを prerender ＋ sitemap.xml 生成）
npm run lint         # ESLint
npm run format       # Prettier + ESLint --fix
npm run check        # Prettier チェックのみ
npx tsc --noEmit     # 型チェック
npx wrangler dev     # ビルド成果物をローカルで配信（本番相当の確認）
npm run deploy       # ビルドして Cloudflare へデプロイ
```

## 構成

```
src/
├── routes/              ファイルベースルーティング
│   ├── __root.tsx       ルートレイアウト（<html>, meta, テーマ, 全体 404）
│   ├── index.tsx        /
│   ├── Project/
│   │   ├── index.tsx    /Project
│   │   └── $slug.tsx    /Project/:slug
│   ├── Blog/
│   │   ├── index.tsx    /Blog
│   │   └── $slug.tsx    /Blog/:slug
│   └── Info/index.tsx   /Info
├── content/             記事・ブログの実データ（JSON）
│   ├── articles/        プロジェクト記事 7 件
│   └── blog/            ブログ記事 5 件
├── components/
│   └── ui/              shadcn/ui コンポーネント
├── lib/                 articles.ts / blogs.ts / utils.ts
├── config/site.ts       サイト共通メタ情報・SEO ヘルパー
└── styles.css           Tailwind v4 設定 + デザイントークン
```

**URL は PascalCase**（`/Project`, `/Blog`, `/Info`）。旧サイトから引き継いでいるため
変更すると既存リンクや Info ページの QR コードが壊れる。

## コンテンツの追加

記事データは JSON。CMS もマークダウンも使っていない。

**プロジェクト記事**: `src/content/articles/` に JSON を置き、`src/lib/articles.ts` の
`articles` 配列に `slug` と `category`（`university` / `personal`）付きで追加する。

**ブログ記事**: `src/content/blog/` に JSON を置き、`src/lib/blogs.ts` の `blogs` 配列に
追加する。本文は `paragraph` / `heading` / `list` / `image` / `code` / `embed` / `link` の
ブロック配列（型は同ファイルの `BlogContent`）。

どちらも追加すれば `vite.config.ts` の `pages` が自動で拾い、prerender と sitemap に反映される。

## ビルドと配信の仕組み

`vite.config.ts` で全ルートを列挙し、ビルド時に静的 HTML へ prerender している
（`dist/client/` に 16 ファイル）。同時に `sitemap.xml` も生成される。

Cloudflare へは静的アセット＋フォールバック Worker として載る。実リクエストはほぼ
静的アセットで返るため、サーバー実行はほとんど発生しない。

`wrangler.jsonc` の `assets.html_handling: "drop-trailing-slash"` で、
`/Project` のような末尾スラッシュなし URL をそのまま配信している（旧サイトと同じ挙動）。

## 検索エンジンへのインデックス

**現在サイト全体を noindex にしている**（旧サイトの設定を引き継いだもの）。
インデックスさせたい場合は 2 か所を変更する:

1. `src/config/site.ts` の `NOINDEX` を `false` に
2. `public/robots.txt` の `Disallow: /` を外す
