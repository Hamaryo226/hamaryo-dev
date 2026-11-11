# 記事追加・サイト改善・コード確認（2026-11-11）

ベースは `main` の `81dc2c5`。未マージの Strolly 記事拡充 PR #3 は含めていません。

## 変更

- `/Blog/06` に「hamaryo.dev の記事を JSON から静的ページにする仕組み」を追加。記事データ、slug 登録、ルーティング、prerender、sitemap、配信ヘッダーについて、実装を根拠に記述しています。利用体験や性能改善の数値は創作していません。
- ホームのブログカードとフッターの Blog リンクを表示し、記事一覧へ進めるようにしました。
- 構成図ビューアーを native `dialog` に変更。背面を操作対象から外し、開いた時のフォーカス、Tab / Shift+Tab の巡回、Escape / 閉じるボタンによる終了、元のボタンへのフォーカス復帰を実装しました。ブラウザー側の拡大操作を妨げないよう、Ctrl / Meta / Alt を伴うショートカットは処理しません。
- `.prettierignore` の `yarn.locksrc/routeTree.gen.ts` を2行に修正。生成ファイルをフォーマッターから除外し、README の書式も修正しました。
- Playwright のブラウザテストを追加し、CI で書式チェックとともに実行します。

## 確認

Node.js 24、Chromium で確認しました。

- `npm run check` / `npm run lint` / `npm run typecheck`: 通過。
- `npm run test:security`: 通過。個別出力でも既存8ケースの通過を確認。
- `npm run build`: 19ページの prerender と sitemap 生成が完了。新記事の HTML と sitemap への登録も確認。
- `npm run test:e2e`: 3ケース通過。ホーム→ブログ一覧→新記事、再読み込み、noindex、構成図のキーボード操作・フォーカス復帰、375px幅、ダークテーマを確認。
- モバイルの記事全体とダークテーマの構成図をスクリーンショットで目視確認。

この作業環境のコマンドサンドボックス内では `networkInterfaces()` が失敗するため、ビルドとブラウザテストは同じ環境の通常実行で確認しました。リポジトリへの環境回避コードの追加はありません。ブラウザには既存の `/usr/bin/chromium` を指定し、CI は Playwright 配布の Chromium を使います。

## 残る指摘

- 本番依存の `npm audit --omit=dev` は0件。全依存では開発用 ESLint 系の中程度12件が残ります。同じ minimatch の [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) が依存先に波及した件数です。監査の修正提案には ESLint のメジャー変更や設定パッケージのダウングレードが含まれ、既存 CI コメントにも minimatch 11 の互換性懸念があるため、自動修正は適用していません。
- Vite は将来の native config loader に関する import 形式の警告を出します。現在のビルドは成功しています。今回その移行は行っていません。
- ブラウザの自動検証は Chromium のみです。Safari / Firefox と実機のピンチ操作は未検証です。
- 本番デプロイ後の配信検証は別途必要です。サイト全体の noindex と既存の PascalCase URL は維持しています。
