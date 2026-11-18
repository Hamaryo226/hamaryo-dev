import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { readSeedCatalog } from "./scripts/seed-catalog.mjs";
import { validateArticleCollection } from "./src/lib/article-schema";
import type { SiteCatalog } from "./src/lib/catalog";
import { SITE_URL } from "./src/config/site";

const snapshot = process.env.HAMARYO_CONTENT_SNAPSHOT;
const catalog: SiteCatalog = snapshot
  ? JSON.parse(readFileSync(join(snapshot, "catalog.json"), "utf8"))
  : readSeedCatalog();
validateArticleCollection(
  catalog.articles.map((data) => ({
    data,
    slug: data.slug,
    file: data.slug,
  })),
);

/**
 * ビルド時に静的 HTML へ焼くページの一覧。
 *
 * crawlLinks は使わない。クロールさせると
 * /dist/Muse_2.4.1_x64-setup.exe（インストーラー）や末尾スラッシュ違いの重複 URL まで
 * sitemap に載ってしまうため。ここで列挙した内容がそのまま sitemap.xml になる。
 *
 * priority / changefreq は旧 src/app/sitemap.ts の値を引き継いでいる。
 */
const pages = [
  { path: "/", sitemap: { priority: 1, changefreq: "monthly" as const } },
  {
    path: "/Project",
    sitemap: { priority: 0.8, changefreq: "monthly" as const },
  },
  { path: "/Blog", sitemap: { priority: 0.8, changefreq: "monthly" as const } },
  { path: "/Info", sitemap: { priority: 0.8, changefreq: "monthly" as const } },
  {
    path: "/About",
    sitemap: { priority: 0.8, changefreq: "monthly" as const },
  },
  ...["/works", ...catalog.works.map(({ slug }) => "/works/" + slug)].map(
    (path) => ({
      path,
      sitemap: { priority: 0.7, changefreq: "monthly" as const },
    }),
  ),
  ...catalog.articles.map(({ slug }) => ({
    path: `/Project/${slug}`,
    sitemap: { priority: 0.6, changefreq: "monthly" as const },
  })),
  ...catalog.blogs.map(({ slug }) => ({
    path: `/Blog/${slug}`,
    sitemap: { priority: 0.5, changefreq: "weekly" as const },
  })),
];

const config = defineConfig(({ command }) => ({
  publicDir: snapshot ? join(snapshot, "public") : "public",
  define: {
    __SITE_CATALOG__: JSON.stringify(catalog),
    // 静的HTMLとブラウザで同じ更新日を使う。Workerの初期化時の時計は参照しない。
    "import.meta.env.VITE_BUILD_DATE": JSON.stringify(
      new Date().toISOString().slice(0, 10).replaceAll("-", "/"),
    ),
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    command === "serve" && devtools(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        // ページは下で明示列挙するため、クロールもルート自動検出も切る。
        // autoStaticPathsDiscovery を有効にすると index ルートが
        // 末尾スラッシュ付き（/Blog/ など）で二重に sitemap へ載る。
        crawlLinks: false,
        autoStaticPathsDiscovery: false,
        failOnError: true,
      },
      sitemap: { enabled: true, host: SITE_URL },
      pages,
    }),
    viteReact(),
  ],
}));

export default config;
