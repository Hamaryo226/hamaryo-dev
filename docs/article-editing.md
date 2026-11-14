# 作品記事の編集ルール（初回ローカル改修）

## 状態は独立

- `articleStatus`: `draft` / `review` / `published`。省略時は `draft`。執筆途中の注意は `published` のときだけ非表示。
- `distribution`: `{ "status": "unknown" }` / `{ "status": "unavailable" }` / `{ "status": "available", "url": "https://…", "label": "利用先を見る" }`。
- 配布状態の省略は `unknown`。記事の公開・完成状態から利用可否を推測しない。unknown は「非公開」を意味しない。
- `available` は利用先を人が確認してから設定する。URL形式の検査だけでは配布中である証拠にならない。変更時は作品名・配布元・利用条件・遷移先を再確認する。
- `unknown` / `unavailable` に `url` / `label` があれば検証エラー。空URL、javascript等の非HTTPスキーム、プロトコル相対URL、認証情報入りURLは拒否する。
- 互換例外: 既存の `links.Installer` は `distribution` 自体が未設定の場合に限り従来通り表示する。Museの既存URLを保全するためであり、新たに配布確認済みとしたものではない。新規記事はこの旧形式を使わず `distribution` で管理する。

## 任意セクション

`intro` は見出しコピー (`headline`)、リード (`lead`)、対応環境 (`environment`) を持つ任意項目。既存タイトル・descriptionはSEO/一覧用として保持する。

`sections: [{ "type": "text", "title": "できること", "body": "本文" }]` を指定すると配列順に表示する。見出し・本文のいずれかが空白のみなら見出しごと表示しない。未指定の場合は従来の `content.概要` を表示する。`sections: []` は表示なし。

`type` は `text`（省略時も同じ）/ `features` のみ。featuresは `items: [{ title, body }]` で小見出し付き本文を表示し、空項目は省く。`id` と `navLabel` を設定した表示セクションだけページ内リンクを生成する。slug・アンカー重複もビルドで拒否する。

Strollyは既存概要を保管したまま任意セクションで再構成。表示側を変更するときは保管概要との意味の差分を確認する。バックグラウンド記録条件・GPXの対象など、既存資料以上の断定は加えない。

技術スタック、構成図、コード例、参考資料、関連リンクは従来形式のまま対応。空のコード辞書や技術配列から見出しだけを生成しない。実画面の素材がなければ架空画面・プレースホルダーを足さない。

## 検証とプレビュー

```sh
npm run test:content
npm run test:security
npm run typecheck
npm run lint
npm run build
npm run test:e2e
npm run preview -- --host 127.0.0.1 --port 4173
```

Vite設定が読み込む `articles.ts` 内で生JSONを検証するため、不正な状態やURLはビルドを失敗させる。ルート生成やCMS/FWは変更していない。

このWindows環境ではPlaywright付属ブラウザが未インストールのため、実行時は既存Chromeを利用した:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='C:/Program Files/Google/Chrome/Application/chrome.exe' npm run test:e2e -- --workers=2
```

URL: http://127.0.0.1:4173/Project/strolly 。`noindex, nofollow` 維持。本番deploy・merge・pushはこの作業に含めない。
