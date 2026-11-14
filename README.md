# hamaryo-dev

ポートフォリオサイト **[hamaryo.dev](https://hamaryo.dev)** のソースコード。

[Next.js 16 App Router 版（`Hamaryo226/ryota-space`）](https://github.com/Hamaryo226/ryota-space)を
**TanStack Start + shadcn/ui** で再構築したもの。既存の URL と記事データを引き継ぎ、
一覧・記事詳細・サイト情報・404 を含む全ページで、自作シンボルと白黒基調の共通デザインを使用している。
幅640pxを上限とした中央カラムに、小さなプロフィールと開閉式の作品紹介を配置する。
初回はダークテーマで表示し、テーマ切り替え後は選択を保存する。

## 技術スタック

| 領域           | 採用技術                                                      |
| -------------- | ------------------------------------------------------------- |
| フレームワーク | TanStack Start v1（TanStack Router + Vite）                   |
| UI             | React 19 / shadcn/ui (new-york, neutral) / Radix UI           |
| スタイル       | Tailwind CSS v4（CSS-first、`src/styles.css`）                |
| フォント       | Geist / Geist Mono（`@fontsource-variable/*` でセルフホスト） |
| テーマ         | next-themes（`class` 属性、初期ダーク・選択保存）             |
| アイコン       | lucide-react                                                  |
| ホスティング   | Cloudflare Workers（`@cloudflare/vite-plugin` + wrangler）    |
| Lint / Format  | ESLint（`@tanstack/eslint-config`）/ Prettier                 |

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
npm run test:security # URL・ヘッダー方針のテスト
npm run test:e2e     # ビルド済みサイトのブラウザテスト（Chromium）
npx tsc --noEmit     # 型チェック
npx wrangler dev     # ビルド成果物をローカルで配信（本番相当の確認）
npm run deploy       # ビルドして Cloudflare へデプロイ
```

ブラウザテストは初回に `npx playwright install chromium` を実行し、
`npm run build` の後に `npm run test:e2e` を実行します。記事への遷移、
作品紹介の開閉・テーマ保存、構成図のフォーカス・キーボード操作、
本文とコードの保持、埋め込み URL、404 の復帰、
モバイル幅とダークテーマを確認します。
既存の Chromium を使う場合は `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` で指定できます。

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
│   ├── Info/index.tsx   /Info
│   └── About/index.tsx  /About（人物紹介・制作分野）
├── content/             記事・ブログの実データ（JSON）
│   ├── articles/        プロジェクト記事
│   └── blog/            ブログ記事
├── components/
│   ├── portfolio-layout.tsx  全ページの共通ナビゲーション・フッター
│   ├── article-elements.tsx  記事のセクション・コード・外部リンク
│   ├── missing-page.tsx      共通の404表示
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

一覧のプラットフォーム分類・技術タグ・アプリ画像は `src/config/portfolio.ts` に置く。
未登録でも一覧に表示されるが、プラットフォームで絞り込みたい場合は分類を登録する。
トップの注目作品も同ファイルの `getFeaturedProjects()` で選ぶ。
作品紹介はネイティブの `details` / `summary` で開閉し、件数は記事データから集計する。

`/Project?platform=apple&category=personal` のように絞り込み条件を URL で共有できる。
About はプロフィールと制作分野、Info はサイトの技術構成・バージョンを担当する。

自作のサイトシンボルは `public/icon/site-symbol.svg`。ヘッダーと favicon で同じ
SVG を使用し、`public/icon/site-touch-icon.png` は同じ図形を PNG に書き出したもの。

**ブログ記事**: `src/content/blog/` に JSON を置き、`src/lib/blogs.ts` の `blogs` 配列に
追加する。本文は `paragraph` / `heading` / `list` / `image` / `code` / `embed` / `link` の
ブロック配列（型は同ファイルの `BlogContent`）。

どちらも追加すれば `vite.config.ts` の `pages` が自動で拾い、prerender と sitemap に反映される。

## ビルドと配信の仕組み

`vite.config.ts` で全ルートを列挙し、ビルド時に静的 HTML へ prerender している
（`dist/client/`）。同時に `sitemap.xml` も生成される。

Cloudflare へは静的アセット＋フォールバック Worker として載る。実リクエストはほぼ
静的アセットで返るため、サーバー実行はほとんど発生しない。

`wrangler.jsonc` の `assets.html_handling: "drop-trailing-slash"` で、
`/Project` のような末尾スラッシュなし URL をそのまま配信している（旧サイトと同じ挙動）。

## 検索エンジンへのインデックス

**現在サイト全体を noindex にしている**（旧サイトの設定を引き継いだもの）。
検索エンジンにはクロールを許可し、HTML の meta と HTTP の
`X-Robots-Tag: noindex, nofollow` で検索結果への掲載を拒否する。
`robots.txt` の `Disallow` だけでは検索結果からの除外を保証できず、
noindex を読めなくなるため、一般クローラーをブロックしない。
特定の AI クローラーへの `Disallow: /` は維持する。

インデックスさせたい場合は 3 か所を変更する:

1. `src/config/site.ts` の `NOINDEX` を `false` に
2. `public/_headers` の `X-Robots-Tag` を外す（静的アセット）
3. `src/lib/security.ts` の `X-Robots-Tag` を外す（Worker 応答）

noindex はアクセス制御ではない。URL を知っている人は引き続き閲覧でき、
従わないクローラーも防げない。既に検索結果にある URL の反映には再クロールが必要。
デプロイ後は Cloudflare が追加する robots.txt を含めた実応答と、
静的ページ・画像・Worker の 404 応答のヘッダーを確認すること。
