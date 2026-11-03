# 依存関係更新・セキュリティ確認（2026-10-29）

対象は `main`。`dev` および `codex/space-ui-redesign` の未マージ変更は含めていません。

## 確認結果と修正

- 更新前の `npm audit` は計20件（Critical 8 / High 12）。これは依存パッケージの検出件数であり、20種類の独立した攻撃がサイトで成立するという意味ではありません。
- TanStack Start 1.168.32 は [GHSA-qx66-fv34-fjm8](https://github.com/advisories/GHSA-qx66-fv34-fjm8) の対象範囲。1.169.4 とその間接依存へ更新しました。このサイトには独自の server function は見つかりませんでしたが、フレームワークの修正版へ更新しています。
- Vite、Wrangler、Cloudflareプラグイン、Serovalなどを含む間接依存を更新。更新後の全依存 `npm audit` は0件（確認時点のデータベースに基づく）。
- React 19.3.1、Vite 8.3.5、Wrangler 4.155.0、ESLint 10.13.0などへ更新。
- TypeScriptは6.0.3を維持し、`~6.0.3` に制限。現行のtypescript-eslintが対応する範囲は `<6.1.0` で、TypeScript 7への移行は見送っています。`@types/node` は既存の22系を維持しています。
- lucide-react 1.xで削除されたGitHub/Instagramアイコンは、既存0.544.0のSVG定義をローカルに保持し、外観と型互換性を維持。ライセンスは `licenses/lucide-brand-icons.txt` に保存しました。
- Spotify埋め込みはHTTPS・正規ホスト・対応パス・22桁の英数字IDのみ許可。認証情報・別ポート・不正なURLは描画せず、任意URLへのフォールバックを廃止しました。コンテンツはリポジトリ内の静的JSONであり、現時点で外部ユーザーの投稿経路は見つかっていません。
- 公開サイトへの通常のHEADリクエストではCSP、X-Frame-Options、nosniff等が見つかりませんでした。静的アセットには `public/_headers`、SSR・404のWorker応答には `src/server.ts` から同じポリシーを設定します。[Cloudflareの仕様](https://developers.cloudflare.com/workers/static-assets/headers/)上、静的アセットの `_headers` だけではWorker生成レスポンスを保護できません。
- CSPは埋め込み元・自身の埋め込み禁止・base URL・プラグインコンテンツを制限します。フレームワークのインラインスクリプトとの互換性を保つため、`script-src` は追加していません。完全なXSS防御を保証するものではありません。
- HSTSは当該ホストのみ（1年）。他のサブドメインを巻き込む `includeSubDomains` / preload は設定していません。
- React Devtoolsは開発時のみ描画し、Vite Devtoolsもserve時のみ有効にします。

## 再検証

Node.js 24で以下を実行します。

```sh
npm ci
npm audit
npm run test:security
npm run typecheck
npm run lint
npm run build
```

セキュリティテストはURLの拒否・既存Spotifyリンクの互換性・レスポンス本文/ステータス/既存ヘッダーの維持・静的/Workerヘッダーの一致を確認します。GitHub Actionsにも依存関係監査、テスト、型チェック、Lint、ビルドを追加しています。

作業環境ではOSの `networkInterfaces()` が `uv_interface_addresses` エラーとなり、Cloudflareのローカルプレビュー起動時に通常ビルドが停止しました。リポジトリ外の一時preloadで、そのエラー時に限りループバック情報を返して再実行し、16ページのプリレンダーとsitemap生成の完了を確認しました。この環境用preloadはコミットしていません。通常環境のビルドはGitHub Actionsでも確認してください。

ビルド出力のCloudflareプレビューに対し、`/`・`/Project`・`/Blog/04`・`/Info` の200応答と、存在しないパスの404応答でセキュリティヘッダーを確認しました。ブログのSpotify埋め込みHTMLも維持されています。本番クライアント出力にDevtools表示文字列が残らないことも確認しました。ブラウザー操作検証は、Chromium未導入かつブラウザー配布物のダウンロード失敗により未実施です。

## 範囲・残る確認

ソースと配信設定の静的確認、依存関係監査、ローカル検証を実施しました。認証・DB・独自API・生HTML挿入・任意コード実行の実装は見つかりませんでした。侵入テストや公開サイトへの攻撃的なスキャンは行っていません。依存監査0件はサイト全体に脆弱性が存在しないことの保証ではありません。

本番への反映にはPRのマージとデプロイが必要です。デプロイ後に `curl -I https://hamaryo.dev` および存在しないパスでヘッダーを確認してください。CloudflareアカウントのWAF・DNS・アクセス権設定、配布中のWindowsインストーラーの内部、過去のGit履歴に含まれる秘密情報は今回の監査対象外です。
