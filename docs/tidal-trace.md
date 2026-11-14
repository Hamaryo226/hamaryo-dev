# Tidal Trace — ローカル確認用トップ

`/` は固定の中央h1 `hamaryo.dev` と独自ジェネラティブ背景だけを表示する。タイトルはリンクでも操作対象でもない。内部ページのナビゲーション・フッターは保持。

## 実装

- `src/lib/tidal.ts`: オリジナルGLSL。非対称の3枚の薄膜場、細い等高線、面に付着する粒子、局所干渉色。外部画像・参考コード・Three.js等の追加依存なし。
- `src/components/tidal-trace.tsx`: Reactライフサイクル、非表示の支援技術向け説明、SSR SVG fallback。
- `src/components/tidal-trace.css`: 全viewport、中央タイトル、フォーカス時のみ枠表示。
- `src/routes/index.tsx`: トップ専用シーンに統合。noindexは既存seo関数を使用。

背景のクリック／タップでは停止しない。背景は装飾divとcanvasで、操作ボタンとは分離。Tabで専用ボタンへ移動してSpace／Enterで停止・再開する。表示中のボタン自体はクリックでも操作可能。タイトルを押しても変化しない。キーボードフォーカス時のみ、画面下部に停止／再開の操作名を表示する。通常のpointer移動は局所渦に作用し、移動速度に応じて強さが変わる。タッチ移動を追従には使わない。

`prefers-reduced-motion: reduce` は静止し、pointer入力も無視する。実行中に設定が変わっても追従。WebGL取得／コンパイル失敗・context loss時はSVGの流線へ切り替え、context復帰時は再初期化。JavaScript無効でもSSRのSVGとh1を表示する。

## 負荷・後始末

- DPR上限1.5、描画ピクセル上限1,200,000、描画頻度上限30fps。
- visibilitychangeでRAF停止。復帰時の時間ジャンプを抑える。
- resize/ResizeObserverでaspectと描画サイズを更新。
- unmount時にRAF、イベント、observer、shader/program/bufferを解放。
- 素材生成は決定的。点滅・ランダムなフレームノイズなし。

## 検証

```sh
npm run typecheck
npm run lint
node --test tests/tidal.test.mjs tests/content.test.mjs tests/security.test.mjs
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='C:/Program Files/Google/Chrome/Application/chrome.exe' npm run test:e2e -- --workers=2
npm run preview -- --host 127.0.0.1 --port 4173
```

トップ表示、390/1280px中央配置、overflow、静止／再開、touch、title非操作、reduced-motion、WebGL不能、実context loss/restore、resize、visibility制御イベント、SPA unmountをテスト。旧トップのナビ・作品カードのテストは新要件に置き換え、内部ページの導線を直接検証する。

ローカルChromeでunit/content/security計15件、E2E24件成功。実WebGLのGLエラー0、DPR2/1280x900で描画サイズ1306x918、短時間サンプル約29fps。pointer uniformの反応とreduced-motion時0も実測。実スマホGPU/Safari/Firefoxの検証は未実施で、この数値は保証値ではない。

ログと画像はignored `test-results/`。E2E再実行で同ディレクトリは再生成される。レビュー用に必要なら先に別のローカル場所へコピーする。

本番deploy・merge・pushは未実行。Strollyを含む先行差分は保持。
