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
│   ├── About/index.tsx  /About
│   ├── Now/index.tsx    /Now
│   ├── Uses/index.tsx   /Uses
│   └── Info/index.tsx   /Info
├── content/             記事・ブログ・単独ページの実データ（JSON）
│   ├── articles/        プロジェクト記事 7 件
│   ├── blog/            ブログ記事 5 件
│   ├── about.json       /About
│   ├── now.json         /Now
│   └── uses.json        /Uses
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
同じ配列で次の 2 つも指定する。

- `featured: true` — ホームに代表作として載せる。載せたい 3 件だけに付ける
- `wip: true` — 記事に「作成途中」バナーと一覧のバッジを出す。本文が揃った記事から外す

記事本文は JSON の `content` に日本語キーで書く。すべて任意で、書いたものだけが表示される。

| キー | 型 | 内容 |
| --- | --- | --- |
| `概要` | 文字列 | 何を作ったか |
| `背景` | 文字列 | 解決したかった課題 |
| `役割` | 文字列 | 自分が担当した範囲 |
| `想定クライアント` / `目的` / `目標` | 文字列 | ページ上部のカードに並ぶ |
| `技術スタック` | 分類名 → 技術名の配列 | ロゴは `src/routes/Project/$slug.tsx` の `logoMap` で解決 |
| `設計判断` | `{ 選択, 理由 }` の配列 | なぜその技術・設計を選んだか |
| `振り返り` | 文字列 | 苦労した点・改善した点 |
| `成果` | 文字列の配列 | 受賞、利用者、処理時間、運用上の変化など |
| `次の実装` | 文字列の配列 | `wip: true` のとき「作成途中」バナーに並ぶ |

```json
{
  "content": {
    "設計判断": [{ "選択": "Django", "理由": "音声認識の前処理を Python で書けるため" }],
    "成果": ["◯◯コンテストで最優秀賞", "スタッフの業務を N 項目削減"],
    "次の実装": ["集計結果の CSV 出力"]
  }
}
```

**ブログ記事**: `src/content/blog/` に JSON を置き、`src/lib/blogs.ts` の `blogs` 配列に
追加する。本文は `paragraph` / `heading` / `list` / `image` / `code` / `embed` / `link` の
ブロック配列（型は同ファイルの `BlogContent`）。

**単独ページ**: `/About`・`/Now`・`/Uses` は `src/content/` 直下の JSON を編集すれば内容が変わる。
項目はすべて任意で、空のもの（`about.json` の `values`、`uses.json` の `デバイス` など）は
セクションごと表示されない。`/Now` は更新頻度が高い想定なので、`updated` も一緒に直す。

記事はどちらも追加すれば `vite.config.ts` の `pages` が自動で拾い、prerender と sitemap に反映される。
単独ページを増やすときは `pages` に手で追記する。

## 更新の型

無理なく続けるための目安。

| 頻度 | やること | 触るファイル |
| --- | --- | --- |
| 月 1 本 | プロジェクトの改善や技術の振り返りをブログに書く | `src/content/blog/` + `src/lib/blogs.ts` |
| 随時 | `/Now` に短い更新を足す。`updated` も一緒に直す | `src/content/now.json` |
| 四半期に 1 本 | 代表プロジェクトのケーススタディを書き足し、`wip` を外せるか見直す | `src/content/articles/` + `src/lib/articles.ts` |

## ビルドと配信の仕組み

`vite.config.ts` で全ルートを列挙し、ビルド時に静的 HTML へ prerender している
（`dist/client/` に 16 ファイル）。同時に `sitemap.xml` も生成される。

Cloudflare へは静的アセット＋フォールバック Worker として載る。実リクエストはほぼ
静的アセットで返るため、サーバー実行はほとんど発生しない。

`wrangler.jsonc` の `assets.html_handling: "drop-trailing-slash"` で、
`/Project` のような末尾スラッシュなし URL をそのまま配信している（旧サイトと同じ挙動）。

## 検索エンジンへのインデックス

**サイト全体を意図して noindex にしている。** 検索結果には載せず、URL を知っている人だけに
見せる運用を選んでいるため。インデックスさせたい場合は 2 か所を変更する:

1. `src/config/site.ts` の `NOINDEX` を `false` に
2. `public/robots.txt` の `Disallow: /` を外す

`robots.txt` 下段の AI クローラ向け `Disallow` は、通常クローラを解禁したあとも維持する想定。
解禁する際は併せて Search Console にサイトを登録する。
